// ========================
// P&P Apartments Main Script
// Premium Framer-Style Interactions
// ========================

document.addEventListener('DOMContentLoaded', function() {
    initHeroAnimations();
    initMobileMenu();
    initApartmentFilter();
    initCarousel();
    initContactForm();
    initFormSubmit();
});

// HERO PREMIUM ANIMATIONS
function initHeroAnimations() {
    // Smooth scroll on buttons - for all primary buttons
    const primaryBtns = document.querySelectorAll('.btn-primary-new, .btn-primary, .btn-premium');
    primaryBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            if (!e.target.href || e.target.href === '#') {
                this.style.transform = 'scale(0.98)';
                setTimeout(() => { this.style.transform = 'scale(1)'; }, 100);
            }
        });
        btn.addEventListener('mousedown', function() {
            this.style.transform = 'scale(0.96)';
        });
        btn.addEventListener('mouseup', function() {
            this.style.transform = 'scale(1)';
        });
    });
    
    // Add accessibility - Tab key support
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            if (document.activeElement.classList.contains('btn-primary-new') ||
                document.activeElement.classList.contains('btn-primary') ||
                document.activeElement.classList.contains('btn-premium')) {
                document.activeElement.click();
            }
        }
    });
}

// PORTFOLIO CAROUSEL - ELRUNE INSPIRED (INFINITE SCROLL)
function initCarousel() {
    const carousel = document.querySelector('.scrolling-carousel');
    const track = document.getElementById('carouselTrack');
    
    if (carousel && track) {
        // Hover pause/resume
        carousel.addEventListener('mouseenter', function() {
            track.style.animationPlayState = 'paused';
        });
        carousel.addEventListener('mouseleave', function() {
            track.style.animationPlayState = 'running';
        });
        
        // Mobile touch support - prevent accidental scrolls
        let touchStartX = 0;
        carousel.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            track.style.animationPlayState = 'paused';
        }, { passive: true });
        
        carousel.addEventListener('touchend', () => {
            track.style.animationPlayState = 'running';
        }, { passive: true });
        
        // Reduce animation smoothness on low-end mobile devices
        if (window.matchMedia('(max-width: 480px)').matches) {
            track.style.willChange = 'auto'; // Prevent excessive repaints on mobile
        }
    }
}

// MOBILE MENU TOGGLE
function initMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');

    if (hamburger) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });

        // Close menu when clicking nav items
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', function() {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            });
        });
    }
}

// APARTMENT FILTERING
function initApartmentFilter() {
    const cards = document.querySelectorAll('.apt-card');
    const bookingCards = document.querySelectorAll('.booking-card');

    // Set initial state
    cards.forEach(card => card.style.display = 'grid');

    // Use booking cards for filtering (they have onclick)
    bookingCards.forEach(card => {
        card.addEventListener('click', function() {
            const bedrooms = this.textContent.includes('2') ? 2 : 3;
            filterApts(bedrooms, this);
        });
    });
}

function filterApts(bedrooms, button) {
    const cards = document.querySelectorAll('.apt-card');
    const bookingCards = document.querySelectorAll('.booking-card');

    // Update active state
    bookingCards.forEach(card => card.classList.remove('active'));
    button.classList.add('active');

    // Filter apartments
    cards.forEach(card => {
        if (card.dataset.br == bedrooms) {
            card.style.display = 'grid';
            card.style.animation = 'fadeInUp 0.5s ease-out';
        } else {
            card.style.display = 'none';
        }
    });
}

// CONTACT FORM HANDLING
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = this.querySelector('input[type="text"]').value;
            const email = this.querySelector('input[type="email"]').value;
            const message = this.querySelector('textarea').value;

            // Send via WhatsApp
            const waMessage = `Hello P&P Apartments!\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;
            const waLink = `https://wa.me/2348057302136?text=${encodeURIComponent(waMessage)}`;
            
            window.open(waLink, '_blank');
            
            // Reset form
            this.reset();
        });
    }
}

function initFormSubmit() {
    // Add any additional form handling if needed
}

// SMOOTH SCROLL FALLBACK
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
            e.preventDefault();
            const element = document.querySelector(href);
            if (element) {
                element.scrollIntoView({behavior: 'smooth'});
            }
        }
    });
});

// ANIMATION TRIGGERS ON SCROLL
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.8s ease-out forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe feature and testimonial cards
const observableElements = document.querySelectorAll('.feature-premium-card, .review-card, .stat-card, .apt-card');
observableElements.forEach(el => observer.observe(el));

// REDUCE MOTION FOR ACCESSIBILITY
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.style.scrollBehavior = 'auto';
    const style = document.createElement('style');
    style.textContent = `
        * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
        }
    `;
    document.head.appendChild(style);
}
// Observe feature and testimonial cards
const observableElements = document.querySelectorAll('.feature-premium-card, .review-card, .stat-card, .apt-card');
observableElements.forEach(el => observer.observe(el));

// UTILITY: Log console message
console.log('%c🏠 Welcome to P&P Apartments', 'color: #d4af37; font-size: 16px; font-weight: bold;');
console.log('%cLuxury Living from ₦150,000 | WhatsApp: +234 805 730 2136', 'color: #666; font-size: 12px;');
