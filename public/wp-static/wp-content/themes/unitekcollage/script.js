// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    
    // Enhanced Program Tab Functionality with Smooth Transitions
    const programTabs = document.querySelectorAll('.program-tab');
    
    programTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs
            programTabs.forEach(t => {
                t.classList.remove('active');
                t.style.transform = 'translateY(0)';
            });
            
            // Add active class to clicked tab
            this.classList.add('active');
            this.style.transform = 'translateY(-2px)';
            
            // Animate content change with fade effect
            animateContentChange(this.querySelector('span').textContent);
        });
    });

    // Animate content change with fade effect
    function animateContentChange(programName) {
        const programContent = document.querySelector('.program-content');
        if (programContent) {
            programContent.style.opacity = '0';
            programContent.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                programContent.style.opacity = '1';
                programContent.style.transform = 'translateY(0)';
            }, 300);
        }
    }
    
    // FAQ Functionality
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            // Toggle active state
            const faqItem = this.parentElement;
            const isActive = faqItem.classList.contains('active');
            
            // Close all FAQ items
            document.querySelectorAll('.faq-item').forEach(item => {
                item.classList.remove('active');
            });
            
            // Open clicked item if it wasn't active
            if (!isActive) {
                faqItem.classList.add('active');
            }
        });
    });
    
    // FAQ Category Navigation
    const faqCategories = document.querySelectorAll('.faq-category');
    
    faqCategories.forEach(category => {
        category.addEventListener('click', function() {
            // Remove active class from all categories
            faqCategories.forEach(c => c.classList.remove('active'));
            // Add active class to clicked category
            this.classList.add('active');
            
            // Here you would typically filter FAQ content based on category
            console.log('FAQ Category selected:', this.textContent);
        });
    });
    
    // Smooth Scrolling for Navigation Links with 800ms animation
    // Use event delegation to handle dynamically created elements
    document.addEventListener('click', function(e) {
        // Check if clicked element is an anchor with href starting with #
        const link = e.target.closest('a[href^="#"]');
        
        if (!link) return;
        
        const targetId = link.getAttribute('href');
        
        console.log('Anchor link clicked:', targetId, 'from element:', link);
        
        // Skip if href is just "#" or empty
        if (!targetId || targetId === '#') {
            console.log('Skipping empty anchor');
            return;
        }
        
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            console.log('Target element found, initiating smooth scroll');
            e.preventDefault();
            e.stopPropagation(); // Stop event from bubbling
            
            // Force close mobile menu if it's open
            const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
            const headerNav = document.querySelector('.header-nav');
            const navList = document.querySelector('.nav-list');
            const header = document.querySelector('.header');
            
            let menuWasOpen = false;
            
            // Check multiple conditions to ensure menu is detected as open
            if (mobileMenuToggle) {
                if (mobileMenuToggle.classList.contains('active') || 
                    (headerNav && headerNav.classList.contains('mobile-open')) ||
                    (navList && navList.classList.contains('mobile-open')) ||
                    (header && header.classList.contains('menu-open'))) {
                    
                    menuWasOpen = true;
                    console.log('Mobile menu detected as open, closing it...');
                    
                    // Force remove all menu-open classes
                    mobileMenuToggle.classList.remove('active');
                    if (headerNav) {
                        headerNav.classList.remove('mobile-open');
                        console.log('Removed mobile-open from headerNav');
                    }
                    if (navList) {
                        navList.classList.remove('mobile-open');
                        console.log('Removed mobile-open from navList');
                    }
                    if (header) {
                        header.classList.remove('menu-open');
                        console.log('Removed menu-open from header');
                    }
                    
                    // Unlock body scroll and restore position only if menu was open
                    if (document.body.classList.contains('menu-open')) {
                        document.body.classList.remove('menu-open');
                        const scrollY = document.body.style.top;
                        document.body.style.top = '';
                        window.scrollTo(0, parseInt(scrollY || '0') * -1);
                        console.log('Restored body scroll');
                    }
                } else {
                    console.log('Mobile menu was not open');
                }
            }
            
            // Function to perform smooth scroll
            function performSmoothScroll() {
                console.log('Performing smooth scroll to:', targetId);
                // Custom smooth scroll with 800ms duration
                const startPosition = window.pageYOffset;
                const headerHeight = window.innerWidth <= 1024 ? 48 : 80; // Mobile: 48px, Desktop: 80px
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20; // Extra 20px padding
                const distance = targetPosition - startPosition;
                const duration = 800;
                let startTime = null;
                
                console.log('Scroll from', startPosition, 'to', targetPosition, 'distance:', distance);
                
                function smoothScrollAnimation(currentTime) {
                    if (startTime === null) startTime = currentTime;
                    const timeElapsed = currentTime - startTime;
                    const progress = Math.min(timeElapsed / duration, 1);
                    
                    // Easing function (ease-in-out)
                    const ease = progress < 0.5 
                        ? 2 * progress * progress 
                        : 1 - Math.pow(-2 * progress + 2, 2) / 2;
                    
                    window.scrollTo(0, startPosition + distance * ease);
                    
                    if (timeElapsed < duration) {
                        requestAnimationFrame(smoothScrollAnimation);
                    } else {
                        console.log('Smooth scroll completed');
                    }
                }
                
                requestAnimationFrame(smoothScrollAnimation);
            }
            
            // If menu was open, wait for menu close animation (300ms) before scrolling
            if (menuWasOpen) {
                console.log('Waiting 300ms for menu close animation before scrolling...');
                setTimeout(performSmoothScroll, 300);
            } else {
                console.log('Starting smooth scroll immediately...');
                performSmoothScroll();
            }
        } else {
            console.log('Target element not found for:', targetId);
        }
    });
    
    // Form Validation and Submission
    const contactForm = document.querySelector('.contact-form-content');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Basic form validation
            const requiredFields = this.querySelectorAll('[required]');
            let isValid = true;
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.style.borderColor = '#ff4444';
                } else {
                    field.style.borderColor = '#e0e0e0';
                }
            });
            
            if (isValid) {
                // Show success message
                showNotification('Thank you! We will contact you soon.', 'success');
                
                // Reset form
                this.reset();
            } else {
                showNotification('Please fill in all required fields.', 'error');
            }
        });
    }
    
    // Enhanced Hero Form Functionality with Smart Auto-fill
    const heroForm = document.querySelector('.hero-form');
    
    if (heroForm) {
        const heroInput = heroForm.querySelector('.hero-input');
        const heroDropdown = heroForm.querySelector('.hero-dropdown');
        
        // Enhanced auto-fill with smooth transitions
        heroInput.addEventListener('input', function() {
            const inputValue = this.value.toLowerCase();
            const options = heroDropdown.querySelectorAll('option');
            
            options.forEach(option => {
                if (option.text.toLowerCase().includes(inputValue)) {
                    // Smooth transition effect
                    heroDropdown.style.opacity = '0.7';
                    heroDropdown.style.transform = 'scale(0.98)';
                    
                    setTimeout(() => {
                        option.selected = true;
                        heroDropdown.style.opacity = '1';
                        heroDropdown.style.transform = 'scale(1)';
                    }, 150);
                }
            });
        });

        // Enhanced dropdown change effect
        heroDropdown.addEventListener('change', function() {
            if (this.value) {
                // Add visual feedback
                this.style.borderColor = '#22C55E';
                this.style.boxShadow = '0 0 0 3px rgba(34, 197, 94, 0.1)';
                
                setTimeout(() => {
                    this.style.borderColor = '#E5E7EB';
                    this.style.boxShadow = 'none';
                }, 1000);
            }
        });
    }
    
    // Enhanced Statistics Animation with Smooth Counting
    const stats = document.querySelectorAll('.stat-number');
    
    const animateStats = () => {
        stats.forEach((stat, index) => {
            const target = parseInt(stat.textContent.replace(/[^\d]/g, ''));
            const duration = 2000 + (index * 200); // Staggered animation
            const increment = target / (duration / 16); // 60fps
            let current = 0;
            
            // Add visual feedback during animation
            stat.style.color = '#16A34A';
            stat.style.transform = 'scale(1.1)';
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                    
                    // Final animation effect
                    stat.style.transform = 'scale(1)';
                    stat.style.color = '#22C55E';
                    
                    // Add celebration effect
                    stat.style.animation = 'statCelebration 0.6s ease-out';
                }
                
                if (stat.textContent.includes('$')) {
                    stat.textContent = '$' + Math.floor(current) + 'K';
                } else if (stat.textContent.includes('%')) {
                    stat.textContent = Math.floor(current) + '%';
                } else {
                    stat.textContent = Math.floor(current);
                }
            }, 16);
        });
    };
    
    // Intersection Observer for stats animation
    const statsSection = document.querySelector('.intro');
    if (statsSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateStats();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(statsSection);
    }
    
    // Header Scroll Effect
    const header = document.querySelector('.header');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.backdropFilter = 'blur(10px)';
        } else {
            header.style.background = 'white';
            header.style.backdropFilter = 'none';
        }
        
        lastScrollTop = scrollTop;
    });
    
    // Support Button Hover Effects
    const supportButtons = document.querySelectorAll('.support-btn');
    
    supportButtons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(8px)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0)';
        });
    });
    
    // News Card Hover Effects
    const newsCards = document.querySelectorAll('.news-card');
    
    newsCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)';
            this.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
        });
    });
    
    // Notification System
    function showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => notification.remove());
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
            color: white;
            padding: 16px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 400px;
        `;
        
        // Add to page
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 5000);
        
        // Close button functionality
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        });
    }
    
    // Mobile Menu Toggle Functionality
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const headerNav = document.querySelector('.header-nav');
    const navList = document.querySelector('.nav-list');
    
    if (mobileMenuToggle && headerNav && navList) {
        // Create mobile CTA button and insert it into mobile menu
        function createMobileCTAButton() {
            // Check if button already exists
            if (headerNav.querySelector('.mobile-cta-button')) {
                return;
            }
            
            // Get the desktop CTA button
            const desktopCTA = document.querySelector('.header-cta .btn-apply');
            if (!desktopCTA) return;
            
            // Clone the button for mobile menu
            const mobileCTAContainer = document.createElement('div');
            mobileCTAContainer.className = 'mobile-cta-button';
            
            const mobileButton = desktopCTA.cloneNode(true);
            
            mobileCTAContainer.appendChild(mobileButton);
            
            // Append to the end of headerNav (after all menu items)
            headerNav.appendChild(mobileCTAContainer);
            
            console.log('Mobile CTA button created and appended to headerNav');
        }
        
        mobileMenuToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            headerNav.classList.toggle('mobile-open');
            navList.classList.toggle('mobile-open');
            
            // Toggle header background color
            const header = document.querySelector('.header');
            
            if (headerNav.classList.contains('mobile-open')) {
                // Menu is open - change header to dark and lock body scroll
                if (header) {
                    header.classList.add('menu-open');
                }
                document.body.classList.add('menu-open');
                // Store current scroll position
                const scrollY = window.scrollY;
                document.body.style.top = `-${scrollY}px`;
                
                createMobileCTAButton();
            } else {
                // Menu is closed - change header to white and unlock body scroll
                if (header) {
                    header.classList.remove('menu-open');
                }
                document.body.classList.remove('menu-open');
                // Restore scroll position
                const scrollY = document.body.style.top;
                document.body.style.top = '';
                window.scrollTo(0, parseInt(scrollY || '0') * -1);
            }
            
            // Auto-expand Programs submenu when mobile menu opens (matching Figma)
            setTimeout(autoExpandProgramsOnMobile, 100);
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            // Only process if menu is actually open
            if (headerNav.classList.contains('mobile-open') && 
                !mobileMenuToggle.contains(e.target) && 
                !headerNav.contains(e.target) &&
                !e.target.closest('.header')) {
                
                const header = document.querySelector('.header');
                
                mobileMenuToggle.classList.remove('active');
                headerNav.classList.remove('mobile-open');
                navList.classList.remove('mobile-open');
                
                if (header) {
                    header.classList.remove('menu-open');
                }
                
                // Unlock body scroll and restore position
                if (document.body.classList.contains('menu-open')) {
                    document.body.classList.remove('menu-open');
                    const scrollY = document.body.style.top;
                    document.body.style.top = '';
                    window.scrollTo(0, parseInt(scrollY || '0') * -1);
                }
            }
        });
        
        // Close mobile menu when clicking on a link
        const headerMenuLinks = document.querySelectorAll('.nav-list a');
        headerMenuLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                // Only handle on mobile
                if (window.innerWidth <= 1024) {
                    const isParentItem = this.parentElement.classList.contains('menu-item-has-children');
                    const parentActive = this.parentElement.classList.contains('active');
                    
                    // If it's a parent item
                    if (isParentItem) {
                        // Check if submenu is already expanded
                        if (parentActive) {
                            // Submenu is expanded - allow navigation, close menu
                            const header = document.querySelector('.header');
                            
                            mobileMenuToggle.classList.remove('active');
                            headerNav.classList.remove('mobile-open');
                            navList.classList.remove('mobile-open');
                            
                            if (header) {
                                header.classList.remove('menu-open');
                            }
                            
                            if (document.body.classList.contains('menu-open')) {
                                document.body.classList.remove('menu-open');
                                const scrollY = document.body.style.top;
                                document.body.style.top = '';
                                window.scrollTo(0, parseInt(scrollY || '0') * -1);
                            }
                            // Let the link navigate
                        } else {
                            // Submenu is collapsed - handled by submenu toggle above
                            // This code won't run because the toggle handler runs first
                        }
                    } else {
                        // It's a regular link or child link - close menu and navigate
                        const header = document.querySelector('.header');
                        
                        mobileMenuToggle.classList.remove('active');
                        headerNav.classList.remove('mobile-open');
                        navList.classList.remove('mobile-open');
                        
                        if (header) {
                            header.classList.remove('menu-open');
                        }
                        
                        if (document.body.classList.contains('menu-open')) {
                            document.body.classList.remove('menu-open');
                            const scrollY = document.body.style.top;
                            document.body.style.top = '';
                            window.scrollTo(0, parseInt(scrollY || '0') * -1);
                        }
                    }
                }
            });
        });
        
        // Close button in mobile header
        const mobileCloseBtn = document.querySelector('.mobile-menu-close-btn');
        if (mobileCloseBtn) {
            mobileCloseBtn.addEventListener('click', function() {
                const header = document.querySelector('.header');
                
                mobileMenuToggle.classList.remove('active');
                headerNav.classList.remove('mobile-open');
                navList.classList.remove('mobile-open');
                
                // Change header back to white
                if (header) {
                    header.classList.remove('menu-open');
                }
                
                // Unlock body scroll and restore position only if menu was open
                if (document.body.classList.contains('menu-open')) {
                    document.body.classList.remove('menu-open');
                    const scrollY = document.body.style.top;
                    document.body.style.top = '';
                    window.scrollTo(0, parseInt(scrollY || '0') * -1);
                }
            });
        }
    }
    
    // Mobile Submenu Toggle Functionality
    const mobileSubmenuToggles = document.querySelectorAll('.nav-list .menu-item-has-children > a, .header-menu .menu-item-has-children > a');
    
    console.log('Found mobile submenu toggles:', mobileSubmenuToggles.length, mobileSubmenuToggles);
    
    mobileSubmenuToggles.forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            // Only prevent default and toggle submenu on mobile
            if (window.innerWidth <= 1024) {
                const parentItem = this.parentElement;
                const wasActive = parentItem.classList.contains('active');
                
                console.log('Mobile submenu toggle clicked:', this.textContent, 'Parent:', parentItem, 'Was active:', wasActive);
                
                // If submenu is NOT active (collapsed), expand it on first click
                if (!wasActive) {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    // Close all other submenus first
                    document.querySelectorAll('.nav-list .menu-item-has-children, .header-menu .menu-item-has-children').forEach(item => {
                        if (item !== parentItem) {
                            item.classList.remove('active');
                        }
                    });
                    
                    // Expand current submenu
                    parentItem.classList.add('active');
                    console.log('Expanded submenu on first click');
                } else {
                    // If submenu IS active (expanded), allow navigation on second click
                    console.log('Submenu already expanded, allowing navigation to:', this.href);
                    // Don't prevent default - let the link work
                }
            }
        });
    });
    
    // Enhanced Mobile Menu Toggle with Smooth Animations (Legacy)
    const createMobileMenu = () => {
        if (window.innerWidth <= 768) {
            const nav = document.querySelector('.nav');
            if (!nav) return;
            const navList = nav.querySelector('.nav-list');
            
            // Add mobile menu button
            const mobileMenuBtn = document.createElement('button');
            mobileMenuBtn.className = 'mobile-menu-btn';
            mobileMenuBtn.innerHTML = '<span></span><span></span><span></span>';
            mobileMenuBtn.style.cssText = `
                display: none;
                flex-direction: column;
                justify-content: space-around;
                width: 30px;
                height: 25px;
                background: transparent;
                border: none;
                cursor: pointer;
                padding: 0;
                z-index: 1001;
            `;
            
            // Mobile menu button spans styling
            const spans = mobileMenuBtn.querySelectorAll('span');
            spans.forEach(span => {
                span.style.cssText = `
                    width: 100%;
                    height: 3px;
                    background: #374151;
                    border-radius: 2px;
                    transition: all 0.3s ease;
                `;
            });
            
            // Toggle mobile menu
            mobileMenuBtn.addEventListener('click', () => {
                navList.classList.toggle('mobile-active');
                mobileMenuBtn.classList.toggle('active');
                
                // Animate button
                if (mobileMenuBtn.classList.contains('active')) {
                    spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                    spans[1].style.opacity = '0';
                    spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
                } else {
                    spans[0].style.transform = 'none';
                    spans[1].style.opacity = '1';
                    spans[2].style.transform = 'none';
                }
            });
            
            // Insert mobile menu button
            nav.insertBefore(mobileMenuBtn, navList);
            
            // Show mobile menu button on small screens
            if (window.innerWidth <= 768) {
                mobileMenuBtn.style.display = 'flex';
                navList.style.display = 'none';
            }
        }
    };
    
    // Initialize mobile menu
    createMobileMenu();
    
    // Handle window resize
    window.addEventListener('resize', createMobileMenu);
    
    // Lazy Loading for Images (placeholder for future implementation)
    const imagePlaceholders = document.querySelectorAll('.image-placeholder');
    
    imagePlaceholders.forEach(placeholder => {
        placeholder.addEventListener('click', function() {
            // In a real implementation, this would load actual images
            this.innerHTML = '🖼️ Image Loaded';
            this.style.background = '#e8f5e8';
            this.style.color = '#4CAF50';
        });
    });
    
    // Scroll to Top Button
    const createScrollToTopButton = () => {
        const scrollToTopBtn = document.createElement('button');
        scrollToTopBtn.innerHTML = '<i class="fas fa-arrow-up" aria-hidden="true"></i>';
        scrollToTopBtn.className = 'scroll-to-top';
        scrollToTopBtn.setAttribute('aria-label', 'Scroll to top');
        scrollToTopBtn.type = 'button';
        scrollToTopBtn.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 50px;
            height: 50px;
            background: #4CAF50;
            color: white;
            border: none;
            border-radius: 50%;
            cursor: pointer;
            display: none;
            align-items: center;
            justify-content: center;
            font-size: 20px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            transition: all 0.3s ease;
            z-index: 1000;
        `;
        
        document.body.appendChild(scrollToTopBtn);
        
        // Show/hide button based on scroll position
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                scrollToTopBtn.style.display = 'flex';
            } else {
                scrollToTopBtn.style.display = 'none';
            }
        });
        
        // Scroll to top functionality
        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
        
        // Hover effects
        scrollToTopBtn.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = '0 6px 20px rgba(0,0,0,0.2)';
        });
        
        scrollToTopBtn.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
        });
    };
    
    // Initialize scroll to top button
    createScrollToTopButton();
    
    // If we're on a search results page, make sure the overlay is closed
    // If we're on a search results page, make sure the overlay is closed and hidden
    if (window.location.search && /[?&]s=/.test(window.location.search)) {
        const overlayEl = document.getElementById('searchOverlay') || document.querySelector('.search-overlay');
        if (overlayEl) {
            overlayEl.classList.remove('active');
            overlayEl.style.display = 'none';
            overlayEl.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        }
    }
    
    
    // Search Overlay Functionality
    let lastSearchQuery = '';
    const searchToggle = document.querySelector('.search-toggle');
    // Support both #searchOverlay (id) and .search-overlay (class)
    const searchOverlay = document.getElementById('searchOverlay') || document.querySelector('.search-overlay');
    const searchCloseBtn = document.querySelector('.search-close-btn');
    const searchInput = document.querySelector('.search-input-field');
    const searchForm = document.querySelector('.search-form-overlay');
    const searchResults = document.querySelector('.search-results');
    
    // Open search overlay
    if (searchToggle && searchOverlay) {
        searchToggle.addEventListener('click', function(e) {
            e.preventDefault();
            openSearchOverlay();
        });
    }
    
    // Close search overlay
    if (searchCloseBtn && searchOverlay) {
        searchCloseBtn.addEventListener('click', function(e) {
            e.preventDefault();
            closeSearchOverlay();
        });
    }
    
    // Close search overlay when clicking outside
    if (searchOverlay) {
        searchOverlay.addEventListener('click', function(e) {
            if (e.target === searchOverlay) {
                closeSearchOverlay();
            }
        });
    }
    
    // Close search overlay with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && searchOverlay && searchOverlay.classList.contains('active')) {
            closeSearchOverlay();
        }
        
        // Handle keyboard navigation in search results
        if (searchOverlay && searchOverlay.classList.contains('active') && searchResults) {
            const resultItems = searchResults.querySelectorAll('.search-result-item');
            const activeItem = searchResults.querySelector('.search-result-item.active');
            
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                if (activeItem) {
                    activeItem.classList.remove('active');
                    const nextItem = activeItem.nextElementSibling;
                    if (nextItem) {
                        nextItem.classList.add('active');
                    } else {
                        resultItems[0].classList.add('active');
                    }
                } else if (resultItems.length > 0) {
                    resultItems[0].classList.add('active');
                }
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                if (activeItem) {
                    activeItem.classList.remove('active');
                    const prevItem = activeItem.previousElementSibling;
                    if (prevItem) {
                        prevItem.classList.add('active');
                    } else {
                        resultItems[resultItems.length - 1].classList.add('active');
                    }
                } else if (resultItems.length > 0) {
                    resultItems[resultItems.length - 1].classList.add('active');
                }
            } else if (e.key === 'Enter' && activeItem) {
                e.preventDefault();
                const url = activeItem.getAttribute('data-url');
                if (url) {
                    window.location.href = url;
                }
            }
        }
    });
    
    // Focus search input when overlay opens
    function openSearchOverlay() {
        searchOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Focus input after animation
        setTimeout(() => {
            if (searchInput) {
                searchInput.focus();
            }
        }, 300);
    }
    
    function closeSearchOverlay() {
        searchOverlay.classList.remove('active');
        document.body.style.overflow = '';
        
        // Clear search input and results
        if (searchInput) {
            searchInput.value = '';
        }
        if (searchResults) {
            searchResults.classList.remove('active');
            searchResults.innerHTML = '';
        }
    }
    
    // Live search functionality
    if (searchInput) {
        let searchTimeout;
        
        searchInput.addEventListener('input', function() {
            const query = this.value.trim();
            
            // Clear previous timeout
            clearTimeout(searchTimeout);
            
            if (query.length < 2) {
                if (searchResults) {
                    searchResults.classList.remove('active');
                    searchResults.innerHTML = '';
                }
                return;
            }
            
            // Debounce search
            searchTimeout = setTimeout(() => {
                performLiveSearch(query);
            }, 300);
        });
        
        // Handle form submission
        if (searchForm) {
            searchForm.addEventListener('submit', function(e) {
                const query = searchInput.value.trim();
                if (query.length < 2) {
                    e.preventDefault();
                    searchInput.focus();
                    return;
                }
                // If overlay is open and we have results, keep it AJAX-only
                if (searchOverlay && searchOverlay.classList.contains('active')) {
                    e.preventDefault();
                    performLiveSearch(query);
                }
            });
        }
    }
    
    // Perform live search
    function performLiveSearch(query) {
        if (!searchResults) return;
        
        console.log('Searching for:', query);
        lastSearchQuery = query;
        
        // Show loading state
        searchResults.innerHTML = '<div class="search-loading">Searching...</div>';
        searchResults.classList.add('active');
        
        // Create search request
        const formData = new FormData();
        formData.append('action', 'unitek_live_search');
        formData.append('query', query);
        formData.append('nonce', window.unitekSearchNonce || '');
        
        // Make AJAX request
        const ajaxEndpoint = (typeof ajaxurl !== 'undefined' && ajaxurl) ? ajaxurl : (window.ajaxurl || (window.unitek_ajax && window.unitek_ajax.ajax_url) || (window.location.origin + '/wp-admin/admin-ajax.php'));
        console.log('AJAX endpoint:', ajaxEndpoint);
        
        fetch(ajaxEndpoint, {
            method: 'POST',
            body: formData
        })
        .then(async (response) => {
            const text = await response.text();
            console.log('Raw response:', text);
            try {
                return JSON.parse(text);
            } catch (e) {
                console.error('AJAX response was not JSON:', text);
                throw e;
            }
        })
        .then(data => {
            console.log('Parsed response:', data);
            if (data.success) {
                displaySearchResults(data.data);
            } else {
                searchResults.innerHTML = '<div class="search-no-results">No results found</div>';
            }
        })
        .catch(error => {
            console.error('Search error:', error);
            searchResults.innerHTML = '<div class="search-error">Search failed. Please try again.</div>';
        });
    }
    
    // Display search results
    function displaySearchResults(results) {
        if (!searchResults) return;
        
        if (results.length === 0) {
            searchResults.innerHTML = '<div class="search-no-results">No results found</div>';
            return;
        }
        
        // Group by type
        const groups = {
            post: [],
            page: [],
            program: [],
            other: []
        };
        results.forEach(r => {
            const type = (r.type === 'post' || r.type === 'page' || r.type === 'program') ? r.type : 'other';
            groups[type].push(r);
        });
        
        const typeLabels = { post: 'Posts', page: 'Pages', program: 'Programs', other: 'Other' };
        let html = '';
        Object.keys(groups).forEach(type => {
            if (groups[type].length === 0) return;
            html += `<div class="search-group-heading">${typeLabels[type]}</div>`;
            groups[type].forEach(result => {
                html += `
                    <div class="search-result-item" data-url="${result.url}">
                        <div class="search-result-title">${result.title}</div>
                        ${result.excerpt ? `<div class=\"search-result-excerpt\">${result.excerpt}</div>` : ''}
                    </div>
                `;
            });
        });
        
        // View-all link removed per request
        
        searchResults.innerHTML = html;
        
        // Add click handlers to result items
        const resultItems = searchResults.querySelectorAll('.search-result-item');
        resultItems.forEach(item => {
            item.addEventListener('click', function() {
                const url = this.getAttribute('data-url');
                if (url) {
                    window.location.href = url;
                }
            });
        });

        // View-all navigation removed
    }
    
    // Add CSS for loading and no results states
    // const searchStyles = `
    //     .search-loading,
    //     .search-no-results,
    //     .search-error {
    //         padding: 20px;
    //         text-align: center;
    //         color: #666;
    //         font-style: italic;
    //     }
        
    //     .search-loading {
    //         color: #007bff;
    //     }
        
    //     .search-error {
    //         color: #dc3545;
    //     }
    // `;
    
    // Inject styles
    // const styleSheet = document.createElement('style');
    // styleSheet.textContent = searchStyles;
    // document.head.appendChild(styleSheet);
    
    // Responsive Mega Menu Functionality
    const megaMenuParent = document.querySelector('.mega-menu-parent');
    const megaMenuTrigger = megaMenuParent ? megaMenuParent.querySelector('a') : null;
    const megaMenuModal = document.querySelector('.mega-menu-modal');
    const megaMenuClose = document.querySelector('.mega-menu-close');
    
    let megaMenuTimeout;
    let mobileSubMenu = null;
    
    // Initialize responsive mega menu
    function initResponsiveMegaMenu() {
        if (!megaMenuParent || !megaMenuModal) {
            console.log('⚠️ Mega menu not found, skipping initialization');
            return;
        }
        
        // Always recreate mobile submenu to ensure consistency
        if (mobileSubMenu) {
            mobileSubMenu.remove();
            mobileSubMenu = null;
        }
        
        // Create mobile submenu
        createMobileSubMenu();
        
        // Toggle icon is handled by CSS ::after pseudo-element
        // No need to create a custom toggle icon
        
        // Set up event listeners
        setupMegaMenuEvents();
        
        // Auto-expand Programs submenu on mobile (matching Figma design)
        if (window.innerWidth <= 1024 && mobileSubMenu) {
            console.log('📱 Mobile detected, auto-expanding Programs submenu');
            setTimeout(function() {
                mobileSubMenu.style.display = 'block';
                megaMenuParent.classList.add('active');
            }, 100);
        }
    }
    
    // Create mobile submenu from mega menu content
    function createMobileSubMenu() {
        mobileSubMenu = document.createElement('ul');
        mobileSubMenu.classList.add('sub-menu', 'mega-mobile-submenu');
        mobileSubMenu.style.display = 'none';
        
        // Create structured mobile submenu with categories and programs
        const megaMenuColumns = megaMenuModal.querySelectorAll('.mega-menu-column');
        
        megaMenuColumns.forEach(column => {
            const columnTitle = column.querySelector('.mega-menu-column-title');
            const programsList = column.querySelector('.mega-menu-programs');
            
            if (columnTitle && programsList) {
                // Create category header container
                const categoryLi = document.createElement('li');
                categoryLi.classList.add('mobile-category-header');
                
                // Check if there are programs (has children)
                const programLinks = programsList.querySelectorAll('li');
                const hasChildren = programLinks && programLinks.length > 0;
                
                if (hasChildren) {
                    categoryLi.classList.add('has-children');
                }
                
                // Check if the column title is wrapped in a link (custom link)
                const titleLink = columnTitle.closest('a');
                const hasUrl = titleLink && titleLink.href && titleLink.href !== '#' && !titleLink.href.includes('javascript:');
                
                // Create title element
                const titleSpan = document.createElement('span');
                titleSpan.classList.add('category-title');
                titleSpan.textContent = columnTitle.textContent;
                
                // Make the title clickable for expansion if it has children
                if (hasChildren) {
                    titleSpan.style.cursor = 'pointer';
                    titleSpan.addEventListener('click', function(e) {
                        e.preventDefault();
                        e.stopPropagation();
                        
                        // Toggle active class
                        const isActive = categoryLi.classList.toggle('active');
                        
                        // Also toggle display of program list
                        const programList = categoryLi.querySelector('.mobile-program-list');
                        if (programList) {
                            programList.style.display = isActive ? 'block' : 'none';
                        }
                    });
                }
                
                categoryLi.appendChild(titleSpan);
                
                // Create program list container if there are programs
                if (hasChildren) {
                    const programListUl = document.createElement('ul');
                    programListUl.classList.add('mobile-program-list');
                    programListUl.style.display = 'none'; // Hide by default
                    
                    programLinks.forEach(li => {
                        const clonedLi = li.cloneNode(true);
                        clonedLi.classList.add('mobile-program-item');
                        programListUl.appendChild(clonedLi);
                    });
                    
                    categoryLi.appendChild(programListUl);
                }
                
                mobileSubMenu.appendChild(categoryLi);
            }
        });
        
        // Add "Find my path" or other footer CTA as a simple link item
        const megaMenuFooter = megaMenuModal.querySelector('.mega-menu-footer');
        const megaMenuCTA = megaMenuFooter ? megaMenuFooter.querySelector('.mega-menu-cta') : null;
        
        if (megaMenuCTA) {
            const ctaLi = document.createElement('li');
            ctaLi.classList.add('mobile-category-header'); // No has-children class
            
            // Create the title span first (contains the triangle)
            const ctaTitle = document.createElement('span');
            ctaTitle.classList.add('category-title');
            
            // Get text content (remove SVG text if any)
            let ctaTextContent = '';
            megaMenuCTA.childNodes.forEach(node => {
                if (node.nodeType === Node.TEXT_NODE) {
                    ctaTextContent += node.textContent.trim();
                }
            });
            ctaTitle.textContent = ctaTextContent || 'Find my path';
            
            // Wrap in a link with the same URL as the CTA button
            const ctaLink = document.createElement('a');
            ctaLink.href = megaMenuCTA.getAttribute('href') || '#'; // Get URL from CTA
            ctaLink.classList.add('category-title-link');
            ctaLink.appendChild(ctaTitle);
            
            ctaLi.appendChild(ctaLink);
            mobileSubMenu.appendChild(ctaLi);
        }
        
        // Insert after the mega menu modal
        megaMenuParent.insertBefore(mobileSubMenu, megaMenuModal.nextSibling);
    }
    
    // Toggle icon is now handled entirely by CSS ::after pseudo-elements
    // No JavaScript toggle icon creation needed
    
    // Set up all mega menu event listeners
    function setupMegaMenuEvents() {
        // Desktop hover events
        if (megaMenuParent && megaMenuModal) {
            megaMenuParent.addEventListener('mouseenter', function() {
                if (window.innerWidth > 1024) {
                    clearTimeout(megaMenuTimeout);
                    // Update position before opening
                    const header = document.querySelector('.header');
                    if (header) {
                        const headerRect = header.getBoundingClientRect();
                        megaMenuModal.style.top = headerRect.bottom + 'px';
                    }
                    openMegaMenu();
                }
            });
            
            megaMenuParent.addEventListener('mouseleave', function() {
                if (window.innerWidth > 1024) {
                    megaMenuTimeout = setTimeout(() => {
                        closeMegaMenu();
                    }, 200);
                }
            });
            
            // Keep open when hovering over modal
            if (megaMenuModal) {
                megaMenuModal.addEventListener('mouseenter', function() {
                    if (window.innerWidth > 1024) {
                        clearTimeout(megaMenuTimeout);
                        // Update position to ensure proper alignment
                        const header = document.querySelector('.header');
                        if (header) {
                            const headerRect = header.getBoundingClientRect();
                            megaMenuModal.style.top = headerRect.bottom + 'px';
                        }
                    }
                });
                
                megaMenuModal.addEventListener('mouseleave', function() {
                    if (window.innerWidth > 1024) {
                        megaMenuTimeout = setTimeout(() => {
                            closeMegaMenu();
                        }, 200);
                    }
                });
            }
        }
        
        // Click handler for Programs menu - both desktop and mobile
        if (megaMenuTrigger) {
            megaMenuTrigger.addEventListener('click', function(e) {
                const isMobile = window.innerWidth <= 1024;
                
                if (isMobile) {
                    // On mobile: First click expands, second click navigates
                    const wasActive = megaMenuParent.classList.contains('active');
                    
                    if (!wasActive) {
                        // First click - expand submenu
                        e.preventDefault();
                        if (mobileSubMenu && megaMenuParent) {
                            mobileSubMenu.style.display = 'block';
                            megaMenuParent.classList.add('active');
                        }
                        console.log('Programs submenu expanded on first click');
                    } else {
                        // Second click - allow navigation
                        console.log('Programs already expanded, allowing navigation to:', this.href);
                        // Don't prevent default - let the link work
                    }
                } else {
                    // On desktop, allow the link to work normally
                    // Mega menu opens/closes on hover, not click
                    // Let the link navigate to its href
                }
            });
        }
    }
    
    // Toggle mobile submenu - Auto-expand Programs submenu on mobile
    function toggleMobileSubMenu() {
        if (!mobileSubMenu) return;
        
        // On mobile, Programs submenu should always be expanded (matching Figma)
        // No toggle functionality - it's always visible
        if (window.innerWidth <= 1024) {
            mobileSubMenu.style.display = 'block';
            megaMenuParent.classList.add('active');
        }
    }
    
    // Auto-expand Programs submenu when mobile menu opens
    function autoExpandProgramsOnMobile() {
        if (window.innerWidth <= 1024) {
            // Ensure mobile submenu exists
            if (!mobileSubMenu && megaMenuModal) {
                console.log('🔧 Mobile submenu missing, recreating it');
                createMobileSubMenu();
            }
            
            if (mobileSubMenu && megaMenuParent) {
                const headerNavOpen = document.querySelector('.header-nav.mobile-open');
                if (headerNavOpen) {
                    console.log('✅ Auto-expanding Programs submenu (matching Figma)');
                    // Show the 2nd level menu (categories)
                    mobileSubMenu.style.display = 'block';
                    megaMenuParent.classList.add('active');
                    
                    // Ensure all 3rd level items are collapsed by default
                    const categoryHeaders = mobileSubMenu.querySelectorAll('.mobile-category-header.has-children');
                    categoryHeaders.forEach(header => {
                        header.classList.remove('active');
                        const programList = header.querySelector('.mobile-program-list');
                        if (programList) {
                            programList.style.display = 'none';
                        }
                    });
                } else {
                    console.log('⚠️ Header nav not open yet');
                }
            } else {
                console.log('⚠️ Mobile submenu or parent not found:', { mobileSubMenu, megaMenuParent });
            }
        }
    }
    
    // Close mega menu
    if (megaMenuClose && megaMenuModal) {
        megaMenuClose.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            closeMegaMenu();
        });
    }
    
    // Close mega menu when clicking outside
    document.addEventListener('click', function(e) {
        if (megaMenuModal && megaMenuModal.classList.contains('active')) {
            if (!megaMenuParent.contains(e.target) && !megaMenuModal.contains(e.target)) {
                closeMegaMenu();
            }
        }
    });
    
    // Close mega menu with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && megaMenuModal && megaMenuModal.classList.contains('active')) {
            closeMegaMenu();
        }
    });
    
    // Close mega menu when clicking on program links
    const megaMenuProgramLinks = document.querySelectorAll('.mega-menu-programs a');
    megaMenuProgramLinks.forEach(link => {
        link.addEventListener('click', function() {
            closeMegaMenu();
        });
    });
    
    // Close mega menu when clicking on CTA link
    const megaMenuCTA = document.querySelector('.mega-menu-cta');
    if (megaMenuCTA) {
        megaMenuCTA.addEventListener('click', function(e) {
            // Close the mega menu and allow navigation
            closeMegaMenu();
            // Let the link navigate naturally (don't preventDefault)
            console.log('CTA clicked, navigating to:', this.href);
        });
    }
    
    // Initialize responsive mega menu
    initResponsiveMegaMenu();
    
    // Debug logging for testing
    console.log('🚀 Responsive Mega Menu initialized');
    console.log('📱 Mobile breakpoint: 1024px');
    console.log('🖥️ Desktop: Mega menu modal');
    console.log('📱 Mobile: Structured submenu with categories and programs');
    console.log('✅ Single plus icon (no duplication)');
    console.log('📋 Full hierarchy: Programs → Categories → Individual Programs');
    console.log('🔗 Custom links: All category headers (NURSING, HEALTHCARE) are clickable when they have URLs');
    
    function openMegaMenu() {
        if (megaMenuModal) {
            // Dynamically calculate header position
            const header = document.querySelector('.header');
            if (header) {
                const headerRect = header.getBoundingClientRect();
                const headerBottom = headerRect.bottom;
                megaMenuModal.style.top = headerBottom + 'px';
            }
            
            megaMenuModal.classList.add('active');
            document.body.style.overflow = 'hidden';
            
            // Add smooth entrance animation
            setTimeout(() => {
                const megaMenuContent = megaMenuModal.querySelector('.mega-menu-content');
                if (megaMenuContent) {
                    megaMenuContent.style.transform = 'translateY(0)';
                    megaMenuContent.style.opacity = '1';
                }
            }, 10);
        }
    }
    
    function closeMegaMenu() {
        if (megaMenuModal) {
            megaMenuModal.classList.remove('active');
            document.body.style.overflow = '';
            
            // Reset animation state
            const megaMenuContent = megaMenuModal.querySelector('.mega-menu-content');
            if (megaMenuContent) {
                megaMenuContent.style.transform = '';
                megaMenuContent.style.opacity = '';
            }
        }
    }
    
    // Handle window resize - responsive behavior
    window.addEventListener('resize', function() {
        // Close mega menu modal when switching to mobile
        if (window.innerWidth <= 1024 && megaMenuModal && megaMenuModal.classList.contains('active')) {
            closeMegaMenu();
        }
        
        // Close mobile submenu when switching to desktop
        if (window.innerWidth > 1024 && mobileSubMenu && mobileSubMenu.style.display === 'block') {
            mobileSubMenu.style.display = 'none';
            if (megaMenuParent) {
                megaMenuParent.classList.remove('active');
            }
            // The CSS ::after pseudo-element will handle the icon change
        }
        
        // Reinitialize if needed
        if (window.innerWidth <= 1024 && !mobileSubMenu) {
            initResponsiveMegaMenu();
        }
    });
    
    // Update mega menu position on scroll if it's open
    window.addEventListener('scroll', function() {
        if (megaMenuModal && megaMenuModal.classList.contains('active') && window.innerWidth > 1024) {
            const header = document.querySelector('.header');
            if (header) {
                const headerRect = header.getBoundingClientRect();
                megaMenuModal.style.top = headerRect.bottom + 'px';
            }
        }
    });
    
    // Prevent default behavior on links with href="#" to avoid unwanted scrolling
    document.querySelectorAll('a[href="#"]').forEach(link => {
        link.addEventListener('click', function(e) {
            // Only prevent default if the link doesn't have a specific handler
            if (!this.classList.contains('skip-link') && 
                !this.classList.contains('search-toggle') && 
                !this.classList.contains('mega-menu-toggle')) {
                e.preventDefault();
            }
        });
    });
    
    // Console welcome message
    // console.log('🚀 Unitek College website loaded successfully!');
    // console.log('💡 Try clicking on program tabs, FAQ items, or the contact form!');
    // console.log('🔍 Search functionality is now active!');
    // console.log('📋 Mega menu is now active! Hover over Programs to see it in action!');
});
