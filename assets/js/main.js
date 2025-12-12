/* 1. CUSTOM CURSOR (Optimized for performance) */
const cursorDot = document.querySelector('[data-cursor-dot]');
const cursorOutline = document.querySelector('[data-cursor-outline]');

// Only run mouse events if device has a mouse (not touch)
if (window.matchMedia("(pointer: fine)").matches) {
    window.addEventListener("mousemove", function (e) {
        const posX = e.clientX;
        const posY = e.clientY;
        
        // Direct assignment is faster than animate() for the dot
        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;
        
        // Use simple animation for the follower
        cursorOutline.animate({
            left: `${posX}px`,
            top: `${posY}px`
        }, { duration: 400, fill: "forwards" });
    });
} else {
    // Hide cursor on mobile to save resources
    if(cursorDot) cursorDot.style.display = 'none';
    if(cursorOutline) cursorOutline.style.display = 'none';
}

/* 2. SCROLL REVEAL ANIMATION */
const revealElements = document.querySelectorAll('.scroll-reveal');
const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            // Stop observing once revealed to save CPU
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

revealElements.forEach(el => revealObserver.observe(el));

/* 3. MOBILE MENU */
const mobileMenu = document.getElementById('mobile-menu');
const navLinks = document.querySelector('.nav-links');

if (mobileMenu) {
    mobileMenu.addEventListener('click', () => {
        mobileMenu.classList.toggle('is-active');
        navLinks.classList.toggle('active');
    });
}

/* 4. FIRE PARTICLES (Optimized) */
const canvas = document.getElementById('fireCanvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    const resizeCanvas = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    let particlesArray = [];
    // PERFORMANCE FIX: Reduced particles from 100 to 45
    const numberOfParticles = 45; 

    class Particle {
        constructor() {
            this.reset();
        }
        
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 3 + 1; // Slightly smaller particles
            this.speedX = Math.random() * 2 - 1; // Slower speed
            this.speedY = Math.random() * 2 - 1;
            this.color = `rgba(245, 158, 11, ${Math.random() * 0.5 + 0.3})`; // Pre-calculate opacity
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.size > 0.2) this.size -= 0.05; // Fade out faster

            // Reset when invisible
            if (this.size <= 0.2) {
                this.reset();
            }
        }

        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function init() {
        particlesArray = [];
        for (let i = 0; i < numberOfParticles; i++) {
            particlesArray.push(new Particle());
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
            particlesArray[i].draw();
        }
        requestAnimationFrame(animate);
    }

    init();
    animate();
}