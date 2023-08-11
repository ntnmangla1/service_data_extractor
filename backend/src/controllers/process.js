const fs = require('fs');
const pdf = require('pdf-parse');

const runOcrCommand = require('../utility/ocr'); // Import your OCR function

async function processPdf(req, res) {
    const inputFile = req.file.path;
    const outputFile = 'output.pdf'; // Replace with your output file path
    try {
        runOcrCommand(inputFile, outputFile).then(() => {
            const pdfFilePath = 'output.pdf'; // Replace with your PDF file path

            // Read the PDF file
            const pdfData = fs.readFileSync(pdfFilePath);
            pdf(pdfData).then(data => {
                const extractedText = data.text;

                // Now you can search for specific data in the extracted text
                const searchTerm = req.body.searchTerm; // Replace with the data you want to find

                const searchArray = searchTerm.split(',').map(value => value.trim())

                const responseArray = [];

                let findingParameter = req.body.findingParameter
                if (findingParameter == 'all') {
                    searchArray.forEach(term => {
                        const indices = [...extractedText.matchAll(new RegExp(term, 'gi'))].map(a => a.index);
                        if (indices.length===0) {
                            responseArray.push('Not Found')
                        }
                        else {
                            indices.forEach(index => {

                                const startIndex = index;
                                const endIndex = startIndex + term.length;

                                const contextBefore = extractedText.substring(
                                    Math.max(startIndex - 100, 0),
                                    startIndex
                                );

                                const contextAfter = extractedText.substring(
                                    endIndex,
                                    Math.min(endIndex + 200, extractedText.length)
                                );

                                let backLineIndex = contextBefore.lastIndexOf('\n')
                                backLineIndex += 2
                                const newLineindex = contextAfter.indexOf('\n')

                                if (newLineindex && backLineIndex) {
                                    let finalAfter = contextAfter.slice(0, newLineindex)
                                    let finalBefore = contextBefore.slice(backLineIndex, startIndex)
                                    let highlightedContent = `${term}: ${finalBefore}${term}${finalAfter}`
                                    responseArray.push(highlightedContent)
                                } else if (backLineIndex) {
                                    let finalBefore = contextBefore.slice(backLineIndex, startIndex)
                                    let highlightedContent = `${term}: ${finalBefore}${term}${contextAfter}`
                                    responseArray.push(highlightedContent)
                                } else if (newLineindex) {
                                    let finalAfter = contextAfter.slice(0, newLineindex)
                                    let highlightedContent = `${term}: ${contextBefore}${term}${finalAfter}`
                                    responseArray.push(highlightedContent)

                                } else {
                                    let highlightedContent = `${term}: ${contextBefore}${term}${contextAfter}`
                                    responseArray.push(highlightedContent)

                                }
                            })
                        }
                    })
                } else if (findingParameter == 'first') {

                    searchArray.forEach(term => {
                        if (extractedText.includes(term)) {
                            const startIndex = extractedText.indexOf(term);
                            const endIndex = startIndex + term.length;

                            const contextBefore = extractedText.substring(
                                Math.max(startIndex - 100, 0),
                                startIndex
                            );
                            const contextAfter = extractedText.substring(
                                endIndex,
                                Math.min(endIndex + 200, extractedText.length)
                            );

                            let backLineIndex = contextBefore.lastIndexOf('\n')
                            backLineIndex += 2
                            const newLineindex = contextAfter.indexOf('\n')

                            if (newLineindex && backLineIndex) {
                                let finalAfter = contextAfter.slice(0, newLineindex)
                                let finalBefore = contextBefore.slice(backLineIndex, startIndex)
                                let highlightedContent = `${term}: ${finalBefore}${term}${finalAfter}`
                                responseArray.push(highlightedContent)
                            } else if (backLineIndex) {
                                let finalBefore = contextBefore.slice(backLineIndex, startIndex)
                                let highlightedContent = `${term}: ${finalBefore}${term}${contextAfter}`
                                responseArray.push(highlightedContent)
                            } else if (newLineindex) {
                                let finalAfter = contextAfter.slice(0, newLineindex)
                                let highlightedContent = `${term}: ${contextBefore}${term}${finalAfter}`
                                responseArray.push(highlightedContent)

                            } else {
                                let highlightedContent = `${term}: ${contextBefore}${term}${contextAfter}`
                                responseArray.push(highlightedContent)

                            }
                        } else {
                            responseArray.push('Not found')
                        }
                    })

                }


                res.send(responseArray)
            });
        });
    }
    catch (e) {
        return res.error(e.message, "Process pdf failed");
    }
}

module.exports = { processPdf };
