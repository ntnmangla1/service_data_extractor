const fs = require('fs');
const pdf = require('pdf-parse');

const runOcrCommand = require('../utility/ocr'); // Import your OCR function

async function processPdf(req, res) {
    const inputFile = req.file.path;
    console.log("Body------>", req.body) 
    // console.log("Req------>", req) 

    const outputFile = 'output.pdf'; // Replace with your output file path
    try {
        runOcrCommand(inputFile, outputFile).then(() => {
            const pdfFilePath = 'output.pdf'; // Replace with your PDF file path

            // Read the PDF file
            const pdfData = fs.readFileSync(pdfFilePath);
            // if(pdfData==null){
            //     throw "not able to read pdf null"
            // }

            // Parse the PDF data
            pdf(pdfData).then(data => {
                const extractedText = data.text;

                // Now you can search for specific data in the extracted text
                const searchTerm = req.body.searchTerm; // Replace with the data you want to find

                if (extractedText.includes(searchTerm)) {
                    const startIndex = extractedText.indexOf(searchTerm);
                    const endIndex = startIndex + searchTerm.length;

                    const contextBefore = extractedText.substring(
                        Math.max(startIndex - 100, 0),
                        startIndex
                    );
                    const contextAfter = extractedText.substring(
                        endIndex,
                        Math.min(endIndex + 10, extractedText.length)
                    );

                    const highlightedContent = `${searchTerm}${contextAfter}`;
                        console.log("text--------->", highlightedContent)
                     return res.json({message : `Search term found:${highlightedContent}`});
                } else {
                   return res.json({message : `Search term found`});
                }
            });
        });
    }
    catch (e) {
        return res.error(e.message, "Process pdf failed");
    }
}

module.exports = { processPdf };
