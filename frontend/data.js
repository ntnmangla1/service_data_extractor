const express = require('express')
const fs = require('fs')

const port = process.env.PORT || 3001
const app = express()

app.use(express.json())

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
  
app.post('/data', (req,res) => {
    try{
        let data = req.body
        let requiredData = Object.keys(data)
                                 .map((key, value) => { return [key, data[key]].join('='); })
                                 .join('\n');

        fs.writeFile('data.txt', `Date: ${new Date().toLocaleString()} \n${requiredData}\n\n`,{ flag: 'a+' }, err => {
            if(err){
                console.log(err)
            }
            console.log(new Date());
        })
        
        res.status(200).json({statusMessage: "Success", message: "Data Saved Successfully!!!", data: data})
    }catch(err){
        res.status(500).json({statusMessage: "Error", message: err.message})
    }
})

app.listen(port, () => {
    console.log(`Server Started at ${port}`)
})