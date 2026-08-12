/* ============================================================
   KASITU WEBS — OPTIMIZED SCRIPT
   Performance Pass
============================================================ */


/* ============================================================
   BASIC HELPERS
============================================================ */

function debounce(fn, delay = 150) {

    let timeout;

    return function (...args) {

        clearTimeout(timeout);

        timeout = setTimeout(() => {

            fn.apply(this, args);

        }, delay);

    };

}


/* ============================================================
   DOM READY
============================================================ */

document.addEventListener("DOMContentLoaded", () => {


    /* ========================================================
       MOBILE MENU
    ======================================================== */

    const menuBtn =
        document.querySelector(".menu-btn");

    const mobileMenu =
        document.querySelector(".mobile-menu");

    if (menuBtn && mobileMenu) {

        menuBtn.addEventListener("click", () => {

            const open =
                mobileMenu.classList.toggle(
                    "mobile-open"
                );

            menuBtn.classList.toggle(
                "open",
                open
            );

            menuBtn.setAttribute(
                "aria-expanded",
                String(open)
            );

        });


        /* Close menu when clicking a link */

        mobileMenu
            .querySelectorAll("a")
            .forEach(link => {

                link.addEventListener(
                    "click",
                    () => {

                        mobileMenu.classList.remove(
                            "mobile-open"
                        );

                        menuBtn.classList.remove(
                            "open"
                        );

                        menuBtn.setAttribute(
                            "aria-expanded",
                            "false"
                        );

                    }
                );

            });


        /* Close menu on scroll, throttled */

        window.addEventListener(
            "scroll",
            debounce(() => {

                if (
                    mobileMenu.classList.contains(
                        "mobile-open"
                    )
                ) {

                    mobileMenu.classList.remove(
                        "mobile-open"
                    );

                    menuBtn.classList.remove(
                        "open"
                    );

                    menuBtn.setAttribute(
                        "aria-expanded",
                        "false"
                    );

                }

            }, 120),
            {
                passive: true
            }
        );

    }


    /* ========================================================
       THEME SWITCHER
    ======================================================== */

    const themeToggle =
        document.querySelector(
            ".theme-toggle"
        );

    const html =
        document.documentElement;

    const savedTheme =
        localStorage.getItem(
            "kasitu-theme"
        );


    if (savedTheme) {

        html.setAttribute(
            "data-theme",
            savedTheme
        );

    }


    if (themeToggle) {

        themeToggle.addEventListener(
            "click",
            () => {

                const current =
                    html.getAttribute(
                        "data-theme"
                    ) || "dark";

                const next =
                    current === "dark"
                        ? "light"
                        : "dark";

                html.setAttribute(
                    "data-theme",
                    next
                );

                localStorage.setItem(
                    "kasitu-theme",
                    next
                );

            }
        );

    }


    /* ========================================================
       ACTIVE NAVIGATION
    ======================================================== */

    const sections =
        document.querySelectorAll(
            "section[id]"
        );

    const navLinks =
        document.querySelectorAll(
            ".nav-links a, .mobile-menu a"
        );


    if (
        sections.length &&
        navLinks.length
    ) {

        const navObserver =
            new IntersectionObserver(
                entries => {

                    entries.forEach(entry => {

                        if (!entry.isIntersecting) {
                            return;
                        }

                        const id =
                            entry.target.id;

                        navLinks.forEach(link => {

                            const href =
                                link.getAttribute(
                                    "href"
                                );

                            link.classList.toggle(
                                "active",
                                href === `#${id}`
                            );

                        });

                    });

                },
                {
                    rootMargin:
                        "-35% 0px -55% 0px"
                }
            );


        sections.forEach(section => {

            navObserver.observe(section);

        });

    }


    /* ========================================================
       REVEAL ON SCROLL
    ======================================================== */

    const revealElements =
        document.querySelectorAll(
            ".hidden"
        );


    if (
        revealElements.length &&
        !window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches
    ) {

        const revealObserver =
            new IntersectionObserver(
                entries => {

                    entries.forEach(entry => {

                        if (
                            entry.isIntersecting
                        ) {

                            entry.target.classList.add(
                                "show"
                            );

                            revealObserver.unobserve(
                                entry.target
                            );

                        }

                    });

                },
                {
                    threshold: .08,
                    rootMargin:
                        "0px 0px -40px 0px"
                }
            );


        revealElements.forEach(element => {

            revealObserver.observe(element);

        });

    } else {

        revealElements.forEach(element => {

            element.classList.add("show");

        });

    }


    /* ========================================================
       IMAGE OPTIMIZATION
    ======================================================== */

    document
        .querySelectorAll(
            "img:not(.site-logo)"
        )
        .forEach(img => {

            img.loading = "lazy";

            img.decoding = "async";

        });


    /* ========================================================
       COUNTERS
    ======================================================== */

    const counters =
        document.querySelectorAll(
            "[data-count]"
        );


    if (
        counters.length &&
        !window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches
    ) {

        const counterObserver =
            new IntersectionObserver(
                entries => {

                    entries.forEach(entry => {

                        if (
                            !entry.isIntersecting
                        ) {

                            return;

                        }


                        const counter =
                            entry.target;

                        const target =
                            parseInt(
                                counter.dataset.count,
                                10
                            ) || 0;

                        const duration = 1200;

                        const start =
                            performance.now();


                        function update(now) {

                            const progress =
                                Math.min(
                                    (now - start) /
                                    duration,
                                    1
                                );

                            const eased =
                                1 -
                                Math.pow(
                                    1 - progress,
                                    3
                                );

                            counter.textContent =
                                Math.floor(
                                    target * eased
                                );


                            if (
                                progress < 1
                            ) {

                                requestAnimationFrame(
                                    update
                                );

                            } else {

                                counter.textContent =
                                    target;

                            }

                        }


                        requestAnimationFrame(
                            update
                        );


                        counterObserver.unobserve(
                            counter
                        );

                    });

                },
                {
                    threshold: .5
                }
            );


        counters.forEach(counter => {

            counterObserver.observe(counter);

        });

    }


    /* ========================================================
       PROGRESS BAR
    ======================================================== */

    const progress =
        document.createElement(
            "div"
        );

    progress.id =
        "progress-bar";

    progress.style.position =
        "fixed";

    progress.style.top =
        "0";

    progress.style.left =
        "0";

    progress.style.height =
        "3px";

    progress.style.width =
        "0%";

    progress.style.zIndex =
        "99999";

    progress.style.pointerEvents =
        "none";

    progress.style.background =
        "linear-gradient(90deg,#4F46E5,#06B6D4,#8B5CF6)";

    progress.style.transformOrigin =
        "left center";

    document.body.appendChild(
        progress
    );


    let progressFrame = null;


    window.addEventListener(
        "scroll",
        () => {

            if (progressFrame) {
                return;
            }


            progressFrame =
                requestAnimationFrame(
                    () => {

                        const scroll =
                            window.scrollY;

                        const height =
                            Math.max(
                                1,
                                document.body
                                    .scrollHeight -
                                window.innerHeight
                            );

                        const percent =
                            (
                                scroll /
                                height
                            ) * 100;


                        progress.style.width =
                            percent + "%";


                        progressFrame =
                            null;

                    }
                );

        },
        {
            passive: true
        }
    );


    /* ========================================================
       PROJECT CARD 3D EFFECT
       DESKTOP ONLY
    ======================================================== */

    if (
        window.matchMedia(
            "(pointer: fine)"
        ).matches &&
        !window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches
    ) {

        const projectCards =
            document.querySelectorAll(
                ".project-card"
            );


        projectCards.forEach(card => {

            let frame = null;

            let pointerX = 0;
            let pointerY = 0;


            card.addEventListener(
                "mousemove",
                event => {

                    pointerX =
                        event.clientX;

                    pointerY =
                        event.clientY;


                    if (frame) {
                        return;
                    }


                    frame =
                        requestAnimationFrame(
                            () => {

                                const rect =
                                    card.getBoundingClientRect();


                                const x =
                                    pointerX -
                                    rect.left;


                                const y =
                                    pointerY -
                                    rect.top;


                                const rotateY =
                                    (
                                        x /
                                        rect.width -
                                        .5
                                    ) * 10;


                                const rotateX =
                                    (
                                        y /
                                        rect.height -
                                        .5
                                    ) * -10;


                                card.style.transform =
                                    `perspective(1200px)
                                     rotateX(${rotateX}deg)
                                     rotateY(${rotateY}deg)
                                     translateY(-8px)`;


                                frame =
                                    null;

                            }
                        );

                },
                {
                    passive: true
                }
            );


            card.addEventListener(
                "mouseleave",
                () => {

                    card.style.transform =
                        "";

                }
            );

        });

    }


    /* ========================================================
       MAGNETIC BUTTONS
       DESKTOP ONLY
    ======================================================== */

    if (
        window.matchMedia(
            "(pointer: fine)"
        ).matches &&
        !window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches
    ) {

        const magneticButtons =
            document.querySelectorAll(
                ".primary-btn,.secondary-btn"
            );


        magneticButtons.forEach(button => {

            let frame = null;

            let x = 0;
            let y = 0;


            button.addEventListener(
                "mousemove",
                event => {

                    const rect =
                        button.getBoundingClientRect();


                    x =
                        (
                            event.clientX -
                            rect.left -
                            rect.width / 2
                        ) * .12;


                    y =
                        (
                            event.clientY -
                            rect.top -
                            rect.height / 2
                        ) * .12;


                    if (frame) {
                        return;
                    }


                    frame =
                        requestAnimationFrame(
                            () => {

                                button.style.transform =
                                    `translate3d(${x}px,${y}px,0)`;


                                frame =
                                    null;

                            }
                        );

                },
                {
                    passive: true
                }
            );


            button.addEventListener(
                "mouseleave",
                () => {

                    button.style.transform =
                        "";

                }
            );

        });

    }


    /* ========================================================
       FLOATING SERVICE ICONS
       CSS ANIMATION INSTEAD OF RAF LOOP
    ======================================================== */

    const floatingIcons =
        document.querySelectorAll(
            ".service-icon"
        );


    if (
        !window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches &&
        !window.matchMedia(
            "(pointer: coarse)"
        ).matches
    ) {

        floatingIcons.forEach(
            (icon, index) => {

                icon.style.animation =
                    `serviceIconFloat ${4.5 + (index % 3) * .6}s ease-in-out infinite`;

                icon.style.animationDelay =
                    `${(index % 4) * -.45}s`;

            }
        );

    }


    /* ========================================================
       CURSOR GLOW
       DESKTOP ONLY
    ======================================================== */

    if (
        window.matchMedia(
            "(pointer: fine)"
        ).matches &&
        !window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches
    ) {

        const glow =
            document.createElement(
                "div"
            );

        glow.className =
            "cursor-glow";

        document.body.appendChild(
            glow
        );


        let glowFrame = null;

        let mouseX = 0;
        let mouseY = 0;


        window.addEventListener(
            "mousemove",
            event => {

                mouseX =
                    event.clientX;

                mouseY =
                    event.clientY;


                if (glowFrame) {
                    return;
                }


                glowFrame =
                    requestAnimationFrame(
                        () => {

                            glow.style.transform =
                                `translate3d(${mouseX}px,${mouseY}px,0)`;


                            glowFrame =
                                null;

                        }
                    );

            },
            {
                passive: true
            }
        );

    }


    /* ========================================================
       PARTICLE BACKGROUND
       LIGHTER + PAUSES WHEN TAB IS HIDDEN
    ======================================================== */

    const particleCanvas =
        document.getElementById(
            "particles"
        );


    if (particleCanvas) {

        const ctx =
            particleCanvas.getContext(
                "2d",
                {
                    alpha: true
                }
            );


        let particles = [];

        let animationFrame = null;

        let particleRunning =
            !document.hidden;


        function getParticleCount() {

            const area =
                window.innerWidth *
                window.innerHeight;


            if (
                window.matchMedia(
                    "(max-width: 600px)"
                ).matches
            ) {

                return 18;

            }


            return Math.min(
                45,
                Math.max(
                    24,
                    Math.round(
                        area / 45000
                    )
                )
            );

        }


        function resizeCanvas() {

            const dpr =
                Math.min(
                    window.devicePixelRatio ||
                    1,
                    1.5
                );


            particleCanvas.width =
                Math.floor(
                    window.innerWidth *
                    dpr
                );


            particleCanvas.height =
                Math.floor(
                    window.innerHeight *
                    dpr
                );


            particleCanvas.style.width =
                window.innerWidth +
                "px";


            particleCanvas.style.height =
                window.innerHeight +
                "px";


            ctx.setTransform(
                dpr,
                0,
                0,
                dpr,
                0,
                0
            );


            const count =
                getParticleCount();


            particles =
                Array.from(
                    {
                        length: count
                    },
                    () => new Particle()
                );

        }


        class Particle {

            constructor() {

                this.reset();

            }


            reset() {

                this.x =
                    Math.random() *
                    window.innerWidth;


                this.y =
                    Math.random() *
                    window.innerHeight;


                this.radius =
                    Math.random() *
                    1.4 +
                    .6;


                this.speedX =
                    (
                        Math.random() -
                        .5
                    ) * .28;


                this.speedY =
                    (
                        Math.random() -
                        .5
                    ) * .28;

            }


            update() {

                this.x +=
                    this.speedX;

                this.y +=
                    this.speedY;


                if (
                    this.x < 0 ||
                    this.x >
                        window.innerWidth
                ) {

                    this.speedX *= -1;

                }


                if (
                    this.y < 0 ||
                    this.y >
                        window.innerHeight
                ) {

                    this.speedY *= -1;

                }

            }


            draw() {

                ctx.beginPath();


                ctx.arc(
                    this.x,
                    this.y,
                    this.radius,
                    0,
                    Math.PI * 2
                );


                ctx.fillStyle =
                    "rgba(6,182,212,.38)";


                ctx.fill();

            }

        }


        function animateParticles() {

            if (!particleRunning) {

                animationFrame =
                    null;

                return;

            }


            ctx.clearRect(
                0,
                0,
                window.innerWidth,
                window.innerHeight
            );


            particles.forEach(
                particle => {

                    particle.update();

                    particle.draw();

                }
            );


            animationFrame =
                requestAnimationFrame(
                    animateParticles
                );

        }


        function startParticles() {

            if (
                particleRunning &&
                !animationFrame
            ) {

                animateParticles();

            }

        }


        function stopParticles() {

            particleRunning =
                false;


            if (animationFrame) {

                cancelAnimationFrame(
                    animationFrame
                );

                animationFrame =
                    null;

            }

        }


        function handleVisibility() {

            particleRunning =
                !document.hidden;


            if (particleRunning) {

                startParticles();

            } else {

                stopParticles();

            }

        }


        resizeCanvas();


        window.addEventListener(
            "resize",
            debounce(
                resizeCanvas,
                180
            ),
            {
                passive: true
            }
        );


        document.addEventListener(
            "visibilitychange",
            handleVisibility
        );


        startParticles();

    }


    /* ========================================================
       FAQ ACCORDION
    ======================================================== */

    const faqItems =
        document.querySelectorAll(
            ".faq-item"
        );


    faqItems.forEach(item => {

        const question =
            item.querySelector(
                ".faq-question"
            );


        if (!question) {
            return;
        }


        question.addEventListener(
            "click",
            () => {

                const isOpen =
                    item.classList.contains(
                        "open"
                    );


                faqItems.forEach(
                    other => {

                        other.classList.remove(
                            "open"
                        );

                    }
                );


                if (!isOpen) {

                    item.classList.add(
                        "open"
                    );

                }

            }
        );

    });


    /* ========================================================
       SMOOTH ANCHOR SCROLL
    ======================================================== */

    document
        .querySelectorAll(
            'a[href^="#"]'
        )
        .forEach(link => {

            link.addEventListener(
                "click",
                event => {

                    const targetId =
                        link.getAttribute(
                            "href"
                        );


                    if (
                        !targetId ||
                        targetId === "#"
                    ) {

                        return;

                    }


                    const target =
                        document.querySelector(
                            targetId
                        );


                    if (!target) {
                        return;
                    }


                    event.preventDefault();


                    target.scrollIntoView({
                        behavior:
                            window.matchMedia(
                                "(prefers-reduced-motion: reduce)"
                            ).matches
                                ? "auto"
                                : "smooth",
                        block: "start"
                    });

                }
            );

        });


    /* ========================================================
       CONTACT / WHATSAPP HELPERS
    ======================================================== */

    const WHATSAPP_NUMBER =
        "27794380103";


    const WHATSAPP_MESSAGE =
`Hi KASITU Webs 👋

I just visited your website and I would like to discuss a project with you.

I would like some advice on the best digital solution for my business.

Please let me know how we can get started. Thank you!`;


    window.openKasituWhatsApp =
        function () {

            const message =
                encodeURIComponent(
                    WHATSAPP_MESSAGE
                );


            const url =
                `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;


            window.open(
                url,
                "_blank",
                "noopener,noreferrer"
            );

        };


    /* ========================================================
       FLOATING WHATSAPP BUTTON
       CLICK = OPEN
       HOLD = DRAG
    ======================================================== */

    const whatsappButton =
        document.getElementById(
            "floating-whatsapp"
        );


    if (whatsappButton) {

        const HOLD_TIME = 450;

        const MOVE_THRESHOLD = 8;


        let holdTimer = null;

        let isHolding = false;

        let isDragging = false;

        let pointerId = null;

        let startX = 0;

        let startY = 0;

        let startLeft = 0;

        let startTop = 0;


        function clearHoldTimer() {

            if (holdTimer) {

                clearTimeout(
                    holdTimer
                );

                holdTimer = null;

            }

        }


        function keepInsideScreen(
            left,
            top
        ) {

            const width =
                whatsappButton.offsetWidth;

            const height =
                whatsappButton.offsetHeight;


            return {

                left: Math.max(
                    8,
                    Math.min(
                        left,
                        window.innerWidth -
                        width -
                        8
                    )
                ),

                top: Math.max(
                    8,
                    Math.min(
                        top,
                        window.innerHeight -
                        height -
                        8
                    )
                )

            };

        }


        whatsappButton.addEventListener(
            "pointerdown",
            event => {

                if (
                    event.pointerType ===
                        "mouse" &&
                    event.button !== 0
                ) {

                    return;

                }


                pointerId =
                    event.pointerId;


                startX =
                    event.clientX;

                startY =
                    event.clientY;


                const rect =
                    whatsappButton
                        .getBoundingClientRect();


                startLeft =
                    rect.left;

                startTop =
                    rect.top;


                isHolding = false;

                isDragging = false;


                clearHoldTimer();


                holdTimer =
                    setTimeout(
                        () => {

                            isHolding = true;


                            whatsappButton
                                .style.left =
                                startLeft +
                                "px";


                            whatsappButton
                                .style.top =
                                startTop +
                                "px";


                            whatsappButton
                                .style.right =
                                "auto";


                            whatsappButton
                                .style.bottom =
                                "auto";


                            whatsappButton
                                .classList.add(
                                    "is-holding"
                                );


                            if (
                                whatsappButton
                                    .setPointerCapture
                            ) {

                                try {

                                    whatsappButton
                                        .setPointerCapture(
                                            pointerId
                                        );

                                } catch (_) {}

                            }

                        },
                        HOLD_TIME
                    );

            }
        );


        whatsappButton.addEventListener(
            "pointermove",
            event => {

                if (
                    pointerId !==
                    event.pointerId
                ) {

                    return;

                }


                const deltaX =
                    event.clientX -
                    startX;


                const deltaY =
                    event.clientY -
                    startY;


                if (
                    !isHolding &&
                    (
                        Math.abs(
                            deltaX
                        ) >
                            MOVE_THRESHOLD ||
                        Math.abs(
                            deltaY
                        ) >
                            MOVE_THRESHOLD
                    )
                ) {

                    clearHoldTimer();

                    return;

                }


                if (!isHolding) {
                    return;
                }


                if (!isDragging) {

                    isDragging = true;


                    whatsappButton
                        .classList.remove(
                            "is-holding"
                        );


                    whatsappButton
                        .classList.add(
                            "is-dragging"
                        );

                }


                const position =
                    keepInsideScreen(
                        startLeft +
                            deltaX,
                        startTop +
                            deltaY
                    );


                whatsappButton.style.left =
                    position.left +
                    "px";


                whatsappButton.style.top =
                    position.top +
                    "px";


                event.preventDefault();

            },
            {
                passive: false
            }
        );


        whatsappButton.addEventListener(
            "pointerup",
            event => {

                if (
                    pointerId !==
                    event.pointerId
                ) {

                    return;

                }


                const wasHeld =
                    isHolding ||
                    isDragging;


                clearHoldTimer();


                whatsappButton
                    .classList.remove(
                        "is-holding",
                        "is-dragging"
                    );


                isHolding = false;

                isDragging = false;

                pointerId = null;


                if (!wasHeld) {

                    window.openKasituWhatsApp();

                }

            }
        );


        whatsappButton.addEventListener(
            "pointercancel",
            () => {

                clearHoldTimer();


                whatsappButton
                    .classList.remove(
                        "is-holding",
                        "is-dragging"
                    );


                isHolding = false;

                isDragging = false;

                pointerId = null;

            }
        );


        window.addEventListener(
            "resize",
            () => {

                if (
                    !whatsappButton.style.left
                ) {

                    return;

                }


                const rect =
                    whatsappButton
                        .getBoundingClientRect();


                const position =
                    keepInsideScreen(
                        rect.left,
                        rect.top
                    );


                whatsappButton.style.left =
                    position.left +
                    "px";


                whatsappButton.style.top =
                    position.top +
                    "px";

            },
            {
                passive: true
            }
        );


        whatsappButton.addEventListener(
            "keydown",
            event => {

                if (
                    event.key === "Enter" ||
                    event.key === " "
                ) {

                    event.preventDefault();

                    window.openKasituWhatsApp();

                }

            }
        );

    }


    /* ========================================================
       EMAILJS
       Keep initialization lightweight
    ======================================================== */

    if (
        typeof emailjs !== "undefined"
    ) {

        try {

            emailjs.init({
                publicKey:
                    "YOUR_EMAILJS_PUBLIC_KEY"
            });

        } catch (error) {

            console.warn(
                "EmailJS initialization failed:",
                error
            );

        }

    }


    /* ========================================================
       CONTACT FORM
    ======================================================== */

    const contactForm =
        document.querySelector(
            "#contact-form"
        );


    if (contactForm) {

        contactForm.addEventListener(
            "submit",
            async event => {

                event.preventDefault();


                const submitButton =
                    contactForm.querySelector(
                        '[type="submit"]'
                    );


                const originalText =
                    submitButton
                        ? submitButton.innerHTML
                        : "";


                if (submitButton) {

                    submitButton.disabled =
                        true;

                    submitButton.innerHTML =
                        `
                        <i class="fas fa-spinner fa-spin"></i>
                        Sending...
                        `;

                }


                try {

                    if (
                        typeof emailjs ===
                        "undefined"
                    ) {

                        throw new Error(
                            "Email service unavailable."
                        );

                    }


                    /*
                       IMPORTANT:
                       Keep your existing EmailJS
                       service/template IDs here.
                    */

                    await emailjs.sendForm(
                        "YOUR_EMAILJS_SERVICE_ID",
                        "YOUR_EMAILJS_TEMPLATE_ID",
                        contactForm
                    );


                    contactForm.reset();


                    alert(
                        "Thank you! Your message has been sent successfully."
                    );


                } catch (error) {

                    console.error(
                        "Contact form error:",
                        error
                    );


                    alert(
                        "Sorry, we could not send your message right now. Please contact us directly via WhatsApp or email."
                    );


                } finally {

                    if (submitButton) {

                        submitButton.disabled =
                            false;

                        submitButton.innerHTML =
                            originalText;

                    }

                }

            }
        );

    }


    /* ========================================================
       PERFORMANCE CLEANUP
    ======================================================== */

    /*
       Remove expensive hover animations from touch devices.
       CSS also handles this, but this prevents unnecessary
       JavaScript work if other scripts target these elements.
    */

    if (
        window.matchMedia(
            "(pointer: coarse)"
        ).matches
    ) {

        document.documentElement
            .classList.add(
                "touch-device"
            );

    }


    /* ========================================================
       PAGE LOAD COMPLETE
    ======================================================== */

    window.requestAnimationFrame(
        () => {

            document.documentElement
                .classList.add(
                    "page-ready"
                );

        }
    );

});
