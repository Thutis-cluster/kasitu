/* ==================================================
   KASITU BUSINESS REGISTRATION PRICE MODAL
================================================== */

document.addEventListener("DOMContentLoaded", function () {

    const button = document.getElementById(
        "business-registration-btn"
    );

    const modal = document.getElementById(
        "business-price-modal"
    );

    const closeButton = document.getElementById(
        "business-price-close"
    );

    const backdrop = document.getElementById(
        "business-price-backdrop"
    );

    const contactButton = document.getElementById(
        "business-price-contact"
    );


    /* CHECK ELEMENTS */

    if (!button) {
        console.error(
            "KASITU: Business Registration button not found."
        );
        return;
    }

    if (!modal) {
        console.error(
            "KASITU: Business Registration modal not found."
        );
        return;
    }


    /* OPEN MODAL */

    function openBusinessModal() {

        modal.classList.add("active");

        modal.setAttribute(
            "aria-hidden",
            "false"
        );

        document.body.style.overflow = "hidden";

    }


    /* CLOSE MODAL */

    function closeBusinessModal() {

        modal.classList.remove("active");

        modal.setAttribute(
            "aria-hidden",
            "true"
        );

        document.body.style.overflow = "";

    }


    /* OPEN */

    button.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            openBusinessModal();

        }
    );


    /* CLOSE BUTTON */

    if (closeButton) {

        closeButton.addEventListener(
            "click",
            closeBusinessModal
        );

    }


    /* BACKDROP */

    if (backdrop) {

        backdrop.addEventListener(
            "click",
            closeBusinessModal
        );

    }


    /* GET STARTED */

    if (contactButton) {

        contactButton.addEventListener(
            "click",
            closeBusinessModal
        );

    }


    /* ESCAPE */

    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Escape" &&
                modal.classList.contains("active")
            ) {

                closeBusinessModal();

            }

        }
    );


    console.log(
        "KASITU Business Registration Modal Loaded ✓"
    );

});
