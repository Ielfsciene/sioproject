// TODO: Implement blacklist
const serverMessageBox = document.getElementById('messageBox')
const inputFirstname = document.getElementById('inputFirstname')	// Required
const inputLastname = document.getElementById('inputLastname')		// Required
const inputEmail = document.getElementById('inputEmail')			// Required
const inputPassword = document.getElementById('inputPassword')		// Required
const inputDob = document.getElementById('inputDob')				// Optional
const inputPhone = document.getElementById('inputPhone')			// Optional

// Other DOM elements
const passwordGuidelines = document.getElementById('passwordGuidelines')

// Set these values, just in case they had prefilled values
// Declared in another script, that's why they're not being declared again here
first_name = inputFirstname.value
last_name = inputLastname.value

// Set the maximum birth date to today so we don't register people born in the future just yet
const now = new Date()
inputDob.setAttribute('max', `${now.getFullYear()}-${getLeadingZeroes(now.getUTCMonth() + 1)}-${getLeadingZeroes(now.getUTCDate())}`)

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

// Show/hide password guidelines.
// I would love to scale it smoothly using max-height, but css is not cooperative and I don't feel like spending hours on this.
inputPassword.addEventListener('focus', (e) => {
	passwordGuidelines.style.maxHeight = 'fit-content'
	passwordGuidelines.style.opacity = 1
})
inputPassword.addEventListener('blur', (e) => {
	setTimeout(() => {
		passwordGuidelines.style.maxHeight = 0
		passwordGuidelines.style.opacity = 0
	}, 150)
	// ↑ This tiny delay is to allow clicks to register on buttons underneath the mouse before items reposition from the possibly shifting DOM elements
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
	document.getElementById('passwordGuidelines_name').className = containsUsername(currentPassword) ? 'text-danger' : 'text-success'
	document.getElementById('passwordGuidelines_blacklist').className = containsBlacklistedPhrase(currentPassword) ? 'text-danger' : 'text-success'

	// Valid passwords must have an expected lifespan of at least a thousand years with current hardware
	let passwordLifespan = timeToCrack(currentPassword)
	const passwordHelper = document.getElementById('passwordHelp')
	passwordHelper.className = !isPasswordValid(currentPassword) ? 'text-danger' : passwordLifespan < 1e9 ? 'text-warning' : passwordLifespan < 1e15 ? 'text-info' : 'text-success'
	passwordHelper.innerText = !isPasswordValid(currentPassword) ? 'Trop faible' : passwordLifespan < 1e9 ? 'Moyen' : passwordLifespan < 1e15 ? 'Fort' : 'Très fort'
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

// reCAPTCHA v3 initialization, nice and out of sight
grecaptcha.ready(() => {
	grecaptcha.execute('6LfPEL0pAAAAAOxerY-ND1pUfPAO6tC4L4t0Ys4Y', { action: 'submit' }).then((token) => {
		document.getElementById('recaptchaToken').value = token
	})
})