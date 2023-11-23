// Navbar collapse handler
function toggleMenu() {
    document.querySelector('ul').classList.toggle('show');
    document.querySelector('.overlay').classList.toggle('show');
}

// Function to fetch data from Mock API and populate dropdowns.
function fetchDataAndPopulateDropdown(url, dropdownId, valueField, textField) {
    return fetch(url)
        .then(response => response.json())
        .then(data => {
            const dropdown = document.getElementById(dropdownId);
            dropdown.innerHTML = `<option value="" disabled selected>Select ${textField}</option>`;
            data[valueField].forEach(item => {
                const option = document.createElement('option');
                option.value = item.id;
                option.text = item.name;
                dropdown.add(option);
            });
        })
        .catch(error => console.error(`Error fetching ${textField} data:`, error));
}

// Function to fetch data for company and subject dropdowns using Promise.all
function fetchCompanyAndSubjectData() {
    const companyPromise = fetchDataAndPopulateDropdown('https://run.mocky.io/v3/9a047975-d933-41b6-a0c8-9121fc47fc47', 'company', 'companies', 'Company');
    const subjectPromise = fetchDataAndPopulateDropdown('https://run.mocky.io/v3/5ddcf293-2e27-46e8-a81b-ded5daa770f9', 'subject', 'subjects', 'Subject');

    return Promise.all([companyPromise, subjectPromise]);
}

// Fetch data for area code dropdown.
fetch('https://run.mocky.io/v3/503ddf67-fb3c-4b72-aa8c-d1c6494f8a47')
    .then(response => response.json())
    .then(data => {
        const areaCodeDropdown = document.getElementById('areaCode');
        const turkiyeAreaCodes = data.turkiye.sehirler;

        // Clear existing options
        areaCodeDropdown.innerHTML = '';

        // Add default option
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.text = 'Select Area Code';
        defaultOption.disabled = true;
        areaCodeDropdown.add(defaultOption);

        for (const [areaCode] of Object.entries(turkiyeAreaCodes)) {
            const option = document.createElement('option');
            option.value = areaCode;
            option.text = `(${areaCode})`;
            areaCodeDropdown.add(option);
        }
        defaultOption.selected = true;
    })
    .catch(error => console.error('Error fetching phone area codes:', error));

document.getElementById('areaCode').value = '';

// Phone input event listener
document.getElementById('phone').addEventListener('input', function (event) {
    let inputValue = event.target.value.replace(/\D/g, '').slice(0, 7);
    event.target.value = formatPhoneNumber(inputValue);
});

function formatPhoneNumber(phoneNumber) {
    return phoneNumber.replace(/(\d{3})(\d{2})(\d{2})/, '$1-$2-$3');
}

// Area Code change event listener
document.getElementById('areaCode').addEventListener('change', function (event) {
    if (!event.target.value) {
        showAlert('Please select an area code.');
    }
});

// Form submission event listener
document.getElementById('registrationForm').addEventListener('submit', function (event) {
    const validationErrors = validateForm();

    if (validationErrors.length > 0) {
        showAlert(`Please fix the following errors:\n${validationErrors.join('\n')}`);
        event.preventDefault();
    } else {
        document.getElementById('formContainer').classList.add('d-none');
        document.getElementById('successMessage').classList.remove('d-none');
        event.preventDefault();
    }
});

// Form validation function to check if required fields are filled and if email and phone number are in correct format.
function validateForm() {
    const requiredFields = ['name', 'surname', 'company', 'email', 'phone', 'subject'];
    const validationErrors = [];

    requiredFields.forEach(field => {
        const input = document.getElementById(field);
        if (!input.value.trim()) {
            validationErrors.push(`${field.charAt(0).toUpperCase() + field.slice(1)} is required!`);
        }
    });

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const emailInput = document.getElementById('email');
    if (!emailRegex.test(emailInput.value.trim())) {
        validationErrors.push('Invalid email format!');
    }

    const phoneRegex = /^\d{3}-\d{2}-\d{2}$/;
    const phoneInput = document.getElementById('phone');
    if (!phoneRegex.test(phoneInput.value.trim())) {
        validationErrors.push('Invalid Turkish phone number format!');
    }

    const beginnerYes = document.getElementById('beginnerYes');
    const beginnerNo = document.getElementById('beginnerNo');
    if (!beginnerYes.checked && !beginnerNo.checked) {
        validationErrors.push('Please select if you are a beginner!');
    }

    const areaCodeInput = document.getElementById('areaCode');
    if (!areaCodeInput.value) {
        validationErrors.push('Please select an area code!');
    }

    return validationErrors;
}

// Show alert function to show error messages.
function showAlert(message) {
    const existingAlert = document.querySelector('.alert-danger');
    if (existingAlert) {
        existingAlert.remove();
    }

    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert alert-danger mt-3';
    alertDiv.role = 'alert';
    alertDiv.innerHTML = message;

    const formContainer = document.getElementById('formContainer');
    formContainer.insertBefore(alertDiv, document.getElementById('registrationForm'));

    setTimeout(() => alertDiv.remove(), 5000);
}

// Before showing the form again, reset the form and clear all inputs.
function showFormAgain() {
    document.getElementById('registrationForm').reset();
    document.getElementById('name').value = '';
    document.getElementById('surname').value = '';
    document.getElementById('company').value = '';
    document.getElementById('email').value = '';
    document.getElementById('phone').value = '';
    document.getElementById('subject').value = '';
    document.getElementById('beginnerYes').checked = false;
    document.getElementById('beginnerNo').checked = false;
    document.getElementById('areaCode').value = '';

    document.getElementById('formContainer').classList.remove('d-none');
    document.getElementById('successMessage').classList.add('d-none');
}


// Fetch data for both company and subject dropdowns using Promise.all
fetchCompanyAndSubjectData()
    .catch(error => console.error('Error fetching company and subject data:', error));
