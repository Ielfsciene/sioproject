// Helper script for validating various fields. DRY and all.
// Just make sure this is loaded before the actual page script, or your console might yell at you about undeclared functions.

let first_name, last_name

function isEmailValid(email) {
	// Yes, this regular expression is beefy. You can thank the RFC 5322 standard.
	const emailExpression = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/g
	return emailExpression.test(email)
}
function isPhoneValid(phone) {
	const phoneExpression = /^\+?\d{2}[ -]?\d{2}[ -]?\d{2}[ -]?\d{2}[ -]?\d{2}$/g
	return phoneExpression.test(phone)
}
function getLeadingZeroes(number) {
	if (number < 10) return `0${number}`
	else return number
}

/**
 * Verifies the complexity of the password
 * Passwords must be at least 8 characters long, include uppercase and lowercase letters, numbers and symbols
 * Additionally, it cannot include the user's own name, as well as common names, words and phrases (as per the blacklist)
 */
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