const express=require('express')
const upload=require('../middleware/multer')
const processController= require('../controllers/process')
const router=new express.Router();

router.get('/', (req, res) => {
    res.render('index');
});

router.post('/process', upload.single('pdfFile'), processController.processPdf);ß


module.exports=router
