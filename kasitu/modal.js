/* ==================================================
   KASITU BUSINESS REGISTRATION PRICE MODAL
================================================== */

const businessRegistrationBtn =
    document.getElementById(
        "business-registration-btn"
    );

const businessPriceModal =
    document.getElementById(
        "business-price-modal"
    );

const businessPriceClose =
    document.getElementById(
        "business-price-close"
    );

const businessPriceBackdrop =
    document.getElementById(
        "business-price-backdrop"
    );

const businessPriceContact =
    document.getElementById(
        "business-price-contact"
    );


/* OPEN */

function openBusinessPriceModal() {

    if (!businessPriceModal) return;

    businessPriceModal.classList.add("active");

    businessPriceModal.setAttribute(
        "aria-hidden",
        "false"
    );

    document.body.style.overflow = "hidden";
}


/* CLOSE */

function closeBusinessPriceModal() {

    if (!businessPriceModal) return;

    businessPriceModal.classList.remove("active");

    businessPriceModal.setAttribute(
        "aria-hidden",
        "true"
    );

    document.body.style.overflow = "";
}


/* SERVICE CARD BUTTON */

if (businessRegistrationBtn) {

    businessRegistrationBtn.addEventListener(
        "click",
        openBusinessPriceModal
    );

}


/* CLOSE BUTTON */

if (businessPriceClose) {

    businessPriceClose.addEventListener(
        "click",
        closeBusinessPriceModal
    );

}


/* BACKDROP */

if (businessPriceBackdrop) {

    businessPriceBackdrop.addEventListener(
        "click",
        closeBusinessPriceModal
    );

}


/* CONTACT BUTTON */

if (businessPriceContact) {

    businessPriceContact.addEventListener(
        "click",
        closeBusinessPriceModal
    );

}


/* ESCAPE KEY */

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Escape" &&
            businessPriceModal &&
            businessPriceModal.classList.contains("active")
        ) {

            closeBusinessPriceModal();

        }

    }
);
