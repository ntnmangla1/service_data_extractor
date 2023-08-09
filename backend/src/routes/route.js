const express=require('express')
const upload=require('../middleware/multer')
const processController= require('../controllers/process')
const router=new express.Router();



router.post('/process', upload.single('pdfFile'), processController.processPdf);


module.exports=router
