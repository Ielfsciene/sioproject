// TODO: Implement blacklist
const serverMessageBox = document.getElementById('messageBox')
const inputFirstname = document.getElementById('inputFirstname')	// Required
const inputLastname = document.getElementById('inputLastname')		// Required
const inputEmail = document.getElementById('inputEmail')			// Required
const inputPassword = document.getElementById('inputPassword')		// Required
const inputDob = document.getElementById('inputDob')				// Optional
const inputPhone = document.getElementById('inputPhone')			// Optional

// Set these values, just in case they had prefilled values
let first_name = inputFirstname.value
let last_name = inputLastname.value

// Set the maximum birth date to today so we don't register people born in the future just yet
const now = new Date()
inputDob.setAttribute('max', `${now.getFullYear()}-${getLeadingZeroes(now.getUTCMonth() + 1)}-${getLeadingZeroes(now.getUTCDate())}`)

function getLeadingZeroes(number) {
	if (number < 10) return `0${number}`
	else return number
}

// Submit button
document.querySelector('form').addEventListener('submit', (e) => {
	e.preventDefault()
	const formData = new FormData(e.target)

	// Before we send anything, verify that everything is *just* right.
	// Of course, because some users are crafty, we'll perform the verification server-side as well.
	// But, hey, if you're a crafty user reading this, we acknowledge you. Pen testing is awesome and cool.
	const allRequiredPresent = formData.get('first_name') && formData.get('last_name') && formData.get('email') && formData.get('password')
	const validatedPassword = isPasswordValid(formData.get('password'))
	const validatedEmail = isEmailValid(formData.get('email'))
	const validatedPhone = isPhoneValid(formData.get('phone')) || formData.get('phone') == ''
	if (allRequiredPresent && validatedPassword && validatedEmail && validatedPhone) {
		fetch('/create-account', {
			method: 'POST',
			body: formData
		})
		.then(async res => {
			const data = await res.json()

			messageBox.style.display = 'block'
			messageBox.textContent = data.message
			
			// 201 Created
			if (res.status === 201) {
				messageBox.classList.add('text-success')
				if (data.redirect) {
					const redirectLink = document.createElement('a')
					redirectLink.innerText = 'Cliquez içi pour vous rediriger manuellement.'
					redirectLink.href = window.location.host + data.redirect

					messageBox.innerText += '\nVous allez être redirigé(e) automatiquement dans quelques secondes...\nLa redirection ne fonctionne pas ? '
					messageBox.appendChild(redirectLink)

					setTimeout(() => {
						window.location.pathname = data.redirect
					}, 5000)
				}
			} else {
				messageBox.classList.add('text-danger')
			}
		})
		.catch(err => {
			console.error(`Error: ${err}`)
		})
	} else {
		// What is it that failed verification?
		let errorMessage = ''

		const failedPasswordString = 'Votre mot de passe ne passe pas toutes les règles de sécurité.'
		const failedEmailString = 'Votre adresse email n\'est pas valide.'
		const failedPhoneString = 'Votre numéro de téléphone n\'est pas valide. Veuillez le corriger ou le laisser vide.'
		const failedRequiredString = 'Veuillez remplir tous les champs obligatoires (marqués par des astérisques rouges)'

		if (!allRequiredPresent) errorMessage += failedRequiredString + `\n`
		if (!validatedPassword) errorMessage += failedPasswordString + '\n'
		if (!validatedEmail) errorMessage += failedEmailString + '\n'
		if (!validatedPhone) errorMessage += failedPhoneString + '\n'

		messageBox.innerText = errorMessage
	}
})

/**
 * All these fields get a red border outline if we don't like what's inside, otherwise we get a green border outline
 */
inputFirstname.addEventListener('blur', (e) => {
	e.target.style.borderColor = e.target.value.length > 0 ? 'green' : 'red'
	first_name = e.target.value
})
inputLastname.addEventListener('blur', (e) => {
	e.target.style.borderColor = e.target.value.length > 0 ? 'green' : 'red'
	last_name = e.target.value
})
inputEmail.addEventListener('blur', (e) => {
	e.target.style.borderColor = isEmailValid(e.target.value) ? 'green' : 'red'
})
inputPhone.addEventListener('blur', (e) => {
	e.target.style.borderColor = (isPhoneValid(e.target.value) || e.target.value.length === 0) ? 'green' : 'red'
})

function isEmailValid(email) {
	// Yes, this regular expression is beefy. You can thank the RFC 5322 standard.
	const emailExpression = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/g
	return emailExpression.test(email)
}
function isPhoneValid(phone) {
	const phoneExpression = /^\+?\d{2}[ -]?\d{2}[ -]?\d{2}[ -]?\d{2}[ -]?\d{2}$/g
	return phoneExpression.test(phone)
}

/**
 * ================================================
 * =================== PASSWORD ===================
 * ================================================
 * There's a lot of code verifying the validity of passwords; so I tucked it nicely at the end of the script to keep it from drowning out the rest of the code
 * Cybersecurity-wise it is impeccable; UX-wise it should also be seamless as long as users follow the password guidelines
 */

// Displays the password guidelines once the password input field is focused
inputPassword.addEventListener('focus', (e) => {
	document.getElementById('passwordGuidelines').style.display = 'block'
})

// And hide it again when it is blurred
inputPassword.addEventListener('blur', (e) => {
	document.getElementById('passwordGuidelines').style.display = 'none'
	e.target.style.borderColor = isPasswordValid(e.target.value, []) ? 'green' : 'red'
})

/**
 * Verifies the complexity of the password
 * Passwords must be at least 8 characters long, include uppercase and lowercase letters, numbers and symbols
 * Additionally, it cannot include the user's own name, as well as common names, words and phrases (as per the blacklist)
 */
inputPassword.addEventListener('input', (e) => {
	let currentPassword = e.target.value

	// Tally up everything and display information back to user
	document.getElementById('passwordGuidelines_minlength').className = meetsMinimumLength(currentPassword) ? 'text-success' : 'text-danger'
	document.getElementById('passwordGuidelines_length').className = meetsRecommendedLength(currentPassword) ? 'text-success' : 'text-danger'
	document.getElementById('passwordGuidelines_capitalization').className = hasCapitalization(currentPassword) ? 'text-success' : 'text-danger'
	document.getElementById('passwordGuidelines_numbers').className = hasNumbers(currentPassword) ? 'text-success' : 'text-danger'
	document.getElementById('passwordGuidelines_special').className = hasSpecialCharacters(currentPassword) ? 'text-success' : 'text-danger'
	document.getElementById('passwordGuidelines_diverse').className = isDiverseEnough(currentPassword) ? 'text-success' : 'text-danger'
	document.getElementById('passwordGuidelines_name').className = containsUsername(currentPassword) ? 'text-danger' : 'text-success'
	document.getElementById('passwordGuidelines_blacklist').className = containsBlacklistedPhrase(currentPassword) ? 'text-danger' : 'text-success'

	// Valid passwords must have an expected lifespan of at least a thousand years with current hardware
	let passwordLifespan = timeToCrack(currentPassword)
	const passwordHelper = document.getElementById('passwordHelp')
	passwordHelper.className = !isPasswordValid(currentPassword) ? 'text-danger' : passwordLifespan < 1e9 ? 'text-warning' : passwordLifespan < 1e15 ? 'text-info' : 'text-success'
	passwordHelper.innerText = !isPasswordValid(currentPassword) ? 'Trop faible' : passwordLifespan < 1e9 ? 'Moyen' : passwordLifespan < 1e15 ? 'Fort' : 'Très fort'
})

// Password complexity handlers
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
function containsUsername(password) {
	password = password.toLowerCase()

	// Ignore empty first/last names
	if (first_name != '') if (password.includes(first_name.toLowerCase())) return true
	if (last_name != '') if (password.includes(last_name.toLowerCase())) return true
	return false
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
function isPasswordValid(password) {
	const passwordLifespan = timeToCrack(password)

	const hasPassingCriteria =
		(meetsRecommendedLength(password) ? 1 : 0) +
		(hasCapitalization(password) ? 1 : 0) +
		(hasNumbers(password) ? 1 : 0) +
		(hasSpecialCharacters(password) ? 1 : 0) >= 3
	const hasFailingCriterion = !meetsMinimumLength(password) || !isDiverseEnough(password) || containsBlacklistedPhrase(password) || containsUsername(password)
	return passwordLifespan >= 1e3 && hasPassingCriteria && !hasFailingCriterion
}

// reCAPTCHA v3 initialization, nice and out of sight
grecaptcha.ready(() => {
	grecaptcha.execute('6LfPEL0pAAAAAOxerY-ND1pUfPAO6tC4L4t0Ys4Y', { action: 'submit' }).then((token) => {
		document.getElementById('recaptchaToken').value = token
	})
})