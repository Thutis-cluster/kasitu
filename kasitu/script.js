/*==================================================
KASITU WEBS V2
Premium Portfolio Script
Version 2.0
==================================================*/

'use strict';

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
STICKY HEADER
==================================================*/

function updateHeader() {

    if (window.scrollY > 80) {

        header.classList.add("scrolled");

    } else {

        header.classList.remove("scrolled");

    }

}

window.addEventListener("scroll", debounce(updateHeader));

updateHeader();

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

window.addEventListener(

    "scroll",

    debounce(highlightNavigation)

);

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

window.addEventListener(

    "scroll",

    debounce(updateScrollButton)

);

updateScrollButton();

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

window.addEventListener("scroll", () => {

    if (!mobileMenu || !menuBtn) return;

    if (mobileMenu.classList.contains("mobile-open")) {

        mobileMenu.classList.remove("mobile-open");
        menuBtn.classList.remove("open");
        menuBtn.setAttribute("aria-expanded", "false");

    }

});

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

const glow = document.createElement("div");

glow.className = "cursor-glow";

document.body.appendChild(glow);

window.addEventListener("mousemove", e => {

glow.style.left = e.clientX + "px";

glow.style.top = e.clientY + "px";

});

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

const floatingIcons =
document.querySelectorAll(".service-icon");

floatingIcons.forEach(icon => {

const speed =
Math.random() * 2 + 1;

let angle = Math.random() * 360;

function floatIcon() {

angle += 0.01 * speed;

icon.style.transform =
`translateY(${Math.sin(angle) * 6}px)`;

requestAnimationFrame(floatIcon);

}

floatIcon();

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

const packagePrices = {
    "Starter Website": 2999,
    "Business Website": 4999,
    "Online Store": 5999
};

const packageButtons = document.querySelectorAll(".select-price");
const packageInput = document.getElementById("site-type");
const extraInputs = document.querySelectorAll(".extra");
const totalElement = document.getElementById("total");

let selectedPackage = "";
let currentTotal = 0;


/* ==========================================
   RECOMMENDED EXTRAS
   These are HIGHLIGHTED only.
   They are NOT automatically checked.
========================================== */

const recommendedExtras = {

    "Starter Website": [
        "seo"
    ],

    "Business Website": [
        "seo",
        "whatsapp"
    ],

    "Online Store": [
        "seo",
        "booking",
        "dashboard",
        "login",
        "whatsapp"
    ]

};


/* ==========================================
   FORMAT CURRENCY
========================================== */

function formatCurrency(value) {

    return "R" + Number(value).toLocaleString("en-ZA");

}


/* ==========================================
   CALCULATE TOTAL
========================================== */

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


/* ==========================================
   UPDATE TOTAL
========================================== */

function updatePrice() {

    const total =
        calculateTotal();

    animatePrice(total);

}


/* ==========================================
   ANIMATE PRICE
========================================== */

function animatePrice(target) {

    if (!totalElement) return;


    const start = currentTotal;

    const difference =
        target - start;

    const duration = 400;

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

            requestAnimationFrame(animate);

        } else {

            currentTotal = target;

        }

    }


    requestAnimationFrame(animate);

}


/* ==========================================
   HIGHLIGHT RECOMMENDED EXTRAS
========================================== */

function updateRecommendedExtras() {

    // Remove previous recommendations

    extraInputs.forEach(extra => {

        const option =
            extra.closest(".extra-option");

        if (!option) return;

        option.classList.remove("recommended");

    });


    // Get recommendations for selected package

    const recommendations =
        recommendedExtras[selectedPackage] || [];


    // Highlight matching extras

    extraInputs.forEach(extra => {

        const extraType =
            extra.dataset.extra;


        if (
            recommendations.includes(extraType)
        ) {

            const option =
                extra.closest(".extra-option");

            if (!option) return;

            option.classList.add(
                "recommended"
            );

        }

    });

}


/* ==========================================
   SELECT PACKAGE
========================================== */

packageButtons.forEach(button => {

    button.addEventListener(
        "click",
        function () {

            const card =
                this.closest(".price-card");

            if (!card) return;


            const packageName =
                card.querySelector("h3");

            if (!packageName) return;


            selectedPackage =
                packageName.textContent.trim();


            /* Update package field */

            if (packageInput) {

                packageInput.value =
                    selectedPackage;

            }


            /* Highlight recommendations */

            updateRecommendedExtras();


            /* Recalculate price */

            updatePrice();


            /* Scroll to calculator */

            const calculator =
                document.querySelector(
                    ".calculator"
                );


            if (calculator) {

                calculator.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });

            }

        }
    );

});


/* ==========================================
   EXTRA FEATURES
   UPDATE PRICE WHEN CHECKED/UNCHECKED
========================================== */

extraInputs.forEach(extra => {

    extra.addEventListener(
        "change",
        function () {

            updatePrice();

        }
    );

});


/* ==========================================
   INITIAL PRICE
========================================== */

updatePrice();

/*==================================================
WHATSAPP QUOTE
==================================================*/

const whatsappBtn=

document.getElementById(

"whatsapp-btn"

);

if(whatsappBtn){

whatsappBtn.addEventListener(

"click",

e=>{

e.preventDefault();

if(!selectedPackage){

showToast(

"Please select a package."

);

return;

}

let features=[];

extras.forEach(extra=>{

if(extra.checked){

features.push(

extra.parentElement.textContent.trim()

);

}

});

const message=

`Hello KASITU Webs 👋

I would like a quotation.

Package:
${selectedPackage}

Extras:
${features.join(", ")||"None"}

Estimated Total:
R${currentTotal.toLocaleString()}

Please contact me.`;

const phone=

"27794380103"; // CHANGE TO YOUR NUMBER

window.open(

`https://wa.me/${phone}?text=${encodeURIComponent(message)}`,

"_blank"

);

});

}

/*==================================================
SCROLL PROGRESS
==================================================*/

const progress=

document.createElement("div");

progress.id="progress-bar";

document.body.appendChild(progress);

window.addEventListener(

"scroll",

()=>{

const scroll=

window.scrollY;

const height=

document.body.scrollHeight-

window.innerHeight;

const percent=

(scroll/height)*100;

progress.style.width=

percent+"%";

}

);

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

function sanitize(value){

return value

.replace(/[<>]/g,"")

.trim();

}

document

.querySelectorAll(

"input,textarea"

)

.forEach(input=>{

input.addEventListener(

"input",

()=>{

input.value=

sanitize(input.value);

}

);

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

projectCards.forEach(card => {

    card.addEventListener("mousemove", e => {

        const rect = card.getBoundingClientRect();

        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const rotateY = ((x / rect.width) - 0.5) * 18;
        const rotateX = ((y / rect.height) - 0.5) * -18;

        card.style.transform =
            `
            perspective(1200px)
            rotateX(${rotateX}deg)
            rotateY(${rotateY}deg)
            translateY(-12px)
            `;
    });

    card.addEventListener("mouseleave", () => {

        card.style.transform = "";

    });

});

/*==================================================
PARTICLE BACKGROUND
==================================================*/

const particleCanvas = document.createElement("canvas");

particleCanvas.id = "particles";

document.body.prepend(particleCanvas);

const ctx = particleCanvas.getContext("2d");

let particles = [];

function resizeCanvas(){

    particleCanvas.width = window.innerWidth;
    particleCanvas.height = window.innerHeight;

}

resizeCanvas();

window.addEventListener("resize", resizeCanvas);

class Particle{

    constructor(){

        this.reset();

    }

    reset(){

        this.x = Math.random()*particleCanvas.width;
        this.y = Math.random()*particleCanvas.height;

        this.radius = Math.random()*2+1;

        this.speedX = (Math.random()-.5)*0.4;
        this.speedY = (Math.random()-.5)*0.4;

    }

    update(){

        this.x += this.speedX;
        this.y += this.speedY;

        if(this.x<0 || this.x>particleCanvas.width)
            this.speedX *= -1;

        if(this.y<0 || this.y>particleCanvas.height)
            this.speedY *= -1;

    }

    draw(){

        ctx.beginPath();

        ctx.arc(
            this.x,
            this.y,
            this.radius,
            0,
            Math.PI*2
        );

        ctx.fillStyle="rgba(6,182,212,.45)";
        ctx.fill();

    }

}

for(let i=0;i<90;i++){

    particles.push(new Particle());

}

function animateParticles(){

    ctx.clearRect(
        0,
        0,
        particleCanvas.width,
        particleCanvas.height
    );

    particles.forEach(p=>{

        p.update();

        p.draw();

    });

    requestAnimationFrame(animateParticles);

}

animateParticles();

/*==================================================
EMAIL FORM
==================================================*/

const contactForm =
document.getElementById("contact-form");

let lastSubmit = 0;

if(contactForm){

contactForm.addEventListener("submit", async e=>{

e.preventDefault();

const now = Date.now();

if(now-lastSubmit<10000){

showToast(
"Please wait before sending another message."
);

return;

}

lastSubmit = now;

const submitButton =
contactForm.querySelector("button");

submitButton.disabled=true;

submitButton.textContent="Sending...";

try{

emailjs.init("YOUR_PUBLIC_KEY");

const response = await emailjs.sendForm(
    "YOUR_SERVICE_ID",
    "YOUR_TEMPLATE_ID",
    contactForm
);
    
submitButton.textContent="Sent ✓";

showToast(
"Message sent successfully!"
);

contactForm.reset();

setTimeout(()=>{

submitButton.disabled=false;

submitButton.textContent=
"Send Proposal Request";

},2500);

}catch(error){

console.error(error);

submitButton.disabled=false;

submitButton.textContent=
"Send Proposal Request";

showToast(
"Failed to send message."
);

}

});

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
