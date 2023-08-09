const fs = require('fs')

async function dummyApi(req, res) {
    try {
        let data = req.body
        let requiredData = Object.keys(data)
            .map((key, value) => { return [key, data[key]].join('='); })
            .join('\n');
        fs.writeFile('data.txt', `Date: ${new Date().toLocaleString()} \n${requiredData}\n\n`, { flag: 'a+' }, err => {

            if (err) {
                console.log(err)
            }
            console.log(new Date());
        })
        res.status(200).json({ statusMessage: "Success", message: "Data Saved Successfully!!!", data: data })
    } catch (err) {
        res.status(500).json({ statusMessage: "Error", message: err.message })
    }
}

module.exports = dummyApi;