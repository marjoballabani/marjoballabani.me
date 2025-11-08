// Modern Cloud Dashboard JavaScript - 2025
// Enhanced with GSAP animations and Chart.js visualizations

class CloudDashboard {
    constructor() {
        this.init();
        this.setupEventListeners();
        this.initializeAnimations();
        this.initializeCharts();
        this.animateCounters();
        this.animateProgressBars();
    }

    init() {
        console.log('🚀 Cloud Dashboard initialized');
        
        // Register GSAP plugins
        gsap.registerPlugin(ScrollTrigger);
        
        // Initialize default animations
        this.setupInitialAnimations();
    }

    setupEventListeners() {
        // Tab switching
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.addEventListener('click', (e) => this.switchTab(e.target.dataset.tab));
        });

        // Smooth scrolling for internal links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', this.smoothScroll);
        });

        // Add hover effects to interactive elements
        this.addHoverEffects();

        // Resize event for responsive charts
        window.addEventListener('resize', () => {
            this.resizeCharts();
        });

        // Initialize intersection observer for scroll animations
        this.initializeScrollAnimations();
    }

    setupInitialAnimations() {
        // Animate header on load
        gsap.from('.profile-avatar', {
            duration: 1,
            scale: 0,
            rotation: 360,
            ease: 'bounce.out',
            delay: 0.2
        });

        gsap.from('.profile-info', {
            duration: 0.8,
            x: -50,
            opacity: 0,
            ease: 'power2.out',
            delay: 0.5
        });

        gsap.from('.header-stats .stat-item', {
            duration: 0.6,
            y: 30,
            opacity: 0,
            stagger: 0.1,
            ease: 'power2.out',
            delay: 0.8
        });

        gsap.from('.header-actions .btn', {
            duration: 0.5,
            scale: 0.8,
            opacity: 0,
            stagger: 0.1,
            ease: 'back.out(1.7)',
            delay: 1.2
        });

        // Animate navigation tabs
        gsap.from('.nav-tab', {
            duration: 0.4,
            y: -20,
            opacity: 0,
            stagger: 0.05,
            ease: 'power2.out',
            delay: 1.5
        });
    }

    initializeScrollAnimations() {
        // Create intersection observer for cards
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCard(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        // Observe all cards
        document.querySelectorAll('.dashboard-card, .project-card, .education-card, .timeline-item').forEach(card => {
            observer.observe(card);
        });
    }

    animateCard(card) {
        gsap.from(card, {
            duration: 0.6,
            y: 50,
            opacity: 0,
            scale: 0.95,
            ease: 'power2.out'
        });
    }

    switchTab(tabName) {
        // Remove active class from all tabs and panes
        document.querySelectorAll('.nav-tab').forEach(tab => tab.classList.remove('active'));
        document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));

        // Add active class to clicked tab and corresponding pane
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        document.getElementById(tabName).classList.add('active');

        // Animate tab content
        gsap.from(`#${tabName}`, {
            duration: 0.5,
            y: 20,
            opacity: 0,
            ease: 'power2.out'
        });

        // Re-initialize charts if switching to skills tab
        if (tabName === 'skills') {
            setTimeout(() => this.initializeCharts(), 100);
        }

        // Re-animate progress bars if switching to skills tab
        if (tabName === 'skills') {
            setTimeout(() => this.animateProgressBars(), 200);
        }
    }

    animateCounters() {
        document.querySelectorAll('.stat-number').forEach(counter => {
            const target = parseInt(counter.dataset.target);
            const duration = 2;
            
            gsap.from(counter, {
                duration: duration,
                innerHTML: 0,
                snap: { innerHTML: 1 },
                ease: 'power2.out',
                delay: 1.8,
                onUpdate: function() {
                    counter.innerHTML = Math.ceil(this.targets()[0].innerHTML);
                }
            });
        });
    }

    animateProgressBars() {
        document.querySelectorAll('.progress').forEach(progressBar => {
            const width = progressBar.dataset.width;
            
            gsap.to(progressBar, {
                duration: 1.5,
                width: `${width}%`,
                ease: 'power2.out',
                delay: 0.2
            });
        });
    }

    initializeCharts() {
        // Performance Chart (Line Chart)
        this.createPerformanceChart();
        
        // Skills Charts (Doughnut Charts)
        this.createSkillsCharts();
    }

    createPerformanceChart() {
        const ctx = document.getElementById('performanceChart');
        if (!ctx) return;

        // Destroy existing chart if it exists
        if (this.performanceChart) {
            this.performanceChart.destroy();
        }

        this.performanceChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'Performance Score',
                    data: [65, 78, 82, 87, 91, 95],
                    borderColor: '#0066cc',
                    backgroundColor: 'rgba(0, 102, 204, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#0066cc',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 6,
                    pointHoverRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        grid: {
                            color: '#e2e8f0'
                        },
                        ticks: {
                            color: '#64748b'
                        }
                    },
                    x: {
                        grid: {
                            color: '#e2e8f0'
                        },
                        ticks: {
                            color: '#64748b'
                        }
                    }
                },
                animation: {
                    duration: 2000,
                    easing: 'easeInOutQuart'
                }
            }
        });
    }

    createSkillsCharts() {
        // Cloud Skills Chart
        this.createSkillChart('cloudSkillsChart', {
            labels: ['AWS', 'Docker', 'Kubernetes', 'Terraform'],
            data: [90, 95, 75, 85],
            colors: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0']
        });

        // Programming Skills Chart
        this.createSkillChart('programmingSkillsChart', {
            labels: ['JavaScript', 'Python', 'Java', 'Go'],
            data: [95, 90, 80, 70],
            colors: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0']
        });

        // Frameworks Skills Chart
        this.createSkillChart('frameworksSkillsChart', {
            labels: ['React', 'Node.js', 'Django', 'Spring'],
            data: [95, 90, 85, 75],
            colors: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0']
        });
    }

    createSkillChart(canvasId, config) {
        const ctx = document.getElementById(canvasId);
        if (!ctx) return;

        // Destroy existing chart if it exists
        if (this[canvasId]) {
            this[canvasId].destroy();
        }

        this[canvasId] = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: config.labels,
                datasets: [{
                    data: config.data,
                    backgroundColor: config.colors,
                    borderWidth: 0,
                    hoverBorderWidth: 2,
                    hoverBorderColor: '#ffffff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                cutout: '60%',
                animation: {
                    animateRotate: true,
                    duration: 1500,
                    easing: 'easeInOutQuart'
                }
            }
        });
    }

    addHoverEffects() {
        // Add subtle hover animations to cards
        document.querySelectorAll('.dashboard-card, .project-card, .education-card, .cert-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                gsap.to(card, {
                    duration: 0.3,
                    y: -5,
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                    ease: 'power2.out'
                });
            });

            card.addEventListener('mouseleave', () => {
                gsap.to(card, {
                    duration: 0.3,
                    y: 0,
                    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                    ease: 'power2.out'
                });
            });
        });

        // Add hover effects to buttons
        document.querySelectorAll('.btn').forEach(btn => {
            btn.addEventListener('mouseenter', () => {
                gsap.to(btn, {
                    duration: 0.2,
                    scale: 1.05,
                    ease: 'power2.out'
                });
            });

            btn.addEventListener('mouseleave', () => {
                gsap.to(btn, {
                    duration: 0.2,
                    scale: 1,
                    ease: 'power2.out'
                });
            });
        });

        // Add hover effects to skill tags
        document.querySelectorAll('.skill-tag, .tech-tag').forEach(tag => {
            tag.addEventListener('mouseenter', () => {
                gsap.to(tag, {
                    duration: 0.2,
                    scale: 1.1,
                    ease: 'back.out(1.7)'
                });
            });

            tag.addEventListener('mouseleave', () => {
                gsap.to(tag, {
                    duration: 0.2,
                    scale: 1,
                    ease: 'power2.out'
                });
            });
        });

        // Add hover effects to activity items
        document.querySelectorAll('.activity-item').forEach(item => {
            item.addEventListener('mouseenter', () => {
                gsap.to(item.querySelector('.activity-icon'), {
                    duration: 0.3,
                    rotation: 360,
                    scale: 1.1,
                    ease: 'power2.out'
                });
            });

            item.addEventListener('mouseleave', () => {
                gsap.to(item.querySelector('.activity-icon'), {
                    duration: 0.3,
                    rotation: 0,
                    scale: 1,
                    ease: 'power2.out'
                });
            });
        });
    }

    smoothScroll(e) {
        e.preventDefault();
        const target = document.querySelector(e.target.getAttribute('href'));
        if (target) {
            gsap.to(window, {
                duration: 1,
                scrollTo: target,
                ease: 'power2.inOut'
            });
        }
    }

    resizeCharts() {
        // Resize all charts when window resizes
        if (this.performanceChart) {
            this.performanceChart.resize();
        }
        
        Object.keys(this).forEach(key => {
            if (key.includes('Chart') && this[key] && typeof this[key].resize === 'function') {
                this[key].resize();
            }
        });
    }

    // Utility function to create floating animation
    createFloatingAnimation(selector, options = {}) {
        const defaults = {
            y: 10,
            duration: 2,
            ease: 'power2.inOut',
            repeat: -1,
            yoyo: true
        };
        
        const settings = { ...defaults, ...options };
        
        gsap.to(selector, settings);
    }

    // Add particle effect (optional enhancement)
    initializeParticles() {
        // Create subtle floating particles for cloud theme
        const particleContainer = document.createElement('div');
        particleContainer.className = 'particles-container';
        particleContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: -1;
        `;
        
        document.body.appendChild(particleContainer);

        // Create particles
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                width: 4px;
                height: 4px;
                background: rgba(0, 102, 204, 0.1);
                border-radius: 50%;
                top: ${Math.random() * 100}%;
                left: ${Math.random() * 100}%;
            `;
            
            particleContainer.appendChild(particle);
            
            // Animate particle
            gsap.to(particle, {
                y: -100,
                duration: Math.random() * 20 + 10,
                repeat: -1,
                ease: 'none',
                delay: Math.random() * 5
            });
            
            gsap.to(particle, {
                x: Math.random() * 100 - 50,
                duration: Math.random() * 10 + 5,
                repeat: -1,
                yoyo: true,
                ease: 'power2.inOut',
                delay: Math.random() * 5
            });
        }
    }

    // Theme switching functionality (bonus feature)
    initializeThemeToggle() {
        const themeToggle = document.createElement('button');
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        themeToggle.className = 'theme-toggle';
        themeToggle.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: var(--primary-blue);
            color: white;
            border: none;
            cursor: pointer;
            box-shadow: var(--shadow-lg);
            z-index: 1000;
            transition: var(--transition-normal);
        `;
        
        document.body.appendChild(themeToggle);
        
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-theme');
            const icon = themeToggle.querySelector('i');
            icon.className = document.body.classList.contains('dark-theme') 
                ? 'fas fa-sun' 
                : 'fas fa-moon';
                
            // Animate theme toggle
            gsap.to(themeToggle, {
                duration: 0.3,
                scale: 1.2,
                ease: 'back.out(1.7)',
                yoyo: true,
                repeat: 1
            });
        });
    }

    // Add typing effect for dynamic text
    addTypingEffect(selector, text, speed = 100) {
        const element = document.querySelector(selector);
        if (!element) return;
        
        element.innerHTML = '';
        let i = 0;
        
        const typeWriter = () => {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                setTimeout(typeWriter, speed);
            }
        };
        
        typeWriter();
    }

    // Initialize all features
    initializeAllFeatures() {
        this.initializeParticles();
        this.initializeThemeToggle();
        
        // Add typing effect to profile title (optional)
        setTimeout(() => {
            this.addTypingEffect('.profile-title', 'Senior Cloud Software Engineer', 150);
        }, 2000);
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const dashboard = new CloudDashboard();
    
    // Optional: Initialize all bonus features
    // dashboard.initializeAllFeatures();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CloudDashboard;
}