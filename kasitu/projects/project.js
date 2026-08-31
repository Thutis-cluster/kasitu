
/* ==========================================
   SHARED KASITU THEME SYSTEM
   Uses the same localStorage key as Home.
========================================== */

const PROJECT_THEME_KEY = "kasitu-theme";
const projectThemeToggle =
    document.getElementById("project-theme-toggle");

function applyProjectTheme(theme) {

    const safeTheme =
        theme === "light" ? "light" : "dark";

    document.documentElement.setAttribute(
        "data-theme",
        safeTheme
    );

    if (projectThemeToggle) {
        projectThemeToggle.textContent =
            safeTheme === "light" ? "☀️" : "🌙";
    }

}

function loadProjectTheme() {

    const savedTheme =
        localStorage.getItem(PROJECT_THEME_KEY) || "dark";

    applyProjectTheme(savedTheme);

}

if (projectThemeToggle) {

    projectThemeToggle.addEventListener("click", () => {

        const current =
            document.documentElement.getAttribute("data-theme") || "dark";

        const next =
            current === "dark" ? "light" : "dark";

        applyProjectTheme(next);
        localStorage.setItem(PROJECT_THEME_KEY, next);

    });

}

loadProjectTheme();

 /* ==========================================
   KASITU WEBS
   REUSABLE PROJECT VIEWER
========================================== */


/* ==========================================
   PROJECT DATABASE
========================================== */

const projects = {

    mumsy: {

        title: "Mumsy Braids Studio",

        category: "BOOKING SYSTEM",

        type: "Booking Management System",

        description:
            "A professional booking platform designed for Mumsy Braids Studio, allowing customers to explore services, select options, choose dates and times, submit their booking information and pay online.",

        url:
            "https://mumsybraidsstudio.co.za/",

        technologies: [
            "HTML",
            "CSS",
            "JavaScript",
            "Firebase",
            "PayStack",
            "twilio"
        ],

        features: [
            "Online booking",
            "Service selection",
            "Date and time selection",
            "Customer information",
            "Booking management",
            "Payment/deposit workflow"
        ]

    },


    thutis: {

        title: "Thuti's Project",

        category: "Business",

        type: "Business Website",

        description:
            "A modern business website created to showcase the store and its products online, allowing customers to browse products and categories, discover the store’s location, and easily access contact details for enquiries.
",

        url:
            "https://kasitu.free.nf/?i=1",

        technologies: [
            "WordPress",
            "CSS",
            "JavaScript"
        ],

        features: [
            "Product catalogue",
            "Product categories",
            "Business information",
            "Store location & directions",
            "Contact information",
            "Responsive design"
        ]

    },


    practice: {

        title: "Thuti's eCommerce Demo",

        category: "PRACTICE PROJECT",

        type: "eCommerce Practice Project",

        description:
            "A practice eCommerce project created to explore product catalogues, shopping cart functionality, checkout workflows and online shopping experiences.",

        url:
            "https://thutis.onrender.com/",

        technologies: [
            "HTML",
            "CSS",
            "JavaScript"
        ],

        features: [
            "Product catalogue",
            "Product search",
            "Shopping cart",
            "Checkout",
            "Online shopping workflow",
            "Responsive interface"
        ]

    }

};


/* ==========================================
   GET PROJECT FROM URL
========================================== */

const params =
    new URLSearchParams(window.location.search);


const projectId =
    params.get("id");


/* ==========================================
   ELEMENTS
========================================== */

const title =
    document.getElementById("project-title");

const category =
    document.getElementById("project-category");

const description =
    document.getElementById("project-description");

const technologies =
    document.getElementById("project-tech");

const type =
    document.getElementById("detail-type");

const technologyDetail =
    document.getElementById("detail-technologies");

const features =
    document.getElementById("project-features");

const frame =
    document.getElementById("project-frame");

const browserUrl =
    document.getElementById("browser-url");

const openProject =
    document.getElementById("open-project");

const openProjectBottom =
    document.getElementById("open-project-bottom");

const loader =
    document.getElementById("iframe-loader");

const year =
    document.getElementById("year");


/* ==========================================
   FOOTER YEAR
========================================== */

if (year) {

    year.textContent =
        new Date().getFullYear();

}


/* ==========================================
   CHECK PROJECT
========================================== */

if (!projectId || !projects[projectId]) {

    showProjectError();

} else {

    loadProject(
        projects[projectId]
    );

}


/* ==========================================
   LOAD PROJECT
========================================== */

function loadProject(project) {


    /* PAGE TITLE */

    document.title =
        `${project.title} | KASITU Webs`;


    /* HEADER */

    title.textContent =
        project.title;


    category.textContent =
        project.category;


    description.textContent =
        project.description;


    /* PROJECT TYPE */

    type.textContent =
        project.type;


    /* TECHNOLOGIES */

    technologyDetail.textContent =
        project.technologies.join(", ");


    technologies.innerHTML = "";


    project.technologies.forEach(
        tech => {

            const tag =
                document.createElement("span");

            tag.textContent =
                tech;

            technologies.appendChild(tag);

        }
    );


    /* FEATURES */

    features.innerHTML = "";


    project.features.forEach(
        feature => {

            const item =
                document.createElement("div");

            item.className =
                "feature-item";

            item.innerHTML = `
                <i class="fas fa-check"></i>
                ${feature}
            `;

            features.appendChild(item);

        }
    );


    /* PROJECT URL */

    openProject.href =
        project.url;


    openProjectBottom.href =
        project.url;


    browserUrl.textContent =
        project.url;


    /* LOAD LIVE WEBSITE */

    frame.src =
        project.url;


    /* SAVE PROJECT */

    localStorage.setItem(
        "lastProject",
        projectId
    );

}


/* ==========================================
   IFRAME LOADED
========================================== */

frame.addEventListener(
    "load",
    () => {

        loader.classList.add(
            "hidden"
        );

    }
);


/* ==========================================
   PROJECT ERROR
========================================== */

function showProjectError() {

    document.querySelector(
        ".project-page"
    ).innerHTML = `

        <section
            class="project-header">

            <span class="project-category">
                PROJECT NOT FOUND
            </span>

            <h1>
                Project Unavailable
            </h1>

            <p class="project-description">

                The project you are looking for
                could not be found.

            </p>

            <div class="project-actions">

                <a
                    href="../index.html#portfolio"
                    class="primary-btn">

                    <i class="fas fa-arrow-left"></i>

                    Back to Portfolio

                </a>

            </div>

        </section>

    `;

}
