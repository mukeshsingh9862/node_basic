const multer = require("multer");
const path = require('path')

const storage = multer.diskStorage({
    destination: path.join(__dirname, '../', '../', 'public/', 'uploads'),
    filename(req: any, file: any, cb: any) {
        let num = Math.round(
            Math.pow(36, 10 + 1) - Math.random() * Math.pow(36, 10)
        )
            .toString(36)
            .slice(1);
        const fileName =file.originalname.split(' ').join('');
        cb(null, fileName);
    },
});
const fileFilter = function (req: any, file: Express.Multer.File, callback: any) {
    const mime = file.mimetype;
    
    if (!mime.includes('image/png') && !mime.includes('image/jpeg') && !mime.includes('image/jpg') && !mime.includes('video/mpeg')) {
    // if (!mime.includes('image') && !mime.includes('pdf') && !mime.includes('mp4')) {
        req.filevalidationerror = 'Only image, pdf and mp4 files are allowed';
        return callback(null, false)
    }
    callback(null, true);
}

export default multer({
    storage: storage,
    limits: { fileSize: 100 * 1048576 }, // 100 mb
    fileFilter
});