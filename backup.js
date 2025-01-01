const form = document.getElementById("form");
const submitMessage = document.getElementById("submitMessage");
const submitButton = document.getElementById("submit-button");

const uploadFile = () => {
  const marksheet10th = document.getElementById("marksheet-10th");
  const marksheet12th = document.getElementById("marksheet-12th");
  const URL_UPLOAD_IMG =
    "https://script.google.com/macros/s/AKfycbwSOe18CKiN1bLOVjGZPap3QlzfL2eVMHLZgpx0_DG-SNCpv2MF8GfRlY8S-ItcUrD8/exec";

  if (
    !marksheet10th ||
    !marksheet10th.files ||
    marksheet10th.files.length === 0 ||
    !marksheet12th ||
    !marksheet12th.files ||
    marksheet12th.files.length === 0
  ) {
    console.error("No file selected. Please select both files to upload.");
    return;
  }

  const readFile = (file) =>
    new Promise((resolve, reject) => {
      const fr = new FileReader();
      fr.readAsDataURL(file);

      fr.addEventListener("loadend", () => {
        const res = fr.result;
        const base64 = res.split("base64,")[1];
        resolve({
          base64: base64,
          type: file.type,
          name: file.name,
        });
      });

      fr.onerror = () => reject(new Error(`Failed to read file: ${file.name}`));
    });

  const file1 = marksheet10th.files[0];
  const file2 = marksheet12th.files[0];
  let payloadData = [];
  Promise.all([readFile(file1), readFile(file2)])
    .then(([file1Data, file2Data]) => {
      const payload = {
        files: [file1Data, file2Data],
      };
      payloadData = [...payload.files];
      console.log(payloadData);

      // fetch(URL_UPLOAD_IMG, {
      //   method: "POST",
      //   mode: "no-cors",
      //   body: JSON.stringify(payload),
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      // })
      //   .then((response) => {
      //     if (!response.ok) {
      //       throw new Error(`HTTP error! Status: ${response.status}`);
      //     }
      //     return response.text();
      //   })
      //   .then((data) => {
      //     console.log("Upload successful:", data);
      //   })
      //   .catch((error) => {
      //     console.error("Error uploading files:", error);
      //   });
    })
    .catch((error) => {
      console.error("Error preparing files:", error);
      // return error;
    });
  return payloadData;
};

// insert data in google sheet
const insertData = () => {
  
};

// ------- Action performed when the form is submitted -------
form.addEventListener("submit", function (e) {
  e.preventDefault();
  submitMessage.textContent = "Submitting..";
  submitMessage.style.display = "block";
  submitButton.disabled = true;

  // Collect the form data
  var formData = new FormData(this);
  var keyValuePairs = [];
  for (var pair of formData.entries()) {
    keyValuePairs.push(pair[0] + "=" + pair[1]);
  }
  // let uploadData = uploadFile();
  // console.log("data:", uploadData);

  console.log(keyValuePairs[0]);
  var formDataString = keyValuePairs.join("&");

  const URL = "";
  // Send a POST request to your Google Apps Script
  fetch(URL, {
    redirect: "follow",
    method: "POST",
    body: formDataString,
    headers: {
      "Content-Type": "text/plain;charset=utf-8",
    },
  })
    .then(function (response) {
      if (response) {
        return response; // Assuming your script returns JSON response
      } else {
        throw new Error("Failed to submit the form.");
      }
    })
    .then(function (data) {
      displaySuccessMessage();
    })
    .catch(function (error) {
      // Handle errors, you can display an error message here
      console.error(error);
      submitMessage.textContent =
        "An error occurred while submitting the form.";
      submitMessage.style.display = "block";
    });
});

const displaySuccessMessage = () => {
  submitMessage.textContent = "Data submitted successfully!";
  submitMessage.style.display = "block";
  submitMessage.style.backgroundColor = "green";
  submitMessage.style.color = "beige";
  submitButton.disabled = false;
  form.reset();

  setTimeout(function () {
    submitMessage.textContent = "";
    submitMessage.style.display = "none";
  }, 2600);
};
