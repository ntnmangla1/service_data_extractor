import React, { useState } from 'react';
import './App.css'; // Import your CSS file for custom styles


const App = () => {
  const [pdfFile, setPdfFile] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [responseString, setResponseString] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Track loading state

  const handleFileChange = (event) => {
    setPdfFile(event.target.files[0]);
  };

  const handleSearchTermChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!pdfFile) {
      alert('Please select a PDF file.');
      return;
    }

    try {
      console.log("PDF-------->", pdfFile.name)

      const formData = new FormData();
      formData.append('pdfFile', pdfFile, pdfFile.name); // Append the actual file
      console.log("hello");
      formData.append('searchTerm', searchTerm);
      console.log("formdata-------->", formData)
      
      setIsLoading(true); // Set loading state

      const response = await fetch('http://localhost:3000/process', {
        method: 'POST',
        body: formData,
      });
      console.log('response--------->', JSON.stringify(response))
      setIsLoading(false); // Reset loading state

      if (response.ok) {
        const data = await response.json();
        console.log("data--------------->", data);
        setResponseString(data);
        console.log("strung data",setResponseString(data.message));
      } else {
        setResponseString("data not found");
        console.error('API request failed.');
      }
    } catch (error) {
      setIsLoading(false); // Reset loading state
      console.error('An error occurred:', error);
    }
  };

  return (
    <div className="app-container">
      <h1>PDF Search and Response</h1>
      <form className="search-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="pdfFile">Select PDF File:</label>
          <input type="file" id="pdfFile" accept=".pdf" onChange={handleFileChange} />
        </div>
        <div className="form-group">
          <label htmlFor="searchTerm">Search Term:</label>
          <input type="text" id="searchTerm" value={searchTerm} onChange={handleSearchTermChange} />
        </div>
        <button className="submit-button" type="submit" disabled={isLoading}>
          {isLoading ? 'Loading...' : 'Submit'}
        </button>
      </form>
      <div className="response-container">
        <h2>Response:</h2>
        <p className="response-text">{responseString}</p>
        <button className="save-button" >
          Save Response
        </button>
      </div>
    </div>
  );
};



export default App;
