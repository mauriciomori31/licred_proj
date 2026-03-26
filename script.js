document.addEventListener("DOMContentLoaded", () => {
    // Reveal animations on scroll
    const revealElements = document.querySelectorAll(".fade-in-up");

    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        const revealPoint = 100;

        revealElements.forEach((el) => {
            const revealTop = el.getBoundingClientRect().top;
            if (revealTop < windowHeight - revealPoint) {
                el.classList.add("visible");
            }
        });
    };

    window.addEventListener("scroll", revealOnScroll);
    revealOnScroll(); // Trigger on load

    // WhatsApp Input Mask (Simple implementation)
    const whatsappInput = document.getElementById("whatsapp");
    if (whatsappInput) {
        whatsappInput.addEventListener("input", (e) => {
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
        });
    }

    // Form submission mock
    const form = document.getElementById("leadForm");
    if (form) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            const btn = form.querySelector("button[type=submit]");
            const originalText = btn.innerHTML;
            
            btn.innerHTML = '<i data-feather="loader" class="spin"></i> Processando...';
            feather.replace(); // re-init new icon

            // Simulate API request
            setTimeout(() => {
                btn.innerHTML = '<i data-feather="check"></i> Sucesso!';
                btn.style.backgroundColor = 'var(--clr-primary-dark)';
                feather.replace();

                // Reset after 3 seconds
                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.style.backgroundColor = '';
                    form.reset();
                    feather.replace();
                }, 3000);
            }, 1000);
        });
    }

    // Glass navbar effect on scroll
    const navbar = document.querySelector(".glass-navbar");
    window.addEventListener("scroll", () => {
        if (window.scrollY > 50) {
            navbar.style.background = "rgba(4, 16, 9, 0.9)";
            navbar.style.borderBottom = "1px solid rgba(16, 185, 129, 0.2)";
        } else {
            navbar.style.background = "rgba(4, 16, 9, 0.7)";
            navbar.style.borderBottom = "1px solid rgba(255, 255, 255, 0.05)";
        }
    });

    // Add spin keyframe dynamically for the loader
    const style = document.createElement('style');
    style.innerHTML = `
        .spin {
            animation: spin 1s linear infinite;
        }
        @keyframes spin {
            100% { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
});
