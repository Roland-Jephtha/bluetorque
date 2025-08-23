        // Loading Animation
        window.addEventListener('load', function() {
            const loadingOverlay = document.getElementById('loadingOverlay');
            setTimeout(() => {
                loadingOverlay.classList.add('hidden');
                document.body.classList.add('loaded');
            }, 1500);
        });

        // Initialize AOS with enhanced settings
        AOS.init({
            duration: 800,
            easing: 'ease-in-out-cubic',
            once: true,
            offset: 100,
            delay: 0
        });

        // Enhanced Hero Slider
        let currentSlide = 0;
        const slides = document.querySelectorAll('.hero-slide');
        const indicators = document.querySelectorAll('.hero-indicator');
        
        function showSlide(index) {
            slides.forEach((slide, i) => {
                slide.classList.toggle('active', i === index);
            });
            indicators.forEach((indicator, i) => {
                indicator.classList.toggle('active', i === index);
            });
        }

        function nextSlide() {
            currentSlide = (currentSlide + 1) % slides.length;
            showSlide(currentSlide);
        }

        // Auto-advance slides
        setInterval(nextSlide, 5000);

        // Indicator click handlers
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                currentSlide = index;
                showSlide(currentSlide);
            });
        });

        // Enhanced Navbar scroll effect with parallax
        let lastScrollTop = 0;
        window.addEventListener('scroll', function() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const navbar = document.querySelector('.navbar');
            
            if (scrollTop > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }

            // Hide navbar on scroll down, show on scroll up
            if (scrollTop > lastScrollTop && scrollTop > 200) {
                navbar.style.transform = 'translateY(-100%)';
            } else {
                navbar.style.transform = 'translateY(0)';
            }
            lastScrollTop = scrollTop;
            
            // Progress bar
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            document.getElementById('progressBar').style.width = scrolled + '%';

            // Parallax effect for hero section
            const hero = document.querySelector('.hero-section');
            if (hero) {
                const scrolled = window.pageYOffset;
                const parallaxElements = document.querySelectorAll('.parallax-element');
                parallaxElements.forEach(element => {
                    const speed = element.dataset.speed || 0.5;
                    element.style.transform = `translateY(${scrolled * speed}px)`;
                });
            }
        });

        // Enhanced Counter animation with intersection observer
        function animateCounter(element) {
            const target = parseInt(element.getAttribute('data-target'));
            const duration = 2000;
            const increment = target / (duration / 16);
            let current = 0;
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    element.textContent = target + (target === 98 ? '%' : '+');
                    clearInterval(timer);
                } else {
                    element.textContent = Math.floor(current) + (target === 98 ? '%' : '+');
                }
            }, 16);
        }

        // Enhanced Intersection Observer for multiple elements
        const observerOptions = {
            threshold: 0.3,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Counter animation
                    if (entry.target.classList.contains('stats-section')) {
                        const counters = entry.target.querySelectorAll('.stat-number');
                        counters.forEach(counter => {
                            if (counter.textContent === '0') {
                                animateCounter(counter);
                            }
                        });
                    }

                    // Card stagger animation
                    if (entry.target.classList.contains('modern-card')) {
                        entry.target.style.animationDelay = '0s';
                        entry.target.style.animation = 'fadeInScale 0.6s ease-out forwards';
                    }

                    // Image reveal animation
                    if (entry.target.classList.contains('image-section')) {
                        entry.target.style.animation = 'slideInUp 0.8s ease-out forwards';
                    }
                }
            });
        }, observerOptions);

        // Observe elements
        document.querySelectorAll('.stats-section, .modern-card, .image-section, .team-member').forEach(el => {
            observer.observe(el);
        });

        // Enhanced smooth scrolling with easing
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    const offsetTop = target.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });

                    // Add ripple effect to clicked link
                    const ripple = document.createElement('span');
                    ripple.classList.add('ripple');
                    this.appendChild(ripple);
                    setTimeout(() => ripple.remove(), 600);
                }
            });
        });

        // Enhanced active navigation highlighting with smooth transitions
        window.addEventListener('scroll', function() {
            const sections = document.querySelectorAll('section[id]');
            const navLinks = document.querySelectorAll('.nav-link');
            
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop - 100;
                const sectionHeight = section.clientHeight;
                if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#' + current) {
                    link.classList.add('active');
                }
            });
        });

        // Mouse parallax effect for cards
        document.querySelectorAll('.modern-card').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 10;
                const rotateY = (centerX - x) / 10;
                
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-12px) scale(1.02)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0) scale(1)';
            });
        });

        // Enhanced image loading with lazy loading simulation
        const images = document.querySelectorAll('img');
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.style.opacity = '0';
                    img.style.transition = 'opacity 0.5s ease';
                    
                    setTimeout(() => {
                        img.style.opacity = '1';
                    }, 100);
                    
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));

        // Project card hover effects
        document.querySelectorAll('.project-card').forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'scale(1.05) translateY(-10px)';
                this.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.2)';
            });

            card.addEventListener('mouseleave', function() {
                this.style.transform = 'scale(1) translateY(0)';
                this.style.boxShadow = 'none';
            });
        });

        // Team member card interactions
        document.querySelectorAll('.team-member').forEach(member => {
            member.addEventListener('mouseenter', function() {
                this.querySelector('.team-avatar').style.transform = 'scale(1.1) rotate(5deg)';
                this.style.transform = 'translateY(-15px)';
            });

            member.addEventListener('mouseleave', function() {
                this.querySelector('.team-avatar').style.transform = 'scale(1) rotate(0deg)';
                this.style.transform = 'translateY(0)';
            });
        });

        // Enhanced button interactions
        document.querySelectorAll('.btn').forEach(button => {
            button.addEventListener('click', function(e) {
                // Create ripple effect
                const ripple = document.createElement('span');
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.cssText = `
                    position: absolute;
                    width: ${size}px;
                    height: ${size}px;
                    left: ${x}px;
                    top: ${y}px;
                    background: rgba(255, 255, 255, 0.4);
                    border-radius: 50%;
                    transform: scale(0);
                    animation: ripple 0.6s linear;
                    pointer-events: none;
                `;
                
                this.style.position = 'relative';
                this.style.overflow = 'hidden';
                this.appendChild(ripple);
                
                setTimeout(() => ripple.remove(), 600);
            });
        });

        // Add CSS animation for ripple effect
        const style = document.createElement('style');
        style.textContent = `
            @keyframes ripple {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }

            .shimmer-effect {
                position: relative;
                overflow: hidden;
            }

            .shimmer-effect::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
                transform: translateX(-100%);
                transition: transform 0.6s;
            }

            .shimmer-effect:hover::before {
                transform: translateX(100%);
            }

            .animate-pulse {
                animation: pulse 2s infinite;
            }

            @keyframes pulse {
                0% {
                    transform: scale(1);
                    box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4);
                }
                70% {
                    transform: scale(1.05);
                    box-shadow: 0 0 0 10px rgba(59, 130, 246, 0);
                }
                100% {
                    transform: scale(1);
                    box-shadow: 0 0 0 0 rgba(59, 130, 246, 0);
                }
            }

            /* Enhanced card animations */
            @keyframes cardFloat {
                0%, 100% {
                    transform: translateY(0);
                }
                50% {
                    transform: translateY(-5px);
                }
            }

            .modern-card {
                animation: cardFloat 4s ease-in-out infinite;
            }

            .modern-card:nth-child(2n) {
                animation-delay: -2s;
            }

            .modern-card:nth-child(3n) {
                animation-delay: -1s;
            }

            /* Enhanced image hover effects */
            .image-section {
                position: relative;
                overflow: hidden;
            }

            .image-section::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: linear-gradient(45deg, transparent, rgba(59, 130, 246, 0.1), transparent);
                transform: translateX(-100%) rotate(45deg);
                transition: transform 0.8s ease;
                z-index: 1;
            }

            .image-section:hover::before {
                transform: translateX(100%) rotate(45deg);
            }

            /* Scroll animations */
            @keyframes slideInFromLeft {
                from {
                    opacity: 0;
                    transform: translateX(-100px);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }

            @keyframes slideInFromRight {
                from {
                    opacity: 0;
                    transform: translateX(100px);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }

            @keyframes slideInFromBottom {
                from {
                    opacity: 0;
                    transform: translateY(50px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            /* Loading animations */
            .fade-in {
                animation: fadeIn 0.8s ease-out;
            }

            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }

            /* Navbar enhancements */
            .navbar-nav .nav-link::after {
                content: '';
                position: absolute;
                bottom: 0;
                left: 50%;
                width: 0;
                height: 2px;
                background: var(--secondary);
                transition: all 0.3s ease;
                transform: translateX(-50%);
            }

            .navbar-nav .nav-link:hover::after,
            .navbar-nav .nav-link.active::after {
                width: 80%;
            }

            /* Footer enhancements */
            .footer-links a {
                position: relative;
                overflow: hidden;
            }

            .footer-links a::before {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.1), transparent);
                transition: left 0.5s;
            }

            .footer-links a:hover::before {
                left: 100%;
            }
        `;
        document.head.appendChild(style);

        // Enhanced scroll reveal animations
        const revealElements = document.querySelectorAll('.section-header, .about-content, .cta-section .row');
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animation = 'slideInFromBottom 0.8s ease-out forwards';
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        revealElements.forEach(el => revealObserver.observe(el));

        // Performance optimization: Throttle scroll events
        let ticking = false;
        function updateOnScroll() {
            // Update scroll-dependent animations here
            ticking = false;
        }

        window.addEventListener('scroll', function() {
            if (!ticking) {
                requestAnimationFrame(updateOnScroll);
                ticking = true;
            }
        });

        // Add touch support for mobile devices
        if ('ontouchstart' in window) {
            document.querySelectorAll('.modern-card, .project-card').forEach(card => {
                card.addEventListener('touchstart', function() {
                    this.classList.add('touch-active');
                });

                card.addEventListener('touchend', function() {
                    setTimeout(() => {
                        this.classList.remove('touch-active');
                    }, 300);
                });
            });
        }

        // Initialize all animations when page loads
        window.addEventListener('load', function() {
            // Add staggered animation to service cards
            const serviceCards = document.querySelectorAll('#services .modern-card');
            serviceCards.forEach((card, index) => {
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, index * 200);
            });

            // Add entrance animation to project cards
            const projectCards = document.querySelectorAll('.project-card');
            projectCards.forEach((card, index) => {
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'scale(1)';
                }, index * 150);
            });
        });

        console.log('Blue Torque Engineering Website - Enhanced with premium animations and interactions');
