/* ==================================================
   KASITU WEBS — HOMEPAGE FOOTER FINISHER
   - Places Legal & Policies between Services and Contact.
   - Removes the unnecessary SEO footer column.
   - Closes the mobile menu on scroll.
   - Corrects the KASITU Webs contact number.
================================================== */
(function () {
    "use strict";

    const links = [
        ["Legal & Policies", "legal.html"],
        ["About Us", "about.html"],
        ["FAQ", "faq.html"],
        ["Terms & Conditions", "terms-and-conditions.html"],
        ["Privacy Policy", "privacy-policy.html"],
        ["Refund & Cancellation", "refund-policy.html"],
        ["Cookie Policy", "cookie-policy.html"],
        ["Disclaimer", "disclaimer.html"],
        ["Services & Pricing", "services-pricing.html"]
    ];

    function getFooterColumnByHeading(footerTop, headingText) {
        const heading = Array.from(
            footerTop.querySelectorAll("h1,h2,h3,h4,h5,h6")
        ).find(function (item) {
            return item.textContent.trim().toLowerCase() === headingText.toLowerCase();
        });

        if (!heading) return null;
        return heading.closest(".footer-column") || heading.parentElement;
    }

    function removeSeoColumn() {
        const footer = document.querySelector("footer.footer");
        if (!footer) return;

        const footerTop = footer.querySelector(".footer-top");
        if (!footerTop) return;

        const seoColumn = getFooterColumnByHeading(footerTop, "SEO");
        if (seoColumn && seoColumn !== footerTop) {
            seoColumn.remove();
        }
    }

    function addLegalNavigation() {
        const footer = document.querySelector("footer.footer");
        if (!footer) return;

        const footerTop = footer.querySelector(".footer-top");
        if (!footerTop) return;

        if (document.querySelector(".legal-footer-links")) return;

        const servicesColumn = getFooterColumnByHeading(footerTop, "Services");
        const contactColumn = getFooterColumnByHeading(footerTop, "Contact");

        const wrapper = document.createElement("div");
        wrapper.className = "legal-footer-links";
        wrapper.setAttribute("aria-label", "Legal and policy links");

        const title = document.createElement("h3");
        title.className = "legal-footer-title";
        title.textContent = "Legal & Policies";
        wrapper.appendChild(title);

        const nav = document.createElement("nav");
        nav.className = "legal-footer-nav";
        nav.setAttribute("aria-label", "Legal navigation");

        links.forEach(function ([label, href], index) {
            const link = document.createElement("a");
            link.href = href;
            link.textContent = label;
            nav.appendChild(link);

            if (index < links.length - 1) {
                const separator = document.createElement("span");
                separator.className = "legal-footer-separator";
                separator.setAttribute("aria-hidden", "true");
                separator.textContent = "·";
                nav.appendChild(separator);
            }
        });

        wrapper.appendChild(nav);

        /* Final required order: Services → Legal & Policies → Contact. */
        if (servicesColumn && servicesColumn !== footerTop) {
            servicesColumn.insertAdjacentElement("afterend", wrapper);
        } else if (contactColumn && contactColumn !== footerTop) {
            footerTop.insertBefore(wrapper, contactColumn);
        } else {
            footerTop.appendChild(wrapper);
        }
    }

    function correctContactNumber() {
        const footer = document.querySelector("footer.footer");
        if (!footer) return;

        footer.querySelectorAll("*").forEach(function (element) {
            if (element.children.length > 0) return;
            if (!element.textContent.includes("079 438 0103")) return;

            element.textContent = element.textContent.replace(
                /079 438 0103/g,
                "079 348 0103"
            );
        });
    }

    function closeMobileMenu() {
        const menuBtn = document.querySelector(".menu-btn");
        const mobileMenu = document.querySelector(".nav-links");

        if (!menuBtn || !mobileMenu || window.innerWidth > 900) return;

        mobileMenu.classList.remove("mobile-open");
        menuBtn.classList.remove("open");
        menuBtn.setAttribute("aria-expanded", "false");
    }

    function setupMobileMenuScrollClose() {
        let ticking = false;

        window.addEventListener("scroll", function () {
            if (ticking) return;

            ticking = true;
            requestAnimationFrame(function () {
                ticking = false;
                closeMobileMenu();
            });
        }, { passive: true });
    }

    function finishHomepageFooter() {
        removeSeoColumn();
        addLegalNavigation();
        correctContactNumber();
        setupMobileMenuScrollClose();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", finishHomepageFooter, { once: true });
    } else {
        finishHomepageFooter();
    }
})();
