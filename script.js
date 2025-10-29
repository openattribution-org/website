// Mobile menu toggle
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');

mobileMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
});

// Close mobile menu when clicking a link
const mobileLinks = mobileMenu.querySelectorAll('a');
mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
    });
});

// Form validation
const contactForm = document.getElementById('contact-form');
const formSuccess = document.getElementById('form-success');
const formError = document.getElementById('form-error');

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Show error message for a field
function showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const errorSpan = field.nextElementSibling;

    field.classList.add('border-coral-500', 'bg-coral-50');
    field.classList.remove('border-gray-300');

    if (errorSpan && errorSpan.classList.contains('error-message')) {
        errorSpan.textContent = message;
        errorSpan.classList.remove('hidden');
    }
}

// Clear error message for a field
function clearError(fieldId) {
    const field = document.getElementById(fieldId);
    const errorSpan = field.nextElementSibling;

    field.classList.remove('border-coral-500', 'bg-coral-50');
    field.classList.add('border-gray-300');

    if (errorSpan && errorSpan.classList.contains('error-message')) {
        errorSpan.classList.add('hidden');
    }
}

// Validate individual field
function validateField(fieldId, value) {
    clearError(fieldId);

    switch(fieldId) {
        case 'organization':
            if (value.trim().length < 2) {
                showError(fieldId, 'Please enter your organization name');
                return false;
            }
            break;
        case 'name':
            if (value.trim().length < 2) {
                showError(fieldId, 'Please enter a valid name');
                return false;
            }
            break;
        case 'email':
            if (!emailRegex.test(value)) {
                showError(fieldId, 'Please enter a valid email address');
                return false;
            }
            break;
    }

    return true;
}

// Real-time validation on blur
['organization', 'name', 'email'].forEach(fieldId => {
    const field = document.getElementById(fieldId);
    if (field) {
        field.addEventListener('blur', () => {
            validateField(fieldId, field.value);
        });

        // Clear error on focus
        field.addEventListener('focus', () => {
            clearError(fieldId);
            formSuccess.classList.add('hidden');
            formError.classList.add('hidden');
        });
    }
});

// Form submission
contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Hide previous messages
    formSuccess.classList.add('hidden');
    formError.classList.add('hidden');

    // Get form values
    const organization = document.getElementById('organization').value;
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;

    // Validate required fields
    let isValid = true;
    isValid = validateField('organization', organization) && isValid;
    isValid = validateField('name', name) && isValid;
    isValid = validateField('email', email) && isValid;

    if (!isValid) {
        return;
    }

    // Get optional fields
    const stakeholder = document.getElementById('stakeholder').value;
    const contentVolume = document.getElementById('content-volume').value;
    const contribution = document.getElementById('contribution').value;
    const primaryInterest = document.getElementById('primary-interest').value;
    const message = document.getElementById('message').value;

    // Simulate form submission (replace with actual endpoint)
    const formData = {
        organization,
        name,
        email,
        stakeholder,
        contentVolume,
        contribution,
        primaryInterest,
        message,
        timestamp: new Date().toISOString()
    };

    // Disable submit button during submission
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.textContent;
    submitButton.disabled = true;
    submitButton.textContent = 'Sending...';

    try {
        // Submit to Web3Forms API
        const response = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                access_key: document.querySelector('input[name="access_key"]').value,
                subject: document.querySelector('input[name="subject"]').value,
                name: name,
                email: email,
                organization: organization,
                organization_type: stakeholder,
                content_volume: contentVolume,
                contribution: contribution,
                primary_interest: primaryInterest,
                message: message,
                from_name: `${name} (${organization})`
            })
        });

        const result = await response.json();

        if (result.success) {
            // Show success message
            formSuccess.classList.remove('hidden');
            contactForm.reset();

            // Scroll to success message
            formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
            throw new Error(result.message || 'Failed to submit form');
        }

    } catch (error) {
        console.error('Form submission error:', error);
        formError.classList.remove('hidden');

        // Update error message with details if available
        if (error.message) {
            formError.textContent = `Error: ${error.message}. Please try again or email us directly at info@openattribution.org`;
        }

        formError.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } finally {
        // Re-enable submit button
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
    }
});

// Smooth scroll behavior (fallback for older browsers)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    });
});

// Add fade-in animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
        }
    });
}, observerOptions);

// Observe sections for animation
document.querySelectorAll('section').forEach(section => {
    observer.observe(section);
});
