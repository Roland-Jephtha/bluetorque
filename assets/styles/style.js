        // Preloader
        window.addEventListener('load', function() {
            const preloader = document.querySelector('.preloader');
            if (preloader) {
                preloader.classList.add('hidden');
                document.body.classList.add('loaded');
            }
        });

        // Navbar scroll effect
        window.addEventListener('scroll', function() {
            const navbar = document.querySelector('.navbar');
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });

        // Initialize AOS
        AOS.init({
            duration: 1000,
            easing: 'ease-in-out',
            once: true,
            mirror: false
        });

        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    const headerOffset = 80;
                    const elementPosition = target.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });

        // Mobile menu functionality - Fixed hamburger animation
        const navbarToggler = document.querySelector('.navbar-toggler');
        const navbarCollapse = document.querySelector('.navbar-collapse');

        if (navbarToggler && navbarCollapse) {
            navbarToggler.addEventListener('click', function() {
                // Toggle aria-expanded attribute
                const isExpanded = this.getAttribute('aria-expanded') === 'true';
                this.setAttribute('aria-expanded', !isExpanded);
            });

            // Close mobile menu when clicking on nav links
            document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
                link.addEventListener('click', function() {
                    if (navbarCollapse.classList.contains('show')) {
                        const bsCollapse = new bootstrap.Collapse(navbarCollapse);
                        bsCollapse.hide();
                        navbarToggler.setAttribute('aria-expanded', 'false');
                    }
                });
            });

            // Update hamburger state when collapse is hidden
            navbarCollapse.addEventListener('hidden.bs.collapse', function() {
                navbarToggler.setAttribute('aria-expanded', 'false');
            });

            navbarCollapse.addEventListener('shown.bs.collapse', function() {
                navbarToggler.setAttribute('aria-expanded', 'true');
            });
        }

        // Counter animation for stats
        function animateCounter(element, target) {
            let current = 0;
            const increment = target / 100;
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                element.textContent = Math.ceil(current) + (target === 98 ? '%' : '+');
            }, 20);
        }

        // Intersection Observer for counter animation
        const observerOptions = {
            threshold: 0.5,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const statNumbers = entry.target.querySelectorAll('.stat-number');
                    statNumbers.forEach(stat => {
                        const target = parseInt(stat.getAttribute('data-target'));
                        if (target) {
                            animateCounter(stat, target);
                        }
                    });
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        const statsSection = document.querySelector('.stats-section');
        if (statsSection) {
            observer.observe(statsSection);
        }

        // Active navigation link highlighting
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.navbar-nav .nav-link');

        function setActiveNavLink() {
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.getBoundingClientRect().top;
                if (sectionTop <= 100) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        }

        window.addEventListener('scroll', setActiveNavLink);
        window.addEventListener('load', setActiveNavLink);

        // Enhanced card hover effects
        document.querySelectorAll('.modern-card').forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-12px) scale(1.02)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
            });
        });

        // Mobile touch optimization
        if ('ontouchstart' in window) {
            document.body.classList.add('touch-device');
            
            // Disable hover effects on touch devices
            const style = document.createElement('style');
            style.textContent = `
                @media (hover: none) {
                    .modern-card:hover,
                    .project-card:hover,
                    .image-section:hover {
                        transform: none !important;
                    }
                    .image-overlay,
                    .project-overlay {
                        opacity: 1 !important;
                        transform: translateY(0) !important;
                    }
                }
            `;
            document.head.appendChild(style);
        }

        // Lazy loading for images
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.classList.remove('lazy');
                            imageObserver.unobserve(img);
                        }
                    }
                });
            });

            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }

        // Performance optimization: Debounce scroll events
        function debounce(func, wait) {
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

        // Apply debounce to scroll handlers
        window.addEventListener('scroll', debounce(() => {
            // Your scroll handlers here
        }, 10));

        // Error handling for missing elements
        const requiredElements = ['.navbar', '.hero-section', '.preloader'];
        requiredElements.forEach(selector => {
            if (!document.querySelector(selector)) {
                console.warn(`Required element ${selector} not found`);
            }
        });

        // Accessibility improvements
        document.addEventListener('keydown', function(e) {
            // ESC key closes mobile menu
            if (e.key === 'Escape' && navbarCollapse.classList.contains('show')) {
                const bsCollapse = new bootstrap.Collapse(navbarCollapse);
                bsCollapse.hide();
            }
        });

        // Skip link functionality
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.textContent = 'Skip to main content';
        skipLink.className = 'sr-only';
        skipLink.style.cssText = `
            position: absolute;
            left: -10000px;
            top: auto;
            width: 1px;
            height: 1px;
            overflow: hidden;
        `;
        
        skipLink.addEventListener('focus', function() {
            this.style.cssText = `
                position: absolute;
                left: 6px;
                top: 7px;
                z-index: 999999;
                color: white;
                background: var(--primary);
                padding: 8px 16px;
                text-decoration: none;
                border-radius: 3px;
            `;
        });
        
        skipLink.addEventListener('blur', function() {
            this.style.cssText = `
                position: absolute;
                left: -10000px;
                top: auto;
                width: 1px;
                height: 1px;
                overflow: hidden;
            `;
        });
        
        document.body.insertBefore(skipLink, document.body.firstChild);
