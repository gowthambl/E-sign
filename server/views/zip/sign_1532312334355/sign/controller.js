/* Method */

    router.get('/sign', Uploader.sign);
    router.post('/signcode', Uploader.signcode);

    router.get('/uploadsign', Uploader.uploadsign);
    router.post('/postsign', Uploader.Postsign);




/* Controller */

import multer from 'multer';
import path from 'path';
import fs from 'fs';




const signupload = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.dirname(require.main.filename) + "\\views\\signupload")
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname.split('.')[file.originalname.split('.').length - 2] +
            '-' + Date.now() + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1])
    }
});

const signature = multer({
    storage: signupload,
    fileFilter: (req, file, callback) => {
        if (['png', 'jpg', 'svg'].indexOf(file.originalname.split('.')[file.originalname.split('.').length - 1]) === -1) {
            req.fileValidationError = 'Invalid Image Extension';
            return callback(null, false, new Error('Invalid File Extension'));
        }
        callback(null, true);
    }
}).single('file');



    /* Draw Signature */

    static sign(req, res) {
        return FileModel.find({}).then(data => {
            res.render('sign', { data: data });
        })
    }

    static signcode(req, res) {
        console.log(req.body)
        const signDetails = {
            sign: req.body.encode,
            date: new Date().toDateString(),
        }
        UploadFile.saveSign(signDetails).then(data => {
            // res.render('list', {data: data})
        })
    }


    static saveSign(signDetails) {
        return signModel(signDetails).save().then(result => {
            return signModel.find({});
        })
    }


    /* Upload Image Signature */
    static uploadsign(req, res) {
        return FileModel.find({}).then(data => {
            res.render('uploadsign', { data: data });
        })
    }

    static Postsign(req, res) {
        signature(req, res, () => {
            if (req.fileValidationError) {
                res.render('uploadsign', { title: 'uploaded invalid file' })
            }
            else {
                const uploadDetails = {
                    fileName: req.file.filename,
                    originalName: req.file.originalname,
                    date: new Date().toDateString(),
                    size: req.file.size,
                    type: req.file.path.split(".")[req.file.path.split(".").length - 1],
                    path: req.file.path
                }
                //let base64Image;
                let data = fs.readFileSync(req.file.path) 
				//console.log(data);
                let extensionName = path.extname(req.file.path);
                let base64Image = new Buffer(data, 'binary').toString('base64');
                let imgSrcString = `data:image/${extensionName.split('.').pop()};base64,${base64Image}`;
                console.log('string', imgSrcString)


                UploadFile.saveFile(uploadDetails).then(data => {
                    return signModel(uploadDetails).save().then(result => {
                                 return signModel.find({});
                    })
                })
            }
        })
    }
