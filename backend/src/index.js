const express = require('express')
const router=require('./routes/route')
const path = require('path');
const cors = require('cors');

const app = express()
app.use(cors())
const port = 3000;
app.use(express.json())
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true })); 
app.use(function(req, res, next) {

    res.header("Access-Control-Allow-Origin", "*");

    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    next();

  });
app.use(router)


app.listen(port, ()=>{
    console.log(`Server is Running on port ${port}`);
})