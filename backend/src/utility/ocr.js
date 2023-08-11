const util = require('util');
const exec = util.promisify(require('child_process').exec);

async function runOcrCommand(inputFile, outputFile) {
    const ocrCommand = `ocrmypdf -l spa --output-type pdfa --optimize 3 --skip-text "${inputFile}" "${outputFile}"`;

    try {
        const { stdout, stderr } = await exec(ocrCommand);
    } catch (error) {
      return error.message;
    }
}

module.exports= runOcrCommand;
