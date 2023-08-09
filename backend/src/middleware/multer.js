const multer=require('multer')
const path=require('path')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        console.log("hello");
        cb(null, path.join("/Users/mahavir.goyal/Desktop/project_Pdf/service_data_extractor/backend/src/uploads"));
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

module.exports=upload