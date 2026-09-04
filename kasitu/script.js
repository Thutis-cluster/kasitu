/*==================================================
KASITU WEBS V2
Premium Portfolio Script
Version 2.0
==================================================*/

'use strict';

/*==================================================
KASITU EMAILJS CONFIGURATION
==================================================*/

const EMAILJS_PUBLIC_KEY = "a3wBtn2bKfskDS4Sa";
const EMAILJS_SERVICE_ID = "service_9a3fush";
const EMAILJS_TEMPLATE_ID = "template_3lwzm3g";

if (typeof emailjs !== "undefined") {

   emailjs.init({
    publicKey: EMAILJS_PUBLIC_KEY
});

    console.log("EmailJS initialized ✔");

} else {

    console.error(
        "EmailJS library was not loaded."
    );

}

/*==================================================
SELECTORS
==================================================*/

const header = document.querySelector('.header');
const navLinks = document.querySelectorAll('.nav-links a');
const sections = document.querySelectorAll('section');
const counters = document.querySelectorAll('.counter');
const scrollTopBtn = document.getElementById('scrollTop');
const menuBtn = document.querySelector('.menu-btn');
const mobileMenu = document.querySelector('.nav-links');
const themeToggle = document.getElementById('theme-toggle');

/*==================================================
HELPERS
==================================================*/

const debounce = (callback, delay = 100) => {
    let timer;

    return (...args) => {
        clearTimeout(timer);

        timer = setTimeout(() => {
            callback(...args);
        }, delay);
    };
};

const clamp = (value, min, max) => {
    return Math.min(Math.max(value, min), max);
};

/*==================================================
PERFORMANCE HELPERS
==================================================*/

const rafThrottle = (callback) => {
    let frame = null;
    let lastArgs;
    return (...args) => {
        lastArgs = args;
        if (frame !== null) return;
        frame = requestAnimationFrame(() => {
            frame = null;
            callback(...lastArgs);
        });
    };
};


/*==================================================
SMOOTH SCROLL
==================================================*/

navLinks.forEach(link => {

    link.addEventListener("click", function (e) {

        const href = this.getAttribute("href");

        if (!href.startsWith("#")) return;

        e.preventDefault();

        const target = document.querySelector(href);

        if (!target) return;

        target.scrollIntoView({

            behavior: "smooth",

            block: "start"

        });

    });

});

/*==================================================
ACTIVE NAVIGATION
==================================================*/

function highlightNavigation() {

    let current = "";

    sections.forEach(section => {

        const top = window.scrollY;

        const offset = section.offsetTop - 180;

        const height = section.offsetHeight;

        if (top >= offset && top < offset + height) {

            current = section.getAttribute("id");

        }

    });

    navLinks.forEach(link => {

        link.classList.remove("active");

        if (link.getAttribute("href") === "#" + current) {

            link.classList.add("active");

        }

    });

}

/*==================================================
SCROLL TO TOP
==================================================*/

if (scrollTopBtn) {

    scrollTopBtn.addEventListener("click", () => {

        window.scrollTo({

            top: 0,

            behavior: "smooth"

        });

    });

}

/*==================================================
SCROLL BUTTON VISIBILITY
==================================================*/

function updateScrollButton() {

    if (!scrollTopBtn) return;

    scrollTopBtn.style.opacity =
        window.scrollY > 400 ? "1" : "0";

    scrollTopBtn.style.pointerEvents =
        window.scrollY > 400 ? "auto" : "none";

}

/*==================================================
COUNTER ANIMATION
==================================================*/

const counterObserver = new IntersectionObserver(entries => {

    entries.forEach(entry => {

        if (!entry.isIntersecting) return;

        const counter = entry.target;

        const target = Number(counter.dataset.target);

        let value = 0;

        const speed = target / 120;

        const animate = () => {

            value += speed;

            if (value < target) {

                counter.textContent = Math.floor(value);

                requestAnimationFrame(animate);

            } else {

                counter.textContent = target;

            }

        };

        animate();

        counterObserver.unobserve(counter);

    });

}, {

    threshold: 0.4

});

counters.forEach(counter => {

    counterObserver.observe(counter);

});

/*==================================================
SCROLL REVEAL
==================================================*/

const revealElements = document.querySelectorAll(

    ".service-card,.project-card,.price-card,.testimonial-card,.tech-card,.feature,.stat-card"

);

const revealObserver = new IntersectionObserver(entries => {

    entries.forEach(entry => {

        if (entry.isIntersecting) {

            entry.target.classList.add("show");

        }

    });

}, {

    threshold: 0.15

});

revealElements.forEach(item => {

    item.classList.add("hidden");

    revealObserver.observe(item);

});

/*==================================================
END OF PART 1
==================================================*/

/*==================================================
PART 2
Dark Mode
Mobile Menu
Typewriter
Cursor Glow
Magnetic Buttons
==================================================*/

/*==================================================
THEME SYSTEM
==================================================*/

const THEME_KEY = "kasitu-theme";

function applyTheme(theme) {

    document.documentElement.setAttribute("data-theme", theme);

    if (themeToggle) {

        themeToggle.textContent =
            theme === "light" ? "☀️" : "🌙";

    }

}

function loadTheme() {

    const savedTheme =
        localStorage.getItem(THEME_KEY) || "dark";

    applyTheme(savedTheme);

}

function toggleTheme() {

    const currentTheme =
        document.documentElement.getAttribute("data-theme") || "dark";

    const nextTheme =
        currentTheme === "dark" ? "light" : "dark";

    applyTheme(nextTheme);

    localStorage.setItem(THEME_KEY, nextTheme);

}

if (themeToggle) {

    themeToggle.addEventListener("click", toggleTheme);

}

loadTheme();

/*==================================================
MOBILE MENU
==================================================*/

if (menuBtn && mobileMenu) {

    menuBtn.addEventListener("click", () => {

       const isOpen = mobileMenu.classList.toggle("mobile-open");

menuBtn.setAttribute(
    "aria-expanded",
    isOpen
);

        menuBtn.classList.toggle("open");

    });

    navLinks.forEach(link => {

        link.addEventListener("click", () => {

            mobileMenu.classList.remove("mobile-open");

            menuBtn.classList.remove("open");

        });

    });

}

/*==================================================*
 * CLOSE MOBILE MENU ON SCROLL
 *==================================================*/



/*==================================================*
 * CLOSE MOBILE MENU ON DESKTOP
 *==================================================*/

window.addEventListener("resize", () => {

    if (!mobileMenu || !menuBtn) return;

    if (window.innerWidth > 900) {

        mobileMenu.classList.remove("mobile-open");
        menuBtn.classList.remove("open");
        menuBtn.setAttribute("aria-expanded", "false");

    }

});

/*==================================================*
 * CLOSE MOBILE MENU WHEN CLICKING OUTSIDE
 *==================================================*/

document.addEventListener("click", (e) => {

    if (!mobileMenu || !menuBtn) return;

    if (
        mobileMenu.classList.contains("mobile-open") &&
        !mobileMenu.contains(e.target) &&
        !menuBtn.contains(e.target)
    ) {

        mobileMenu.classList.remove("mobile-open");
        menuBtn.classList.remove("open");
        menuBtn.setAttribute("aria-expanded", "false");

    }

});

/*==================================================
TYPEWRITER EFFECT
==================================================*/

const codeWindow =
document.querySelector(".code");

if (codeWindow) {

const codeLines = [

'const company = "KASITU Webs";',

"",

"buildWebsite(client);",

"deployCloud();",

"optimisePerformance();",

"",

"console.log('Success ✔');"

];

let line = 0;

let character = 0;

let output = "";

function typeCode() {

if (line >= codeLines.length) {

setTimeout(() => {

output = "";

line = 0;

character = 0;

codeWindow.innerHTML = "";

typeCode();

}, 2500);

return;

}

const current = codeLines[line];

if (character < current.length) {

output += current.charAt(character);

codeWindow.innerHTML =
output.replace(/\n/g, "<br>") +
'<span class="cursor">|</span>';

character++;

setTimeout(typeCode, 45);

} else {

output += "\n";

line++;

character = 0;

setTimeout(typeCode, 250);

}

}

typeCode();

}

/*==================================================
KASITU WEBS — PERFORMANCE OPTIMIZED JS
==================================================*/

(() => {
    "use strict";

    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    const smallScreen = window.matchMedia(
        "(max-width: 768px)"
    ).matches;

    /*==================================================
    1. FLOATING SERVICE ICONS
    Lightweight CSS-style motion
    No permanent JavaScript animation loop
    ==================================================*/

    const serviceIcons = document.querySelectorAll(".service-icon");

    if (!reducedMotion) {
        serviceIcons.forEach((icon, index) => {
            icon.style.setProperty(
                "--float-delay",
                `${index * 0.15}s`
            );
        });
    }


    /*==================================================
    2. PARTICLES
    Reduced count + automatically pauses while scrolling
    ==================================================*/

    const canvas = document.getElementById("particles");

    if (canvas && !reducedMotion) {

        const ctx = canvas.getContext("2d", {
            alpha: true
        });

        let particles = [];
        let particleFrame = null;
        let scrolling = false;
        let scrollTimer = null;

        const particleCount = smallScreen ? 12 : 25;

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }

        function createParticles() {

            particles = [];

            for (let i = 0; i < particleCount; i++) {

                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    size: Math.random() * 2 + 0.5,
                    speedX: (Math.random() - 0.5) * 0.25,
                    speedY: (Math.random() - 0.5) * 0.25
                });
            }
        }

        function drawParticles() {

            if (scrolling) {
                particleFrame = null;
                return;
            }

            ctx.clearRect(
                0,
                0,
                canvas.width,
                canvas.height
            );

            particles.forEach(p => {

                p.x += p.speedX;
                p.y += p.speedY;

                if (p.x < 0) p.x = canvas.width;
                if (p.x > canvas.width) p.x = 0;

                if (p.y < 0) p.y = canvas.height;
                if (p.y > canvas.height) p.y = 0;

                ctx.beginPath();

                ctx.arc(
                    p.x,
                    p.y,
                    p.size,
                    0,
                    Math.PI * 2
                );

                ctx.fill();
            });

            particleFrame = requestAnimationFrame(drawParticles);
        }

        function startParticles() {

            if (
                particleFrame === null &&
                !scrolling
            ) {
                particleFrame =
                    requestAnimationFrame(drawParticles);
            }
        }

        function stopParticles() {

            if (particleFrame !== null) {

                cancelAnimationFrame(
                    particleFrame
                );

                particleFrame = null;
            }
        }

        function handleScroll() {

            scrolling = true;

            stopParticles();

            clearTimeout(scrollTimer);

            scrollTimer = setTimeout(() => {

                scrolling = false;

                startParticles();

            }, 180);
        }

        resizeCanvas();
        createParticles();

        window.addEventListener(
            "resize",
            () => {
                resizeCanvas();
                createParticles();
            },
            { passive: true }
        );

        window.addEventListener(
            "scroll",
            handleScroll,
            { passive: true }
        );

        startParticles();
    }


    /*==================================================
    3. CURSOR GLOW
    Disabled on touch devices and small screens
    ==================================================*/

    if (
        !reducedMotion &&
        !smallScreen &&
        window.matchMedia("(pointer: fine)").matches
    ) {

        const glow = document.querySelector(
            ".cursor-glow"
        );

        if (glow) {

            let mouseX = 0;
            let mouseY = 0;
            let glowX = 0;
            let glowY = 0;
            let glowFrame = null;

            window.addEventListener(
                "mousemove",
                e => {

                    mouseX = e.clientX;
                    mouseY = e.clientY;

                    if (!glowFrame) {

                        glowFrame =
                            requestAnimationFrame(() => {

                                glowX +=
                                    (mouseX - glowX) * 0.18;

                                glowY +=
                                    (mouseY - glowY) * 0.18;

                                glow.style.transform =
                                    `translate3d(
                                        ${glowX}px,
                                        ${glowY}px,
                                        0
                                    )`;

                                glowFrame = null;
                            });
                    }

                },
                { passive: true }
            );
        }
    }


    /*==================================================
    4. OPTIMIZED SCROLL UI
    Only ONE scroll listener
    ==================================================*/

    let scrollFrame = null;

    function updateScrollUI() {

        scrollFrame = null;

        const scrollY = window.scrollY;

        /* Header */

        const header =
            document.querySelector("header");

        if (header) {

            header.classList.toggle(
                "scrolled",
                scrollY > 50
            );
        }


        /* Progress bar */

        const progress =
            document.querySelector(
                ".scroll-progress"
            );

        if (progress) {

            const maxScroll =
                document.documentElement.scrollHeight -
                window.innerHeight;

            const percentage =
                maxScroll > 0
                    ? (scrollY / maxScroll) * 100
                    : 0;

            progress.style.width =
                `${percentage}%`;
        }


        /* Back-to-top button */

        const scrollButton =
            document.querySelector(
                "#scrollTop, .scroll-top"
            );

        if (scrollButton) {

            scrollButton.classList.toggle(
                "show",
                scrollY > 500
            );
        }
    }

    window.addEventListener(
        "scroll",
        () => {

            if (!scrollFrame) {

                scrollFrame =
                    requestAnimationFrame(
                        updateScrollUI
                    );
            }
        },
        { passive: true }
    );


    /*==================================================
    5. DISABLE HEAVY 3D EFFECTS ON TOUCH DEVICES
    ==================================================*/

    if (
        smallScreen ||
        !window.matchMedia("(pointer: fine)").matches
    ) {

        document
            .querySelectorAll(".project-card")
            .forEach(card => {

                card.style.transform = "none";
            });
    }


    /*==================================================
    6. PAUSE EXPENSIVE EFFECTS WHEN TAB IS HIDDEN
    ==================================================*/

    document.addEventListener(
        "visibilitychange",
        () => {

            if (
                document.hidden &&
                typeof particleFrame !== "undefined" &&
                particleFrame
            ) {
                cancelAnimationFrame(
                    particleFrame
                );
            }
        }
    );

})();

/*==================================================
MAGNETIC BUTTONS
==================================================*/

const magneticButtons =
document.querySelectorAll(
".primary-btn,.secondary-btn"
);

magneticButtons.forEach(button => {

button.addEventListener("mousemove", e => {

const rect = button.getBoundingClientRect();

const x =
e.clientX - rect.left - rect.width / 2;

const y =
e.clientY - rect.top - rect.height / 2;

button.style.transform =
`translate(${x * .18}px, ${y * .18}px)`;

});

button.addEventListener("mouseleave", () => {

button.style.transform = "";

});

});


/*==================================================
PAGE LOADED
==================================================*/

window.addEventListener("load", () => {

document.body.classList.add("loaded");

});

console.log(
"%cKASITU Webs",
"color:#06B6D4;font-size:24px;font-weight:bold;"
);

console.log(
"%cPremium Portfolio Loaded Successfully ✔",
"color:#63ff99;font-size:14px;"
);

/*==================================================
PROJECT DETAILS MODAL
==================================================*/

const projectModal =
    document.getElementById("project-modal");

const projectModalClose =
    document.getElementById("project-modal-close");

const projectModalBackdrop =
    document.querySelector(
        ".project-modal-backdrop"
    );

const projectModalTitle =
    document.getElementById(
        "project-modal-title"
    );

const projectModalTag =
    document.getElementById(
        "project-modal-tag"
    );

const projectModalDescription =
    document.getElementById(
        "project-modal-description"
    );

const projectModalFeatures =
    document.getElementById(
        "project-modal-features"
    );

const projectModalTech =
    document.getElementById(
        "project-modal-tech"
    );

const projectModalLink =
    document.getElementById(
        "project-modal-link"
    );


/*==================================================
PROJECT DATA
==================================================*/

const projectData = {

    mumsy: {

        title:
            "Mumsy Braids Studio",

        tag:
            "Online Booking Management System",

        description:
            "A professional online booking platform developed for Mumsy Braids Studio. The website makes it easier for customers to browse hairstyles, select their preferred hair length, choose an appointment date and time, provide their details, complete their booking and get notifications and reminders via Sms, WhatsApp and E-Mails.",

        features: [

            "Online appointment booking",

            "Hairstyle selection",

            "Hair-length selection",

            "Appointment date selection",

            "Available time selection",

            "Customer information capture",

            "Booking review and confirmation",

            "Deposit payment",

            "Calendar integration",

            "Owner and Customer Notifications and Reminders",

            "Admin Dashboard",

            "Responsive mobile-friendly experience"

        ],

        technologies: [

            "HTML5",

            "CSS3",

            "JavaScript",

           "MangoesDB",

            "Twilio",

            "Paystack"

        ],

        url:
            "https://mumsybraidsstudio.co.za/"

    },


    store: {

        title:
            "Local Store Website",

        tag:
            "Business Website",

        description:
            "A simple business website created for a local store selling vegetables, chicken, chicken feeds, eggs, dog food and tissues. The website gives the business an online presence, allows customers to see what is available in the store and helps customers find the physical store and contact details.",

        features: [

            "Product showcase",

            "Product Categories",

            "Business information",

            "Store location information",

           "Business contact information",

            "Customer-friendly navigation",

            "Mobile-friendly website"

        ],

        technologies: [

            "WordPress",

            "CSS3",

            "JavaScript",

            "Responsive Design"

        ],

        url:
            "https://kasitu.free.nf/?i=2"

    }

};


/*==================================================
OPEN MODAL
==================================================*/

function openProjectModal(projectId) {

    const project =
        projectData[projectId];

    if (!project) return;


    projectModalTitle.textContent =
        project.title;

    projectModalTag.textContent =
        project.tag;

    projectModalDescription.textContent =
        project.description;


    /* FEATURES */

    projectModalFeatures.innerHTML = "";

    project.features.forEach(
        feature => {

            const li =
                document.createElement("li");

            li.textContent =
                feature;

            projectModalFeatures.appendChild(li);

        }
    );


    /* TECHNOLOGIES */

    projectModalTech.innerHTML = "";

    project.technologies.forEach(
        technology => {

            const span =
                document.createElement("span");

            span.textContent =
                technology;

            projectModalTech.appendChild(span);

        }
    );


    /* WEBSITE LINK */

    projectModalLink.href =
        project.url;


    /* SHOW */

   projectModal.classList.add("active");

projectModal.setAttribute(
    "aria-hidden",
    "false"
);

/* LOCK THE ENTIRE PAGE */

document.documentElement.classList.add(
    "project-modal-open"
);

document.body.classList.add(
    "project-modal-open"
);


/* Prevent background scrolling */

document.body.style.overflow = "hidden";

    /* FOCUS */

    setTimeout(() => {

        projectModalClose.focus();

    }, 100);

}


/*==================================================
CLOSE MODAL
==================================================*/

function closeProjectModal() {

    projectModal.classList.remove("active");

    projectModal.setAttribute(
        "aria-hidden",
        "true"
    );


    /* UNLOCK ENTIRE PAGE */

    document.documentElement.classList.remove(
        "project-modal-open"
    );

    document.body.classList.remove(
        "project-modal-open"
    );


    document.body.style.overflow = "";

}

/*==================================================
DETAIL BUTTONS
==================================================*/

document
    .querySelectorAll(
        ".project-details-btn"
    )
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const projectId =
                    button.dataset.project;

                openProjectModal(
                    projectId
                );

            }
        );

    });


/*==================================================
CLOSE BUTTON
==================================================*/

if (projectModalClose) {
    projectModalClose.addEventListener("click", closeProjectModal);
}


/*==================================================
CLICK BACKDROP TO CLOSE
==================================================*/

if (projectModalBackdrop) {
    projectModalBackdrop.addEventListener("click", closeProjectModal);
}


/*==================================================
ESCAPE KEY
==================================================*/

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Escape" &&
            projectModal.classList.contains(
                "active"
            )
        ) {

            closeProjectModal();

        }

    }
);

/*==================================================
END PART 2
==================================================*/

/*==================================================
PART 3
Calculator
Progress Bar
Toast
Validation
WhatsApp Quote
==================================================*/


/* ==========================================
   LIVE PRICE CALCULATOR
========================================== */

/*==================================================
LIVE PRICE CALCULATOR
==================================================*/

const packagePrices = {
    
"Starter Website": 2999,

"Business Website": 4999,

"Online Store": 5999,

"Online Store Premium": 7999

};

const packageButtons =
document.querySelectorAll(".select-price");

const packageInput =
document.getElementById("site-type");

const extraInputs =
document.querySelectorAll(".extra");

const totalElement =
document.getElementById("total");

const calculatorForm =
document.getElementById("price-form");

let selectedPackage = "";

let currentTotal = 0;

/*==================================================
RECOMMENDED EXTRAS

IMPORTANT:
These are ONLY highlighted.
They are NOT automatically selected.
==================================================*/

const recommendedExtras = {

"Starter Website": [

    "seo",
    "whatsapp",
    "blog"

],

"Business Website": [

    "app",
    "seo",
    "booking",
    "dashboard",
    "login"

],

"Online Store": [

    "app",
    "login"

],

"Online Store Premium": [

    "app",
    "dashboard",
    "login"

]

};

/*==================================================
FORMAT CURRENCY
==================================================*/

function formatCurrency(value) {

return "R" +
    Number(value).toLocaleString("en-ZA");

}

/*==================================================
CALCULATE TOTAL
==================================================*/

function calculateTotal() {
    
let total =
    packagePrices[selectedPackage] || 0;


extraInputs.forEach(extra => {

    if (extra.checked) {

        const extraPrice =
            Number(extra.dataset.price) || 0;

        total += extraPrice;

    }

});


return total;
    
}

/*==================================================
UPDATE TOTAL
==================================================*/

function updatePrice() {

const total =
    calculateTotal();

animatePrice(total);

}

/*==================================================
ANIMATE PRICE
==================================================*/

function animatePrice(target) {

if (!totalElement) return;


const start =
    currentTotal;

const difference =
    target - start;

const duration =
    400;

const startTime =
    performance.now();


function animate(currentTime) {

    const elapsed =
        currentTime - startTime;


    const progress =
        Math.min(
            elapsed / duration,
            1
        );


    const value =
        start +
        difference * progress;


    totalElement.textContent =
        formatCurrency(
            Math.round(value)
        );


    if (progress < 1) {

        requestAnimationFrame(
            animate
        );

    } else {

        currentTotal =
            target;

    }

}


requestAnimationFrame(
    animate
);

}

/*==================================================
HIGHLIGHT RECOMMENDED EXTRAS
==================================================*/

function updateRecommendedExtras() {

/* Remove old recommendations */

extraInputs.forEach(extra => {

    const option =
        extra.closest(".extra-option");

    if (!option) return;

    option.classList.remove(
        "recommended"
    );

});


/* Get recommendations */

const recommendations =
    recommendedExtras[
        selectedPackage
    ] || [];


/* Highlight recommendations */

extraInputs.forEach(extra => {

    const extraType =
        extra.dataset.extra;


    if (
        recommendations.includes(
            extraType
        )
    ) {

        const option =
            extra.closest(
                ".extra-option"
            );


        if (!option) return;


        option.classList.add(
            "recommended"
        );

    }

});

}

/*==================================================
   SELECT PACKAGE
==================================================*/

packageButtons.forEach(button => {

    button.addEventListener("click", function () {

        const card = this.closest(".price-card");

        if (!card) return;

        const heading = card.querySelector("h3");

        if (!heading) return;

        /* ------------------------------------------
           SAVE SELECTED PACKAGE
        ------------------------------------------ */

        selectedPackage = heading.textContent.trim();


        /* ------------------------------------------
           PUT PACKAGE INTO CALCULATOR
        ------------------------------------------ */

        if (packageInput) {
            packageInput.value = selectedPackage;
        }


        /* ------------------------------------------
           RECALCULATE PRICE
        ------------------------------------------ */

        updatePrice();


        /* ------------------------------------------
           HIGHLIGHT RECOMMENDED EXTRAS
        ------------------------------------------ */

        updateRecommendedExtras();


        /* ------------------------------------------
           NOTIFY USER
        ------------------------------------------ */

        if (typeof showToast === "function") {

            showToast(
                selectedPackage + " selected ✓"
            );

        }


        /* ------------------------------------------
           SMOOTH SCROLL TO TOP OF LIVE ESTIMATE
           This keeps the LIVE ESTIMATE heading at the
           top while showing the package + extras below.
        ------------------------------------------ */

/* ------------------------------------------
   SMOOTH SCROLL TO TOP OF LIVE ESTIMATE
   ------------------------------------------ */

/* ------------------------------------------
   SMOOTH SCROLL TO TOP OF LIVE ESTIMATE
   ------------------------------------------ */

const liveEstimate = document.getElementById("live-estimate");

if (liveEstimate) {

    setTimeout(() => {

        const header = document.querySelector(".header");

        const headerOffset =
            header ? header.offsetHeight + 15 : 15;

        const targetTop =
            liveEstimate.getBoundingClientRect().top +
            window.scrollY -
            headerOffset;

        window.scrollTo({
            top: Math.max(0, targetTop),
            behavior: "smooth"
        });

    }, 100);

}

    });

});

/*==================================================
EXTRA FEATURE CHANGES
==================================================*/

extraInputs.forEach(extra => {

extra.addEventListener(
    "change",
    () => {

        updatePrice();

    }
);

});

/*==================================================
CONTINUE BUTTON
==================================================*/

const continueButton =
document.getElementById(
"whatsapp-btn"
);

if (continueButton) {

continueButton.addEventListener(
    "click",
    function () {


        /* No package selected */

        if (!selectedPackage) {

            if (
                typeof showToast ===
                "function"
            ) {

                showToast(
                    "Please select a package to proceed."
                );

            } else {

                alert(
                    "Please select a package to proceed."
                );

            }

            return;

        }

        /* Make sure latest price is calculated */

        currentTotal =
            calculateTotal();

        /* Find contact form */

        const contactSection =
            document.getElementById(
                "contact"
            );


        const contactForm =
            document.getElementById(
                "contact-form"
            );


        /* Tell user what happened */

        if (
            typeof showToast ===
            "function"
        ) {

            showToast(

                selectedPackage +
                " selected ✓ Scroll down to complete your proposal."

            );

        }

        /* Smooth scroll */

        if (contactSection) {

            contactSection.scrollIntoView({

                behavior: "smooth",

                block: "start"

            });

        }

        /* Put selected package into form */

        if (packageInput) {

            packageInput.value =
                selectedPackage;

        }


        /* Highlight name field */

        if (contactForm) {

            setTimeout(() => {

                const nameInput =
                    contactForm.querySelector(
                        'input[name="name"]'
                    );


                if (nameInput) {

                    nameInput.classList.add(
                        "form-highlight"
                    );


                    nameInput.focus();


                    setTimeout(() => {

                        nameInput.classList.remove(
                            "form-highlight"
                        );

                    }, 3000);

                }

            }, 900);

        }

    }
);

}

/*==================================================
INITIAL STATE
==================================================*/

if (totalElement) {

totalElement.textContent =
    "R0";

}

console.log(
"KASITU Calculator Loaded ✓"
);

/*==================================================
WHATSAPP QUOTE
==================================================*/

/*==================================================
CONTINUE → CONTACT FORM
==================================================*/

const whatsappBtn =
    document.getElementById("whatsapp-btn");

const contactSection =
    document.getElementById("contact");

const contactForm =
    document.getElementById("contact-form");

const nameInput =
    contactForm?.querySelector('input[name="name"]');

if (whatsappBtn) {

    whatsappBtn.addEventListener("click", function(e) {

        e.preventDefault();

        e.stopPropagation();

        /* ==========================================
           NO PACKAGE
        ========================================== */

        if (!selectedPackage) {

            showToast(
                "Please select a package to proceed."
            );

            /* Take the user back to packages */
            const pricingSection =
                document.getElementById("pricing");

if (pricingSection) {

    const header = document.querySelector(".header");

    const headerOffset =
        header ? header.offsetHeight + 15 : 15;

    const targetTop =
        pricingSection.getBoundingClientRect().top +
        window.scrollY -
        headerOffset;

    window.scrollTo({
        top: Math.max(0, targetTop),
        behavior: "smooth"
    });

}

            return;

        }

        /* ==========================================
           PACKAGE SELECTED
        ========================================== */

        showToast(
            `${selectedPackage} selected ✓ — Please tell us about your project.`
        );

        /* ==========================================
           SCROLL TO CONTACT
        ========================================== */

        if (contactSection) {

            contactSection.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        }

        /* ==========================================
           FOCUS NAME FIELD AFTER SCROLL
        ========================================== */

        setTimeout(() => {

            if (nameInput) {

                nameInput.focus();

                nameInput.classList.add(
                    "input-attention"
                );

                setTimeout(() => {

                    nameInput.classList.remove(
                        "input-attention"
                    );

                }, 2500);

            }

        }, 900);

    });

}


/*==================================================
TOAST
==================================================*/

function showToast(message){

let toast=

document.createElement("div");

toast.className="toast";

toast.textContent=message;

document.body.appendChild(toast);

setTimeout(()=>{

toast.classList.add("show");

},100);

setTimeout(()=>{

toast.classList.remove("show");

setTimeout(()=>{

toast.remove();

},400);

},2500);

}

/*==================================================
INPUT SANITIZER
==================================================*/

function sanitizeInput(value) {

    return value.replace(/[<>]/g, "");

}

document
.querySelectorAll("input, textarea")
.forEach(input => {

    input.addEventListener("input", () => {

        const cursorPosition = input.selectionStart;

        input.value = sanitizeInput(input.value);

        input.setSelectionRange(
            cursorPosition,
            cursorPosition
        );

    });

});

/*==================================================
END PART 3
==================================================*/

/*==================================================
PART 4
Premium Interactions
==================================================*/

/*==================================================
KASITU — LIGHTWEIGHT PROJECT CARD EFFECT
==================================================*/

const projectCards =
    document.querySelectorAll(".project-card");

if (
    window.matchMedia("(pointer: fine)").matches &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
) {
    projectCards.forEach(card => {

        card.addEventListener(
            "mouseenter",
            () => {
                card.classList.add("card-hover");
            }
        );

        card.addEventListener(
            "mouseleave",
            () => {
                card.classList.remove("card-hover");
            }
        );

    });
}


/*==================================================
EMAIL FORM
==================================================*/

/*==================================================
KASITU PROPOSAL REQUEST SYSTEM
EmailJS + WhatsApp + Optional Quotation
==================================================*/

const proposalForm =
    document.getElementById("contact-form");

let lastSubmit = 0;


/*==================================================
COUNT WORDS
==================================================*/

function countWords(text) {

    return text
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .length;

}


/*==================================================
GET SELECTED EXTRAS
==================================================*/

function getSelectedExtras() {

    const selected = [];

    extraInputs.forEach(extra => {

        if (extra.checked) {

            const option =
                extra.closest(".extra-option");

            let label = "";

            if (option) {

                label =
                    option.textContent
                        .replace(/\s+/g, " ")
                        .trim();

            } else {

                label =
                    extra.parentElement
                        ? extra.parentElement.textContent
                            .replace(/\s+/g, " ")
                            .trim()
                        : extra.dataset.extra || "";

            }

            if (label) {

                selected.push(label);

            }

        }

    });

    return selected;

}


/*==================================================
BUILD WHATSAPP MESSAGE
==================================================*/

function buildWhatsAppMessage(customer) {

    const selectedExtras =
        getSelectedExtras();

    const packageText =
        selectedPackage || "Package not selected";

    const totalText =
        selectedPackage
            ? formatCurrency(currentTotal)
            : "To be discussed";

    return `Hello KASITU Webs 👋

I would like to request information about a website/project.

Name:
${customer.name}

Email:
${customer.email}

Phone:
${customer.phone}

Company:
${customer.company || "Not provided"}

Package:
${packageText}

Extras:
${selectedExtras.join(", ") || "None"}

Estimated Total:
${totalText}

Project Details:
${customer.message}

Thank you.`;

}


/*==================================================
GET QUOTATION DATA
==================================================*/

function getQuotationData() {

    const selectedExtras =
        getSelectedExtras();

    return {

        packageName:
            selectedPackage,

        packagePrice:
            packagePrices[selectedPackage] || 0,

        extras:
            selectedExtras,

        total:
            currentTotal

    };

}


/*==================================================
SEND TO WHATSAPP
==================================================*/

function sendToWhatsApp(customer) {

    const whatsappMessage =
        buildWhatsAppMessage(customer);

    const whatsappPhone =
        "27794380103";

    const encodedMessage =
        encodeURIComponent(
            whatsappMessage
        );

    const whatsappWebURL =
        `https://wa.me/${whatsappPhone}?text=${encodedMessage}`;

    const whatsappAppURL =
        `whatsapp://send?phone=${whatsappPhone}&text=${encodedMessage}`;


    const isMobile =
        /Android|iPhone|iPad|iPod/i.test(
            navigator.userAgent
        );


    /*==================================================
      DESKTOP
    ==================================================*/

    if (!isMobile) {

        window.open(
            whatsappWebURL,
            "_blank",
            "noopener,noreferrer"
        );

        /*
        ONLY show quotation if a package
        was actually selected.
        */

        if (selectedPackage) {

            setTimeout(() => {

                showQuotationChoice(customer);

            }, 1200);

        }

        return;

    }


    /*==================================================
      MOBILE / TABLET
    ==================================================*/

    let whatsappOpened = false;


    const handleVisibilityChange = () => {

        if (document.hidden) {

            whatsappOpened = true;

            document.removeEventListener(
                "visibilitychange",
                handleVisibilityChange
            );

        }

    };


    document.addEventListener(
        "visibilitychange",
        handleVisibilityChange
    );


    /*
    Try opening WhatsApp app.
    */

    window.location.href =
        whatsappAppURL;


    /*
    If WhatsApp does not open,
    continue after a short delay.
    */

    setTimeout(() => {

        document.removeEventListener(
            "visibilitychange",
            handleVisibilityChange
        );


        if (!whatsappOpened) {

            showToast(
                "WhatsApp could not be opened."
            );

        }


        /*
        IMPORTANT:
        Quotation ONLY appears when
        package was selected.
        */

        if (
            selectedPackage &&
            !whatsappOpened
        ) {

            showQuotationChoice(customer);

        }

    }, 1800);

}


/*==================================================
PROPOSAL FORM SUBMIT
==================================================*/

if (proposalForm) {

    proposalForm.addEventListener(
        "submit",
        async function (e) {

            e.preventDefault();


            /*========================================
              EMAILJS CHECK
            ========================================*/

            if (
                typeof emailjs === "undefined"
            ) {

                console.error(
                    "EmailJS library was not loaded."
                );

                showToast(
                    "Email service is currently unavailable."
                );

                return;

            }


            /*========================================
              EMAILJS CONFIGURATION CHECK
            ========================================*/

            if (
                !EMAILJS_SERVICE_ID ||
                !EMAILJS_TEMPLATE_ID ||
                !EMAILJS_PUBLIC_KEY
            ) {

                console.error(
                    "EmailJS configuration is incomplete."
                );

                showToast(
                    "Email service has not been configured."
                );

                return;

            }


            /*========================================
              FORM ELEMENTS
            ========================================*/

            const nameInput =
                proposalForm.querySelector(
                    '[name="name"]'
                );

            const emailInput =
                proposalForm.querySelector(
                    '[name="email"]'
                );

            const phoneInput =
                proposalForm.querySelector(
                    '[name="phone"]'
                );

            const companyInput =
                proposalForm.querySelector(
                    '[name="company"]'
                );

            const messageInput =
                proposalForm.querySelector(
                    '[name="message"]'
                );


            /*========================================
              SAFETY CHECK
            ========================================*/

            if (
                !nameInput ||
                !emailInput ||
                !phoneInput ||
                !messageInput
            ) {

                console.error(
                    "Required form fields are missing."
                );

                showToast(
                    "Some required form fields are missing."
                );

                return;

            }


            /*========================================
              GET VALUES
            ========================================*/

            const name =
                nameInput.value.trim();

            const email =
                emailInput.value.trim();

            const phone =
                phoneInput.value.trim();

            const company =
                companyInput
                    ? companyInput.value.trim()
                    : "";

            const message =
                messageInput.value.trim();


            /*========================================
              NAME VALIDATION
            ========================================*/

            if (!name) {

                showToast(
                    "Please enter your full name."
                );

                nameInput.focus();

                return;

            }


            /*========================================
              EMAIL VALIDATION
            ========================================*/

            if (!email) {

                showToast(
                    "Please enter your email address."
                );

                emailInput.focus();

                return;

            }


            if (
                !emailInput.checkValidity()
            ) {

                showToast(
                    "Please enter a valid email address."
                );

                emailInput.focus();

                return;

            }


            /*========================================
              PHONE VALIDATION
              EXACTLY 10 DIGITS
            ========================================*/

            if (!phone) {

                showToast(
                    "Please enter your 10-digit phone number."
                );

                phoneInput.focus();

                return;

            }


            if (!/^\d{10}$/.test(phone)) {

                showToast(
                    "Phone number must contain exactly 10 digits."
                );

                phoneInput.focus();

                return;

            }


            /*========================================
              MESSAGE VALIDATION
            ========================================*/

            if (!message) {

                showToast(
                    "Please describe your project."
                );

                messageInput.focus();

                return;

            }


            /*========================================
              8 WORD MINIMUM
            ========================================*/

            const wordCount =
                countWords(message);


            if (wordCount < 8) {

                showToast(
                    `Please describe your project using at least 8 words. You currently have ${wordCount}.`
                );

                messageInput.focus();

                return;

            }


            /*========================================
              ANTI-SPAM COOLDOWN
            ========================================*/

            const now =
                Date.now();


            if (
                now - lastSubmit < 10000
            ) {

                showToast(
                    "Please wait before sending another request."
                );

                return;

            }


            lastSubmit = now;


            /*========================================
              CALCULATE TOTAL
            ========================================*/

            currentTotal =
                calculateTotal();


            /*========================================
              SUBMIT BUTTON
            ========================================*/

            const submitButton =
                proposalForm.querySelector(
                    'button[type="submit"]'
                );


            if (submitButton) {

                submitButton.disabled =
                    true;

                submitButton.textContent =
                    "Sending Message...";

            }


            /*========================================
              CUSTOMER DATA
            ========================================*/

            const customer = {

                name,
                email,
                phone,
                company,
                message

            };


            /*========================================
              SEND EMAIL WITH EMAILJS
            ========================================*/

            try {

                const response =
                    await emailjs.sendForm(

                        EMAILJS_SERVICE_ID,

                        EMAILJS_TEMPLATE_ID,

                        proposalForm

                    );


                console.log(
                    "Message sent successfully:",
                    response
                );


                /*====================================
                  EMAIL SUCCESS
                ====================================*/

                if (submitButton) {

                    submitButton.textContent =
                        "Message Sent ✓";

                }


                showToast(
                    "Message sent successfully!"
                );


                /*====================================
                  WHATSAPP
                ====================================*/

                setTimeout(() => {

                    sendToWhatsApp(
                        customer
                    );

                }, 500);


            } catch (error) {

                console.error(
                    "Message sending failed:",
                    error
                );


                /*====================================
                  RESTORE BUTTON
                ====================================*/

                if (submitButton) {

                    submitButton.disabled =
                        false;

                    submitButton.textContent =
                        "Send Message";

                }


                showToast(
                    "Failed to send message. Please try again."
                );

            }

        }
    );

}

/*==================================================
KASITU QUOTATION SYSTEM
==================================================*/


/*==================================================
LOAD jsPDF
==================================================*/

function loadJsPDF() {

    return new Promise((resolve, reject) => {

        if (window.jspdf) {

            resolve(window.jspdf.jsPDF);

            return;

        }


        const script =
            document.createElement("script");

        script.src =
            "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";

        script.onload = () => {

            resolve(window.jspdf.jsPDF);

        };

        script.onerror = () => {

            reject(
                new Error(
                    "Unable to load PDF library."
                )
            );

        };

        document.head.appendChild(script);

    });

}


/*==================================================
QUOTATION MODAL
==================================================*/

const quotationModal =
    document.getElementById(
        "quotation-modal"
    );

const quotationClose =
    document.getElementById(
        "quotation-close"
    );

const quotationLater =
    document.getElementById(
        "quotation-later"
    );

const downloadQuotation =
    document.getElementById(
        "download-quotation"
    );

const quotationPackage =
    document.getElementById(
        "quotation-package"
    );

const quotationTotal =
    document.getElementById(
        "quotation-total"
    );

const quotationMessage =
    document.getElementById(
        "quotation-message"
    );


/*==================================================
SHOW QUOTATION CHOICE
==================================================*/

function showQuotationChoice(customer) {

    /* Never show quotation modal without a package */
    if (!selectedPackage) {
        return;
    }

    if (!quotationModal) return;

    quotationPackage.textContent =
        selectedPackage;

    quotationTotal.textContent =
        `R${currentTotal.toLocaleString("en-ZA")}`;

    quotationMessage.textContent =
        `Thank you, ${customer.name}. Your proposal request has been sent successfully.`;

    quotationModal.classList.add("show");

    document.body.style.overflow =
        "hidden";
}

/*==================================================
CLOSE QUOTATION
==================================================*/

function closeQuotationModal() {

    quotationModal.classList.remove(
        "show"
    );

    document.body.style.overflow =
        "";

}


if (quotationClose) {

    quotationClose.addEventListener(
        "click",
        closeQuotationModal
    );

}


if (quotationLater) {

    quotationLater.addEventListener(
        "click",
        closeQuotationModal
    );

}


/*==================================================
CLICK OUTSIDE
==================================================*/

if (quotationModal) {

    quotationModal.addEventListener(
        "click",
        e => {

            if (
                e.target ===
                quotationModal
            ) {

                closeQuotationModal();

            }

        }
    );

}


/*==================================================
GENERATE PDF
==================================================*/
/*==================================================
KASITU QUOTATION PDF
AUTO LIGHT / DARK MODE
==================================================*/

async function generateQuotationPDF() {

    try {

        downloadQuotation.disabled = true;

        downloadQuotation.innerHTML =
            `<i class="fas fa-spinner fa-spin"></i> Creating PDF...`;

        /* ==========================================
           LOAD PDF LIBRARY
        ========================================== */

        const jsPDF = await loadJsPDF();

        /* ==========================================
           DETECT CURRENT WEBSITE THEME
           
           This checks the theme at the exact
           moment the user downloads the PDF.
        ========================================== */

        const currentTheme =
            document.documentElement.getAttribute("data-theme") || "dark";

        const isLightMode =
            currentTheme === "light";

        console.log(
            "Quotation theme:",
            isLightMode ? "LIGHT" : "DARK"
        );

        /* ==========================================
           CREATE PDF
        ========================================== */

        const doc = new jsPDF({

            orientation: "portrait",

            unit: "mm",

            format: "a4"

        });

        /* ==========================================
           GET QUOTATION DATA
        ========================================== */

        const data = getQuotationData();

        /* ==========================================
           GET CUSTOMER INFORMATION
        ========================================== */

        const name =
            proposalForm
                .querySelector('[name="name"]')
                .value
                .trim();

        const email =
            proposalForm
                .querySelector('[name="email"]')
                .value
                .trim();

        const phone =
            proposalForm
                .querySelector('[name="phone"]')
                .value
                .trim();

        const company =
            proposalForm
                .querySelector('[name="company"]')
                .value
                .trim();

        const message =
            proposalForm
                .querySelector('[name="message"]')
                .value
                .trim();


        /* ==================================================
           THEME COLOURS
           
           LIGHT MODE:
           Elegant white / soft grey / navy / cyan
   
           DARK MODE:
           Premium navy / purple / cyan
        ================================================== */

        let colors;


        if (isLightMode) {

            /* ==========================================
               CLASSY LIGHT MODE
            ========================================== */

            colors = {

                background: [248, 250, 252],

                surface: [255, 255, 255],

                surfaceAlt: [241, 245, 249],

                primary: [15, 23, 42],

                secondary: [51, 65, 85],

                accent: [8, 145, 178],

                accentLight: [207, 250, 254],

                border: [226, 232, 240],

                text: [15, 23, 42],

                muted: [100, 116, 139],

                white: [255, 255, 255]

            };

        } else {

            /* ==========================================
               PREMIUM DARK MODE
            ========================================== */

            colors = {

                background: [7, 11, 23],

                surface: [14, 21, 42],

                surfaceAlt: [17, 23, 34],

                primary: [79, 70, 229],

                secondary: [45, 55, 80],

                accent: [6, 182, 212],

                accentLight: [30, 41, 70],

                border: [45, 55, 80],

                text: [245, 247, 255],

                muted: [148, 163, 184],

                white: [255, 255, 255]

            };

        }


        /* ==================================================
           PAGE BACKGROUND
        ================================================== */

        doc.setFillColor(
            ...colors.background
        );

        doc.rect(
            0,
            0,
            210,
            297,
            "F"
        );


        /* ==================================================
           TOP ACCENT
        ================================================== */

        doc.setFillColor(
            ...colors.accent
        );

        doc.rect(
            0,
            0,
            210,
            4,
            "F"
        );


        /* ==================================================
           BRAND HEADER
        ================================================== */

        doc.setTextColor(
            ...colors.primary
        );

        doc.setFont(
            "helvetica",
            "bold"
        );

        doc.setFontSize(25);

        doc.text(
            "KASITU",
            20,
            28
        );


        doc.setTextColor(
            ...colors.accent
        );

        doc.setFontSize(10);

        doc.text(
            "WEBS",
            20,
            35
        );


        doc.setTextColor(
            ...colors.muted
        );

        doc.setFont(
            "helvetica",
            "normal"
        );

        doc.setFontSize(8);

        doc.text(
            "Building Digital Excellence",
            20,
            41
        );


        /* ==================================================
           QUOTATION TITLE
        ================================================== */

        doc.setTextColor(
            ...colors.primary
        );

        doc.setFont(
            "helvetica",
            "bold"
        );

        doc.setFontSize(22);

        doc.text(
            "PROJECT QUOTATION",
            190,
            28,
            {
                align: "right"
            }
        );


        doc.setTextColor(
            ...colors.muted
        );

        doc.setFontSize(8);

        doc.text(
            "PRELIMINARY ESTIMATE",
            190,
            35,
            {
                align: "right"
            }
        );


        doc.text(
            new Date().toLocaleDateString(
                "en-ZA"
            ),
            190,
            41,
            {
                align: "right"
            }
        );


        /* ==================================================
           DIVIDER
        ================================================== */

        doc.setDrawColor(
            ...colors.border
        );

        doc.line(
            20,
            52,
            190,
            52
        );


        /* ==================================================
           CLIENT INFORMATION
        ================================================== */

        doc.setTextColor(
            ...colors.accent
        );

        doc.setFont(
            "helvetica",
            "bold"
        );

        doc.setFontSize(10);

        doc.text(
            "CLIENT INFORMATION",
            20,
            66
        );


        doc.setTextColor(
            ...colors.text
        );

        doc.setFont(
            "helvetica",
            "normal"
        );

        doc.setFontSize(10);

        doc.text(
            `Name: ${name}`,
            20,
            76
        );

        doc.text(
            `Email: ${email}`,
            20,
            84
        );

        doc.text(
            `Phone: ${phone || "Not provided"}`,
            20,
            92
        );

        doc.text(
            `Company: ${company || "Not provided"}`,
            20,
            100
        );


        /* ==================================================
           SELECTED PACKAGE CARD
        ================================================== */

        doc.setFillColor(
            ...colors.surface
        );

        doc.setDrawColor(
            ...colors.border
        );

        doc.roundedRect(
            20,
            112,
            170,
            38,
            5,
            5,
            "FD"
        );


        doc.setTextColor(
            ...colors.accent
        );

        doc.setFont(
            "helvetica",
            "bold"
        );

        doc.setFontSize(9);

        doc.text(
            "SELECTED PACKAGE",
            28,
            124
        );


        doc.setTextColor(
            ...colors.primary
        );

        doc.setFontSize(15);

        doc.text(
            data.packageName,
            28,
            137
        );


        doc.setTextColor(
            ...colors.muted
        );

        doc.setFontSize(9);

        doc.text(
            `Base price: R${data.packagePrice.toLocaleString("en-ZA")}`,
            28,
            145
        );


        /* ==================================================
           ADDITIONAL FEATURES
        ================================================== */

        doc.setTextColor(
            ...colors.accent
        );

        doc.setFont(
            "helvetica",
            "bold"
        );

        doc.setFontSize(10);

        doc.text(
            "ADDITIONAL FEATURES",
            20,
            168
        );


        let y = 178;


        doc.setTextColor(
            ...colors.text
        );

        doc.setFont(
            "helvetica",
            "normal"
        );

        doc.setFontSize(9);


        if (data.extras.length === 0) {

            doc.text(
                "No additional features selected.",
                20,
                y
            );

            y += 8;

        } else {

            data.extras.forEach(feature => {

                const cleanFeature =
                    feature
                        .replace(/\s+/g, " ")
                        .trim();


                doc.setFillColor(
                    ...colors.accent
                );

                doc.circle(
                    22,
                    y - 1.5,
                    1,
                    "F"
                );


                doc.setTextColor(
                    ...colors.text
                );

                doc.text(
                    cleanFeature,
                    27,
                    y
                );


                y += 8;

            });

        }


        /* ==================================================
           TOTAL INVESTMENT
        ================================================== */

        y += 8;


        doc.setFillColor(
            ...colors.primary
        );

        doc.roundedRect(
            20,
            y,
            170,
            28,
            5,
            5,
            "F"
        );


        doc.setTextColor(
            ...colors.accentLight
        );

        doc.setFont(
            "helvetica",
            "bold"
        );

        doc.setFontSize(9);

        doc.text(
            "ESTIMATED PROJECT INVESTMENT",
            28,
            y + 11
        );


        doc.setTextColor(
            ...colors.white
        );

        doc.setFont(
            "helvetica",
            "bold"
        );

        doc.setFontSize(19);

        doc.text(
            `R${data.total.toLocaleString("en-ZA")}`,
            182,
            y + 19,
            {
                align: "right"
            }
        );


        /* ==================================================
           PROJECT DESCRIPTION
        ================================================== */

        y += 43;


        doc.setTextColor(
            ...colors.accent
        );

        doc.setFont(
            "helvetica",
            "bold"
        );

        doc.setFontSize(10);

        doc.text(
            "PROJECT DESCRIPTION",
            20,
            y
        );


        y += 9;


        doc.setTextColor(
            ...colors.text
        );

        doc.setFont(
            "helvetica",
            "normal"
        );

        doc.setFontSize(8.5);


        const wrapped =
            doc.splitTextToSize(
                message,
                165
            );


        doc.text(
            wrapped,
            20,
            y
        );


        /* ==================================================
           FOOTER
        ================================================== */

        doc.setDrawColor(
            ...colors.border
        );

        doc.line(
            20,
            270,
            190,
            270
        );


        doc.setTextColor(
            ...colors.muted
        );

        doc.setFontSize(7.5);

        doc.text(
            "KASITU Webs • Soshanguve, Pretoria, Gauteng, South Africa",
            20,
            280
        );


        doc.text(
            "info@kasituwebs.co.za • +27 79 438 0103",
            20,
            287
        );


        doc.setTextColor(
            ...colors.accent
        );

        doc.text(
            "This quotation is an estimate and may be adjusted after project consultation.",
            190,
            287,
            {
                align: "right"
            }
        );


        /* ==================================================
           SAVE PDF
        ================================================== */

        const safeName =
            name
                .replace(
                    /[^a-z0-9]/gi,
                    "-"
                )
                .toLowerCase();


        const modeName =
            isLightMode
                ? "Light"
                : "Dark";


        doc.save(
            `KASITU-Webs-Quotation-${safeName || "Client"}-${modeName}.pdf`
        );


        showToast(
            `Quotation downloaded in ${isLightMode ? "light" : "dark"} mode ✓`
        );


    } catch (error) {

        console.error(
            "PDF generation failed:",
            error
        );

        showToast(
            "Unable to create the quotation PDF."
        );

    } finally {

        downloadQuotation.disabled =
            false;

        downloadQuotation.innerHTML =
            `<i class="fas fa-file-pdf"></i> Download Quotation`;

    }

}

/*==================================================
DOWNLOAD BUTTON
==================================================*/

if (downloadQuotation) {

    downloadQuotation.addEventListener(
        "click",
        generateQuotationPDF
    );

}

/*==================================================
PAGE PERFORMANCE
==================================================*/

document.querySelectorAll("img")
.forEach(img=>{

img.loading="lazy";

});

/*==================================================
CONSOLE
==================================================*/

console.log(
"%cKASITU Premium Portfolio",
"font-size:28px;color:#06B6D4;font-weight:bold;"
);

console.log(
"%cPowered by HTML • CSS • JavaScript",
"font-size:15px;color:#63ff99;"
);

/*==================================================
END PART 4
==================================================*/

/*==================================================
PART 5
KASITU OS
Interactive Terminal
Command Palette
==================================================*/

/*==================================================
TERMINAL
==================================================*/

const terminal = document.getElementById("terminal");
const terminalBody = document.getElementById("terminal-body");
const terminalInput = document.getElementById("terminal-input");
const terminalToggle = document.getElementById("terminal-toggle");
const terminalClose = document.getElementById("terminal-close");

const commands = {

help:`

Available Commands

help

about

services

projects

pricing

skills

contact

clear

github

linkedin

`,

about:`

KASITU WEBS

We build premium websites,

mobile apps,

business systems,

branding,

graphic design,

and cloud solutions.

`,

services:`

Website Development

App Development

Business Registration

Brand Identity

Graphic Design

SEO

Maintenance

`,

pricing:`

Starter Website

Business Website

eCommerce Website

Custom Systems

Request a quotation

`,

projects:`

Portfolio Website

Restaurant Website

Corporate Website

Booking System

Online Store

`,

skills:`

HTML

CSS

JavaScript

Firebase

Node.js

Express

MongoDB

Git

Responsive Design

`,

contact:`

Email:

info@kasituwebs.co.za

Website:

www.kasituwebs.co.za

WhatsApp:

+27 79 348 0103 

`,

clear:"CLEAR"

};

function print(text){

const line=document.createElement("div");

line.className="terminal-line";

line.innerHTML=text;

terminalBody.appendChild(line);

terminalBody.scrollTop=terminalBody.scrollHeight;

}

if(terminalToggle){

terminalToggle.addEventListener("click",()=>{

terminal.classList.add("open");

terminalInput.focus();

});

}

if(terminalClose){

terminalClose.addEventListener("click",()=>{

terminal.classList.remove("open");

});

}

if(terminalInput){

terminalInput.addEventListener("keydown",e=>{

if(e.key!=="Enter") return;

const value=terminalInput.value.trim().toLowerCase();

print(`<span style="color:#06B6D4">></span> ${value}`);

terminalInput.value="";

if(value==="") return;

if(commands[value]==="CLEAR"){

terminalBody.innerHTML="";

return;

}

if(commands[value]){

print(commands[value]);

}else{

print("Unknown command. Type <b>help</b>");

}

});

}

/*==================================================
CTRL + K
==================================================*/

const commandPalette=document.getElementById("command-palette");
const commandSearch=document.getElementById("command-search");

document.addEventListener("keydown",e=>{

if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="k"){

e.preventDefault();

commandPalette.classList.add("show");

commandSearch.focus();

}

if(e.key==="Escape"){

commandPalette.classList.remove("show");

}

});

const shortcuts={

home:"#home",

services:"#services",

projects:"#projects",

pricing:"#pricing",

contact:"#contact"

};

if(commandSearch){

commandSearch.addEventListener("keydown",e=>{

if(e.key!=="Enter") return;

const value=commandSearch.value.toLowerCase();

if(shortcuts[value]){

document.querySelector(shortcuts[value]).scrollIntoView({

behavior:"smooth"

});

}

commandPalette.classList.remove("show");

commandSearch.value="";

});

}

/*==================================================
SYSTEM STATUS
==================================================*/

const indicators=document.querySelectorAll(".status-indicator");

indicators.forEach((indicator,index)=>{

setTimeout(()=>{

indicator.classList.add("online");

},500*index);

});

/*==================================================
PAGE TRANSITIONS
==================================================*/

document.querySelectorAll("a").forEach(link=>{

const href=link.getAttribute("href");

if(!href) return;

if(href.startsWith("#")) return;

link.addEventListener("click",()=>{

document.body.classList.remove("loaded");

});

});

/*==================================================
END PART 5
==================================================*/

/* ==================================================
   KASITU INFORMATION MINI MODALS
   Technologies + Why Choose Us
   ================================================== */

const infoModal =
    document.getElementById("info-modal");

const infoModalBox =
    document.querySelector(".info-modal-box");

const infoModalClose =
    document.getElementById("info-modal-close");

const infoModalOk =
    document.getElementById("info-modal-ok");

const infoModalTitle =
    document.getElementById("info-modal-title");

const infoModalText =
    document.getElementById("info-modal-text");

const infoModalIcon =
    document.getElementById("info-modal-icon");


/* ==================================================
   OPEN INFORMATION MODAL
   ================================================== */

function openInfoModal(title, icon, text) {

    if (!infoModal) return;

    if (infoModalTitle) {
        infoModalTitle.textContent = title;
    }

    if (infoModalText) {
        infoModalText.textContent = text;
    }

    if (infoModalIcon) {

        infoModalIcon.className =
            icon || "fas fa-circle-info";

    }

    infoModal.classList.add("active");

    infoModal.setAttribute(
        "aria-hidden",
        "false"
    );

    document.body.classList.add(
        "modal-open"
    );

    if (infoModalClose) {
        setTimeout(() => {
            infoModalClose.focus();
        }, 100);
    }

}


/* ==================================================
   CLOSE INFORMATION MODAL
   ================================================== */

function closeInfoModal() {

    if (!infoModal) return;

    infoModal.classList.remove("active");

    infoModal.setAttribute(
        "aria-hidden",
        "true"
    );

    document.body.classList.remove(
        "modal-open"
    );

}


/* ==================================================
   TECHNOLOGY MODALS
   ================================================== */

document
    .querySelectorAll(".tech-info-card")
    .forEach(card => {

        card.addEventListener("click", () => {

            openInfoModal(

                card.dataset.modalTitle,

                card.dataset.modalIcon,

                card.dataset.modalText

            );

        });

    });


/* ==================================================
   WHY CHOOSE US MODALS
   ================================================== */

document
    .querySelectorAll(".why-right .feature")
    .forEach(feature => {

        feature.addEventListener("click", () => {

            openInfoModal(

                feature.dataset.modalTitle,

                feature.dataset.modalIcon,

                feature.dataset.modalText

            );

        });

    });


/* ==================================================
   CLOSE BUTTON
   ================================================== */

if (infoModalClose) {

    infoModalClose.addEventListener(
        "click",
        closeInfoModal
    );

}


/* ==================================================
   GOT IT BUTTON
   ================================================== */

if (infoModalOk) {

    infoModalOk.addEventListener(
        "click",
        closeInfoModal
    );

}


/* ==================================================
   CLICK OUTSIDE MODAL
   ================================================== */

if (infoModal) {

    infoModal.addEventListener(
        "click",
        function (e) {

            if (e.target === infoModal) {

                closeInfoModal();

            }

        }
    );

}


/* ==================================================
   ESC KEY
   ================================================== */

document.addEventListener(
    "keydown",
    function (e) {

        if (
            e.key === "Escape" &&
            infoModal &&
            infoModal.classList.contains("active")
        ) {

            closeInfoModal();

        }

    }
);


/* ==================================================
   PREVENT BACKGROUND SCROLL WHILE MODAL IS OPEN
   ================================================== */

const modalStyle =
    document.createElement("style");

modalStyle.textContent = `
    body.modal-open {
        overflow: hidden;
    }
`;

document.head.appendChild(modalStyle);


/* ==================================================
   CLEAR SELECTED PACKAGE
   ================================================== */

const clearPackageButton =
    document.getElementById(
        "clear-package"
    );


function clearSelectedPackage() {

    /* ------------------------------------------
       REMOVE PACKAGE STATE
       ------------------------------------------ */

    selectedPackage = "";

    currentTotal = 0;


    /* ------------------------------------------
       CLEAR PACKAGE INPUT
       ------------------------------------------ */

    if (packageInput) {

        packageInput.value = "";

        packageInput.placeholder =
            "Select a package above";

    }


    /* ------------------------------------------
       UNCHECK ALL EXTRA FEATURES
       ------------------------------------------ */

    extraInputs.forEach(extra => {

        extra.checked = false;

    });


    /* ------------------------------------------
       REMOVE RECOMMENDED HIGHLIGHTS
       ------------------------------------------ */

    extraInputs.forEach(extra => {

        const option =
            extra.closest(
                ".extra-option"
            );

        if (option) {

            option.classList.remove(
                "recommended"
            );

        }

    });


    /* ------------------------------------------
       RESET PRICE
       ------------------------------------------ */

    if (totalElement) {

        totalElement.textContent =
            "R0";

    }


    /* ------------------------------------------
       RESET CALCULATOR TOTAL
       ------------------------------------------ */

    currentTotal = 0;


    /* ------------------------------------------
       HIDE CLEAR BUTTON
       ------------------------------------------ */

    if (clearPackageButton) {

        clearPackageButton.classList.remove(
            "visible"
        );

    }


    /* ------------------------------------------
       NOTIFY USER
       ------------------------------------------ */

    if (
        typeof showToast ===
        "function"
    ) {

        showToast(
            "Package selection cleared."
        );

    }

}


/* ==================================================
   CLEAR BUTTON CLICK
   ================================================== */

if (clearPackageButton) {

    clearPackageButton.addEventListener(
        "click",
        function (e) {

            e.preventDefault();

            e.stopPropagation();

            clearSelectedPackage();

        }
    );

}


/* ==================================================
   SHOW / HIDE CLEAR BUTTON
   ================================================== */

function updateClearPackageButton() {

    if (!clearPackageButton) return;

    if (selectedPackage) {

        clearPackageButton.classList.add(
            "visible"
        );

    } else {

        clearPackageButton.classList.remove(
            "visible"
        );

    }

}


/* ==================================================
   UPDATE CLEAR BUTTON AFTER PACKAGE SELECTION
   ================================================== */

packageButtons.forEach(button => {

    button.addEventListener(
        "click",
        function () {

            setTimeout(
                updateClearPackageButton,
                0
            );

        }
    );

});


/* ==================================================
   CONTINUE SAFETY CHECK
   ==================================================
   Even if somebody clears the visible input,
   Continue is ONLY allowed when selectedPackage
   contains a valid package.
   ================================================== */

function hasValidPackageSelected() {

    return (
        selectedPackage &&
        Object.prototype.hasOwnProperty.call(
            packagePrices,
            selectedPackage
        )
    );

}


/* ==================================================
   FINAL CONTINUE PROTECTION
   ================================================== */

if (continueButton) {

    continueButton.addEventListener(
        "click",
        function (e) {

            if (!hasValidPackageSelected()) {

                e.preventDefault();

                e.stopImmediatePropagation();

                if (
                    typeof showToast ===
                    "function"
                ) {

                    showToast(
                        "Please select a package to proceed."
                    );

                }

                const pricingSection =
                    document.getElementById(
                        "pricing"
                    );

                if (pricingSection) {

                    const header =
                        document.querySelector(
                            ".header"
                        );

                    const headerOffset =
                        header
                            ? header.offsetHeight + 15
                            : 15;

                    const targetTop =
                        pricingSection
                            .getBoundingClientRect()
                            .top +
                        window.scrollY -
                        headerOffset;

                    window.scrollTo({

                        top:
                            Math.max(
                                0,
                                targetTop
                            ),

                        behavior:
                            "smooth"

                    });

                }

                return false;

            }

        },
        true
    );

}


/* ==================================================
   KEEP CLEAR BUTTON STATE IN SYNC
   ================================================== */

if (packageInput) {

    const packageObserver =
        new MutationObserver(
            updateClearPackageButton
        );

    packageObserver.observe(
        packageInput,
        {
            attributes: true,
            attributeFilter: [
                "value"
            ]
        }
    );

}


/* ==================================================
   INITIAL STATE
   ================================================== */

updateClearPackageButton();

console.log(
    "KASITU Info Modals + Package Clear Loaded ✓"
);

   /* ==================================================
   FLOATING WHATSAPP BUTTON
   Click = WhatsApp
   Hold = Drag
================================================== */

(() => {

    const button =
        document.getElementById(
            "floating-whatsapp"
        );

    if (!button) return;


    /* ==========================================
       YOUR WHATSAPP NUMBER
       ========================================== */

    const WHATSAPP_NUMBER =
        "27794380103";


    /* ==========================================
       PRE-TYPED MESSAGE
       ========================================== */

    const WHATSAPP_MESSAGE =
`Hi KASITU Webs 👋

I just visited your website and I would like to discuss a project with you.

I would like some advice on the best digital solution for my business.

Please let me know how we can get started. Thank you!`;


    /* ==========================================
       SETTINGS
       ========================================== */

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


    /* ==========================================
       OPEN WHATSAPP
       ========================================== */

    function openWhatsApp() {

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

    }


    /* ==========================================
       KEEP BUTTON INSIDE SCREEN
       ========================================== */

    function keepInsideScreen(
        left,
        top
    ) {

        const width =
            button.offsetWidth;

        const height =
            button.offsetHeight;


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


    /* ==========================================
       CLEAR HOLD TIMER
       ========================================== */

    function clearHoldTimer() {

        if (holdTimer) {

            clearTimeout(
                holdTimer
            );

            holdTimer = null;

        }

    }


    /* ==========================================
       POINTER DOWN
       ========================================== */

    button.addEventListener(
        "pointerdown",
        event => {

            if (
                event.pointerType === "mouse" &&
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
                button.getBoundingClientRect();


            startLeft =
                rect.left;

            startTop =
                rect.top;


            isHolding = false;

            isDragging = false;


            clearHoldTimer();


            /* ==================================
               HOLD ACTIVATION
            ================================== */

            holdTimer =
                setTimeout(() => {

                    isHolding = true;


                    /* Convert fixed
                       right/bottom positioning
                       into left/top */

                    button.style.left =
                        startLeft + "px";

                    button.style.top =
                        startTop + "px";

                    button.style.right =
                        "auto";

                    button.style.bottom =
                        "auto";


                    button.classList.add(
                        "is-holding"
                    );


                    if (
                        button.setPointerCapture
                    ) {

                        try {

                            button.setPointerCapture(
                                pointerId
                            );

                        } catch (_) {}

                    }

                }, HOLD_TIME);

        }
    );


    /* ==========================================
       POINTER MOVE
       ========================================== */

    button.addEventListener(
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


            /* User moved before holding */

            if (
                !isHolding &&
                (
                    Math.abs(deltaX) >
                        MOVE_THRESHOLD ||

                    Math.abs(deltaY) >
                        MOVE_THRESHOLD
                )
            ) {

                clearHoldTimer();

                return;

            }


            if (!isHolding) {

                return;

            }


            /* Start dragging */

            if (!isDragging) {

                isDragging = true;

                button.classList.remove(
                    "is-holding"
                );

                button.classList.add(
                    "is-dragging"
                );

            }


            const position =
                keepInsideScreen(
                    startLeft + deltaX,
                    startTop + deltaY
                );


            button.style.left =
                position.left + "px";

            button.style.top =
                position.top + "px";


            event.preventDefault();

        },
        {
            passive: false
        }
    );


    /* ==========================================
       POINTER UP
       ========================================== */

    button.addEventListener(
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


            button.classList.remove(
                "is-holding",
                "is-dragging"
            );


            isHolding = false;

            isDragging = false;

            pointerId = null;


            /* Normal click */

            if (!wasHeld) {

                openWhatsApp();

            }

        }
    );


    /* ==========================================
       POINTER CANCEL
       ========================================== */

    button.addEventListener(
        "pointercancel",
        () => {

            clearHoldTimer();

            button.classList.remove(
                "is-holding",
                "is-dragging"
            );

            isHolding = false;

            isDragging = false;

            pointerId = null;

        }
    );


    /* ==========================================
       KEEP POSITION VALID AFTER RESIZE
       ========================================== */

    window.addEventListener(
        "resize",
        () => {

            if (
                !button.style.left
            ) {

                return;

            }


            const rect =
                button.getBoundingClientRect();


            const position =
                keepInsideScreen(
                    rect.left,
                    rect.top
                );


            button.style.left =
                position.left + "px";

            button.style.top =
                position.top + "px";

        }
    );


    /* ==========================================
       KEYBOARD ACCESS
       ========================================== */

    button.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Enter" ||
                event.key === " "
            ) {

                event.preventDefault();

                openWhatsApp();

            }

        }
    );


    console.log(
        "Floating WhatsApp Button Loaded ✓"
    );

})();

/* ==================================================
   KASITU CREATIVE STUDIO PRICE MODAL
================================================== */

const creativeExploreBtn =
    document.getElementById("creative-explore-btn");

const creativePriceModal =
    document.getElementById("creative-price-modal");

const creativePriceClose =
    document.getElementById("creative-price-close");

const creativePriceBackdrop =
    document.getElementById("creative-price-backdrop");

const creativePriceContact =
    document.getElementById("creative-price-contact");


/* OPEN */

function openCreativePriceModal() {

    if (!creativePriceModal) return;

    creativePriceModal.classList.add("active");

    creativePriceModal.setAttribute(
        "aria-hidden",
        "false"
    );

    document.body.style.overflow = "hidden";
}


/* CLOSE */

function closeCreativePriceModal() {

    if (!creativePriceModal) return;

    creativePriceModal.classList.remove("active");

    creativePriceModal.setAttribute(
        "aria-hidden",
        "true"
    );

    document.body.style.overflow = "";
}


/* EXPLORE STUDIO */

if (creativeExploreBtn) {

    creativeExploreBtn.addEventListener(
        "click",
        openCreativePriceModal
    );

}


/* CLOSE BUTTON */

if (creativePriceClose) {

    creativePriceClose.addEventListener(
        "click",
        closeCreativePriceModal
    );

}


/* BACKDROP */

if (creativePriceBackdrop) {

    creativePriceBackdrop.addEventListener(
        "click",
        closeCreativePriceModal
    );

}


/* CONTACT BUTTON */

if (creativePriceContact) {

    creativePriceContact.addEventListener(
        "click",
        closeCreativePriceModal
    );

}


/* ESCAPE KEY */

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Escape" &&
            creativePriceModal &&
            creativePriceModal.classList.contains("active")
        ) {

            closeCreativePriceModal();

        }

    }
);
