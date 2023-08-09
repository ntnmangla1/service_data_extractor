const multer=require('multer')
const path=require('path')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, '/Users/utkarsh.nigam/Desktop/NodeJS Practice/POC-data-Extractor/service_data_extractor/backend/src/uploads');
        console.log("hello");
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

module.exports=upload