import axios from "axios";
declare var bootstrap: any;
import "../../scss/style.scss";

const sendVerificationMail = async (email: string, isSignIn: boolean) => {
  try {
    const requestUrl = `/api/${isSignIn ? "signin" : "signup"}`;
    const signUpRequest = await axios.post(requestUrl, { email });
    const { data } = signUpRequest;
    const closeSignUpModal = bootstrap.Modal.getOrCreateInstance(
      document.getElementById("signUpModal")
    );
    const closeSignInModal = bootstrap.Modal.getOrCreateInstance(
      document.getElementById("signInModal")
    );
    const openModal = bootstrap.Modal.getOrCreateInstance(
      document.getElementById("signUpMailConfirmation")
    );
    closeSignUpModal.hide();
    closeSignInModal.hide();
    const emailDiv = <HTMLSpanElement>(
      document.querySelector("#signupConfirmationMessage")
    );
    emailDiv.innerHTML = `Check the link we have send to ${email} to complete your account set up.`;
    openModal.show();
  } catch (error) {
    console.log(error);
  }
};

(function () {
  "use strict";
  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  var forms = document.querySelectorAll(".needs-validation");
  // Loop over them and prevent submission
  Array.prototype.slice.call(forms).forEach(function (form) {
    form.addEventListener(
      "submit",
      async function (event: {
        target: any;
        preventDefault: () => void;
        stopPropagation: () => void;
      }) {
        event.preventDefault();
        event.stopPropagation();
        const isSignIn = event.target.getAttribute("data-tt-name") == "sign-in";
        if (form.checkValidity()) {
          const email = form.querySelector("input").value;
          await sendVerificationMail(email, isSignIn);
        }
        form.classList.add("was-validated");
      },
      false
    );
  });
})();
