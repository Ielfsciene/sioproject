// DOM elements
const calendarEl = document.getElementById('calendar')
const serverMessageBox = document.getElementById('messageBox')

document.addEventListener('DOMContentLoaded', function() {
	adjustCalendarHeight()

	const calendar = new FullCalendar.Calendar(calendarEl, {
		initialView: 'dayGridMonth',
		height: 'auto',
		dateClick: function(info) {
			openModal(info.dateStr)
		}
	})
	calendar.render()
	window.addEventListener('resize', adjustCalendarHeight)

	// Listen for change on the center selection field
	const centerSelect = document.getElementById('centerSelect')
	centerSelect.addEventListener('change', function() {
		// Clear and disable departmentSelect whenever centerSelect changes
		departmentSelect.innerHTML = ''
		departmentSelect.disabled = true

		// Fetch new departments if a valid center is selected
		if (centerSelect.value) {
			fetchDepartments(centerSelect.value)
		}
	})

	// Setup event listeners for modal buttons
	document.querySelector('#meetingModal .btn-secondary').addEventListener('click', closeModal)
	document.querySelector('#meetingModal .btn-primary').addEventListener('click', function() {
		const form = document.querySelector('#meetingModal form')
		const formData = new FormData(form)
	
		// Check if all required fields are filled
		if (!formData.get('meetingDate') || !formData.get('meetingTime') || !formData.get('centerId') || !formData.get('departmentId') || !formData.get('doctorId')) {
			alert('Veuillez renseigner tous les champs.')
			return
		}
	
		fetch('/api/meetings', {
			method: 'POST',
			body: formData
		})
		.then(res => {
			// 201 Created
			if (res.status === 201) {
				alert('Votre rendez-vous est enregistré !')
				return
			} else {
				alert('Erreur pendant la création du rendez-vous. Veuillez réessayer plus tard.')
				throw new Error('Network response was not ok')
			}
		})
		.catch(err => {
			console.error(`Error creating meeting:, ${err}`)
			alert('Erreur pendant la création du rendez-vous. Veuillez réessayer plus tard.')
		})

		closeModal()
	})
})

// Makes sure that when the modal is open, clicking behind it closes it
// Just a practical UX thing
window.onclick = function(event) {
	var modal = document.getElementById('meetingModal')
	if (event.target === modal) {
		closeModal()
	}
}

// Displays the meeting modal and initializes its values
function openModal(dateStr) {
	// Pre-fill the date field in the modal
	document.getElementById('meetingDate').value = dateStr

	// Clear all other fields and disable departmentSelect, a fresh start
	const hourSelect = document.getElementById('meetingTime')
	hourSelect.innerHTML = ''
	populateMeetingTimeOptions()
	const centerSelect = document.getElementById('centerSelect')
	centerSelect.innerHTML = ''
	fetchCenters()
	const departmentSelect = document.getElementById('departmentSelect')
	departmentSelect.innerHTML = ''
	departmentSelect.disabled = true

	// Show the modal
	document.getElementById('meetingModal').style.display = 'block'
	document.getElementById('meetingModal').classList.add('show')
}

// Hide the modal
function closeModal() {
	document.getElementById('meetingModal').style.display = 'none'
	document.getElementById('meetingModal').classList.remove('show')
}

// Populates the time brackets with all the possible 30-minute intervals between 0:00 and 23:30
function populateMeetingTimeOptions() {
	const select = document.getElementById('meetingTime')
	for (let hour = 0; hour < 24; hour++) {
		for (let min = 0; min < 60; min += 30) {
			const timeString = `${String(hour).padStart(2, '0')}:${String(min).padStart(2, '0')}`
			const option = new Option(timeString, timeString)
			select.add(option)
		}
	}
}

// Populates the available centers with... all the available centers on the database
function fetchCenters() {
	fetch('/api/centers')
	.then(response => response.json())
	.then(centers => {
		const select = document.getElementById('centerSelect')
		centers.forEach(center => {
			const option = new Option(center.name, center.id)
			select.add(option)
		})
		
		const departmentSelect = document.getElementById('departmentSelect')
		departmentSelect.innerHTML = ''
		departmentSelect.disabled = true
		fetchDepartments(select.value)
		
		select.addEventListener('change', () => {
			// Fetch departments when a center is selected
			fetchDepartments(select.value)
		})
	})
	.catch(err => console.error(`Error fetching centers: ${err}`))
}

// Once we have selected a center, populate the departments select with all the departments available to that center
function fetchDepartments(centerId) {
	const departmentSelect = document.getElementById('departmentSelect')
	const url = `/api/departments?center_id=${centerId}`
	fetch(url)
	.then(response => response.json())
	.then(departments => {
		// Clear previous options
		departmentSelect.innerHTML = ''
		departments.forEach(department => {
			const option = new Option(department.name, department.id)
			departmentSelect.add(option)
		})
		// Enable the select
		departmentSelect.disabled = false
		fetchDoctors(departmentSelect.value)

		departmentSelect.addEventListener('change', () => {
			// Fetch doctors when a department is selected
			fetchDoctors(departmentSelect.value)
		})
	})
	.catch(err => console.error(`Error fetching departments: ${err}`))
}

// Function to fetch doctors based on the selected department
function fetchDoctors(departmentId) {
	const doctorSelect = document.getElementById('doctorSelect')
	fetch(`/api/users?department=${departmentId}`)
	.then(response => response.json())
	.then(users => {
		// Clear existing options
		doctorSelect.innerHTML = ''
		users.forEach(user => {
			const option = new Option(`Dr. ${user.last_name.toUpperCase()} ${user.first_name}`, user.id)
			doctorSelect.appendChild(option)
		})
		// Enable the select after populating it
		doctorSelect.disabled = false
	})
	.catch(err => {
		console.error(`Error fetching users: ${err}`)
		doctorSelect.disabled = true
	})
}

function adjustCalendarHeight() {
	const navbarHeight = document.querySelector('.navbar').offsetHeight
	const footerHeight = document.querySelector('footer').offsetHeight
	const viewportHeight = window.innerHeight
	const availableHeight = viewportHeight - navbarHeight - footerHeight
	
	calendarEl.style.height = `${availableHeight}px` // Set the calendar height dynamically
}