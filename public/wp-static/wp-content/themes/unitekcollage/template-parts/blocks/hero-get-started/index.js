/**
 * Hero Get Started Block - JavaScript
 * Multi-step form functionality
 */

(function() {
    'use strict';

    // Global variables
    var currentStep = 1;
    var totalSteps = 6; // Updated to 6 steps: campus, program, first name, last name, phone, email+consent

    // Campus-specific programs
    var campusPrograms = {
        'Unitek College - Bakersfield': [
            {value: '', text: 'PROGRAM OF INTEREST*'},
            {value: 'Bachelors of Science in Nursing', text: 'Bachelors of Science in Nursing'},
            {value: 'Bachelors of Science in Nursing{LVNtoBSN}', text: 'LVN to BSN (Track)'},
            {value: 'Medical Assisting', text: 'Medical Assisting'},
            {value: 'Vocational Nursing', text: 'Vocational Nursing'},
            {value: 'Associate of Science in Vocational Nursing', text: 'Vocational Nursing (Associate Degree)'}
        ],
        'Unitek College - Concord': [
            {value: '', text: 'PROGRAM OF INTEREST*'},
            {value: 'Bachelors of Science in Nursing', text: 'Bachelors of Science in Nursing'},
            {value: 'Bachelors of Science in Nursing{LVNtoBSN}', text: 'LVN to BSN (Track)'},
            {value: 'Medical Assisting', text: 'Medical Assisting'},
            {value: 'Vocational Nursing', text: 'Vocational Nursing'},
            {value: 'Associate of Science in Vocational Nursing', text: 'Vocational Nursing (Associate Degree)'}
        ],
        'Unitek College - Fremont': [
            {value: '', text: 'PROGRAM OF INTEREST*'},
            {value: 'Bachelors of Science in Nursing', text: 'Bachelors of Science in Nursing'},
            {value: 'Bachelors of Science in Nursing{LVNtoBSN}', text: 'LVN to BSN (Track)'},
            {value: 'Medical Assisting', text: 'Medical Assisting'},
            {value: 'Medical Office Administration', text: 'Medical Office Administration'},
            {value: 'Vocational Nursing', text: 'Vocational Nursing'},
            {value: 'Associate of Science in Vocational Nursing', text: 'Vocational Nursing (Associate Degree)'}
        ],
        'Unitek College - Hayward': [
            {value: '', text: 'PROGRAM OF INTEREST*'},
            {value: 'Medical Assisting', text: 'Medical Assisting'},
            {value: 'Vocational Nursing', text: 'Vocational Nursing'},
            {value: 'Associate of Science in Vocational Nursing', text: 'Vocational Nursing (Associate Degree)'}
        ],
        'Unitek College - Ontario': [
            {value: '', text: 'PROGRAM OF INTEREST*'},
            {value: 'Medical Assisting', text: 'Medical Assisting'}
        ],
        'Unitek College - Reno': [
            {value: '', text: 'PROGRAM OF INTEREST*'},
            {value: 'Bachelors of Science in Nursing', text: 'Bachelors of Science in Nursing'},
            {value: 'Bachelors of Science in Nursing{LVNtoBSN}', text: 'LVN to BSN (Track)'},
            {value: 'Medical Assisting', text: 'Medical Assisting'},
            {value: 'Practical Nursing', text: 'Practical Nursing'},
            {value: 'Associate of Science in Vocational Nursing', text: 'Vocational Nursing (Associate Degree)'}
        ],
        'Unitek College - Sacramento': [
            {value: '', text: 'PROGRAM OF INTEREST*'},
            {value: 'Bachelors of Science in Nursing', text: 'Bachelors of Science in Nursing'},
            {value: 'Bachelors of Science in Nursing{LVNtoBSN}', text: 'LVN to BSN (Track)'},
            {value: 'Medical Assisting', text: 'Medical Assisting'},
            {value: 'Vocational Nursing', text: 'Vocational Nursing'},
            {value: 'Associate of Science in Vocational Nursing', text: 'Vocational Nursing (Associate Degree)'}
        ],
        'Unitek College - San Jose': [
            {value: '', text: 'PROGRAM OF INTEREST*'},
            {value: 'Medical Assisting', text: 'Medical Assisting'},
            {value: 'Vocational Nursing', text: 'Vocational Nursing'},
            {value: 'Associate of Science in Vocational Nursing', text: 'Vocational Nursing (Associate Degree)'}
        ],
        'Unitek College - South San Francisco': [
            {value: '', text: 'PROGRAM OF INTEREST*'},
            {value: 'Medical Assisting', text: 'Medical Assisting'},
            {value: 'Vocational Nursing', text: 'Vocational Nursing'},
            {value: 'Associate of Science in Vocational Nursing', text: 'Vocational Nursing (Associate Degree)'}
        ],
        'Unitek College - Online': [
            {value: '', text: 'PROGRAM OF INTEREST*'},
            {value: 'Associate of Science in Vocational Nursing', text: 'Vocational Nursing (Associate Degree)'}
        ]
    };

    // Function to validate phone input
    window.validatePhoneInput = function(input) {
        // Remove any non-numeric characters
        var numericValue = input.value.replace(/\D/g, '');
        
        // Limit to maximum 10 digits
        if (numericValue.length > 10) {
            numericValue = numericValue.substring(0, 10);
        }
        
        // Update the input with only numeric characters (max 10 digits)
        if (input.value !== numericValue) {
            input.value = numericValue;
        }
        
        // Update input text color and background when populated
        if (numericValue.length > 0) {
            input.style.color = '#ffffff';
            input.style.fontWeight = '500';
            input.style.backgroundColor = 'transparent';
        } else {
            input.style.color = '#68747C';
            input.style.fontWeight = '300';
            input.style.backgroundColor = '#ffffff';
        }
        
        console.log('Phone input validation called, value:', numericValue, 'length:', numericValue.length);
        var nextBtn = document.getElementById('hgs-next');
        if (!nextBtn) {
            console.log('Next button not found!');
            return;
        }
        
        // Check if we have exactly 10 digits
        if (numericValue.length === 10) {
            nextBtn.disabled = false;
            nextBtn.classList.add('active');
            nextBtn.style.backgroundColor = '#B4E850';
            nextBtn.style.color = '#28323C';
            nextBtn.style.cursor = 'pointer';
            console.log('Next button enabled');
        } else {
            nextBtn.disabled = true;
            nextBtn.classList.remove('active');
            nextBtn.style.backgroundColor = '#68747C';
            nextBtn.style.color = '#28323C';
            nextBtn.style.cursor = 'not-allowed';
            console.log('Next button disabled');
        }
    };

    // Function to validate email input
    window.validateEmailInput = function(input) {
        // Email validation regex pattern
        var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        var isValidEmail = emailPattern.test(input.value.trim());
        
        // Update input text color and background when populated
        if (input.value.trim().length > 0) {
            input.style.color = '#ffffff';
            input.style.fontWeight = '500';
            input.style.backgroundColor = 'transparent';
        } else {
            input.style.color = '#68747C';
            input.style.fontWeight = '300';
            input.style.backgroundColor = '#ffffff';
        }
        
        console.log('Email input validation called, value:', input.value, 'valid:', isValidEmail);
        
        // Check both email validity and consent checkbox
        checkStep6Validation();
    };

    // Function to validate consent checkbox
    window.validateConsentInput = function(checkbox) {
        console.log('Consent checkbox validation called, checked:', checkbox.checked);
        
        // Check both email validity and consent checkbox
        checkStep6Validation();
    };

    // Function to check if both email and consent are valid for step 6
    function checkStep6Validation() {
        var emailInput = document.getElementById('hgs-email');
        var consentCheckbox = document.getElementById('hgs-consent');
        var submitBtn = document.getElementById('hgs-submit');
        var submitBtnMobile = document.getElementById('hgs-submit-mobile');
        
        if (!emailInput || !consentCheckbox || !submitBtn) {
            console.log('Step 6 elements not found');
            return;
        }
        
        // Email validation regex pattern
        var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        var isValidEmail = emailPattern.test(emailInput.value.trim());
        var isConsentChecked = consentCheckbox.checked;
        
        console.log('Step 6 validation check - Email valid:', isValidEmail, 'Consent checked:', isConsentChecked);
        
        // Enable submit buttons only if both email is valid AND consent is checked
        var buttons = [submitBtn];
        if (submitBtnMobile) {
            buttons.push(submitBtnMobile);
        }
        
        buttons.forEach(function(btn) {
            if (isValidEmail && isConsentChecked) {
                btn.disabled = false;
                btn.classList.add('active');
                btn.style.backgroundColor = '#B4E850';
                btn.style.color = '#28323C';
                btn.style.cursor = 'pointer';
            } else {
                btn.disabled = true;
                btn.classList.remove('active');
                btn.style.backgroundColor = '#68747C';
                btn.style.color = '#28323C';
                btn.style.cursor = 'not-allowed';
            }
        });
        
        if (isValidEmail && isConsentChecked) {
            console.log('Get started button enabled');
        } else {
            console.log('Get started button disabled - Email valid:', isValidEmail, 'Consent:', isConsentChecked);
        }
    }

    // Function to update programs based on campus selection
    function updateProgramsForCampus(campusValue) {
        var programSelect = document.getElementById('hgs-program');
        if (!programSelect) return;
        
        // Clear existing options
        programSelect.innerHTML = '';
        
        // Reset to unselected state (white background, gray text)
        programSelect.style.color = '#68747C';
        programSelect.style.fontWeight = '300';
        programSelect.style.backgroundColor = '#ffffff';
        
        // Get programs for selected campus
        var programs = campusPrograms[campusValue] || campusPrograms['Unitek College - Bakersfield'];
        
        // Add new options
        for (var i = 0; i < programs.length; i++) {
            var option = document.createElement('option');
            option.value = programs[i].value;
            option.textContent = programs[i].text;
            if (i === 0) {
                option.disabled = true;
                option.selected = true;
            }
            programSelect.appendChild(option);
        }
    }

    // Function to go to next step
    window.goToNextStep = function() {
        console.log('goToNextStep called, current step:', currentStep);
        
        // Check if campus is selected
        var campusSelect = document.getElementById('hgs-campus');
        if (!campusSelect || !campusSelect.value || campusSelect.value === '') {
            console.log('Campus not selected');
            return;
        }
        
        // If going to step 2 (programs), update programs based on campus
        if (currentStep === 1) {
            updateProgramsForCampus(campusSelect.value);
            console.log('Updated programs for campus:', campusSelect.value);
        }
        
        // Hide all steps
        var steps = document.querySelectorAll('.hgs-step');
        for (var i = 0; i < steps.length; i++) {
            steps[i].classList.remove('active');
        }
        
        // Show next step
        currentStep++;
        console.log('Moving to step:', currentStep);
        var nextStepElement = document.querySelector('.hgs-step[data-step="' + currentStep + '"]');
        if (nextStepElement) {
            nextStepElement.classList.add('active');
            console.log('Showing step:', currentStep);
        } else {
            console.log('Step element NOT found for step:', currentStep);
        }
        
        // Update progress bar
        var progressFill = document.getElementById('hgs-progress');
        if (progressFill) {
            var percentage = Math.round(((currentStep - 1) / (totalSteps - 1)) * 100);
            progressFill.style.width = percentage + '%';
            console.log('Progress updated to:', percentage + '%');
        }
        
        // Update progress text
        var progressText = document.getElementById('hgs-progress-text');
        if (progressText) {
            progressText.textContent = currentStep + ' of ' + totalSteps;
            console.log('Progress text updated to:', currentStep + '/' + totalSteps);
        }
        
        // Show back button
        var backBtn = document.getElementById('hgs-back');
        if (backBtn) {
            backBtn.classList.remove('hgs-hidden');
            console.log('Back button shown');
        }
        
        // Handle final step
        if (currentStep === totalSteps) {
            // Hide next button on final step
            var nextBtn = document.getElementById('hgs-next');
            if (nextBtn) {
                nextBtn.classList.add('hgs-hidden');
            }
            
            console.log('Reached final step - submit button will be enabled by validation');
        } else {
            // Disable next button until next step is filled
            var nextBtn = document.getElementById('hgs-next');
            if (nextBtn) {
                nextBtn.disabled = true;
                nextBtn.classList.remove('active');
                nextBtn.style.backgroundColor = '#68747C';
                nextBtn.style.color = '#28323C';
                nextBtn.style.cursor = 'not-allowed';
                console.log('Next button disabled');
            }
            
            // Ensure submit buttons are disabled on non-final steps
            var submitBtn = document.getElementById('hgs-submit');
            var submitBtnMobile = document.getElementById('hgs-submit-mobile');
            
            var submitButtons = [];
            if (submitBtn) submitButtons.push(submitBtn);
            if (submitBtnMobile) submitButtons.push(submitBtnMobile);
            
            submitButtons.forEach(function(btn) {
                btn.disabled = true;
                btn.classList.remove('active');
                btn.style.backgroundColor = '#68747C';
                btn.style.color = '#28323C';
                btn.style.cursor = 'not-allowed';
            });
        }
    };

    // Function to go to previous step
    window.goToPreviousStep = function() {
        console.log('goToPreviousStep called, current step:', currentStep);
        
        if (currentStep <= 1) {
            console.log('Already at first step');
            return;
        }
        
        // Hide all steps
        var steps = document.querySelectorAll('.hgs-step');
        for (var i = 0; i < steps.length; i++) {
            steps[i].classList.remove('active');
        }
        
        // Show previous step
        currentStep--;
        var prevStepElement = document.querySelector('.hgs-step[data-step="' + currentStep + '"]');
        if (prevStepElement) {
            prevStepElement.classList.add('active');
            console.log('Showing step:', currentStep);
        }
        
        // Update progress bar
        var progressFill = document.getElementById('hgs-progress');
        if (progressFill) {
            var percentage = Math.round(((currentStep - 1) / (totalSteps - 1)) * 100);
            progressFill.style.width = percentage + '%';
            console.log('Progress updated to:', percentage + '%');
        }
        
        // Update progress text
        var progressText = document.getElementById('hgs-progress-text');
        if (progressText) {
            progressText.textContent = currentStep + ' of ' + totalSteps;
            console.log('Progress text updated to:', currentStep + '/' + totalSteps);
        }
        
        // Hide back button if at first step
        if (currentStep === 1) {
            var backBtn = document.getElementById('hgs-back');
            if (backBtn) {
                backBtn.classList.add('hgs-hidden');
                console.log('Back button hidden');
            }
        }
        
        // Show next button and disable submit buttons when going back from final step
        var nextBtn = document.getElementById('hgs-next');
        if (nextBtn) {
            nextBtn.classList.remove('hgs-hidden');
            nextBtn.disabled = false;
            nextBtn.classList.add('active');
            nextBtn.style.backgroundColor = '#B4E850';
            nextBtn.style.color = '#28323C';
            nextBtn.style.cursor = 'pointer';
            console.log('Next button enabled');
        }
        
        // Disable submit buttons when not on final step
        var submitBtn = document.getElementById('hgs-submit');
        var submitBtnMobile = document.getElementById('hgs-submit-mobile');
        
        var submitButtons = [];
        if (submitBtn) submitButtons.push(submitBtn);
        if (submitBtnMobile) submitButtons.push(submitBtnMobile);
        
        submitButtons.forEach(function(btn) {
            btn.disabled = true;
            btn.classList.remove('active');
            btn.style.backgroundColor = '#68747C';
            btn.style.color = '#28323C';
            btn.style.cursor = 'not-allowed';
        });
        console.log('Submit buttons disabled');
    };

    // Function to handle form submission
    window.handleFormSubmit = function(event) {
        event.preventDefault(); // Prevent page refresh
        
        console.log('Form submitted');
        
        // Hide the entire content container
        var contentContainer = document.querySelector('.hero-get-started-content');
        if (contentContainer) {
            contentContainer.style.display = 'none';
        }
        
        // Show confirmation message
        var confirmationMessage = document.getElementById('confirmation-message');
        if (confirmationMessage) {
            confirmationMessage.style.display = 'block';
        }
        
        // Optional: Scroll to confirmation message
        if (confirmationMessage) {
            confirmationMessage.scrollIntoView({ behavior: 'smooth' });
        }
        
        // Here you can add code to send form data to your server
        // For example, using fetch API or XMLHttpRequest
        
        return false; // Prevent any further form submission
    };

    // Simple form initialization
    document.addEventListener('DOMContentLoaded', function() {
        console.log('Form initialized');
        
        // Debug: Check all steps
        var steps = document.querySelectorAll('.hgs-step');
        console.log('Total steps found:', steps.length);
        for (var i = 0; i < steps.length; i++) {
            var stepNum = steps[i].getAttribute('data-step');
            console.log('Step', stepNum, 'has active class:', steps[i].classList.contains('active'));
        }
        
        // Ensure only step 1 is active initially
        steps.forEach(function(step) {
            step.classList.remove('active');
        });
        var firstStep = document.querySelector('.hgs-step[data-step="1"]');
        if (firstStep) {
            firstStep.classList.add('active');
            console.log('Step 1 activated');
        }
        
        // Ensure submit buttons are disabled initially
        var submitBtn = document.getElementById('hgs-submit');
        var submitBtnMobile = document.getElementById('hgs-submit-mobile');
        
        var submitButtons = [];
        if (submitBtn) submitButtons.push(submitBtn);
        if (submitBtnMobile) submitButtons.push(submitBtnMobile);
        
        submitButtons.forEach(function(btn) {
            btn.disabled = true;
            btn.classList.remove('active');
            btn.style.backgroundColor = '#68747C';
            btn.style.color = '#28323C';
            btn.style.cursor = 'not-allowed';
        });
        console.log('Submit buttons disabled on init');
        
        // Reset current step to 1
        currentStep = 1;
        console.log('Current step set to:', currentStep);
    });

})();

