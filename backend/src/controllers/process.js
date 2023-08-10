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

                const searchArray = searchTerm.split(',').map(value=>value.trim())
                console.log(searchTerm)

                const responseArray = [];

                searchArray.forEach(term=>{
                    if (extractedText.includes(term)) {
                        const startIndex = extractedText.indexOf(term);
                        const endIndex = startIndex + term.length;
    
                        const contextAfter = extractedText.substring(
                            endIndex,
                            Math.min(endIndex + 200, extractedText.length)
                        );

                        const newLineindex=contextAfter.indexOf('\n')
                        const temp= "Message: "

                        // let highlightedContent= `${temp}${term}${contextAfter}`
                        // responseArray.push(highlightedContent)

                        if(newLineindex!==-1){
                            const finalAfter=contextAfter.slice(0,newLineindex)
                            let highlightedContent = `${temp}${term}${finalAfter}`;
                            responseArray.push(highlightedContent)
                        }
                        else{
                            let highlightedContent = `${temp}${term}${contextAfter}`;
                            responseArray.push(highlightedContent)
                        }
                        

                        
    
                        
                        // res.json({message : `Search term found:${highlightedContent}`});
                    } else {
                    //    return res.json({message : `Search term not found`});
                        responseArray.push('Not found')
                    }
                })

                res.send(responseArray)
            });
        });
    }
    catch (e) {
        return res.error(e.message, "Process pdf failed");
    }
}

module.exports = { processPdf };
