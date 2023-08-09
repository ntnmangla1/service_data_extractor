const express = require('express')
const router=require('./routes/route')
const path = require('path');

const app = express()
const port = 3000;

app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true })); 
app.use(router)


app.listen(port, ()=>{
    console.log(`Server is Running on port ${port}`);
})