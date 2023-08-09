// Wait for the DOM content to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // Get references to the form and result elements
  const uploadForm = document.getElementById('uploadForm');
  const resultDiv = document.getElementById('result');

  // Add an event listener for form submission
  uploadForm.addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission behavior

    // Get the selected PDF file and parameters
    const pdfFile = document.getElementById('pdfFile').files[0];
    const parameters = document.getElementById('parameters').value;

    // Check if a PDF file was selected
    if (!pdfFile) {
      alert('Please select a PDF file.');
      return;
    }

    // Create a FormData object to send the file and parameters
    const formData = new FormData();
    formData.append('pdfFile', pdfFile);
    formData.append('parameters', parameters);

    // Send the FormData to the backend using Fetch API
    fetch('http://localhost:3000/process', {
      method: 'POST',
      body: formData
    })
    .then(response => response.json())
    .then(data => {
      // Clear the resultDiv before displaying new data
      resultDiv.innerHTML = ''; 

      // Loop through the extracted data and create HTML elements
      for (const parameter in data) {
        const extractedData = data[parameter];
        const parameterDiv = document.createElement('div');
        parameterDiv.innerHTML = `
          <h3>${parameter}</h3>
          ${extractedData.join('<br>')}
        `;
        resultDiv.appendChild(parameterDiv);
      }
    })
    .catch(error => {
      console.error('Error:', error);
      alert('An error occurred while extracting data.');
    });
  });

  // Add an event listener for the "Submit Data" button
  const submitButton = document.getElementById('submitButton');
  submitButton.addEventListener('click', function() {
    // Create an array to store the extracted data
    const extractedDataArray = [];

    // Loop through each "pre" element within the resultDiv
    resultDiv.querySelectorAll('pre').forEach(pre => {
      const parameter = pre.previousElementSibling.textContent;
      const extractedData = pre.textContent.split('\n');
      extractedDataArray.push({ parameter, data: extractedData });
    });

    // Send the extractedDataArray to the dummy server using Fetch API
    // fetch('http://localhost:3000/extractedData', {
    //   method: 'POST',
    //   body: JSON.stringify(extractedDataArray),
    //   headers: {
    //     'Content-Type': 'application/json'
    //   }
    // })
    // .then(response => response.json())
    // .then(data => {
    //   alert('Data submitted successfully!');
    // })
    // .catch(error => {
    //   console.error('Error:', error);
    //   alert('An error occurred while submitting data.');
    // });
  });
});
