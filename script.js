window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 50) {
        header.style.background = 'rgba(255, 255, 255, 0.98)';
        header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15)';
    } else {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    }
});

// Sections reference for intersection animations (safe if none present)
const sections = document.querySelectorAll('.section');

// Button interactions
const startLearningBtn = document.getElementById('startLearningBtn');
if (startLearningBtn) startLearningBtn.addEventListener('click', () => {
    // Add ripple effect
    const ripple = document.createElement('span');
    ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        width: 100px;
        height: 100px;
        margin-top: -50px;
        margin-left: -50px;
        animation: ripple 0.6s;
        opacity: 0;
    `;
    
    startLearningBtn.style.position = 'relative';
    startLearningBtn.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
    
    // Scroll to learning section
    const learningSection = document.getElementById('learning');
    if (learningSection) {
        const headerHeight = document.querySelector('.header').offsetHeight;
        const sectionPosition = learningSection.offsetTop - headerHeight;
        
        setTimeout(() => {
            window.scrollTo({
                top: sectionPosition,
                behavior: 'smooth'
            });
        }, 300);
    }
});

const exploreBtn = document.getElementById('exploreBtn');
if (exploreBtn) exploreBtn.addEventListener('click', () => {
    // Show modal or scroll to sustainability section
    const sustainabilitySection = document.getElementById('sustainability');
    if (sustainabilitySection) {
        const headerHeight = document.querySelector('.header').offsetHeight;
        const sectionPosition = sustainabilitySection.offsetTop - headerHeight;
        
        window.scrollTo({
            top: sectionPosition,
            behavior: 'smooth'
        });
    }
});

// Add ripple animation
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            opacity: 0;
            transform: scale(4);
        }
    }
`;
document.head.appendChild(style);

// Logo click event
// Home logo click behavior disabled to avoid in-page navigation on subpages

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero-content');
    const scrollIndicator = document.querySelector('.scroll-indicator');
    
    if (hero && scrolled < window.innerHeight) {
        hero.style.transform = `translateY(${scrolled * 0.3}px)`;
        hero.style.opacity = 1 - scrolled / 500;
        
        if (scrollIndicator) {
            scrollIndicator.style.opacity = 1 - scrolled / 300;
        }
    }
});

// Add scroll indicator click event
const scrollIndicator = document.querySelector('.scroll-indicator');
if (scrollIndicator) {
    scrollIndicator.addEventListener('click', () => {
        const learningSection = document.getElementById('learning');
        if (learningSection) {
            const headerHeight = document.querySelector('.header').offsetHeight;
            const sectionPosition = learningSection.offsetTop - headerHeight;
            
            window.scrollTo({
                top: sectionPosition,
                behavior: 'smooth'
            });
        }
    });
    
    scrollIndicator.style.cursor = 'pointer';
}

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all sections
sections.forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(section);
});

// Add keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown' && window.pageYOffset === 0) {
        e.preventDefault();
        window.scrollTo({
            top: window.innerHeight,
            behavior: 'smooth'
        });
    }
});

// Console greeting
console.log('%c🌿 Welcome to KaAni Web! 🌿', 'color: #4caf50; font-size: 20px; font-weight: bold;');
console.log('%cEmpowering Agriculture & Fisheries', 'color: #2c3e50; font-size: 14px;');

// --- Learning Hub interactions (Challenges section) ---
function wireChallengeInteractions() {
    const challengeItems = document.querySelectorAll('.challenge-item');
    challengeItems.forEach((item) => {
        // Toggle expand on click
        item.addEventListener('click', () => {
            item.classList.toggle('expanded');
        });

        // Keyboard accessibility
        item.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                item.classList.toggle('expanded');
            }
        });
    });
}

// On DOM ready, wire up interactions in case the section is already present
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', wireChallengeInteractions);
} else {
    wireChallengeInteractions();
}

// Wire feature Explore buttons to scroll to their sections
function wireFeatureButtons() {
    const buttons = document.querySelectorAll('.feature-explore');
    buttons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const target = btn.getAttribute('data-target');
            const section = document.getElementById(target);
            if (!section) return;
            const headerHeight = document.querySelector('.header').offsetHeight;
            const position = section.offsetTop - headerHeight;
            window.scrollTo({ top: position, behavior: 'smooth' });
        });
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', wireFeatureButtons);
} else {
    wireFeatureButtons();
}

// Footer quick links smooth scroll
function wireFooterLinks() {
    const links = document.querySelectorAll('#contact .footer-link[data-target], #site-footer .footer-link[data-target]');
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = link.getAttribute('data-target');
            const section = document.getElementById(target);
            if (!section) return;
            const headerHeight = document.querySelector('.header').offsetHeight;
            const position = section.offsetTop - headerHeight;
            window.scrollTo({ top: position, behavior: 'smooth' });
        });
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', wireFooterLinks);
} else {
    wireFooterLinks();
}

// --- Interactive Scene: fish generation and gentle parallax ---
function spawnFish() {
    const layer = document.getElementById('fishLayer');
    if (!layer) return;
    const colors = ['yellow', 'blue'];
    const count = 7;
    for (let i = 0; i < count; i++) {
        const fish = document.createElement('div');
        const isBlue = Math.random() > 0.5;
        fish.className = `fish ${isBlue ? 'blue' : ''}`;
        const startX = Math.random() * window.innerWidth * 0.8;
        const startY = 8 + Math.random() * (window.innerHeight * 0.24);
        fish.style.left = `${startX}px`;
        fish.style.bottom = `${startY}px`;
        layer.appendChild(fish);

        const swimDuration = 12 + Math.random() * 10;
        const amplitude = 6 + Math.random() * 10;
        const direction = Math.random() > 0.5 ? 1 : -1;
        fish.style.transform = `scaleX(${direction})`;

        let start = performance.now();
        function swim(t) {
            const elapsed = (t - start) / 1000;
            const dx = direction * elapsed * (window.innerWidth / swimDuration);
            const dy = Math.sin(elapsed * 2) * amplitude;
            fish.style.transform = `translate(${dx}px, ${-dy}px) scaleX(${direction})`;
            if ((direction === 1 && startX + dx < window.innerWidth + 40) || (direction === -1 && startX + dx > -60)) {
                requestAnimationFrame(swim);
            } else {
                fish.remove();
            }
        }
        requestAnimationFrame(swim);
    }
}

function parallaxMouse() {
    const scene = document.querySelector('.hero-scene');
    if (!scene) return;
    scene.addEventListener('mousemove', (e) => {
        const { innerWidth: w, innerHeight: h } = window;
        const dx = (e.clientX - w / 2) / w;
        const dy = (e.clientY - h / 2) / h;
        const clouds = document.querySelectorAll('.cloud');
        clouds.forEach((c, i) => {
            c.style.transform = `translate(${dx * (10 + i * 6)}px, ${dy * (4 + i * 2)}px)`;
        });
        const boat = document.querySelector('.boat');
        if (boat) boat.style.transform = `translate(${dx * 8}px, ${dy * 2}px)`;
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => { if (document.getElementById('fishLayer')) { spawnFish(); setInterval(spawnFish, 6000); } parallaxMouse(); });
} else {
    if (document.getElementById('fishLayer')) { spawnFish(); setInterval(spawnFish, 6000); }
    parallaxMouse();
}

// Community CTA (Legal section)
function wireCommunityCta() {
    const btn = document.getElementById('getStartedBtn');
    if (!btn) return;
    btn.addEventListener('click', () => {
        // Smooth scroll to the top hero as a starting point
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', wireCommunityCta);
} else {
    wireCommunityCta();
}

