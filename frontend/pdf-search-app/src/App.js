import React, { useState } from 'react';
import './App.css'; // Import your CSS file for custom styles


const App = () => {
  const [pdfFile, setPdfFile] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOption, setSelectedOption] = useState('first');
  // const [responseString, setResponseString] = useState('');
  const [responseArray, setResponseArray] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // Track loading state

  const handleFileChange = (event) => {
    setPdfFile(event.target.files[0]);
  };

  const handleSearchTermChange = (event) => {
      setSearchTerm(event.target.value);
  };
  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!pdfFile) {
      alert('Please select a PDF file.');
      return;
    }
    if(searchTerm==="" || searchTerm==="/n"){
      alert('Please add search term');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('pdfFile', pdfFile, pdfFile.name); // Append the actual file
      formData.append('searchTerm', searchTerm);
      formData.append('findingParameter', selectedOption);
      
      setIsLoading(true); // Set loading state

      const response = await fetch('http://localhost:3000/process', {
        method: 'POST',
        body: formData,
      });
      if(response==null){
        alert('network problem');
      return;
      }
      setIsLoading(false); // Reset loading state
     if (response.ok) {
        const data = await response.json();
        // setResponseString(data);
        setResponseArray(data);
        // console.log("strung data",setResponseString(data));
      } else {

        alert('API request failed. Please check your network connection.');
        setIsLoading(false);
        return;
      }
    } catch (error) {
      setIsLoading(false); // Reset loading state
      console.error('An error occurred:', error);
    }
  };
  const handleSave = async () => {
    try {
      let temp = false;
      responseArray.forEach((element, index)=>{
       if(element!=="Not found"){
        temp = true;
       }
      })
      if(!temp){
        alert('No response to save.');
        return;
      }

      if (responseArray.length === 0) {
        alert('No response to save.');
        return;
      }

      const saveResponse = await fetch('http://localhost:3000/data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ response: responseArray }),
      });

      if (saveResponse.ok) {
        alert('Response saved successfully.');
      } else {
        alert('Failed to save response.');
      }
    } catch (error) {
      console.error('An error occurred while saving response:', error);
    }
  };

  return (
    <div className="app-container">
      <h1>PDF Search and Response</h1>
      <form className="search-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="pdfFile">Select PDF File</label>
          <input type="file" id="pdfFile" accept=".pdf" onChange={handleFileChange} />
        </div>
        <div className="form-group">
          <label htmlFor="searchTerm">Search Term</label>
          <input type="text" id="searchTerm" value={searchTerm} onChange={handleSearchTermChange} />
        </div>
        <div className="form-group">
          <label>Select Option</label>
          <div className="radio-group">
            <label>
              <input
                type="radio"
                value="first"
                checked={selectedOption === "first"}
                onChange={handleOptionChange}
              />
              First Occurence
            </label>
            <label>
              <input
                type="radio"
                value="all"
                checked={selectedOption === "all"}
                onChange={handleOptionChange}
              />
              All Occurences
            </label>
          </div>
          </div>
        <button className="submit-button" type="submit" disabled={isLoading}>
          {isLoading ? 'Loading...' : 'Submit'}
        </button>
      </form>
      <div className="response-container">
        <h2>Response</h2>
        {responseArray.length > 0 ? (
          <table className="response-table">
            <thead>
              <tr>
                <th>Index</th>
                <th>Response Item</th>
              </tr>
            </thead>
            <tbody>
              {responseArray.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="response-text"></p>
        )}
        <button className="save-button" onClick={handleSave}>
          Save Response
        </button>
      </div>
    </div>
  );
};

export default App;