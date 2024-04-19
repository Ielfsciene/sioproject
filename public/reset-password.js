// Get DOM elements
const serverMessageBox = document.getElementById('messageBox')
const inputPassword = document.getElementById('inputNewPassword')		// Email input for password reset
const inputEmail = document.getElementById('inputEmail')				// Email input for password reset
const passwordGuidelines = document.getElementById('passwordGuidelines')

// We cannot verify the first and last name of the user, it'll be verified server-side instead
first_name = last_name = ''

// Reset password form submission
document.querySelector('form').addEventListener('submit', (e) => {
	e.preventDefault()
	const formData = new FormData(e.target)

	// Validate the data
	const validatedPassword = isPasswordValid(formData.get('password'))
	const validatedEmail = isEmailValid(formData.get('email'))
	if (validatedPassword && validatedEmail) {
		// Send the request to the API to reset password.
		fetch('/reset-password', {
			method: 'POST',
			body: formData
		})
		.then(async res => {
			const data = await res.json()

			serverMessageBox.style.display = 'block'
			serverMessageBox.textContent = data.message

			// 200 OK
			if (res.status === 200) {
				serverMessageBox.classList.add('text-success')
			} else {
				serverMessageBox.classList.add('text-danger')
			}
		})
		.catch(err => {
			console.error(`Error: ${err}`)
		})
	}
})

inputPassword.addEventListener('input', (e) => {
	let currentPassword = e.target.value

	// Tally up everything and display information back to user
	document.getElementById('passwordGuidelines_minlength').className = meetsMinimumLength(currentPassword) ? 'text-success' : 'text-danger'
	document.getElementById('passwordGuidelines_length').className = meetsRecommendedLength(currentPassword) ? 'text-success' : 'text-danger'
	document.getElementById('passwordGuidelines_capitalization').className = hasCapitalization(currentPassword) ? 'text-success' : 'text-danger'
	document.getElementById('passwordGuidelines_numbers').className = hasNumbers(currentPassword) ? 'text-success' : 'text-danger'
	document.getElementById('passwordGuidelines_special').className = hasSpecialCharacters(currentPassword) ? 'text-success' : 'text-danger'
	document.getElementById('passwordGuidelines_diverse').className = isDiverseEnough(currentPassword) ? 'text-success' : 'text-danger'
	document.getElementById('passwordGuidelines_blacklist').className = containsBlacklistedPhrase(currentPassword) ? 'text-danger' : 'text-success'

	// Valid passwords must have an expected lifespan of at least a thousand years with current hardware
	let passwordLifespan = timeToCrack(currentPassword)
	const passwordHelper = document.getElementById('passwordHelp')
	passwordHelper.className = !isPasswordValid(currentPassword) ? 'text-danger' : passwordLifespan < 1e9 ? 'text-warning' : passwordLifespan < 1e15 ? 'text-info' : 'text-success'
	passwordHelper.innerText = !isPasswordValid(currentPassword) ? 'Trop faible' : passwordLifespan < 1e9 ? 'Moyen' : passwordLifespan < 1e15 ? 'Fort' : 'Très fort'
})

// reCAPTCHA v3 initialization
grecaptcha.ready(() => {
	grecaptcha.execute('6LfPEL0pAAAAAOxerY-ND1pUfPAO6tC4L4t0Ys4Y', { action: 'submit' }).then((token) => {
		document.getElementById('recaptchaToken').value = token
	})
})
