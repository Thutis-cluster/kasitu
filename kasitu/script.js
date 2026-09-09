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
CURSOR GLOW
==================================================*/

/* Skip the mouse-following glow on touch devices.
   Position updates are batched to one animation frame. */
if (window.matchMedia("(pointer: fine)").matches) {
    const glow = document.createElement("div");
    glow.className = "cursor-glow";
    document.body.appendChild(glow);

    let glowX = 0;
    let glowY = 0;
    let glowFrame = null;

    window.addEventListener("mousemove", e => {
        glowX = e.clientX;
        glowY = e.clientY;
        if (glowFrame !== null) return;
        glowFrame = requestAnimationFrame(() => {
            glowFrame = null;
            glow.style.transform = `translate3d(${glowX}px, ${glowY}px, 0)`;
        });
    }, { passive: true });
}

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
FLOATING ICONS
==================================================*/

const floatingIcons = document.querySelectorAll(".service-icon");

/* One animation loop instead of one requestAnimationFrame loop per icon. */
if (floatingIcons.length && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const iconData = Array.from(floatingIcons, icon => ({
        icon,
        speed: Math.random() * 2 + 1,
        angle: Math.random() * 360
    }));

    let iconLastTime = performance.now();

    const animateFloatingIcons = now => {
        const delta = Math.min(now - iconLastTime, 50);
        iconLastTime = now;

        iconData.forEach(item => {
            item.angle += 0.01 * item.speed * (delta / 16.67);
            item.icon.style.transform = `translate3d(0, ${Math.sin(item.angle) * 6}px, 0)`;
        });

        requestAnimationFrame(animateFloatingIcons);
    };

    requestAnimationFrame(animateFloatingIcons);
}

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

           "MongoDB",

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

    if (!projectModal) return;

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

    if (!projectModal) return;

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

/* ==================================================
   KASITU UNIFIED SERVICE SELECTION SYSTEM
   Handles:
   - Website Packages
   - Business Registration
   - Creative Design Packages
   - Bluetooth Key Locator
   - Security Alarm
   - Website Extras
================================================== */

let selectedPackage = "";
let currentTotal = 0;

/*
 * Additional non-website services selected by the customer.
 */
let selectedServices = [];

/*
 * Current primary service selection.
 * Used for showing the customer what they selected.
 */
let primarySelection = null;

/* Selected Business Registration package detail is kept for the owner message,
   while the customer quotation intentionally stays generic. */
let selectedBusinessRegistrationPackage = "";

/* True only when Business Registration was started via the enquiry button. */
let businessRegistrationPriceDiscussed = false;


/* ==================================================
   STANDALONE SERVICE PRICES
================================================== */

const standaloneServices = {
    "Business Registration": {
        price: 650,
        type: "Business Registration"
    },

    "Registration + Google Business Profile setup": {
        price: 950,
        type: "Business Registration"
    },

    "Business Registration Premium": {
        price: 1500,
        type: "Business Registration"
    },

    "Logo Design": {
        price: 270,
        type: "Creative Design"
    },

    "Premium Logo Package": {
        price: 390,
        type: "Creative Design"
    },

    "Flyer Design": {
        price: 399,
        type: "Creative Design"
    },

    "Poster Design": {
        price: 449,
        type: "Creative Design"
    },

    "KASITU Brand Starter": {
        price: 1899,
        type: "Creative Design"
    },

    "Bluetooth Key Locator": {
        price: 209.99,
        type: "Product"
    },

    "Security Alarm": {
        price: 229.99,
        type: "Product"
    }
};


/* ==================================================
   ADD SERVICE
================================================== */

function addSelectedService(name, price, type = "Service") {

    /*
     * Prevent the same service from being added twice.
     */
    const alreadySelected =
        selectedServices.some(
            service => service.name === name
        );

    if (!alreadySelected) {

        selectedServices.push({
            name,
            price: Number(price) || 0,
            type
        });

    }

    primarySelection = {
        name,
        price: Number(price) || 0,
        type
    };

    updateAllSelectedCalculator();

    updateContactSelectionSummary();

}


/* ==================================================
   REMOVE SERVICE
================================================== */

function removeSelectedService(name) {

    selectedServices =
        selectedServices.filter(
            service =>
                service.name !== name
        );


    if (
        primarySelection &&
        primarySelection.name === name
    ) {

        primarySelection = null;

    }


    updateAllSelectedCalculator();

    updateContactSelectionSummary();

}


/* ==================================================
   GET SELECTED SERVICES
================================================== */

function getSelectedServices() {

    return selectedServices.map(service => ({
        name: service.name,
        price: service.price,
        type: service.type
    }));

}


/* ==================================================
   CALCULATE COMPLETE TOTAL
================================================== */

function calculateUnifiedTotal() {

    let total = 0;

    /*
     * Website package
     */
    if (selectedPackage) {
        total +=
            packagePrices[selectedPackage] || 0;
    }

    /*
     * Website extras
     */
    extraInputs.forEach(extra => {

        if (extra.checked) {

            total +=
                Number(extra.dataset.price) || 0;

        }

    });

    /*
     * Business / Creative / Products
     */
    selectedServices.forEach(service => {

        total +=
            Number(service.price) || 0;

    });

    return total;
}


/* ==================================================
   ALL SELECTED CALCULATOR
   IMPORTANT:
   This is SEPARATE from LIVE ESTIMATE.
================================================== */

function calculateAllSelectedTotal() {

    let total = 0;

    /* Website package */
    if (selectedPackage) {

        total +=
            packagePrices[selectedPackage] || 0;

    }

    /* Website extras */
    extraInputs.forEach(extra => {

        if (extra.checked) {

            total +=
                Number(extra.dataset.price) || 0;

        }

    });

    /* Business / Creative / Products */
    selectedServices.forEach(service => {

        total +=
            Number(service.price) || 0;

    });

    return total;
}


/* ==================================================
   UPDATE ALL SELECTED CALCULATOR
================================================== */

function updateAllSelectedCalculator() {

    const calculator =
        document.getElementById(
            "all-selected-calculator"
        );

    if (!calculator) return;


    const items =
        getAllSelectedItems();


    const total =
        calculateAllSelectedTotal();


    const list =
        calculator.querySelector(
            "#all-selected-items"
        );


    const totalElement =
        calculator.querySelector(
            "#all-selected-total"
        );


    if (!items.length) {

        calculator.classList.remove("active");

        return;

    }


    calculator.classList.add("active");


    if (list) {

        list.innerHTML =
            items.map(item => `

                <div class="all-selected-item">

                    <span>
                        ${item.name}
                    </span>

                    <strong>
                        ${formatCurrency(item.price)}
                    </strong>

                </div>

            `).join("");

    }


    if (totalElement) {

        totalElement.textContent =
            formatCurrency(total);

    }

}


/* ==================================================
   GET EVERYTHING SELECTED
================================================== */

function getAllSelectedItems() {

    const items = [];


    /* Website package */

    if (selectedPackage) {

        items.push({

            name: selectedPackage,

            price:
                packagePrices[selectedPackage] || 0,

            type:
                "Website Package"

        });

    }


    /* Website extras */

    extraInputs.forEach(extra => {

        if (!extra.checked) return;


        const option =
            extra.closest(".extra-option");


        const name =
            option
                ? option.textContent
                    .replace(/\s+/g, " ")
                    .trim()
                : extra.dataset.extra;


        items.push({

            name,

            price:
                Number(extra.dataset.price) || 0,

            type:
                "Website Extra"

        });

    });


    /* Standalone services */

    selectedServices.forEach(service => {

        items.push({

            name: service.name,

            price:
                Number(service.price) || 0,

            type: service.type

        });

    });


    return items;

}

/* ==================================================
   CREATE ALL SELECTED CALCULATOR
================================================== */

function createAllSelectedCalculator() {

    if (
        document.getElementById(
            "all-selected-calculator"
        )
    ) {
        return;
    }


    const calculator =
        document.createElement("section");


    calculator.id =
        "all-selected-calculator";


    calculator.innerHTML = `

        <div class="all-selected-inner">

            <div class="all-selected-heading">

                <span class="all-selected-label">
                    ALL SELECTED
                </span>

                <h2>
                    Your Complete Selection
                </h2>

                <p>
                    Everything you have selected across
                    our website packages, extras, services
                    and products.
                </p>

            </div>


            <div
                id="all-selected-items"
                class="all-selected-items">
            </div>


            <div class="all-selected-total-box">

                <span>
                    TOTAL ESTIMATED INVESTMENT
                </span>

                <strong
                    id="all-selected-total">
                    R0
                </strong>

            </div>

        </div>

    `;


    const contact =
        document.getElementById("contact");


    if (contact) {

        contact.insertAdjacentElement(
            "afterend",
            calculator
        );

    } else {

        document.body.appendChild(
            calculator
        );

    }

}


/* Create immediately */

createAllSelectedCalculator();


/* ==================================================
   SELECTION SUMMARY
================================================== */

function getSelectionSummaryText() {

    const services =
        getSelectedServices();


    const lines = [];


    /* Custom / primary enquiry */

    if (
        primarySelection &&
        primarySelection.name ===
            "Custom Creative Design"
    ) {

        lines.push(
            "Creative Design: Custom Design Enquiry"
        );

    }


    /* Website package */

    if (selectedPackage) {

        lines.push(
            `Website Package: ${selectedPackage} — ${formatCurrency(
                packagePrices[selectedPackage] || 0
            )}`
        );

    }


    /* Standalone services */

    if (services.length) {

        lines.push(
            "Selected Services:"
        );


        services.forEach(service => {

            lines.push(
                `• ${service.name} — ${formatCurrency(service.price)}`
            );

        });

    }


    /* Website extras */

    const extras =
        getSelectedExtraData();


    if (extras.length) {

        lines.push(
            "Website Extras:"
        );


        extras.forEach(extra => {

            lines.push(
                `• ${extra.name} — ${formatCurrency(extra.price)}`
            );

        });

    }


    return lines.join("\n");

}

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
    return calculateUnifiedTotal();
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

updateRecommendedExtras();

updateAllSelectedCalculator();

updateContactSelectionSummary();

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

            /* LIVE ESTIMATE */
            updatePrice();

            /* ALL SELECTED */
            updateAllSelectedCalculator();

            /* CONTACT SUMMARY */
            updateContactSelectionSummary();

        }
    );

});

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
CONTINUE → CONTACT FORM
Single handler for website packages, extras,
standalone services, products and custom design.
==================================================*/

const whatsappBtn = document.getElementById("whatsapp-btn");

function hasAnySelection() {
    return Boolean(selectedPackage) ||
        selectedServices.length > 0 ||
        getSelectedExtraData().length > 0 ||
        Boolean(primarySelection);
}

function goToContact(instruction = "Please fill in your contact details and tell us about your project.") {
    const contactSection = document.getElementById("contact");
    const contactForm = document.getElementById("contact-form");

    if (typeof updateContactSelectionSummary === "function") {
        updateContactSelectionSummary();
    }

    if (typeof showSelectionInstruction === "function") {
        showSelectionInstruction(instruction);
    }

    if (contactSection) {
        contactSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    setTimeout(() => {
        const nameInput = contactForm?.querySelector('input[name="name"]');
        if (!nameInput) return;
        nameInput.focus();
        nameInput.classList.add("input-attention", "form-highlight");
        setTimeout(() => {
            nameInput.classList.remove("input-attention", "form-highlight");
        }, 2500);
    }, 900);
}

if (whatsappBtn) {
    whatsappBtn.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();

        if (!hasAnySelection()) {
            showToast("Please select a service, product or website package first.");
            const pricingSection = document.getElementById("pricing");
            if (pricingSection) {
                const headerEl = document.querySelector(".header");
                const headerOffset = headerEl ? headerEl.offsetHeight + 15 : 15;
                const targetTop = pricingSection.getBoundingClientRect().top + window.scrollY - headerOffset;
                window.scrollTo({ top: Math.max(0, targetTop), behavior: "smooth" });
            }
            return;
        }

        currentTotal = calculateUnifiedTotal();

        const selectedNames = getAllSelectedItems().map(item => item.name);
        const selectionLabel = selectedNames.length ? selectedNames.join(", ") : "your selected service";

        showToast(`${selectionLabel} selected ✓ — Please tell us about your project.`);
        goToContact("Please fill in your contact details and tell us about your project.");
    });
}

/*==================================================
KASITU — FAST SCROLL CONTROLLER
Maintenance / Performance Version
==================================================*/

const progress = document.createElement("div");

progress.id = "progress-bar";

document.body.appendChild(progress);

let scrollFrame = null;
let latestScrollY = window.scrollY;


/*==================================================
UPDATE ALL SCROLL UI
==================================================*/

function updateScrollUI() {

    scrollFrame = null;

    latestScrollY = window.scrollY;


    /* ------------------------------------------
       STICKY HEADER
    ------------------------------------------ */

    if (header) {

        header.classList.toggle(
            "scrolled",
            latestScrollY > 80
        );

    }


    /* ------------------------------------------
       ACTIVE NAVIGATION
    ------------------------------------------ */

    highlightNavigation();


    /* ------------------------------------------
       SCROLL TO TOP BUTTON
    ------------------------------------------ */

    updateScrollButton();


    /* ------------------------------------------
       PROGRESS BAR
    ------------------------------------------ */

    const height =
        Math.max(
            1,
            document.documentElement.scrollHeight -
            window.innerHeight
        );

    const percent =
        (latestScrollY / height) * 100;

    progress.style.width =
        Math.min(
            100,
            Math.max(0, percent)
        ) + "%";


    /* ------------------------------------------
       CLOSE MOBILE MENU WHILE SCROLLING
    ------------------------------------------ */

    if (
        mobileMenu &&
        menuBtn &&
        mobileMenu.classList.contains("mobile-open")
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

}


/*==================================================
REQUEST ONE ANIMATION FRAME
==================================================*/

function requestScrollUpdate() {

    latestScrollY =
        window.scrollY;

    if (scrollFrame !== null) {
        return;
    }

    scrollFrame =
        requestAnimationFrame(
            updateScrollUI
        );

}


/*==================================================
FAST PASSIVE SCROLL
==================================================*/

window.addEventListener(
    "scroll",
    requestScrollUpdate,
    {
        passive: true
    }
);


/*==================================================
RESIZE
==================================================*/

window.addEventListener(
    "resize",
    requestScrollUpdate,
    {
        passive: true
    }
);


/*==================================================
INITIAL UPDATE
==================================================*/

updateScrollUI();

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
3D PROJECT CARDS
==================================================*/

const projectCards = document.querySelectorAll(".project-card");

if (window.matchMedia("(pointer: fine)").matches && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    projectCards.forEach(card => {
        let frame = null;
        let pointerX = 0;
        let pointerY = 0;

        card.addEventListener("pointermove", e => {
            const rect = card.getBoundingClientRect();
            pointerX = e.clientX - rect.left;
            pointerY = e.clientY - rect.top;

            if (frame !== null) return;
            frame = requestAnimationFrame(() => {
                frame = null;
                const rotateY = ((pointerX / rect.width) - 0.5) * 18;
                const rotateX = ((pointerY / rect.height) - 0.5) * -18;
                card.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-12px)`;
            });
        }, { passive: true });

        card.addEventListener("pointerleave", () => {
            if (frame !== null) cancelAnimationFrame(frame);
            frame = null;
            card.style.transform = "";
        });
    });
}

/*==================================================
PARTICLE BACKGROUND
==================================================*/

const particleCanvas = document.createElement("canvas");
particleCanvas.id = "particles";
document.body.prepend(particleCanvas);

const ctx = particleCanvas.getContext("2d", { alpha: true });
let particles = [];
let particleFrame = null;
let particlesRunning = true;
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const isSmallScreen = window.innerWidth < 768;
const particleCount = reducedMotion ? 0 : (isSmallScreen ? 35 : 55);

function resizeCanvas() {
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const width = window.innerWidth;
    const height = window.innerHeight;
    particleCanvas.style.width = `${width}px`;
    particleCanvas.style.height = `${height}px`;
    particleCanvas.width = Math.round(width * dpr);
    particleCanvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas, { passive: true });

class Particle {
    constructor() { this.reset(); }
    reset() {
        this.x = Math.random() * window.innerWidth;
        this.y = Math.random() * window.innerHeight;
        this.radius = Math.random() * 2 + 1;
        this.speedX = (Math.random() - 0.5) * 0.4;
        this.speedY = (Math.random() - 0.5) * 0.4;
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x < 0 || this.x > window.innerWidth) this.speedX *= -1;
        if (this.y < 0 || this.y > window.innerHeight) this.speedY *= -1;
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(6,182,212,.45)";
        ctx.fill();
    }
}

for (let i = 0; i < particleCount; i++) particles.push(new Particle());

function animateParticles() {
    particleFrame = null;
    if (!ctx) return;
    if (!particlesRunning || !particles.length) return;

    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    particles.forEach(p => { p.update(); p.draw(); });
    particleFrame = requestAnimationFrame(animateParticles);
}

const particleObserver = new IntersectionObserver(entries => {
    particlesRunning = entries[0]?.isIntersecting ?? true;
    if (particlesRunning && particleFrame === null) {
        particleFrame = requestAnimationFrame(animateParticles);
    }
}, { threshold: 0 });

if (particleCanvas && particleCount) {
    particleObserver.observe(particleCanvas);
    particleFrame = requestAnimationFrame(animateParticles);
}

document.addEventListener("visibilitychange", () => {
    particlesRunning = !document.hidden;
    if (particlesRunning && particleFrame === null && particleCount) {
        particleFrame = requestAnimationFrame(animateParticles);
    }
}, { passive: true });

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

function getSelectedExtraData() {

    const selected = [];

    extraInputs.forEach(extra => {

        if (!extra.checked) {
            return;
        }

        const option =
            extra.closest(".extra-option");

        const label =
            option
                ? option.textContent
                    .replace(/\s+/g, " ")
                    .trim()
                : extra.dataset.extra;

        selected.push({
            name: label,
            price:
                Number(extra.dataset.price) || 0,
            type: "Website Extra"
        });

    });

    return selected;

}


/*==================================================
BUILD WHATSAPP MESSAGE
==================================================*/

function buildWhatsAppMessage(customer) {

    const data =
        getQuotationData();

    const serviceText =
        data.services.length
            ? data.services
                .map(service =>
                    `• ${service.name} — ${formatCurrency(service.price)}`
                )
                .join("\n")
            : "None";

    const packageText =
        data.packageName
            ? `${data.packageName} — ${formatCurrency(data.packagePrice)}`
            : "None";

    const extrasText =
        data.extras.length
            ? data.extras
                .map(extra =>
                    `• ${extra.name} — ${formatCurrency(extra.price)}`
                )
                .join("\n")
            : "None";

    const totalText =
        data.items.length
            ? formatCurrency(data.total)
            : "To be discussed";

let requestSummary =
    "No specific service selected.";


if (
    data.items.length
) {

    requestSummary =
        data.items
            .map(item =>
                `${item.name}`
            )
            .join(", ");

}


if (
    primarySelection &&
    primarySelection.name ===
        "Custom Creative Design"
) {

    requestSummary =
        requestSummary ===
            "No specific service selected."

            ? "Custom Creative Design enquiry"

            : `${requestSummary}, plus a Custom Creative Design enquiry`;

}

    return `Hello KASITU Webs 👋

I would like to request information about:

${requestSummary}

CUSTOMER INFORMATION

Name:
${customer.name}

Email:
${customer.email}

Phone:
${customer.phone}

Company:
${customer.company || "Not provided"}


SELECTED SERVICES

${serviceText}


WEBSITE PACKAGE

${packageText}


WEBSITE EXTRAS

${extrasText}


ESTIMATED TOTAL

${totalText}


PROJECT DETAILS

${customer.message}


Please contact me regarding the selected services and next steps.

Thank you.`;

}

/* ==================================================
   COMPLETE QUOTATION DATA
================================================== */

function getQuotationData() {

    const websiteExtras =
        getSelectedExtraData();

    const services =
        getSelectedServices();

    const websitePackage =
        selectedPackage
            ? [{
                name: selectedPackage,
                price:
                    packagePrices[selectedPackage] || 0,
                type: "Website Package"
            }]
            : [];

    const allItems = [
        ...services,
        ...websitePackage,
        ...websiteExtras
    ];

    return {

        packageName:
            selectedPackage || "",

        packagePrice:
            packagePrices[selectedPackage] || 0,

        services,

        extras:
            websiteExtras,

        items:
            allItems,

        total:
            calculateUnifiedTotal()

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

        if (getQuotationData().items.length || (typeof primarySelection !== "undefined" && primarySelection && primarySelection.name === "Custom Creative Design")) {
            setTimeout(() => showQuotationChoice(customer), 1200);
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
            (getQuotationData().items.length || (typeof primarySelection !== "undefined" && primarySelection && primarySelection.name === "Custom Creative Design")) &&
            !whatsappOpened
        ) {
            showQuotationChoice(customer);
        }

    }, 1800);

}



function getCustomerIntent(){
    const data=getQuotationData();
    if(typeof primarySelection!=="undefined" && primarySelection && primarySelection.name==="Custom Creative Design") return "Custom Creative Design enquiry — customer wants to discuss a custom design solution.";
    if(selectedBusinessRegistrationPackage) {
        const extras = data.items.filter(i => i.type !== "Business Registration").map(i => i.name);
        const base = `Business Registration enquiry — customer selected: ${selectedBusinessRegistrationPackage}.`;
        return extras.length ? base + " Other selected items: " + extras.join(", ") + "." : base;
    }
    if(data.items.length) return "Customer is interested in: "+data.items.map(i=>i.name).join(", ")+".";
    return "General enquiry.";
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

/* ==================================================
   PREPARE EMAILJS SELECTION DATA
================================================== */

const emailServices =
    document.getElementById(
        "email-selected-services"
    );

const emailPackage =
    document.getElementById(
        "email-selected-package"
    );

const emailExtras =
    document.getElementById(
        "email-selected-extras"
    );

const emailTotal =
    document.getElementById(
        "email-estimated-total"
    );

const emailSummary =
    document.getElementById(
        "email-quotation-summary"
    );


const quotationData =
    getQuotationData();


if (emailServices) {

    emailServices.value =
        quotationData.services.length
            ? quotationData.services
                .map(service =>
                    `${service.name} (${formatCurrency(service.price)})`
                )
                .join("\n")
            : "None";

}


if (emailPackage) {

    emailPackage.value =
        quotationData.packageName
            ? `${quotationData.packageName} (${formatCurrency(quotationData.packagePrice)})`
            : "None";

}


if (emailExtras) {

    emailExtras.value =
        quotationData.extras.length
            ? quotationData.extras
                .map(extra =>
                    `${extra.name} (${formatCurrency(extra.price)})`
                )
                .join("\n")
            : "None";

}


if (emailTotal) {

    const businessOnly =
        businessRegistrationPriceDiscussed &&
        selectedBusinessRegistrationPackage &&
        !quotationData.packageName &&
        !quotationData.extras.length &&
        quotationData.services.length > 0 &&
        quotationData.services.every(service => service.type === "Business Registration");

    emailTotal.value = businessOnly
        ? "To be discussed"
        : (quotationData.items.length ? formatCurrency(quotationData.total) : "To be discussed");

}


if (emailSummary) {

    emailSummary.value =
        getSelectionSummaryText();

}

const emailIntent = document.getElementById("email-customer-intent");
if (emailIntent) emailIntent.value = getCustomerIntent();

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

    const data =
        getQuotationData();

    const customEnquiry = typeof primarySelection !== "undefined" && primarySelection && primarySelection.name === "Custom Creative Design";
    if (!data.items.length && !customEnquiry) {
        return;
    }

    if (!quotationModal) {
        return;
    }

    const businessOnly =
        selectedBusinessRegistrationPackage &&
        !data.packageName &&
        !data.extras.length &&
        data.services.length > 0 &&
        data.services.every(service => service.type === "Business Registration");

    const itemSummary = businessOnly
        ? "Business Registration"
        : data.items.map(item => `${item.name} — ${formatCurrency(item.price)}`).join(" • ");

    if (quotationPackage) quotationPackage.textContent = itemSummary;
    if (quotationTotal) quotationTotal.textContent = businessOnly ? "To be discussed" : formatCurrency(data.total);

    if (quotationMessage) quotationMessage.textContent =
        `Thank you, ${customer.name}. Your request has been sent successfully.`;

    quotationModal.classList.add(
        "show"
    );

    document.body.style.overflow =
        "hidden";

}

/*==================================================
CLOSE QUOTATION
==================================================*/

function closeQuotationModal() {

    if (!quotationModal) return;

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
        if (downloadQuotation) { downloadQuotation.disabled=true; downloadQuotation.innerHTML='<i class="fas fa-spinner fa-spin"></i> Creating PDF...'; }
        const jsPDF=await loadJsPDF();
        const data=getQuotationData();
        const customEnquiry=typeof primarySelection!=="undefined" && primarySelection && primarySelection.name==="Custom Creative Design";
        const currentTheme=document.documentElement.getAttribute("data-theme")||"dark";
        const light=currentTheme==="light";
        const doc=new jsPDF({orientation:"portrait",unit:"mm",format:"a4"});
        const c=light?{bg:[248,250,252],surface:[255,255,255],primary:[15,23,42],accent:[8,145,178],text:[15,23,42],muted:[100,116,139],border:[226,232,240],white:[255,255,255]}:{bg:[7,11,23],surface:[14,21,42],primary:[79,70,229],accent:[6,182,212],text:[245,247,255],muted:[148,163,184],border:[45,55,80],white:[255,255,255]};
        const name=proposalForm?.querySelector('[name="name"]')?.value.trim()||"Client";
        const email=proposalForm?.querySelector('[name="email"]')?.value.trim()||"";
        const phone=proposalForm?.querySelector('[name="phone"]')?.value.trim()||"";
        const company=proposalForm?.querySelector('[name="company"]')?.value.trim()||"";
        const message=proposalForm?.querySelector('[name="message"]')?.value.trim()||"";
        doc.setFillColor(...c.bg);doc.rect(0,0,210,297,"F");
        doc.setFillColor(...c.primary);doc.roundedRect(15,15,180,32,6,6,"F");
        doc.setTextColor(...c.white);doc.setFont("helvetica","bold");doc.setFontSize(20);doc.text("KASITU Webs",24,29);
        doc.setFontSize(9);doc.setTextColor(...c.accent);doc.text("QUOTATION / PROJECT ENQUIRY",24,39);
        let y=58;
        doc.setTextColor(...c.accent);doc.setFontSize(10);doc.text("CLIENT INFORMATION",20,y);y+=9;
        doc.setTextColor(...c.text);doc.setFont("helvetica","normal");doc.setFontSize(9);
        [`Name: ${name}`,`Email: ${email}`,`Phone: ${phone||"Not provided"}`,`Company: ${company||"Not provided"}`].forEach(t=>{doc.text(t,20,y);y+=7});
        y+=5;doc.setTextColor(...c.accent);doc.setFont("helvetica","bold");doc.setFontSize(10);doc.text("SELECTED SERVICES",20,y);y+=8;
        doc.setFont("helvetica","normal");doc.setTextColor(...c.text);doc.setFontSize(9);
        const businessOnly =
            selectedBusinessRegistrationPackage &&
            !data.packageName &&
            !data.extras.length &&
            data.services.length > 0 &&
            data.services.every(service => service.type === "Business Registration");

        const items = businessOnly
            ? [{name:"Business Registration",price:0,type:"Business Registration"}]
            : data.items.slice();
        if(customEnquiry) items.push({name:"Custom Creative Design",price:0,type:"Creative Design Enquiry"});
        if(!items.length){doc.text("General enquiry — quotation to be discussed.",20,y);y+=8;}
        for(const item of items){
            const price=(item.name==="Custom Creative Design" || businessOnly?"To be discussed":formatCurrency(item.price));
            const wrapped=doc.splitTextToSize(`${item.type ? item.type+": " : ""}${item.name} — ${price}`,165);
            if(y+wrapped.length*5>258){doc.addPage();y=20;doc.setFillColor(...c.bg);doc.rect(0,0,210,297,"F");doc.setTextColor(...c.accent);doc.setFont("helvetica","bold");doc.text("SELECTED SERVICES — CONTINUED",20,y);y+=9;doc.setTextColor(...c.text);doc.setFont("helvetica","normal");}
            doc.text(wrapped,20,y);y+=Math.max(7,wrapped.length*5);
        }
        y+=5;doc.setFillColor(...c.primary);doc.roundedRect(20,y,170,25,5,5,"F");doc.setTextColor(...c.accent);doc.setFont("helvetica","bold");doc.setFontSize(9);doc.text("ESTIMATED INVESTMENT",28,y+10);
        doc.setTextColor(...c.white);doc.setFontSize(17);doc.text((businessOnly || !data.items.length)?"To be discussed":formatCurrency(data.total),182,y+17,{align:"right"});y+=36;
        doc.setTextColor(...c.accent);doc.setFontSize(10);doc.text("CUSTOMER REQUEST",20,y);y+=8;doc.setTextColor(...c.text);doc.setFont("helvetica","normal");doc.setFontSize(8.5);
        const wrappedMsg=doc.splitTextToSize(message||"No additional project details provided.",165);doc.text(wrappedMsg,20,y);y+=wrappedMsg.length*4.5+10;
        doc.setTextColor(...c.muted);doc.setFontSize(7.5);doc.text("KASITU Webs • Soshanguve, Pretoria, Gauteng, South Africa",20,278);doc.text("info@kasituwebs.co.za • +27 79 438 0103",20,285);
        const safe=name.replace(/[^a-z0-9]/gi,"-").toLowerCase()||"client";
        doc.save(`KASITU-Webs-Quotation-${safe}-${light?"Light":"Dark"}.pdf`);
        showToast(`Quotation downloaded in ${light?"light":"dark"} mode ✓`);
    }catch(error){console.error("PDF generation failed:",error);showToast("Unable to create the quotation PDF.");}
    finally{if(downloadQuotation){downloadQuotation.disabled=false;downloadQuotation.innerHTML='<i class="fas fa-file-pdf"></i> Download Quotation';}}
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

const creativeStart =
    document.getElementById(
        "creative-price-contact"
    );

if (creativeStart) {

    creativeStart.addEventListener(
        "click",
        function(event) {

            event.preventDefault();

            /*
             * This is a CUSTOM DESIGN enquiry,
             * not a fixed-price package.
             */
            primarySelection = {
                name: "Custom Creative Design",
                price: 0,
                type: "Creative Design"
            };

            /*
             * Don't add R0 to the quotation.
             */
            selectedServices =
                selectedServices.filter(
                    service =>
                        service.name !==
                        "Custom Creative Design"
                );

            updateAllSelectedCalculator();
	    updateContactSelectionSummary();

            const creativeModal =
                document.getElementById(
                    "creative-price-modal"
                );

            if (creativeModal) {

                creativeModal.classList.remove(
                    "active"
                );

                creativeModal.setAttribute(
                    "aria-hidden",
                    "true"
                );

            }

            goToContactWithSelection(
                "You want a custom creative design package. Please fill in your name, email, phone number and explain what you would like designed."
            );

        }
    );

}

/* ==================================================
   GO TO CONTACT WITH SELECTION
================================================== */

function goToContactWithSelection(instruction) {

    const contactSection =
        document.getElementById("contact");

    const contactForm =
        document.getElementById("contact-form");

    if (!contactSection) {
        return;
    }

    /*
     * Update the visible selection panel.
     */
    updateContactSelectionSummary();

    /*
     * Show customer instruction.
     */
    showSelectionInstruction(instruction);

    /*
     * Scroll to Contact.
     */
    contactSection.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

    /*
     * Focus name field after scrolling.
     */
    setTimeout(() => {

        const nameInput =
            contactForm?.querySelector(
                'input[name="name"]'
            );

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

}




/* =========================================================
   KASITU UNIFIED SELECTION CONTROLLER
   - Does NOT replace or alter the LIVE ESTIMATOR.
   - Adds all non-website service selection to the same state.
========================================================= */
(function(){
    function refreshSelectionUI(){
        if (typeof updateAllSelectedCalculator === "function") updateAllSelectedCalculator();
        if (typeof updateContactSelectionSummary === "function") updateContactSelectionSummary();
    }

    window.showSelectionInstruction = function(text){
        const el=document.getElementById("selection-summary-instruction");
        if(el) el.textContent=text;
    };

    window.updateContactSelectionSummary = function(){
        const box=document.getElementById("contact-selection-summary");
        const details=document.getElementById("selection-summary-details");
        const total=document.getElementById("selection-summary-total");
        if(!box || !details || !total) return;
        const lines=[];
        if(window.primarySelection && primarySelection.name === "Custom Creative Design") lines.push("Creative Design: Custom Design Enquiry");
        if(typeof selectedPackage !== "undefined" && selectedPackage) lines.push(`Website Package: ${selectedPackage} — ${formatCurrency(packagePrices[selectedPackage] || 0)}`);
        if(typeof getSelectedServices === "function") getSelectedServices().forEach(s=>lines.push(`• ${s.name} — ${formatCurrency(s.price)}`));
        if(typeof getSelectedExtraData === "function") getSelectedExtraData().forEach(e=>lines.push(`• ${e.name} — ${formatCurrency(e.price)}`));
        if(!lines.length){box.hidden=true;return;}
        box.hidden=false;
        details.textContent=lines.join("\n");
        total.textContent=`Estimated Total: ${formatCurrency(typeof calculateUnifiedTotal === "function" ? calculateUnifiedTotal() : 0)}`;
    };

    function closeModal(id){
        const m=document.getElementById(id); if(!m)return;
        m.classList.remove("active");m.setAttribute("aria-hidden","true");
        document.body.classList.remove("kasitu-service-modal-open");
    }
    function openModal(id){
        document.querySelectorAll(".kasitu-unified-modal.active").forEach(m=>{m.classList.remove("active");m.setAttribute("aria-hidden","true")});
        const m=document.getElementById(id); if(!m)return;
        m.classList.add("active");m.setAttribute("aria-hidden","false");document.body.classList.add("kasitu-service-modal-open");
    }
    function goContact(instruction){
        refreshSelectionUI();showSelectionInstruction(instruction);
        const contact=document.getElementById("contact");
        if(contact) contact.scrollIntoView({behavior:"smooth",block:"start"});
        setTimeout(()=>document.querySelector('#contact-form input[name="name"]')?.focus(),700);
    }
    function selectService(name,price,type,instruction){
        if(typeof addSelectedService === "function") addSelectedService(name,price,type);
        goContact(instruction);
    }

    document.addEventListener("DOMContentLoaded",()=>{
        document.getElementById("business-registration-btn")?.addEventListener("click",e=>{e.preventDefault();e.stopPropagation();openModal("business-price-modal")});
        document.getElementById("businessRegistrationCard")?.addEventListener("click",e=>{if(!e.target.closest("button"))openModal("business-price-modal")});
        document.getElementById("creative-explore-btn")?.addEventListener("click",e=>{e.preventDefault();e.stopPropagation();openModal("creative-price-modal")});
        document.getElementById("creativeDesignServiceCard")?.addEventListener("click",e=>{if(!e.target.closest("button"))openModal("creative-price-modal")});
        document.getElementById("key-locator-pricing-btn")?.addEventListener("click",e=>{e.preventDefault();e.stopPropagation();openModal("keyLocatorPricingModal")});
        document.getElementById("keyLocatorCard")?.addEventListener("click",e=>{if(!e.target.closest("button"))openModal("keyLocatorPricingModal")});
        document.getElementById("alarm-pricing-btn")?.addEventListener("click",e=>{e.preventDefault();e.stopPropagation();openModal("alarmPricingModal")});
        document.getElementById("alarmServiceCard")?.addEventListener("click",e=>{if(!e.target.closest("button"))openModal("alarmPricingModal")});

        document.querySelectorAll("#business-price-modal .business-price-card").forEach(card=>card.addEventListener("click",()=>{
            const packageName = card.dataset.name || "Business Registration";
            const priceElement = card.querySelector(".business-price");
            const priceText = priceElement ? priceElement.textContent : "";
            const price = Number(priceText.replace(/[^0-9.]/g, "")) || 0;

            selectedBusinessRegistrationPackage = packageName;
            businessRegistrationPriceDiscussed = false;

            /* Replace any earlier Business Registration selection so that
               changing packages always updates the quotation price. */
            selectedServices = selectedServices.filter(
                service => service.type !== "Business Registration"
            );

            selectService(
                "Business Registration",
                price,
                "Business Registration",
                `You selected Business Registration (${packageName}) at ${formatCurrency(price)}. Please complete your name, email, phone number and company details. You can also tell us anything else you would like included.`
            );

            closeModal("business-price-modal");
        }));

        document.getElementById("business-price-contact")?.addEventListener("click",e=>{
            e.preventDefault();
            e.stopPropagation();
            selectedBusinessRegistrationPackage = "Price to be discussed";
            businessRegistrationPriceDiscussed = true;

            /* Replace any earlier Business Registration selection and keep
               this enquiry out of the numeric total. */
            selectedServices = selectedServices.filter(
                service => service.type !== "Business Registration"
            );

            selectService(
                "Business Registration",
                0,
                "Business Registration",
                "Business Registration selected. Please fill in your name, email, phone number and company details so we can review your requirements and provide a suitable quotation."
            );
            closeModal("business-price-modal");
        });
        document.querySelectorAll("#creative-price-modal .creative-price-card").forEach(card=>card.addEventListener("click",()=>{
            selectService(card.dataset.name,Number(card.dataset.price),"Creative Design",`You selected ${card.dataset.name}. Please enter your contact details and tell us what you would like designed.`);
            closeModal("creative-price-modal");
        }));
        document.getElementById("creative-price-contact")?.addEventListener("click",e=>{
            e.preventDefault();
            primarySelection={name:"Custom Creative Design",price:0,type:"Creative Design",enquiryOnly:true};
            selectedServices=selectedServices.filter(s=>s.name!=="Custom Creative Design");
            closeModal("creative-price-modal");
            refreshSelectionUI();
            goContact("Custom Creative Design selected. Please complete your contact details and describe what you would like designed.");
        });
        document.querySelector(".key-locator-quote-btn")?.addEventListener("click",e=>{
            e.preventDefault();e.stopPropagation();
            selectService("Bluetooth Key Locator",209.99,"Product","Bluetooth Key Locator selected. Please enter your contact details and tell us how many units you need and any delivery requirements.");
            closeModal("keyLocatorPricingModal");
        });
        document.querySelector(".alarm-quote-btn")?.addEventListener("click",e=>{
            e.preventDefault();e.stopPropagation();
            selectService("Security Alarm",229.99,"Product","Security Alarm selected. Please enter your contact details and tell us how many units you need, plus any installation requirements.");
            closeModal("alarmPricingModal");
        });
        ["business-price-modal","creative-price-modal","keyLocatorPricingModal","alarmPricingModal"].forEach(id=>{
            const m=document.getElementById(id); if(!m)return;
            m.addEventListener("click",e=>{if(e.target===m)closeModal(id)});
            m.querySelector(".kasitu-modal-close")?.addEventListener("click",()=>closeModal(id));
        });
        document.addEventListener("keydown",e=>{if(e.key==="Escape")document.querySelectorAll(".kasitu-unified-modal.active").forEach(m=>closeModal(m.id))});

        // Keep the all-selected calculator in sync when extras change.
        document.querySelectorAll(".extra").forEach(extra=>extra.addEventListener("change",refreshSelectionUI));
        refreshSelectionUI();
    });
})();
