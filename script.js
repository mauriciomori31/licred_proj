document.addEventListener("DOMContentLoaded", () => {
    // CSRF Token
    const csrfToken = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let token = '';
        for (let i = 0; i < 32; i++) token += chars.charAt(Math.floor(Math.random() * chars.length));
        return token;
    };

    // Rate limiting
    let lastSubmitTime = 0;
    const RATE_LIMIT_MS = 5000;
    const canSubmit = () => {
        const now = Date.now();
        if (now - lastSubmitTime < RATE_LIMIT_MS) return false;
        lastSubmitTime = now;
        return true;
    };

    // Input sanitization
    const sanitizeInput = (str) => str.replace(/[<>]/g, '').trim();

    // Mobile performance optimization utilities
    const isMobileDevice = () => /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    let isPageVisible = !document.hidden;
    let scrollThrottleId = null;
    let inputThrottleId = null;

    // Visibility change detection
    document.addEventListener('visibilitychange', () => {
        isPageVisible = !document.hidden;
        if (isPageVisible) {
            revealOnScroll(); // Resume animations when page becomes visible
        }
    });

    // Reveal animations on scroll (optimized for mobile)
    const revealElements = document.querySelectorAll(".fade-in-up");

    const revealOnScroll = () => {
        if (!isPageVisible) return; // Skip if page not visible

        const windowHeight = window.innerHeight;
        const revealPoint = isMobileDevice() ? 50 : 100; // Smaller reveal point on mobile

        revealElements.forEach((el) => {
            const revealTop = el.getBoundingClientRect().top;
            if (revealTop < windowHeight - revealPoint) {
                el.classList.add("visible");
            }
        });
    };

    // Throttled scroll handler using requestAnimationFrame
    const throttledScroll = () => {
        if (scrollThrottleId) return;
        scrollThrottleId = requestAnimationFrame(() => {
            revealOnScroll();
            scrollThrottleId = null;
        });
    };

    window.addEventListener("scroll", throttledScroll);
    revealOnScroll(); // Trigger on load

    // WhatsApp Input Mask (optimized)
    const whatsappInput = document.getElementById("whatsapp");
    if (whatsappInput) {
        let inputThrottleId = null;

        whatsappInput.addEventListener("input", (e) => {
            // Throttle input processing on mobile for better performance
            if (inputThrottleId) return;

            inputThrottleId = requestAnimationFrame(() => {
                let value = e.target.value.replace(/\D/g, "");
                let formatted = value;

                if (value.length > 0) {
                    formatted = "(" + value.substring(0, 2);
                }
                if (value.length > 2) {
                    formatted += ") " + value.substring(2, 7);
                }
                if (value.length > 7) {
                    formatted += "-" + value.substring(7, 11);
                }

                e.target.value = formatted;
                inputThrottleId = null;
            });
        });
    }

    // Lead Form submission - Download Guide
    const leadForm = document.getElementById("leadForm");
    if (leadForm) {
        leadForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            if (!canSubmit()) {
                alert("Por favor, aguarde 5 segundos antes de enviar novamente.");
                return;
            }
            const btn = leadForm.querySelector("button[type=submit]");
            const originalText = btn.innerHTML;
            const nome = sanitizeInput(document.getElementById("guia_nome").value);
            const whatsapp = sanitizeInput(document.getElementById("guia_whatsapp").value);

            btn.disabled = true;
            btn.innerHTML = '<i data-feather="loader" class="spin"></i> Enviando...';
            feather.replace();

            try {
                await fetch('https://webhookn8n.ntwsaas.app.br/webhook/gratis', {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        'X-CSRF-Token': csrfToken()
                    },
                    body: JSON.stringify({ nome, whatsapp, csrfToken: csrfToken() })
                });
            } catch (err) {
                console.log('Webhook erro:', err);
            }

            btn.innerHTML = '<i data-feather="check"></i> Sucesso!';
            btn.style.backgroundColor = 'var(--clr-primary-dark)';
            feather.replace();

            const toast = document.getElementById('toast');
            toast.innerHTML = '<i data-feather="check-circle"></i> Seu arquivo será enviado para seu WhatsApp!';
            toast.classList.add('show');
            feather.replace();
            setTimeout(() => toast.classList.remove('show'), 5000);

            setTimeout(() => {
                btn.disabled = false;
                btn.innerHTML = originalText;
                btn.style.backgroundColor = '';
                leadForm.reset();
                feather.replace();
            }, 2000);
        });
    }

    // Contact Form - Simple and Clean
    const contactForm = document.getElementById("contactForm");
    if (contactForm) {
        contactForm.addEventListener("submit", async function(e) {
            e.preventDefault();
            
            if (!canSubmit()) {
                alert("Por favor, aguarde 5 segundos antes de enviar novamente.");
                return;
            }

            const nome = sanitizeInput(document.getElementById("contato_nome").value);
            const telefone = sanitizeInput(document.getElementById("contato_telefone").value);
            const email = sanitizeInput(document.getElementById("contato_email").value);
            const mensagem = sanitizeInput(document.getElementById("contato_mensagem").value);

            if (!nome || !email) {
                alert("Por favor, preencha nome e e-mail.");
                return;
            }

            const btn = contactForm.querySelector("button[type=submit]");
            const originalText = btn.innerHTML;
            btn.disabled = true;
            btn.innerHTML = '<i data-feather="loader" class="spin"></i> Enviando...';
            feather.replace();

            try {
                const response = await fetch('https://webhookn8n.ntwsaas.app.br/webhook/contatolid', {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        'X-CSRF-Token': csrfToken()
                    },
                    body: JSON.stringify({ nome, telefone, email, mensagem, csrfToken: csrfToken() })
                });

                btn.innerHTML = '<i data-feather="check"></i> Enviado com sucesso!';
                btn.style.backgroundColor = '#059669';
                contactForm.reset();
                const toast = document.getElementById('toast');
                toast.classList.add('show');
                feather.replace();
                setTimeout(() => toast.classList.remove('show'), 4000);
            } catch (error) {
                console.error('Erro:', error);
                btn.innerHTML = '<i data-feather="check"></i> Enviado!';
                btn.style.backgroundColor = '#059669';
                contactForm.reset();
                const toast = document.getElementById('toast');
                toast.classList.add('show');
                feather.replace();
                setTimeout(() => toast.classList.remove('show'), 4000);
            }

            feather.replace();
            
            setTimeout(() => {
                btn.disabled = false;
                btn.innerHTML = originalText;
                btn.style.backgroundColor = '';
                feather.replace();
            }, 3000);
        });

        // Máscara de telefone simples
        document.getElementById("contato_telefone").addEventListener("input", function(e) {
            let value = e.target.value.replace(/\D/g, "");
            if (value.length > 0) {
                value = "(" + value.substring(0, 2) + ") " + value.substring(2, 7) + "-" + value.substring(7, 11);
            }
            e.target.value = value;
        });
    }

    // Glass navbar effect on scroll (optimized)
    const navbar = document.querySelector(".glass-navbar");
    let navbarThrottleId = null;

    const updateNavbar = () => {
        if (!isPageVisible) return; // Skip if page not visible

        if (window.scrollY > 50) {
            navbar.style.background = "rgba(4, 16, 9, 0.9)";
            navbar.style.borderBottom = "1px solid rgba(16, 185, 129, 0.2)";
        } else {
            navbar.style.background = "rgba(4, 16, 9, 0.7)";
            navbar.style.borderBottom = "1px solid rgba(255, 255, 255, 0.05)";
        }
    };

    const throttledNavbarUpdate = () => {
        if (navbarThrottleId) return;
        navbarThrottleId = requestAnimationFrame(() => {
            updateNavbar();
            navbarThrottleId = null;
        });
    };

    window.addEventListener("scroll", throttledNavbarUpdate);
    updateNavbar(); // Initial state

    // Add optimized spin keyframe dynamically
    const style = document.createElement('style');
    const isMobile = isMobileDevice();
    const spinDuration = isMobile ? '2s' : '1s'; // Slower on mobile to save battery

    style.innerHTML = `
        .spin {
            animation: spin ${spinDuration} linear infinite;
        }
        @keyframes spin {
            100% { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);

    // Device capability detection for fallbacks
    const canUseAdvancedEffects = () => {
        // Check for modern browser features
        return 'requestAnimationFrame' in window &&
               'IntersectionObserver' in window &&
               CSS.supports('backdrop-filter: blur(10px)');
    };

    // Apply reduced motion preferences
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
        document.documentElement.style.setProperty('--animation-duration', '0.01ms');
    }

    // Performance monitoring (development only)
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        console.log('Mobile Performance Optimization Applied:', {
            isMobile: isMobile,
            canUseAdvancedEffects: canUseAdvancedEffects(),
            prefersReducedMotion: prefersReducedMotion,
            pageVisibility: isPageVisible
        });
    }
});
