// Category switching function
function switchFAQCategory(categoryIndex) {
    // Update tab active states
    const tabs = document.querySelectorAll('.faq-category-tab');
    tabs.forEach((tab, index) => {
        if (index === categoryIndex) {
            tab.classList.add('active');
            tab.setAttribute('aria-expanded', 'true');
        } else {
            tab.classList.remove('active');
            tab.setAttribute('aria-expanded', 'false');
        }
    });
    
    // Update desktop accordion content - hide all categories first
    const accordionCategories = document.querySelectorAll('.faq-accordion-category');
    accordionCategories.forEach((category, index) => {
        if (index === categoryIndex) {
            category.classList.add('active');
        } else {
            category.classList.remove('active');
        }
    });
    
    // Update mobile accordion - show/hide categories
    const mobileAccordions = document.querySelectorAll('.faq-mobile-accordion');
    mobileAccordions.forEach((accordion, index) => {
        if (index === categoryIndex) {
            accordion.classList.add('active');
        } else {
            accordion.classList.remove('active');
        }
    });
    
    // Close all open accordion items when switching categories
    const allAnswers = document.querySelectorAll('.faq-accordion-answer, .faq-mobile-answer');
    const allQuestions = document.querySelectorAll('.faq-accordion-question, .faq-mobile-question');
    
    allAnswers.forEach(answer => {
        answer.classList.remove('active');
    });
    
    allQuestions.forEach(question => {
        question.classList.remove('active');
        question.setAttribute('aria-expanded', 'false');
    });
}

// FAQ item toggle function (desktop)
function toggleFAQItem(button) {
    const answer = button.nextElementSibling;
    const isActive = answer.classList.contains('active');
    
    // Only work within the active category
    const currentCategory = button.closest('.faq-accordion-category');
    if (!currentCategory.classList.contains('active')) {
        return; // Don't toggle if category is not active
    }
    
    // Close all other FAQ items in the same category
    const allQuestionsInCategory = currentCategory.querySelectorAll('.faq-accordion-question');
    const allAnswersInCategory = currentCategory.querySelectorAll('.faq-accordion-answer');
    
    allQuestionsInCategory.forEach(q => {
        if (q !== button) {
            q.classList.remove('active');
            q.setAttribute('aria-expanded', 'false');
        }
    });
    
    allAnswersInCategory.forEach(a => {
        if (a !== answer) {
            a.classList.remove('active');
        }
    });
    
    // Toggle current item
    if (isActive) {
        answer.classList.remove('active');
        button.classList.remove('active');
        button.setAttribute('aria-expanded', 'false');
    } else {
        answer.classList.add('active');
        button.classList.add('active');
        button.setAttribute('aria-expanded', 'true');
    }
}

// Mobile FAQ item toggle function
function toggleMobileFAQItem(button) {
    const answer = button.nextElementSibling;
    const isActive = answer.classList.contains('active');
    
    // Only work within the active mobile category
    const currentMobileCategory = button.closest('.faq-mobile-accordion');
    if (!currentMobileCategory.classList.contains('active')) {
        return; // Don't toggle if category is not active
    }
    
    // Close all other FAQ items in the same mobile category
    const allQuestionsInCategory = currentMobileCategory.querySelectorAll('.faq-mobile-question');
    const allAnswersInCategory = currentMobileCategory.querySelectorAll('.faq-mobile-answer');
    
    allQuestionsInCategory.forEach(q => {
        if (q !== button) {
            q.classList.remove('active');
            q.setAttribute('aria-expanded', 'false');
        }
    });
    
    allAnswersInCategory.forEach(a => {
        if (a !== answer) {
            a.classList.remove('active');
        }
    });
    
    // Toggle current item
    if (isActive) {
        answer.classList.remove('active');
        button.classList.remove('active');
        button.setAttribute('aria-expanded', 'false');
    } else {
        answer.classList.add('active');
        button.classList.add('active');
        button.setAttribute('aria-expanded', 'true');
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Activate first category on desktop only (mobile categories start collapsed)
    const isDesktop = window.innerWidth > 768;
    if (isDesktop) {
        switchFAQCategory(0);
    }
    
    // Set up event listeners for category tabs
    const categoryTabs = document.querySelectorAll('.faq-category-tab');
    categoryTabs.forEach((tab, index) => {
        tab.addEventListener('click', function() {
            switchFAQCategory(index);
        });
    });
    
    // Set up event listeners for desktop FAQ questions
    const desktopQuestions = document.querySelectorAll('.faq-accordion-question');
    desktopQuestions.forEach(question => {
        question.addEventListener('click', function() {
            toggleFAQItem(this);
        });
    });
    
    // Set up event listeners for mobile FAQ questions
    const mobileQuestions = document.querySelectorAll('.faq-mobile-question');
    mobileQuestions.forEach(question => {
        question.addEventListener('click', function() {
            toggleMobileFAQItem(this);
        });
    });
});

