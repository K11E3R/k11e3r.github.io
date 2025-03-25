// DOM Elements
const navbar = document.querySelector('.navbar');
const navLinks = document.querySelector('.nav-links');
const burger = document.querySelector('.burger');
const themeToggle = document.querySelector('.theme-toggle');
const contactForm = document.getElementById('contactForm');
const sections = document.querySelectorAll('section');
const navItems = document.querySelectorAll('.nav-links a');

// Theme Management
const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

// Check for saved theme preference or use the browser preference
const savedTheme = localStorage.getItem('theme') || (prefersDarkMode ? 'dark' : 'light');

// Apply saved theme on page load
if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
}

// Toggle between dark and light mode
function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    
    // Save preference to localStorage
    if (document.body.classList.contains('dark-mode')) {
        localStorage.setItem('theme', 'dark');
    } else {
        localStorage.setItem('theme', 'light');
    }
}

// Navigation and Scrolling
function toggleNav() {
    navLinks.classList.toggle('active');
    burger.classList.toggle('active');
}

function closeNav() {
    if (navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
        burger.classList.remove('active');
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
        if (item.getAttribute('href') === `#${currentSection}`) {
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
    threshold: 0.25
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
        }
    });
}, observerOptions);

// Apply observer to elements that should animate on scroll
document.querySelectorAll('.skill-item, .project-card, .about-stats .stat').forEach(el => {
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
    
    .skill-item.in-view, .project-card.in-view, .stat.in-view {
        transition-delay: calc(var(--animation-order, 0) * 100ms);
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

// Event Listeners
window.addEventListener('scroll', handleScroll);
themeToggle.addEventListener('click', toggleTheme);
burger.addEventListener('click', toggleNav);
navItems.forEach(item => item.addEventListener('click', closeNav));

if (contactForm) {
    contactForm.addEventListener('submit', handleFormSubmit);
}

// Initialize scroll position on page load
handleScroll(); 