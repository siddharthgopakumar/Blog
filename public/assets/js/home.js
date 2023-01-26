// import axios from "axios";
// use webpack and uncomment the above line

(function () {
  "use strict";
  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  var forms = document.querySelectorAll(".needs-validation");
  // Loop over them and prevent submission
  Array.prototype.slice.call(forms).forEach(function (form) {
    form.addEventListener(
      "submit",
      async function (event) {
        event.preventDefault();
        event.stopPropagation();
        if (form.checkValidity()) {
          const email = form.querySelector("input").value;
          try {
            const signUpRequest = await axios.post("/api/signup", { email });
            const { data } = signUpRequest;
            const closeModal = bootstrap.Modal.getOrCreateInstance(
              document.getElementById("staticBackdrop")
            );
            const openModal = bootstrap.Modal.getOrCreateInstance(
              document.getElementById("signUpMailConfirmation")
            );
            closeModal.hide();
            document.querySelector("#putEmail").innerHTML = email;
            openModal.show();
          } catch (error) {
            console.log(error);
          }
        }
        form.classList.add("was-validated");
      },
      false
    );
  });
})();
