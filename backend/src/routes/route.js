const express = require('express')
const upload = require('../middleware/multer')
const { processController, saveDetails } = require('../controllers');
const router = new express.Router();


router.post('/process', upload.single('pdfFile'), processController.processPdf);
router.post('/data', saveDetails);

module.exports = router
