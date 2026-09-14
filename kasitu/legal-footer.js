/* ==================================================
   KASITU WEBS — HOMEPAGE LEGAL NAVIGATION
   Places Legal & Policies between Contact and SEO.
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
        if (!footer || document.querySelector(".kasitu-home-legal-links")) return;

        const footerTop = footer.querySelector(".footer-top");
        if (!footerTop) return;

        const seoHeading = Array.from(footerTop.querySelectorAll("h1,h2,h3,h4,h5,h6"))
            .find(function (heading) {
                return heading.textContent.trim().toLowerCase() === "seo";
            });

        const wrapper = document.createElement("div");
        wrapper.className = "kasitu-home-legal-links";
        wrapper.setAttribute("aria-label", "Legal and policy links");

        const heading = document.createElement("span");
        heading.className = "kasitu-home-legal-title";
        heading.textContent = "Legal & Policies";
        wrapper.appendChild(heading);

        const nav = document.createElement("nav");
        nav.className = "kasitu-home-legal-nav";
        nav.setAttribute("aria-label", "Legal navigation");

        links.forEach(function ([label, href]) {
            const link = document.createElement("a");
            link.href = href;
            link.textContent = label;
            nav.appendChild(link);
        });

        wrapper.appendChild(nav);

        /* Insert immediately before the SEO column. */
        if (seoHeading) {
            const seoColumn = seoHeading.closest("div");
            if (seoColumn && seoColumn !== footerTop) {
                footerTop.insertBefore(wrapper, seoColumn);
                return;
            }
        }

        /* Safe fallback: place after the footer column containing Contact. */
        const contactHeading = Array.from(footerTop.querySelectorAll("h1,h2,h3,h4,h5,h6"))
            .find(function (heading) {
                return heading.textContent.trim().toLowerCase() === "contact";
            });
        const contactColumn = contactHeading && contactHeading.closest("div");

        if (contactColumn && contactColumn !== footerTop) {
            contactColumn.insertAdjacentElement("afterend", wrapper);
        } else {
            footerTop.appendChild(wrapper);
        }
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", addLegalNavigation, { once: true });
    } else {
        addLegalNavigation();
    }
})();
