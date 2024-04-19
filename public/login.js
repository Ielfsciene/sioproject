// Get DOM elements
const serverMessageBox = document.getElementById('messageBox')
const inputEmail = document.getElementById('inputEmail')  // Required
const inputPassword = document.getElementById('inputPassword')  // Required

// Submit button
document.querySelector('form').addEventListener('submit', (e) => {
	e.preventDefault()
	const formData = new FormData(e.target)

	fetch('/login', {
		method: 'POST',
		body: formData
	})
	.then(async res => {
		const data = await res.json()

		serverMessageBox.style.display = 'block'
		serverMessageBox.textContent = data.message

		// Check response status
		// 200 OK
		if (res.status === 200) {
			serverMessageBox.classList.add('text-success')
			if (data.redirect) {
				window.location.pathname = data.redirect
			}
		} else {
			serverMessageBox.classList.add('text-danger')
		}
	})
	.catch(err => {
		console.error(`Error: ${err}`)
	})
})

// reCAPTCHA v3 initialization, nice and out of sight
grecaptcha.ready(() => {
	grecaptcha.execute('6LfPEL0pAAAAAOxerY-ND1pUfPAO6tC4L4t0Ys4Y', { action: 'submit' }).then((token) => {
		document.getElementById('recaptchaToken').value = token
	})
})