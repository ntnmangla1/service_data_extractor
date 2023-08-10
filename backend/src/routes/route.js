const express = require('express')
const upload = require('../middleware/multer')
const processController = require('../controllers/process')
const dummyApi = require('../controllers/dummyapi')
const router = new express.Router();




router.post('/process', upload.single('pdfFile'), processController.processPdf);
router.post('/data',dummyApi);

module.exports = router
