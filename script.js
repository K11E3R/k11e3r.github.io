// DOM Elements
const navbar = document.querySelector('.navbar');
const navLinks = document.querySelector('.nav-links');
const burger = document.querySelector('.burger');
const themeToggle = document.querySelector('.theme-toggle');
const contactForm = document.getElementById('contactForm');
const sections = document.querySelectorAll('section');
const navItems = document.querySelectorAll('.nav-links a');
const body = document.querySelector('body');

// Theme Management
const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

// Check for saved theme preference or use the browser preference
const savedTheme = localStorage.getItem('theme') || (prefersDarkMode ? 'dark' : 'light');

// Apply saved theme on page load
document.documentElement.setAttribute('data-theme', savedTheme);
console.log('Theme set to:', savedTheme);

// Toggle between dark and light mode
function toggleTheme(e) {
    e.stopPropagation(); // Prevent click from closing mobile nav
    
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    console.log('Theme toggled to:', newTheme);
    
    // Save preference to localStorage
    localStorage.setItem('theme', newTheme);
}

// Force theme refresh
function forceThemeRefresh() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    document.documentElement.setAttribute('data-theme', '');
    setTimeout(() => {
        document.documentElement.setAttribute('data-theme', currentTheme);
    }, 10);
}

// Navigation and Scrolling
function toggleNav() {
    navLinks.classList.toggle('active');
    burger.classList.toggle('active');
    
    // Prevent body scrolling when nav is open
    if (navLinks.classList.contains('active')) {
        body.style.overflow = 'hidden';
    } else {
        body.style.overflow = '';
    }
}

function closeNav() {
    if (navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
        burger.classList.remove('active');
        body.style.overflow = '';
    }
}

// Scroll event handler
function handleScroll() {
    // Navbar styling on scroll
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    // Highlight nav item based on scroll position
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 150;
        const sectionHeight = section.offsetHeight;
        
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href') === `#${currentSection}` || 
            (currentSection === 'home' && item.getAttribute('href') === 'index.html')) {
            item.classList.add('active');
        }
    });
}

// Contact Form Submission
function handleFormSubmit(e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    
    // Basic form validation
    if (!name || !email || !message) {
        alert('Please fill in all fields');
        return;
    }
    
    // Here you'd typically send the form data to a server or email service
    // For this example, we'll just log it to console and show a success message
    console.log({
        name,
        email,
        message
    });
    
    // Reset form
    e.target.reset();
    
    // Show success message (you could create a more elegant solution)
    alert('Message sent successfully!');
}

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1, // Lower threshold for mobile
    rootMargin: '0px 0px -10% 0px' // Trigger a bit earlier
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
        }
    });
}, observerOptions);

// Apply observer to elements that should animate on scroll
document.querySelectorAll('.skill-item, .project-card, .about-stats .stat, .reference-group').forEach(el => {
    el.classList.add('animate-on-scroll');
    observer.observe(el);
});

// Add CSS for animated elements
const style = document.createElement('style');
style.textContent = `
    .animate-on-scroll {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }
    
    .animate-on-scroll.in-view {
        opacity: 1;
        transform: translateY(0);
    }
    
    .skill-item.in-view, .project-card.in-view, .stat.in-view, .reference-group.in-view {
        transition-delay: calc(var(--animation-order, 0) * 100ms);
    }
    
    @media (prefers-reduced-motion: reduce) {
        .animate-on-scroll {
            opacity: 1;
            transform: none;
            transition: none;
        }
    }
`;
document.head.appendChild(style);

// Set animation order for staggered animations
document.querySelectorAll('.skill-item').forEach((el, index) => {
    el.style.setProperty('--animation-order', index % 8);
});

document.querySelectorAll('.project-card').forEach((el, index) => {
    el.style.setProperty('--animation-order', index);
});

document.querySelectorAll('.stat').forEach((el, index) => {
    el.style.setProperty('--animation-order', index);
});

document.querySelectorAll('.reference-group').forEach((el, index) => {
    el.style.setProperty('--animation-order', index % 4);
});

// Close nav when clicking outside
document.addEventListener('click', (e) => {
    const isClickInside = navLinks.contains(e.target) || burger.contains(e.target);
    if (!isClickInside && navLinks.classList.contains('active')) {
        closeNav();
    }
});

// Handle orientation change for mobile
window.addEventListener('orientationchange', () => {
    // Force layout recalculation
    setTimeout(() => {
        window.scrollBy(0, 1);
        window.scrollBy(0, -1);
        
        // Fix for some mobile browsers
        if (navLinks.classList.contains('active')) {
            closeNav();
        }
    }, 100);
});

// Event Listeners
window.addEventListener('scroll', handleScroll);
window.addEventListener('DOMContentLoaded', forceThemeRefresh);
themeToggle.addEventListener('click', toggleTheme);
burger.addEventListener('click', toggleNav);

// Add touch events for better mobile performance
if ('ontouchstart' in window) {
    navItems.forEach(item => {
        item.addEventListener('touchend', (e) => {
            e.preventDefault();
            const href = item.getAttribute('href');
            if (href.startsWith('#')) {
                const targetElement = document.querySelector(href);
                if (targetElement) {
                    closeNav();
                    setTimeout(() => {
                        targetElement.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }, 300);
                }
            } else {
                window.location.href = href;
            }
        });
    });
} else {
    navItems.forEach(item => item.addEventListener('click', closeNav));
}

if (contactForm) {
    contactForm.addEventListener('submit', handleFormSubmit);
}

// Initialize scroll position on page load
handleScroll(); 