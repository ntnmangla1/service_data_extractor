
// pdfjsLib.GlobalWorkerOptions.workerSrc =
// 	'https://mozilla.github.io/pdf.js/build/pdf.worker.js';

    document.querySelector('#submitButton').addEventListener('click', async (e) => {
        e.preventDefault();
        let statusBlock = document.querySelector('#result')
        let data = {
            // 'a': 'test',
            // 'b':  '200 ok',
            'Message': 'Data saving succesfully'
        }
    
        let response = await fetch('http://localhost:3001/data', {
    
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
    
            body: JSON.stringify(data),
        })
    
        let responseMessage = await response.json()
        statusBlock.innerText = responseMessage.message;
    })
    
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://mozilla.github.io/pdf.js/build/pdf.worker.js';
    function extractText(pdfUrl) {
        var pdf = pdfjsLib.getDocument(pdfUrl);
        return pdf.promise.then(function (pdf) {
            var totalPageCount = pdf.numPages;
            var countPromises = [];
            for (
                var currentPage = 1;
                currentPage <= totalPageCount;
                currentPage++
            ) {
                var page = pdf.getPage(currentPage);
                countPromises.push(
                    page.then(function (page) {
                        var textContent = page.getTextContent();
                        return textContent.then(function (text) {
                            return text.items
                                .map(function (s) {
                                    return s.str;
                                })
                                .join('');
                        });
                    }),
                );
            }
    
            return Promise.all(countPromises).then(function (texts) {
                return texts.join('');
            });
        });
    }
    
    let inputfile = document.querySelector('#fileupload')
    console.log(inputfile);
    inputfile.onchange = (e) => {
        let file = e.target.files[0];
        let fileReader = new FileReader();
        console.log(file)
        fileReader.onload = (e) => {
            let typedarray = new Uint8Array(e.target.result)
            console.log(typedarray)
            extractText(typedarray).then(
                function (text) {
                    console.log('parse' + text);
                    // let textDiv = document.querySelector('#fileText')
                    // textDiv.innerText = text
                },
                function (reason) {
                    console.error(reason);
                },
            );
        }
    
        fileReader.readAsArrayBuffer(file)
    }


