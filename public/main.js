const uiSelectors = {
  nameInputField: "#name",
  aboutInputField: "#about",
  generatePDFButton: "#submit"
};

const addEventListeners = () => {
  document
    .querySelector(uiSelectors.generatePDFButton)
    .addEventListener("click", onSubmitHandler);

  document
    .querySelector(uiSelectors.nameInputField)
    .addEventListener("focus", resetValidation);
  document
    .querySelector(uiSelectors.aboutInputField)
    .addEventListener("focus", resetValidation);
};

const onSubmitHandler = e => {
  e.preventDefault();
  let nameElement = document.querySelector(uiSelectors.nameInputField);
  let name = nameElement.value.trim();
  let aboutElement = document.querySelector(uiSelectors.aboutInputField);
  let about = aboutElement.value.trim();

  if (!validateInput(name, nameElement)) return;
  if (!validateInput(about, aboutElement)) return;

  let formData = { name, about };
  console.log(JSON.stringify(formData));
  fetch("/", {
    method: "POST",
    body: JSON.stringify(formData),
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then(res => res.blob())
    .then(function(myBlob) {
      var objectURL = URL.createObjectURL(myBlob);
      console.log(objectURL);

      const saveData = (function() {
        var a = document.createElement("a");
        document.body.appendChild(a);
        a.style = "display: none";
        return function(fileName) {
          url = window.URL.createObjectURL(myBlob);
          a.href = url;
          a.download = fileName;
          a.click();
          window.URL.revokeObjectURL(url);
        };
      })();

      saveData("new_pdf.pdf");
    })
    .then(res => {
      clearFormInputs([nameElement, aboutElement]);
    })
    .catch(error => console.log("Error:", error));
};

const validateInput = (value, element) => {
  if (value.length < 1) {
    element.style.border = "1px solid red";
    return false;
  }
  return true;
};

const resetValidation = e => {
  e.target.style.border = "none";
};

const clearFormInputs = elements => {
  elements.forEach(element => {
    element.value = "";
  });
};
addEventListeners();
