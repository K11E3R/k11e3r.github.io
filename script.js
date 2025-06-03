// DOM Elements
const navbar = document.querySelector('.navbar');
const navLinks = document.querySelector('.nav-links');
const burger = document.querySelector('.burger');
const themeToggle = document.querySelector('.theme-toggle');
const contactForm = document.getElementById('contactForm');
const sections = document.querySelectorAll('section');
const navItems = document.querySelectorAll('.nav-links a');
const body = document.querySelector('body');
const quoteContainer = document.getElementById('quote-container'); 

// AI Models for attribution
const aiModels = [
    { name: "GPT-4", provider: "OpenAI" },
    { name: "Claude 3", provider: "Anthropic" },
    { name: "Gemini Pro", provider: "Google" },
    { name: "Llama 3", provider: "Meta" },
    { name: "Mistral Large", provider: "Mistral AI" }
];

// Fallback quotes in case API fails
const fallbackQuotes = [
    {
        text: "The beauty of mathematics lies not in its complexity, but in its elegant simplicity.",
        author: "GPT-4",
        model: "OpenAI"
    },
    {
        text: "Artificial intelligence is not about replacing human creativity, but amplifying it.",
        author: "Claude 3",
        model: "Anthropic"
    },
    {
        text: "Data is the canvas, intelligence is the brush, but wisdom is knowing what to paint.",
        author: "GPT-4",
        model: "OpenAI"
    },
    {
        text: "Artificial intelligence is not about replacing human creativity, but amplifying it.",
        author: "Claude 3",
        model: "Anthropic"
    },
    {
        text: "The most fascinating aspect of AI is not what it can do, but what it inspires humans to imagine.",
        author: "Gemini Pro",
        model: "Google"
    }
];

// Function to show loading animation with terminal style
function showQuoteLoading() {
    quoteContainer.innerHTML = '';
    quoteContainer.classList.remove('with-quote-mark');
    
    if (document.body.classList.contains('dark-theme')) {
        quoteContainer.style.backgroundColor = '#000000';
        
        const windowControls = document.createElement('div');
        windowControls.className = 'window-controls';
        windowControls.innerHTML = `
            <div class="control"></div>
            <div class="control"></div>
            <div class="control"></div>
        `;
        quoteContainer.appendChild(windowControls);
        
        const terminalContent = document.createElement('div');
        terminalContent.className = 'quote-text';
        terminalContent.style.marginTop = '20px';
        quoteContainer.appendChild(terminalContent);
        
        const cmdLine = document.createElement('div');
        cmdLine.className = 'command-line';
        cmdLine.innerHTML = `<span class="prompt">root@ai-terminal:~$</span> <span class="command-text">ai-quote-fetch</span>`;
        terminalContent.appendChild(cmdLine);
        
        const loadingLine = document.createElement('div');
        loadingLine.className = 'command-line';
        loadingLine.innerHTML = `<span class="output">Fetching wisdom from the neural network</span>`;
        terminalContent.appendChild(loadingLine);
        
        const loadingDots = document.createElement('span');
        loadingDots.className = 'loading-dots';
        loadingLine.querySelector('.output').appendChild(loadingDots);
        
        let dots = 0;
        const loadingInterval = setInterval(() => {
            loadingDots.textContent = '.'.repeat(dots % 4);
            dots++;
        }, 500);
        
        quoteContainer.loadingInterval = loadingInterval;
    }
    
    const loadingTextElement = document.createElement('p');
    loadingTextElement.className = 'quote-text';
    loadingTextElement.style.marginTop = document.body.classList.contains('dark-theme') ? '15px' : '28px';
    loadingTextElement.style.fontSize = '1em';
    
    if (document.body.classList.contains('dark-theme')) {
        loadingTextElement.style.color = '#00ff00';
        loadingTextElement.style.fontFamily = '"VT323", "Courier New", monospace';
        loadingTextElement.style.textAlign = 'left';
        loadingTextElement.style.paddingLeft = '10px';
    }
    quoteContainer.appendChild(loadingTextElement);
    
    const attributionElement = document.createElement('p');
    attributionElement.className = 'quote-attribution';
    attributionElement.style.marginTop = '28px';
    attributionElement.style.fontSize = document.body.classList.contains('dark-theme') ? '0.8rem' : '15px';
    
    if (document.body.classList.contains('dark-theme')) {
        attributionElement.style.color = '#00ff00';
        attributionElement.style.fontFamily = '"VT323", "Courier New", monospace';
        attributionElement.style.textAlign = 'left';
        attributionElement.style.paddingLeft = '10px';
        attributionElement.innerHTML = `> AI <span class="ai-model">SYSTEM</span>`;
    } else {
        attributionElement.innerHTML = `— AI <span class="ai-model">thinking</span>`;
    }
    quoteContainer.appendChild(attributionElement);
    
    const loadingText = document.body.classList.contains('dark-theme') ? 
                        'Connecting to quote API...' : 
                        'Generating wisdom';
    let i = 0;
    const typeSpeed = document.body.classList.contains('dark-theme') ? 30 : 70; 
    
    function typeWriter() {
        if (i < loadingText.length) {
            loadingTextElement.textContent += loadingText.charAt(i);
            i++;
            setTimeout(typeWriter, typeSpeed);
        } else {
            if (document.body.classList.contains('dark-theme')) {
                setTimeout(() => {
                    loadingTextElement.innerHTML += '<br><span style="color: #00aa00;">Connection established. Fetching data...</span>';
                    
                    setTimeout(() => {
                        loadingTextElement.innerHTML += '<br><span class="cursor">_</span>';
                        
                        const cursor = document.querySelector('.cursor');
                        let visible = true;
                        
                        const blinkInterval = setInterval(() => {
                            if (cursor && document.contains(cursor)) {
                                visible = !visible;
                                cursor.style.opacity = visible ? '1' : '0';
                            } else {
                                clearInterval(blinkInterval);
                            }
                        }, 500);
                        
                        setTimeout(() => clearInterval(blinkInterval), 5000);
                    }, 800);
                }, 500);
            } else {
                loadingTextElement.innerHTML = loadingTextElement.textContent + '<span class="loading-dots">...</span>';
                
                let dots = document.querySelector('.loading-dots');
                let dotCount = 0;
                
                if (dots) {
                    const loadingInterval = setInterval(() => {
                        dotCount = (dotCount + 1) % 4;
                        dots.textContent = '.'.repeat(dotCount);
                        
                        if (!document.contains(dots)) {
                            clearInterval(loadingInterval);
                        }
                    }, 300);
                    
                    setTimeout(() => clearInterval(loadingInterval), 5000);
                }
            }
        }
    }
    
    typeWriter();
}

// Function to fetch a random quote from the API
async function fetchRandomQuote() {
    showQuoteLoading();
    try {
        const quotes = [
            { text: "The universe is a pretty big place. If it's just us, seems like an awful waste of space.", author: "Carl Sagan", model: "GPT-4" },
            { text: "The good thing about science is that it's true whether or not you believe in it.", author: "Neil deGrasse Tyson", model: "GPT-4" },
            { text: "An algorithm must be seen to be believed.", author: "Donald Knuth", model: "Claude" },
            { text: "In mathematics, you don't understand things. You just get used to them.", author: "John von Neumann", model: "Claude" },
            { text: "To invent, you need a good imagination and a pile of junk.", author: "Thomas Edison", model: "GPT-4" },
            { text: "Science is magic that works.", author: "Kurt Vonnegut", model: "Claude" },
            { text: "Computer science is no more about computers than astronomy is about telescopes.", author: "Edsger W. Dijkstra", model: "Claude" },
            { text: "Mathematics is not about numbers, equations, computations or algorithms: it is about understanding.", author: "William Paul Thurston", model: "GPT-4" },
            { text: "We are just an advanced breed of monkeys on a minor planet of a very average star.", author: "Stephen Hawking", model: "GPT-4" },
            { text: "Success is a lousy teacher. It seduces smart people into thinking they can't lose.", author: "Bill Gates", model: "Claude" }
        ];
        
        if (quoteContainer.loadingInterval) {
            clearInterval(quoteContainer.loadingInterval);
            quoteContainer.loadingInterval = null;
        }
        
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const randomIndex = Math.floor(Math.random() * quotes.length);
        return quotes[randomIndex];
    } catch (error) {
        console.error('Error fetching quote:', error);
        return { text: "The best way to predict the future is to invent it.", author: "Alan Kay", model: "Offline Mode" };
    }
}

// Function to simulate terminal commands and outputs with better error handling
async function simulateTerminalCommands(terminalContent, quote) {
    try {
        const commands = [
            { command: 'ai-wisdom-init', output: 'Initializing neural wisdom module v2.0.4...' },
            { command: 'connect-oracle', output: 'Connecting to the wisdom oracle... [OK]' },
            { command: 'scan-knowledge-base', output: 'Scanning quantum knowledge base...' },
            { command: 'ai-quote-fetch --author="' + quote.author + '" --model="' + quote.model + '"', output: 'Quote retrieved successfully.' },
        ];
        
        for (const cmd of commands) {
            const cmdLine = document.createElement('div');
            cmdLine.className = 'command-line';
            cmdLine.innerHTML = `<span class="prompt">root@ai-terminal:~$</span> `;
            terminalContent.appendChild(cmdLine);
            
            const cmdText = document.createElement('span');
            cmdText.className = 'command-text';
            cmdLine.appendChild(cmdText);
            
            await typeCommandText(cmdText, cmd.command).catch(e => {
                console.warn('Command typing error:', e);
                cmdText.textContent = cmd.command;
            });
            
            await new Promise(resolve => {
                const timer = setTimeout(() => {
                    clearTimeout(timer);
                    resolve();
                }, 300);
            });
            
            const outputLine = document.createElement('div');
            outputLine.className = 'command-line';
            outputLine.innerHTML = `<span class="output">${cmd.output}</span>`;
            terminalContent.appendChild(outputLine);
            
            await new Promise(resolve => {
                const timer = setTimeout(() => {
                    clearTimeout(timer);
                    resolve();
                }, 500);
            });
            
            try {
                terminalContent.scrollTop = terminalContent.scrollHeight;
            } catch (scrollErr) {
                console.warn('Scroll error:', scrollErr);
            }
        }
        
        const spacer = document.createElement('div');
        spacer.className = 'command-line';
        spacer.innerHTML = `<span class="output"></span>`;
        terminalContent.appendChild(spacer);
        
        const quoteBox = document.createElement('div');
        quoteBox.className = 'command-line';
        quoteBox.innerHTML = `<span class="output">+${'-'.repeat(Math.min(60, quote.text.length * 0.8))}+</span>`;
        terminalContent.appendChild(quoteBox);
        
        const quoteLine = document.createElement('div');
        quoteLine.className = 'command-line';
        quoteLine.innerHTML = `<span class="output">| ${quote.text} |</span>`;
        terminalContent.appendChild(quoteLine);
        
        const quoteBoxBottom = document.createElement('div');
        quoteBoxBottom.className = 'command-line';
        quoteBoxBottom.innerHTML = `<span class="output">+${'-'.repeat(Math.min(60, quote.text.length * 0.8))}+</span>`;
        terminalContent.appendChild(quoteBoxBottom);
        
        const authorLine = document.createElement('div');
        authorLine.className = 'command-line';
        authorLine.innerHTML = `<span class="output">-- ${quote.author} <span class="ai-model">${quote.model}</span></span>`;
        terminalContent.appendChild(authorLine);
        
        const commandLine = document.createElement('div');
        commandLine.className = 'command-line';
        commandLine.innerHTML = `<span class="prompt">root@ai-terminal:~$</span> <span class="cursor">|</span>`;
        terminalContent.appendChild(commandLine);
        
        try {
            terminalContent.scrollTop = terminalContent.scrollHeight;
        } catch (scrollErr) {
            console.warn('Final scroll error:', scrollErr);
        }
    } catch (error) {
        console.error('Terminal command simulation failed:', error);
        terminalContent.innerHTML = `
            <div class="command-line"><span class="output">System error: Terminal simulation failed</span></div>
            <div class="command-line"><span class="output">Displaying quote in basic mode:</span></div>
            <div class="command-line"><span class="output">${quote.text}</span></div>
            <div class="command-line"><span class="output">-- ${quote.author} <span class="ai-model">${quote.model}</span></span></div>
        `;
    }
}

// Function to type out command text character by character
async function typeCommandText(element, text, speed = 30) {
    for (let i = 0; i < text.length; i++) {
        element.textContent += text.charAt(i);
        await new Promise(resolve => setTimeout(resolve, speed));
    }
}

// Function to display a random quote with terminal typing effect
async function displayRandomQuote() {
    try {
        const randomQuote = await fetchRandomQuote().catch(error => {
            console.error('Error fetching quote:', error);
            return { text: "Connection error. Wisdom unavailable.", author: "System", model: "Offline" };
        });
        
        while (quoteContainer.firstChild) {
            quoteContainer.removeChild(quoteContainer.firstChild);
        }
        quoteContainer.classList.add('with-quote-mark');
        
        if (document.body.classList.contains('dark-theme')) {
            quoteContainer.style.backgroundColor = '#000000';
            
            const windowControls = document.createElement('div');
            windowControls.className = 'window-controls';
            windowControls.innerHTML = `
                <div class="control"></div>
                <div class="control"></div>
                <div class="control"></div>
            `;
            quoteContainer.appendChild(windowControls);
            
            const terminalHeader = document.createElement('div');
            terminalHeader.className = 'terminal-header';
            terminalHeader.textContent = 'AI Terminal - v2.0.0';
            quoteContainer.appendChild(terminalHeader);
            
            const terminalContent = document.createElement('div');
            terminalContent.className = 'quote-text';
            terminalContent.style.marginTop = '20px';
            quoteContainer.appendChild(terminalContent);
            
            await simulateTerminalCommands(terminalContent, randomQuote);
            return; 
        }
        
        const quoteTextElement = document.createElement('p');
        quoteTextElement.className = 'quote-text';
        quoteTextElement.style.marginTop = document.body.classList.contains('dark-theme') ? '15px' : '28px';
        quoteTextElement.style.fontSize = '1em';
        if (document.body.classList.contains('dark-theme')) {
            quoteTextElement.style.color = '#00ff00';
            quoteTextElement.style.fontFamily = '"Roboto Mono", "VT323", monospace';
            quoteTextElement.style.paddingLeft = '10px';
        }
        quoteContainer.appendChild(quoteTextElement);
        
        const attributionElement = document.createElement('p');
        attributionElement.className = 'quote-attribution';
        attributionElement.style.marginTop = '28px';
        attributionElement.style.fontSize = document.body.classList.contains('dark-theme') ? '0.8rem' : '15px';
        attributionElement.style.opacity = '0';
        if (document.body.classList.contains('dark-theme')) {
            attributionElement.style.color = 'rgba(0, 255, 0, 0.8)';
            attributionElement.style.fontFamily = '"Roboto Mono", "VT323", monospace';
            attributionElement.style.paddingLeft = '10px';
            attributionElement.innerHTML = `> ${randomQuote.author} <span class="ai-model">${randomQuote.model}</span>`;
        } else {
            attributionElement.innerHTML = `— ${randomQuote.author} <span class="ai-model">${randomQuote.model}</span>`;
        }
        quoteContainer.appendChild(attributionElement);
        
        await typeWriterPromise(quoteTextElement, randomQuote.text, 
            document.body.classList.contains('dark-theme') ? 30 : 50);
        
        attributionElement.style.transition = 'opacity 0.5s';
        attributionElement.style.opacity = '1';
        
        if (document.body.classList.contains('dark-theme')) {
            const cursor = document.createElement('span');
            cursor.className = 'cursor';
            cursor.textContent = '|';
            attributionElement.appendChild(cursor);
        }
    } catch (error) {
        console.error('Error displaying quote:', error);
        while (quoteContainer.firstChild) {
            quoteContainer.removeChild(quoteContainer.firstChild);
        }
        const errorMsg = document.createElement('p');
        errorMsg.className = 'quote-text';
        errorMsg.textContent = 'Error displaying quote. Please refresh.';  
        quoteContainer.appendChild(errorMsg);
    }
}

// Safer typewriter function that returns a promise
function typeWriterPromise(element, text, speed = 50) {
    return new Promise(resolve => {
        let i = 0;
        function type() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(type, speed);
            } else {
                resolve();
            }
        }
        type();
    });
}

// Display a random quote on page load
displayRandomQuote();

// Set an interval to change the quote every 60 seconds
setInterval(displayRandomQuote, 60000);

// Theme Management
const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

// Check for saved theme preference or use the browser preference
const savedTheme = localStorage.getItem('theme') || (prefersDarkMode ? 'dark' : 'light');

// Function to add twinkling stars and planets to the quote container in light mode
function addStarsToQuoteContainer() {
    if (document.body.classList.contains('dark-theme')) {
        return;
    }
    
    const container = document.querySelector('.quote-container');
    if (!container) {
        return;
    }
    
    const starCount = Math.floor(Math.random() * 10) + 25;
    
    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        
        star.style.top = `${Math.random() * 100}%`;
        star.style.left = `${Math.random() * 100}%`;
        
        const size = (Math.random() * 2) + 1;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        
        star.style.animationDelay = `${Math.random() * 5}s`;
        star.style.animationDuration = `${Math.random() * 2 + 2}s`;
        
        container.appendChild(star);
    }
    
    addPlanetsToQuoteContainer(container);
}

// Function to add orbiting planets
function addPlanetsToQuoteContainer(container) {
    const planetTypes = ['small', 'medium', 'large'];
    const orbitRadii = [70, 100, 140]; 
    
    for (let i = 0; i < 3; i++) {
        const planet = document.createElement('div');
        planet.className = `planet ${planetTypes[i]}`;
        
        planet.style.top = '50%';
        planet.style.left = '50%';
        
        planet.style.setProperty('--orbit-radius', `${orbitRadii[i]}px`);
        planet.style.animationDelay = `${i * -5}s`; 
        
        container.appendChild(planet);
    }
}

// Function to remove all stars and planets
function removeStars() {
    const stars = document.querySelectorAll('.star');
    stars.forEach(star => star.remove());
    
    const planets = document.querySelectorAll('.planet');
    planets.forEach(planet => planet.remove());
}

function setTheme(refresh = false) {
    const currentTheme = localStorage.getItem('theme');
    const isDarkTheme = currentTheme === 'dark' || (!currentTheme && prefersDarkMode);
    
    if (isDarkTheme) {
        document.body.classList.add('dark-theme');
        document.documentElement.setAttribute('data-theme', 'dark');
        removeStars();
    } else {
        document.body.classList.remove('dark-theme');
        document.documentElement.setAttribute('data-theme', 'light');
        document.documentElement.style.setProperty('--quote-bg-light', 'linear-gradient(135deg, #c2e9fb 0%, #a1c4fd 100%)');
        addStarsToQuoteContainer();
    }
    
    if (refresh) {
        setTimeout(() => {
            displayRandomQuote();
        }, 100);
    }
}

// Apply saved theme on page load
document.addEventListener('DOMContentLoaded', function() {
    setTheme();
    
    setTimeout(() => {
        if (!document.body.classList.contains('dark-theme')) {
            addStarsToQuoteContainer();
        }
    }, 300);
});

// Ensure the theme is set even if DOMContentLoaded already fired
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTheme();
    
    setTimeout(() => {
        if (!document.body.classList.contains('dark-theme')) {
            addStarsToQuoteContainer();
        }
    }, 300);
}

// Toggle between dark and light mode
if (themeToggle) {
    themeToggle.addEventListener('click', function(e) {
        const isDarkTheme = document.body.classList.contains('dark-theme');
        
        if (!isDarkTheme) {
            document.body.classList.add('dark-theme');
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            removeStars();
        } else {
            document.body.classList.remove('dark-theme');
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
            document.documentElement.style.setProperty('--quote-bg-light', 'linear-gradient(135deg, #c2e9fb 0%, #a1c4fd 100%)');
            addStarsToQuoteContainer();
        }
        
        setTimeout(() => {
            displayRandomQuote();
        }, 200);
    });
} else {
    console.error('Theme toggle element not found');
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
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
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
    
    if (!name || !email || !message) {
        alert('Please fill in all fields');
        return;
    }
    
    // Show loading state
    const submitBtn = document.querySelector('#contactForm button[type="submit"]');
    const originalBtnText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    
    // Using emailjs service - make sure to add the SDK to your index.html
    // This is using a public key approach - you should set up EmailJS account
    emailjs.send('default_service', 'template_contact', {
        from_name: name,
        from_email: email,
        message: message,
        to_email: 'prs.online.00@gmail.com'
    }, 'YOUR_PUBLIC_KEY')
    .then(() => {
        e.target.reset();
        alert('Message sent successfully!');
    })
    .catch((error) => {
        console.error('Email error:', error);
        showEmailErrorPopup();
    })
    .finally(() => {
        // Reset button state
        submitBtn.textContent = originalBtnText;
        submitBtn.disabled = false;
    });
}

// Show super cool Tokyo retro pop-up on email send error
function showEmailErrorPopup() {
    const overlay = document.createElement('div');
    overlay.className = 'error-popup-overlay';
    const popup = document.createElement('div');
    popup.className = 'error-popup';
    // Randomize error popup message
    const messages = [
        `<p>💤 Oops! I took an unexpected power nap!<br>Your message is safe in my memory banks—I'll send it right after I boot up! 🚀</p>`,
        `<p>😵‍💫 Woah, got caught in a cosmic dust storm! Your message is stowed safely; will be launched once systems clear! 🌌</p>`,
        `<p>🔌 Low power mode activated! Charging... 📡 Your message will beam out when I'm back online! 📮</p>`,
        `<p>💾 Saving your message to my neural drive! Stand by for dispatch on next power cycle! 🛠️</p>`,
        `<p>✨ Terminal says “Zzz…” — I'll whip that message out shortly when I wake up! 🖥️</p>`
    ];
    const index = Math.floor(Math.random() * messages.length);
    popup.innerHTML = messages[index] + '<button class="error-popup-close">Got it!</button>';
    overlay.appendChild(popup);
    document.body.appendChild(overlay);
    popup.querySelector('.error-popup-close').addEventListener('click', () => {
        document.body.removeChild(overlay);
    });
}

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1, 
    rootMargin: '0px 0px -10% 0px' 
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
        opacity: 0.2;
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
    setTimeout(() => {
        window.scrollBy(0, 1);
        window.scrollBy(0, -1);
        
        if (navLinks.classList.contains('active')) {
            closeNav();
        }
    }, 100);
});

// Event Listeners
window.addEventListener('scroll', handleScroll);
window.addEventListener('DOMContentLoaded', forceThemeRefresh);
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

// Back to top button functionality
const backToTopButton = document.querySelector('.back-to-top');
if (backToTopButton) {
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
    });
    
    backToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}