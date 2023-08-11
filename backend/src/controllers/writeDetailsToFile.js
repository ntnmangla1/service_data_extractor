const fs = require('fs')

async function saveDetails(req, res) {
    try {
        let data = req.body
        let requiredData = Object.keys(data)
            .map((key, value) => { return [key, data[key]].join('='); })
            .join('\n');
        fs.writeFileSync('data.txt', `Date: ${new Date().toLocaleString()} \n${requiredData}\n\n`, { flag: 'a+' }, err => {

            if (err) {
               return res.send("res data not saved", err)
            }
        })
        res.status(200).json({ statusMessage: "Success", message: "Data Saved Successfully!!!", data: data })
    } catch (err) {
        res.status(500).json({ statusMessage: "data get not saved due to input changes", message: err.message })
    }
}

module.exports = saveDetails;