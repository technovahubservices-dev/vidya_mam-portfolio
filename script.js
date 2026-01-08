        // 1. THEME SWITCHER
        const themeBtn = document.getElementById('themeBtn');
        const icon = themeBtn.querySelector('i');
        const html = document.documentElement;

        // Check LocalStorage
        if (localStorage.getItem('theme') === 'light') {
            html.setAttribute('data-theme', 'light');
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        }

        themeBtn.addEventListener('click', () => {
            const currentTheme = html.getAttribute('data-theme');
            if (currentTheme === 'dark') {
                html.setAttribute('data-theme', 'light');
                icon.classList.remove('fa-moon');
                icon.classList.add('fa-sun');
                localStorage.setItem('theme', 'light');
            } else {
                html.setAttribute('data-theme', 'dark');
                icon.classList.remove('fa-sun');
                icon.classList.add('fa-moon');
                localStorage.setItem('theme', 'dark');
            }
        });

        // 2. SCROLL REVEAL
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    // Trigger Stats
                    if (entry.target.querySelector('.stat-number')) {
                        runStats();
                    }
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

        // 3. NUMBER COUNTER
        let statsRun = false;
        function runStats() {
            if (statsRun) return;
            document.querySelectorAll('.stat-number').forEach(counter => {
                const target = +counter.getAttribute('data-val');
                const inc = target / 50;
                let c = 0;
                const timer = setInterval(() => {
                    c += inc;
                    if (c >= target) {
                        counter.innerText = target + (target === 100 ? "%" : "+");
                        clearInterval(timer);
                    } else {
                        counter.innerText = Math.ceil(c);
                    }
                }, 30);
            });

            // Animate progress rings
            document.querySelectorAll('.progress-fill').forEach(circle => {
                const progress = circle.style.getPropertyValue('--progress');
                circle.style.strokeDashoffset = `calc(157 - (157 * ${progress}) / 100)`;
            });

            statsRun = true;
        }

        // 4. TYPEWRITER EFFECT
        const textElement = document.getElementById("type-text");
        const words = ["Automation Consultant.", "Founder & MD.", "Tech Innovator."];
        let wordIndex = 0;
        let charIndex = 0;
        let isDeleting = false;

        function type() {
            const currentWord = words[wordIndex];
            if (isDeleting) {
                textElement.textContent = currentWord.substring(0, charIndex - 1);
                charIndex--;
            } else {
                textElement.textContent = currentWord.substring(0, charIndex + 1);
                charIndex++;
            }

            if (!isDeleting && charIndex === currentWord.length) {
                isDeleting = true;
                setTimeout(type, 2000);
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;
                setTimeout(type, 500);
            } else {
                setTimeout(type, isDeleting ? 100 : 150);
            }
        }
        document.addEventListener('DOMContentLoaded', type);

        // 5. SMOOTH SCROLL
        function scrollToID(id, event) {
            document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
            // Update Active Class
            document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
            if (event && event.currentTarget) {
                event.currentTarget.classList.add('active');
            }
        }

        // 6. MODALS
        function toggleModal(id) {
            const modal = document.getElementById(id);
            modal.classList.toggle('active');
        }

        // 8. EXPERIENCE TABS
        function switchTab(tabId, tabElement) {
            // Hide all tab panes
            document.querySelectorAll('.tab-pane').forEach(pane => {
                pane.classList.remove('active');
            });

            // Remove active class from all tabs
            document.querySelectorAll('.exp-tab').forEach(tab => {
                tab.classList.remove('active');
            });

            // Show selected tab pane
            document.getElementById(tabId).classList.add('active');

            // Add active class to clicked tab
            tabElement.classList.add('active');
        }

        // 7. CANVAS BACKGROUND
        const canvas = document.getElementById('canvas-bg');
        const ctx = canvas.getContext('2d');
        let width, height, particles = [];

        function resize() {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        }
        window.addEventListener('resize', resize);
        resize();

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                this.size = Math.random() * 2;
            }
            update() {
                this.x += this.vx; this.y += this.vy;
                if (this.x < 0 || this.x > width) this.vx *= -1;
                if (this.y < 0 || this.y > height) this.vy *= -1;
            }
            draw() {
                // Get Color from CSS Variable dynamically
                const style = getComputedStyle(document.documentElement);
                const color = style.getPropertyValue('--canvas-color').trim();

                ctx.fillStyle = `rgba(${color}, 0.5)`;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        for (let i = 0; i < 80; i++) particles.push(new Particle());

        function animate() {
            ctx.clearRect(0, 0, width, height);
            const style = getComputedStyle(document.documentElement);
            const color = style.getPropertyValue('--canvas-color').trim();

            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();
                for (let j = i; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const d = Math.sqrt(dx * dx + dy * dy);
                    if (d < 120) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(${color}, ${1 - d / 120})`;
                        ctx.lineWidth = 0.5;
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }
            requestAnimationFrame(animate);
        }
        animate();

