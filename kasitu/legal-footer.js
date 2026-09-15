/* ==================================================
   KASITU WEBS — HOMEPAGE LEGAL NAVIGATION
   Places Legal & Policies between Contact and SEO.
   Links are displayed next to each other.
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

    function addLegalNavigation() {
        const footer = document.querySelector("footer.footer");
        if (!footer || document.querySelector(".legal-footer-links")) return;

        const footerTop = footer.querySelector(".footer-top");
        if (!footerTop) return;

        const headings = Array.from(footerTop.querySelectorAll("h1,h2,h3,h4,h5,h6"));

        const seoHeading = headings.find(function (heading) {
            return heading.textContent.trim().toLowerCase() === "seo";
        });

        const contactHeading = headings.find(function (heading) {
            return heading.textContent.trim().toLowerCase() === "contact";
        });

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

        /* Preferred position: immediately before the SEO column. */
        if (seoHeading) {
            const seoColumn = seoHeading.closest(".footer-column") || seoHeading.parentElement;
            if (seoColumn && seoColumn !== footerTop) {
                footerTop.insertBefore(wrapper, seoColumn);
                return;
            }
        }

        /* Fallback: immediately after the Contact column. */
        if (contactHeading) {
            const contactColumn = contactHeading.closest(".footer-column") || contactHeading.parentElement;
            if (contactColumn && contactColumn !== footerTop) {
                contactColumn.insertAdjacentElement("afterend", wrapper);
                return;
            }
        }

        footerTop.appendChild(wrapper);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", addLegalNavigation, { once: true });
    } else {
        addLegalNavigation();
    }
})();
