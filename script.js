// ============================================
// LUMINA TALENT - Main JavaScript
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initNavbar();
    initMobileMenu();
    initScrollAnimations();
    initFormSteps(); // Esto funcionará cuando creemos la página apply.html
    initFileUpload(); // Esto funcionará cuando creemos la página apply.html
    
    // Check for stats to animate immediately if visible
    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) {
        animateCountersObserver.observe(heroStats);
    }
});
  
// ============================================
// NAVBAR SCROLL EFFECT
// ============================================
function initNavbar() {
    const navbar = document.getElementById('navbar');
    
    if (!navbar) return;
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 20) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}
  
// ============================================
// MOBILE MENU INTERACTION
// ============================================
function initMobileMenu() {
    const mobileToggle = document.getElementById('mobileToggle');
    const navLinks = document.getElementById('navLinks');
    
    if (!mobileToggle || !navLinks) return;
    
    // Toggle Menu
    mobileToggle.addEventListener('click', function(e) {
        e.stopPropagation(); // Prevent immediate closing
        navLinks.classList.toggle('active');
        mobileToggle.classList.toggle('active'); // CSS handles the X animation now
    });
    
    // Close menu when clicking a link
    const links = navLinks.querySelectorAll('.nav-link, .btn');
    links.forEach(link => {
        link.addEventListener('click', function() {
            navLinks.classList.remove('active');
            mobileToggle.classList.remove('active');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (navLinks.classList.contains('active') && 
            !navLinks.contains(e.target) && 
            !mobileToggle.contains(e.target)) {
            navLinks.classList.remove('active');
            mobileToggle.classList.remove('active');
        }
    });
}
  
// ============================================
// SCROLL ANIMATIONS (Fade Up)
// ============================================
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    
    if (!animatedElements.length) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });
    
    animatedElements.forEach(el => observer.observe(el));
}
  
// ============================================
// COUNTER ANIMATION (Updated for Decimals)
// ============================================
const animateCountersObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            startCounterAnimation();
            animateCountersObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

function startCounterAnimation() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        const originalText = counter.innerText;
        // Detect numeric value (including decimals)
        const targetValue = parseFloat(originalText.replace(/[^0-9.]/g, ''));
        
        if (isNaN(targetValue)) return;

        // Detect prefix/suffix
        const hasDollar = originalText.includes('$');
        const hasM = originalText.includes('M');
        const hasPlus = originalText.includes('+');
        const hasX = originalText.includes('x');
        const hasPercent = originalText.includes('%');
        
        // Check if it has decimals
        const isFloat = targetValue % 1 !== 0;

        let startTimestamp = null;
        const duration = 2000; // 2 seconds

        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            
            // Easing function for smooth stop
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            
            const currentVal = targetValue * easeOutQuart;
            
            // Format number
            let formattedVal = isFloat ? currentVal.toFixed(1) : Math.floor(currentVal);
            
            // Reconstruct string
            let finalString = formattedVal;
            if (hasDollar) finalString = '$' + finalString;
            if (hasM) finalString = finalString + 'M';
            if (hasX) finalString = finalString + 'x';
            if (hasPercent) finalString = finalString + '%';
            if (hasPlus) finalString = finalString + '+';
            
            counter.innerText = finalString;

            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                counter.innerText = originalText; // Ensure exact final match
            }
        };

        window.requestAnimationFrame(step);
    });
}

// ============================================
// PARALLAX EFFECT (Subtle Mouse Movement)
// ============================================
document.addEventListener('mousemove', function(e) {
    const orbs = document.querySelectorAll('.glow-orb');
    
    // Reduced sensitivity for elegance
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;
    
    orbs.forEach((orb, index) => {
        // Reverse direction for depth feel
        const speed = (index + 1) * 20; 
        const moveX = (x * speed) - (speed / 2);
        const moveY = (y * speed) - (speed / 2);
        
        // We use transform translate3d for better performance
        // Note: This adds to the CSS animation, doesn't replace it completely
        // if CSS uses keyframes on 'transform', this might conflict.
        // For simple orbs without complex CSS movement, this works.
        // If CSS has float animation, apply this to a wrapper or use marginTop/Left
        orb.style.transform = `translate(${moveX}px, ${moveY}px)`;
    });
});

// ============================================
// FORM STEPS (For Apply Page)
// ============================================
let currentStep = 1;
const formData = {};
  
function initFormSteps() {
    const formStep1 = document.getElementById('formStep1');
    const formStep2 = document.getElementById('formStep2');
    const formStep3 = document.getElementById('formStep3');
    
    if (formStep1) {
        formStep1.addEventListener('submit', function(e) {
            e.preventDefault();
            goToStep(2);
        });
    }
    
    if (formStep2) {
        formStep2.addEventListener('submit', function(e) {
            e.preventDefault();
            goToStep(3);
        });
    }
    
    if (formStep3) {
        formStep3.addEventListener('submit', function(e) {
            e.preventDefault();
            submitApplication();
        });
    }
}
  
function goToStep(step) {
    // Hide all sections
    document.querySelectorAll('.form-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show target section
    const targetSection = document.getElementById('step' + step);
    if (targetSection) {
        targetSection.classList.add('active');
        // Trigger generic fade-up animation
        targetSection.style.animation = 'none';
        targetSection.offsetHeight; /* trigger reflow */
        targetSection.style.animation = 'fadeInUp 0.5s ease forwards';
    }
    
    // Update step indicators
    document.querySelectorAll('.step').forEach((stepEl, index) => {
        stepEl.classList.remove('active', 'completed');
        if (index + 1 < step) {
            stepEl.classList.add('completed');
        } else if (index + 1 === step) {
            stepEl.classList.add('active');
        }
    });
    
    currentStep = step;
    
    // Scroll to top of form
    const formContainer = document.querySelector('.form-container');
    if (formContainer) {
        formContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}
  
function submitApplication() {
    console.log('Application submitted');
    
    const formSteps = document.querySelector('.form-steps');
    const formContainer = document.querySelector('.form-container');
    
    if (formSteps) formSteps.style.display = 'none';
    
    // Hide all inputs
    document.querySelectorAll('.form-section').forEach(s => s.style.display = 'none');
    
    // Show success
    const successMessage = document.getElementById('successMessage');
    if (successMessage) {
        successMessage.classList.add('show');
    }
    
    // Confetti or visual success feedback could go here
}

// ============================================
// FILE UPLOAD (Updated for New Colors)
// ============================================
function initFileUpload() {
    const fileInput = document.getElementById('photoUpload');
    const fileNameDisplay = document.getElementById('fileName');
    const fileUploadLabel = document.querySelector('.file-upload');
    
    if (!fileInput || !fileUploadLabel) return;
    
    fileInput.addEventListener('change', function(e) {
        if (this.files && this.files[0]) {
            const file = this.files[0];
            
            if (fileNameDisplay) {
                fileNameDisplay.textContent = '✓ ' + file.name;
                // Updated Color Variable
                fileNameDisplay.style.color = 'var(--primary-blue)'; 
                fileNameDisplay.style.fontWeight = '600';
            }
            
            // Updated Border Color
            fileUploadLabel.style.borderColor = 'var(--primary-blue)';
            fileUploadLabel.style.backgroundColor = 'rgba(37, 99, 235, 0.05)';
        }
    });
}
// ============================================
// FAQ ACCORDION LOGIC
// ============================================
function initFaq() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            // 1. Cerrar otros items (Opcional, si quieres que solo uno esté abierto a la vez)
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                    otherItem.querySelector('.faq-answer').style.maxHeight = null;
                }
            });

            // 2. Toggle del actual
            item.classList.toggle('active');
            
            const answer = item.querySelector('.faq-answer');
            if (item.classList.contains('active')) {
                answer.style.maxHeight = answer.scrollHeight + "px";
            } else {
                answer.style.maxHeight = null;
            }
        });
    });
}

// Llamar a la función al cargar
document.addEventListener('DOMContentLoaded', function() {
    // ... tus otros inits ...
    initFaq();
});