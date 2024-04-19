require('dotenv').config()
const MySQL = require('mysql')
const Path = require('path')
const Express = require('express')
const Bcrypt = require('bcrypt')
const bodyParser = require('body-parser')
const multer = require('multer')
const cookieParser = require('cookie-parser')
const JWT = require('jsonwebtoken')
const app = Express()
const upload = multer()
const PORT = process.env.PORT || 3000
const PUBLIC_PATH = Path.join(__dirname, '../public')

// None of these two SQL users have any table or schema-scoped permissions. They can't create tables or drop them, and can't view the schema.
// This is to protect the database from potential SQL injections, should one somehow bypass the prepared statements.
// Most privileged user, can SELECT, UPDATE, INSERT and EXECUTE. Used exclusively for server-initiated queries.
const serverPool = MySQL.createPool({
	connectionLimit: 50,
	host: '127.0.0.1',
	user: 'server_client',
	password: process.env.SERVER_PASS,
	database: 'projectsio'
})
// Least privileged user, can exclusively SELECT.
const clientPool = MySQL.createPool({
	connectionLimit: 50,
	host: '127.0.0.1',
	user: 'user_client',
	password: process.env.CLIENT_PASS,
	database: 'projectsio'
})

// Middlewares
app.listen(PORT)
app.use(Express.json())
app.use(Express.static(PUBLIC_PATH))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())

// Verifies that the user is currently authenticated and that their session token is still valid.
function authenticate(req, res, next) {
	const token = req.cookies.token
	if (!token) {
		// 401 Unauthorized
		res.status(401).json({ message: 'Connexion nécessaire pour accéder à cette ressource' })
		return res.redirect('/login')
	}

	try {
		const verified = JWT.verify(token, process.env.JWT_KEY)
		req.user = verified		// Add the decoded token to the request so it can be used in the handler
		next()					// Continue to the next middleware/route handler
	} catch (error) {
		console.error(`JWT verification error: ${error}`)
		// 401 Unauthorized
		res.status(401).json({ message: 'Connexion nécessaire pour accéder à cette ressource' })
		return res.redirect('/login')
	}
}

// Routes. 'req' might look useless, but do not remove it.
// If you remove 'req', 'res' will be treated as 'req' and that'll brick the entire script.
app.get('/signup', (req, res) => {
	const htmlPath = Path.join(__dirname, '../routes/signup.html')
	res.sendFile(htmlPath)
})
// Not to be confused with the POST endpoint of the same name
app.get('/login', (req, res) => {
	const htmlPath = Path.join(__dirname, '../routes/login.html')
	res.sendFile(htmlPath)
})
app.get('/reset-password', (req, res) => {
	const htmlPath = Path.join(__dirname, '../routes/reset-password.html')
	res.sendFile(htmlPath)
})
app.get('/home', (req, res) => {
	const htmlPath = Path.join(__dirname, '../routes/home.html')
	res.sendFile(htmlPath)
})
app.get('/scheduler', authenticate, (req, res) => {
	const htmlPath = Path.join(__dirname, '../routes/scheduler.html')
	res.sendFile(htmlPath)
})
app.get('/todo', (req, res) => {
	const htmlPath = Path.join(__dirname, '../routes/todo.html')
	res.sendFile(htmlPath)
})

/**
 * SIGNUP
 */
app.post('/create-account', upload.none(), async (req, res) => {
	const { first_name, last_name, email, password, dob, phone, recaptchaToken } = req.body

	// If this user is already registered, reject the signup request with 
	const userQuery = `SELECT * FROM users WHERE email = ? LIMIT 1`
	clientPool.query(userQuery, [email], async (err, data, fields) => {
		if (err) {
			console.error(`Database error: ${err}`)
			// 500 Internal Server Error
			return res.status(500).json({ message: 'Internal Server Error' })
		}

		if (data.length !== 0) {
			// Email already registered
			// 409 Conflict
			return res.status(409).json({
				field: 'email',
				message: 'Cette adresse email est déjà utilisée.'
			})
		} else {
			// Proceed with signup
			try {
				// Server-side validate all the data. This is to ensure no client-side verification bypass makes it on the SQL server
				const allRequiredPresent = first_name != '' && last_name != '' && email != '' && password != ''
				const validatedPassword = isPasswordValid(password, [first_name, last_name])
				const validatedEmail = isEmailValid(email)
				const validatedPhone = isPhoneValid(phone) || phone == ''

				if (allRequiredPresent && validatedPassword && validatedEmail && validatedPhone) {
					// We perform reCAPTCHA's verification last to minimize delays from relying on third parties in case of faster resolutions
					// Is the user interaction genuine?
					const recaptchaUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${recaptchaToken}`
					try {
						const response = await fetch(recaptchaUrl, { method: 'POST' })
						const data = await response.json()
						
						// reCAPTCHA success
						// Score of 1.0 is almost certainly a human, while a score of 0.0 is almost certainly a bot.
						if (data.success && data.score >= 0.6) {
							// First, hash the password so it can be stored in the database safely
							const hashedPassword = await encryptPassword(password)
							const signupQuery = `INSERT INTO users (first_name, last_name, dob, email, phone_number, password_hash) VALUES (?, ?, ?, ?, ?, ?)`
							serverPool.query(signupQuery, [first_name, last_name, dob || null, email, phone, hashedPassword], (err) => {
								if (err) {
									console.error(`Database error during signup: ${err}`)
									// 500 Internal Server Error
									return res.status(500).json({ message: 'Internal Server Error' })
								}
								// 201 Created
								return res.status(201).json({
									message: 'Compte créé avec succès !',
									redirect: '/login'
								})
							})
						} else {
							// 400 Bad Request
							res.status(400).json({ message: 'Échec de la vérification reCAPTCHA, veuillez réessayer.' })
						}
					} catch (err) {
						console.error(`Error verifying reCAPTCHA: ${err}`)
						// 500 Internal Server Error
						res.status(500).json({ message: 'Une erreur a eu lieu pendant la vérification reCAPTCHA. Veuillez réessayer plus tard.' })
					}
				} else {
					// 400 Bad Request
					return res.status(400).json({ message: 'La validation du formulaire a échoué.' })
				}
			} catch (err) {
				console.error(`Error hashing password: ${err}`)
				// 500 Internal Server Error
				return res.status(500).json({ message: 'Internal Server Error' })
			}
		}
	})
})

/**
 * LOGIN
 * Do not confuse this for the GET request of the same endpoint
 */
app.post('/login', upload.none(), (req, res) => {
	const { email, password, recaptchaToken } = req.body
	if (!email || !password) {
		// 400 Bad Request
		return res.status(400).json({ message: 'Veuillez insérer votre adresse email et votre mot de passe.' })
	}

	const query = 'SELECT id, password_hash FROM users WHERE email = ? LIMIT 1'
	clientPool.query(query, [email], async (err, results) => {
		if (err) {
			console.error(`Database error: ${err}`)
			// 500 Internal Server Error
			return res.status(500).json({ message: 'Internal Server Error' })
		}

		if (results.length === 0) {
			// 401 Unauthorized
			return res.status(401).json({ message: 'Adresse email ou mot de passe erroné(es).' })
		}

		const { id, password_hash } = results[0]
		// Compare the login password with the one expected from the user.
		// Bcrypt expects the first password to be plain text.
		const passwordMatch = await comparePasswords(password, password_hash)
		if (!passwordMatch) {
			// 401 Unauthorized
			return res.status(401).json({ message: 'Adresse email ou mot de passe erroné(es).' })
		}

		// We perform reCAPTCHA's verification last to minimize delays from relying on third parties in case of faster resolutions
		// Is the user interaction genuine?
		const recaptchaUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${recaptchaToken}`
		try {
			const response = await fetch(recaptchaUrl, { method: 'POST' })
			const data = await response.json()

			// reCAPTCHA success
			// Score of 1.0 is almost certainly a human, while a score of 0.0 is almost certainly a bot.
			if (data.success && data.score >= 0.6) {
				// Generate the session oauth token
				const token = JWT.sign(
					{ user_id: id },		// Payload
					process.env.JWT_KEY,	// Secret JWT key
					{ expiresIn: '4h' }		// Token expires after 4 hours
				)
		
				// Send the session token as an httpOnly cookie
				res.cookie('token', token, {
					httpOnly: true,			// The cookie is not accessible via JavaScript
					// secure: true,		// Cookie will be sent only over HTTPS, not implemented yet
					sameSite: 'strict'		// Mitigates CSRF attacks	
				})
				// 200 OK
				res.status(200).json({
					message: 'Connexion réussie !',
					redirect: '/home'
				})
			} else {
				// 400 Bad Request
				res.status(400).json({ message: 'Échec de la vérification reCAPTCHA, veuillez réessayer.' })
			}
		} catch (err) {
			console.error(`Error verifying reCAPTCHA: ${error}`)
			// 500 Internal Server Error
			res.status(500).json({ message: 'Une erreur a eu lieu pendant la vérification reCAPTCHA. Veuillez réessayer plus tard.' })
		}
	})
})

/**
 * RESET PASSWORD
 * Do not confuse this for the GET request of the same endpoint
 * Please note that the reset password implementation has been dramatically simplified to hasten the implementation time.
 * Given more time, I would have documented myself on the setting up of an SMTP system to get a proper reset procedure
 * For reference, a normal implementation would have followed a flowchart of "Forgot password" → "Send unique password reset email" → "Reset password"
 * Instead we directly reset passwords from step 1. This is obviously very unsafe, but given the time constraint, this is a sacrifice I had to make
 */
app.post('/reset-password', upload.none(), async (req, res) => {
	const { email, password, recaptchaToken } = req.body
	if (!email || !password) {
		return res.status(400).json({ message: 'Veuillez fournir une adresse email et un nouveau mot de passe.' })
	}

	// First, verify the reCAPTCHA to ensure the request is from a legitimate source.
	const recaptchaUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${recaptchaToken}`
	try {
		const response = await fetch(recaptchaUrl, { method: 'POST' })
		const data = await response.json()

		// reCAPTCHA success
		// Score of 1.0 is almost certainly a human, while a score of 0.0 is almost certainly a bot.
		if (!(data.success && data.score >= 0.6)) {
			// 400 Bad Request
			return res.status(400).json({ message: 'Échec de la vérification reCAPTCHA, veuillez réessayer.' })
		}
	} catch (error) {
		console.error(`Error verifying reCAPTCHA: ${error}`)
		// 500 Internal Server Error
		return res.status(500).json({ message: 'Une erreur a eu lieu pendant la vérification reCAPTCHA. Veuillez réessayer plus tard.' })
	}

	// Verify if the user exists in the database
	const userQuery = 'SELECT id FROM users WHERE email = ? LIMIT 1'
	clientPool.query(userQuery, [email], async (err, results) => {
		if (err) {
			console.error(`Database error: ${err}`)
			// 500 Internal Server Error
			return res.status(500).json({ message: 'Internal Server Error' })
		}

		if (results.length === 0) {
			// 401 Unauthorized
			return res.status(401).json({ message: 'Aucun utilisateur trouvé avec cette adresse email.' })
		}

		// Hash the new password before storing it
		const hashedPassword = await encryptPassword(password)

		// Update user's password in the database
		const updateQuery = 'UPDATE users SET password_hash = ? WHERE id = ?'
		serverPool.query(updateQuery, [hashedPassword, results[0].id], (err, updateResults) => {
			if (err) {
				console.error(`Database error on password update: ${err}`)
				// 500 Internal Server Error
				return res.status(500).json({ message: 'Internal Server Error' })
			}

			// 200 OK
			res.status(200).json({ message: 'Mot de passe réinitialisé avec succès !', redirect: '/login' })
		})
	})
})

// Return user information
app.get('/api/users', (req, res) => {
	const userId = req.query.user_id
	const token = req.cookies.token
	if (!token) {
		// 401 Unauthorized
		return res.status(401).json({ message: 'Authentication required' })
	}
	try {
		// TODO manage View Users permission
		const verified = JWT.verify(token, process.env.JWT_KEY)

		let query = 'SELECT id, first_name, last_name, email FROM users' // Limit the fields for privacy
		let params = []

		if (userId) {
			query += ' WHERE id = ?'
			params.push(userId)
		}

		serverPool.query(query, params, (err, data) => {
			if (err) {
				console.error(`Error while querying '/api/users/': ${err}`)
				// 500 Internal Server Error
				return res.status(500).json({ message: 'Internal Server Error' })
			}
			res.json(data)
		})
	} catch (error) {
		console.error(`JWT verification error: ${error}`)
		// 401 Unauthorized
		res.status(401).json({ message: 'Jeton de session expiré ou invalide' })
	}
})

app.get('/api/user-info', (req, res) => {
	const token = req.cookies.token
	if (!token) {
		return res.status(401).json({ isAuthenticated: false, message: 'Authentication required' })
	}

	try {
		const verified = JWT.verify(token, process.env.JWT_KEY)
		const query = 'SELECT first_name, last_name, photo_uuid FROM users WHERE id = ? AND status = "active" LIMIT 1'
		clientPool.query(query, [verified.user_id], (err, results) => {
			if (err) {
				console.error(`Error fetching user data: ${err}`)
				return res.status(500).json({ message: 'Internal Server Error' })
			}
			if (results.length > 0) {
				const user = results[0]
				res.json({ isAuthenticated: true, user })
			} else {
				res.status(404).json({ isAuthenticated: false, message: 'Utilisateur inconnu ou inactif' })
			}
		})
	} catch (error) {
		console.error(`JWT verification error: ${error}`)
		res.status(401).json({ isAuthenticated: false, message: 'Jeton de session expiré ou invalide' })
	}
})
app.get('/api/meetings' , (req, res) => {
	const userId = req.user.user_id
	const query = 'SELECT * FROM meetings WHERE patient_id = ? AND meeting_date > NOW() ORDER BY meeting_date ASC'
	clientPool.query(query, [userId], (err, results) => {
		if (err) {
			console.error(`Database error when fetching meetings: ${err}`)
			// 500 Internal Server Error
			return res.status(500).json({ message: 'Internal Server Error' })

			res.json(results)
		}
	})
})
app.get('/api/departments' , (req, res) => {
	
})
app.get('/api/user_type' , (req, res) => {
	
})
app.get('/api/centers' , (req, res) => {
	
})

async function encryptPassword(password) {
	const saltRounds = 10
	try {
		const salt = await Bcrypt.genSalt(saltRounds)
		const hash = await Bcrypt.hash(password, salt)
		return hash
	} catch (err) {
		console.error(`Error in password encryption: ${err}`)
		throw err
	}
}

async function comparePasswords(password, comparer) {
	try {
		return Bcrypt.compare(password, comparer)
	} catch (err) {
		console.error(`Error in password comparison: ${err}`)
		throw err
	}
}

/**
 * Ensures that passwords are sufficiently complex
 * This server happens client-side as well, but we double-check just in case the validation was bypassed somehow.
 */
function meetsMinimumLength(password) {
	return password.length >= 8
}
function meetsRecommendedLength(password) {
	return password.length >= 12
}
function hasCapitalization(password) {
	const { lowercase, uppercase } = getPasswordStats(password)
	return lowercase && uppercase
}
function hasNumbers(password) {
	const { numbers } = getPasswordStats(password)
	return numbers > 0
}
function hasSpecialCharacters(password) {
	const { specialCharacters } = getPasswordStats(password)
	return specialCharacters > 0
}
function isDiverseEnough(password) {
	const { differentCharacters } = getPasswordStats(password)
	return differentCharacters.size >= 8
}
function containsBlacklistedPhrase(password) {
	// password = password.toLowerCase()
	// for (const phrase of blacklist) {
	// 	if (password.includes(phrase)) return true
	// }
	return false
}

function getPasswordStats(password) {
	let lowercase = 0
	let uppercase = 0
	let numbers = 0
	let specialCharacters = 0
	let differentCharacters = new Set()

	for (const char of password) {
		if (/[a-z]/.test(char)) lowercase++
		else if (/[A-Z]/.test(char)) uppercase++
		else if (/[0-9]/.test(char)) numbers++
		else if (/[^a-zA-Z0-9]/.test(char)) specialCharacters++
		differentCharacters.add(char.toLowerCase())
	}

	return { lowercase, uppercase, numbers, specialCharacters, differentCharacters }
}

/**
 * TODO: DRY this thing. We have a validators.js file now.
 */

// Entropy is a measure of the unpredictability of a password, how many possible combinations of characters it could contain
function calculateEntropy(password) {
	const charsetSize = getCharsetSize(password)
	const entropy = Math.log2(Math.pow(charsetSize, password.length))

	return entropy
}
// Returns the size of the character set used for a password
function getCharsetSize(password) {
	const { lowercase, uppercase, numbers, specialCharacters } = getPasswordStats(password)
	return (lowercase ? 26 : 0) + (uppercase ? 26 : 0) + (numbers ? 10 : 0) + (specialCharacters ? 32 : 0)
}
// Returns the time to crack a password in years
// Default 1 billion guesses per second
function timeToCrack(password, guessesPerSecond = 1e9) {
	const entropy = calculateEntropy(password)
	const seconds = Math.pow(2, entropy) / guessesPerSecond
	const years = seconds / (3600 * 24 * 365.25)

	return years
}
// Returns whether the password as a whole is acceptable as per the security standards
function isPasswordValid(password, comparers) {
	const passwordLifespan = timeToCrack(password)

	const hasPassingCriteria =
		(meetsRecommendedLength(password) ? 1 : 0) +
		(hasCapitalization(password) ? 1 : 0) +
		(hasNumbers(password) ? 1 : 0) +
		(hasSpecialCharacters(password) ? 1 : 0) >= 3
	let containsUsername = false
	for (let comparer of comparers) {
		if (password.toLowerCase().includes(comparer.toLowerCase())) containsUsername = true
	}
	const hasFailingCriterion = !meetsMinimumLength(password) || !isDiverseEnough(password) || containsBlacklistedPhrase(password) || containsUsername
	return passwordLifespan >= 1e3 && hasPassingCriteria && !hasFailingCriterion
}

/**
 * Other server-side verification
 */
function isEmailValid(email) {
	// Yes, this regular expression is beefy. You can thank the RFC 5322 standard.
	const emailExpression = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/g
	return emailExpression.test(email)
}
function isPhoneValid(phone) {
	const phoneExpression = /^\+?\d{2}[ -]?\d{2}[ -]?\d{2}[ -]?\d{2}[ -]?\d{2}$/g
	return phoneExpression.test(phone)
}