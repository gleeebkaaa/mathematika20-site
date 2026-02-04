/* ============================================
   МАТЕМАТИКА 2.0 - Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    initPreloader();
    initNavigation();
    initScrollEffects();
    initCounters();
    initReviewsSlider();
    initAOS();
    initParticles();
    initTrialAnimation();
});

/* ============================================
   Preloader
   ============================================ */
function initPreloader() {
    const preloader = document.getElementById('preloader');
    
    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.classList.add('hidden');
            document.body.style.overflow = 'visible';
        }, 500);
    });
}

/* ============================================
   Navigation
   ============================================ */
function initNavigation() {
    const header = document.getElementById('header');
    const navMenu = document.getElementById('nav-menu');
    const navToggle = document.getElementById('nav-toggle');
    const navClose = document.getElementById('nav-close');
    const navLinks = document.querySelectorAll('.nav__link');
    
    // Mobile menu toggle
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.add('show-menu');
            document.body.style.overflow = 'hidden';
        });
    }
    
    if (navClose) {
        navClose.addEventListener('click', () => {
            navMenu.classList.remove('show-menu');
            document.body.style.overflow = 'visible';
        });
    }
    
    // Close menu when clicking on nav links
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('show-menu');
            document.body.style.overflow = 'visible';
        });
    });
    
    // Header scroll effect
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        // Add scrolled class
        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });
    
    // Active link highlighting
    const sections = document.querySelectorAll('section[id]');
    
    function highlightNavLink() {
        const scrollY = window.pageYOffset;
        
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 150;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav__link[href*="${sectionId}"]`);
            
            if (navLink) {
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    navLink.classList.add('active');
                } else {
                    navLink.classList.remove('active');
                }
            }
        });
    }
    
    window.addEventListener('scroll', highlightNavLink);
}

/* ============================================
   Scroll Effects
   ============================================ */
function initScrollEffects() {
    const backToTop = document.getElementById('back-to-top');
    
    // Back to top button
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });
    
    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
}

/* ============================================
   Animated Counters
   ============================================ */
function initCounters() {
    const counters = document.querySelectorAll('.stat__number[data-count]');
    const speed = 200; // Animation duration in ms per increment
    
    const animateCounter = (counter) => {
        const target = +counter.getAttribute('data-count');
        const increment = target / speed;
        
        const updateCounter = () => {
            const current = +counter.innerText;
            
            if (current < target) {
                counter.innerText = Math.ceil(current + increment);
                setTimeout(updateCounter, 1);
            } else {
                counter.innerText = target;
            }
        };
        
        updateCounter();
    };
    
    // Use Intersection Observer to trigger animation when visible
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    counters.forEach(counter => observer.observe(counter));
}

/* ============================================
   Reviews Slider
   ============================================ */
function initReviewsSlider() {
    const track = document.getElementById('reviews-track');
    const prevBtn = document.getElementById('reviews-prev');
    const nextBtn = document.getElementById('reviews-next');
    const dotsContainer = document.getElementById('reviews-dots');
    
    if (!track) return;
    
    const cards = track.querySelectorAll('.review-card');
    let currentIndex = 0;
    let cardsPerView = getCardsPerView();
    let maxIndex = Math.max(0, cards.length - cardsPerView);
    
    // Create dots
    function createDots() {
        dotsContainer.innerHTML = '';
        const numDots = maxIndex + 1;
        
        for (let i = 0; i < numDots; i++) {
            const dot = document.createElement('div');
            dot.classList.add('reviews__dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        }
    }
    
    function getCardsPerView() {
        if (window.innerWidth < 768) return 1;
        if (window.innerWidth < 1024) return 2;
        return 3;
    }
    
    function updateSlider() {
        const cardWidth = cards[0].offsetWidth;
        const gap = 32; // 2rem gap
        const offset = -currentIndex * (cardWidth + gap);
        track.style.transform = `translateX(${offset}px)`;
        
        // Update dots
        const dots = dotsContainer.querySelectorAll('.reviews__dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }
    
    function goToSlide(index) {
        currentIndex = Math.min(Math.max(0, index), maxIndex);
        updateSlider();
    }
    
    function nextSlide() {
        currentIndex = currentIndex >= maxIndex ? 0 : currentIndex + 1;
        updateSlider();
    }
    
    function prevSlide() {
        currentIndex = currentIndex <= 0 ? maxIndex : currentIndex - 1;
        updateSlider();
    }
    
    // Event listeners
    prevBtn.addEventListener('click', prevSlide);
    nextBtn.addEventListener('click', nextSlide);
    
    // Handle resize
    window.addEventListener('resize', () => {
        cardsPerView = getCardsPerView();
        maxIndex = Math.max(0, cards.length - cardsPerView);
        currentIndex = Math.min(currentIndex, maxIndex);
        createDots();
        updateSlider();
    });
    
    // Auto-play
    let autoPlay = setInterval(nextSlide, 5000);
    
    track.addEventListener('mouseenter', () => clearInterval(autoPlay));
    track.addEventListener('mouseleave', () => {
        autoPlay = setInterval(nextSlide, 5000);
    });
    
    // Touch support
    let touchStartX = 0;
    let touchEndX = 0;
    
    track.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    track.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
    }
    
    // Initialize
    createDots();
    updateSlider();
}

/* ============================================
   AOS (Animate On Scroll) Initialization
   ============================================ */
function initAOS() {
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-out-cubic',
            once: true,
            offset: 50,
            disable: 'mobile'
        });
    }
}

/* ============================================
   Particle Animation (Hero Background)
   ============================================ */
function initParticles() {
    const container = document.getElementById('particles');
    if (!container) return;
    
    const particleCount = 30;
    
    for (let i = 0; i < particleCount; i++) {
        createParticle(container);
    }
}

function createParticle(container) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    // Random properties
    const size = Math.random() * 6 + 2;
    const left = Math.random() * 100;
    const animationDuration = Math.random() * 20 + 10;
    const animationDelay = Math.random() * 10;
    const opacity = Math.random() * 0.3 + 0.1;
    
    particle.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background: linear-gradient(135deg, #6366f1, #ec4899);
        border-radius: 50%;
        left: ${left}%;
        bottom: -10%;
        opacity: ${opacity};
        animation: particleFloat ${animationDuration}s linear ${animationDelay}s infinite;
        pointer-events: none;
    `;
    
    container.appendChild(particle);
}

// Add particle animation keyframes
const styleSheet = document.createElement('style');
styleSheet.textContent = `
    @keyframes particleFloat {
        0% {
            transform: translateY(0) rotate(0deg);
            opacity: 0;
        }
        10% {
            opacity: 0.3;
        }
        90% {
            opacity: 0.3;
        }
        100% {
            transform: translateY(-100vh) rotate(720deg);
            opacity: 0;
        }
    }
    
    .nav__link.active {
        color: var(--primary-color);
    }
    
    .nav__link.active::after {
        width: 100%;
    }
`;
document.head.appendChild(styleSheet);

/* ============================================
   Utility Functions
   ============================================ */

// Debounce function
function debounce(func, wait = 100) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function
function throttle(func, limit = 100) {
    let inThrottle;
    return function executedFunction(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/* ============================================
   Form Validation (for future use)
   ============================================ */
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    const re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
    return re.test(phone);
}

/* ============================================
   Lazy Loading Images (for future use)
   ============================================ */
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

/* ============================================
   Cookie Consent (for future use)
   ============================================ */
function showCookieConsent() {
    const consent = localStorage.getItem('cookieConsent');
    
    if (!consent) {
        const banner = document.createElement('div');
        banner.className = 'cookie-banner';
        banner.innerHTML = `
            <p>Мы используем файлы cookie для улучшения работы сайта. 
            Продолжая использовать сайт, вы соглашаетесь с нашей 
            <a href="pages/privacy.html">политикой конфиденциальности</a>.</p>
            <button class="btn btn--primary" id="accept-cookies">Принять</button>
        `;
        document.body.appendChild(banner);
        
        document.getElementById('accept-cookies').addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'true');
            banner.remove();
        });
    }
}

/* ============================================
   Trial Section Animation
   ============================================ */
function initTrialAnimation() {
    const trialBtn = document.querySelector('.trial__center-card .btn--primary');
    if (!trialBtn) return;
    
    // Функция мигания кнопки
    function flashButton() {
        trialBtn.classList.add('btn--flash');
        setTimeout(() => {
            trialBtn.classList.remove('btn--flash');
        }, 500);
    }
    
    // Кнопка мигает 1 раз в 5 секунд когда последняя точка достигает
    // Первая точка: старт 0s, длительность 5s = достигает в 5s
    // Последняя точка: старт 4s, длительность 5s = достигает в 9s
    
    // Мигаем когда последняя точка достигает (через 9 секунд первый раз)
    setTimeout(() => {
        flashButton();
        // Потом каждые 5 секунд (цикл анимации)
        setInterval(flashButton, 5000);
    }, 9000);
}

console.log('МАТЕМАТИКА 2.0 - Сайт загружен успешно! 📐');
