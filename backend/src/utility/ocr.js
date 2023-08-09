const util = require('util');
const exec = util.promisify(require('child_process').exec);

async function runOcrCommand(inputFile, outputFile) {
    const ocrCommand = `ocrmypdf -l spa --output-type pdfa --optimize 3 --skip-text "${inputFile}" "${outputFile}"`;

    try {
        const { stdout, stderr } = await exec(ocrCommand);
        console.log('Output:', stdout);
        if (stderr) {
            console.error('Error:', stderr);
        } else {
            console.log('OCR completed successfully.');
        }
    } catch (error) {
        console.error('Error:', error.message);
    }
}

module.exports= runOcrCommand;
