/* ==================================================
   KASITU WEBS — LEGAL FOOTER LINKS
   Injects the legal/policy navigation into the
   existing homepage footer without replacing index.html.
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

    function addLegalFooter() {
        const footer = document.querySelector("footer.footer");
        if (!footer || document.querySelector(".legal-footer-links")) return;

        const bottom = footer.querySelector(".footer-bottom");
        if (!bottom) return;

        const wrapper = document.createElement("div");
        wrapper.className = "legal-footer-links";
        wrapper.setAttribute("aria-label", "Legal and policy links");

        const heading = document.createElement("span");
        heading.className = "legal-footer-title";
        heading.textContent = "Legal & Policies";
        wrapper.appendChild(heading);

        const nav = document.createElement("nav");
        nav.className = "legal-footer-nav";
        nav.setAttribute("aria-label", "Legal navigation");

        links.forEach(function ([label, href]) {
            const link = document.createElement("a");
            link.href = href;
            link.textContent = label;
            nav.appendChild(link);
        });

        wrapper.appendChild(nav);
        footer.insertBefore(wrapper, bottom);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", addLegalFooter, { once: true });
    } else {
        addLegalFooter();
    }
})();
