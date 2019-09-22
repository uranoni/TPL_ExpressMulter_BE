var express = require('express');
var app = express();
var path = require('path')
var fs = require('fs');
var multer  = require('multer');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


const accepted_extensions = ['jpg', 'png', 'gif'];
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, `${__dirname}/uploads`)
    },
    filename: function (req, file, cb) {
        console.log()
      cb(null, file.fieldname + '-' + Date.now()+ path.extname(file.originalname))
    }
  })
const upload = multer({
    limits: { 
        fileSize: 5 * 1024 * 1024,  // 5 MB upload limit
        files: 1                    // 1 file
    },
    fileFilter: (req, file, cb) => {
        // if the file extension is in our accepted list
        if (accepted_extensions.some(ext => file.originalname.endsWith("." + ext))) {
            return cb(null, true);
        }

        // otherwise, return error
        return cb(new Error('Only ' + accepted_extensions.join(", ") + ' files are allowed!'));
    },
    storage
});

/**
 * Middleware for validating file format
 */
function validate_format(req, res, next) {
    // For MemoryStorage, validate the format using `req.file.buffer`
    // For DiskStorage, validate the format using `fs.readFile(req.file.path)` from Node.js File System Module
    let mime = fileType(req.file.path);

    // if can't be determined or format not accepted
    if(!mime || !accepted_extensions.includes(mime.ext))
        return next(new Error('The uploaded file is not in ' + accepted_extensions.join(", ") + ' format!'));
    
    next();
}


app.post('/', upload.single('avator'),(req, res) => {
    let formData = req.body;
    console.log(formData)
    var file = req.file;
    console.log('檔案型別：%s', file.mimetype);
    console.log('原始檔名：%s', file.originalname);
    console.log('檔案大小：%s', file.size);
    console.log('檔案儲存路徑：%s', file.path);
    res.send({ret_code: '0'});
});
    

    
// // 使用硬碟儲存模式設定存放接收到的檔案的路徑以及檔名
// var storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         // 接收到檔案後輸出的儲存路徑（若不存在則需要建立）
//         cb(null, 'uploads/');    
//     },
//     filename: function (req, file, cb) {
//         // 將儲存檔名設定為 時間戳 + 檔案原始名，比如 151342376785-123.jpg
//         cb(null, Date.now() + "-" + file.originalname);  
//     }
// });

// // 建立資料夾
// var createFolder = function(folder){
//     try{
//         // 測試 path 指定的檔案或目錄的使用者許可權,我們用來檢測檔案是否存在
//         // 如果檔案路徑不存在將會丟擲錯誤"no such file or directory"
//         fs.accessSync(folder); 
//     }catch(e){
//         // 資料夾不存在，以同步的方式建立檔案目錄。
//         fs.mkdirSync(folder);
//     }  
// };

// var uploadFolder = './uploads/';
// createFolder(uploadFolder);

// // 建立 multer 物件
// var upload = multer({ storage: storage });

// /* POST upload listing. */
// router.post('/', upload.single('file'), function(req, res, next) {
//     var file = req.file;
//     console.log('檔案型別：%s', file.mimetype);
//     console.log('原始檔名：%s', file.originalname);
//     console.log('檔案大小：%s', file.size);
//     console.log('檔案儲存路徑：%s', file.path);
//     // 接收檔案成功後返回資料給前端
//     res.json({res_code: '0'});
// });


app.listen(3000, () => {
    console.log("http://localhost:3000");
})