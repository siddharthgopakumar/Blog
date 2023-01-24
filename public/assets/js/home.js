// import axios from "axios";
// use webpack and uncomment the above line

$("#emailInputButton").on("click", () => {
  const emailInputField = document.getElementById("emailInput");
  const email = emailInputField.value;
  console.log(email);
  if (email)
    axios
      .post("/api/SignUp", {
        email,
      })
      .then((res) => {
        console.log(res);
      });
});

(function () {
  "use strict";

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  var forms = document.querySelectorAll(".needs-validation");

  // Loop over them and prevent submission
  Array.prototype.slice.call(forms).forEach(function (form) {
    form.addEventListener(
      "submit",
      function (event) {
        event.preventDefault();
        event.stopPropagation();
        if (!form.checkValidity()) {
        } else {
          const email = $(form).find("input").val();
          console.log(email);
          const closeModal = bootstrap.Modal.getOrCreateInstance(
            document.getElementById("staticBackdrop")
          );
          const openModal = bootstrap.Modal.getOrCreateInstance(
            document.getElementById("signUpMailConfirmation")
          );
          closeModal.hide();
          $("#putEmail").html(email);
          openModal.show();
        }
        form.classList.add("was-validated");
      },
      false
    );
  });
})();
