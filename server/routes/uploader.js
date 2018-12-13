import multer from 'multer';
import path from 'path';
import FileModel from './../helpers/db/fileModel'
import signModel from './../helpers/db/signModel'
import mammoth from "mammoth";
import fs from 'fs';
import nodeMailer from 'nodemailer';


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.dirname(require.main.filename) + "\\views\\files")
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname.split('.')[file.originalname.split('.').length - 2] +
            '-' + Date.now() + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1])
    }
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, callback) => {
        if (['pdf', 'docx', 'txt'].indexOf(file.originalname.split('.')[file.originalname.split('.').length - 1]) === -1) {
            req.fileValidationError = 'Invalid File Extension';
            return callback(null, false, new Error('Invalid File Extension'));
        }
        callback(null, true);
    }
}).single('file');




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





export default class UploadFile {
    static Upload(req, res) {
        upload(req, res, () => {
            if (req.fileValidationError) {
                res.render('index', { title: 'uploaded invalid file' })
            }
            else {
                const fileDetails = {
                    fileName: req.file.filename,
                    originalName: req.file.originalname,
                    date: new Date().toDateString(),
                    size: req.file.size,
                    type: req.file.path.split(".")[req.file.path.split(".").length - 1],
                    path: req.file.path
                }
                UploadFile.saveFile(fileDetails).then(data => {
                    res.render('list', { data: data })
                })
            }
        })
    }

    static list(req, res) {
        return FileModel.find({}).then(data => {
            res.render('list', { data: data });
        })
    }

    static viewer(req, res) {
        if (req.query.type === "pdf") {
            res.render('viewer', { data: req.query.name, name: req.query.name.split('-')[0] });
            // console.log(req.query.name.split('-')[0]);
        }
        else if (req.query.type === "docx") {
            mammoth.convertToHtml({ path: path.dirname(require.main.filename) + "\\views\\files\\" + req.query.name })
                .then(function (result) {
                    let html = result.value;
                    let messages = result.messages;
                    res.render('docviewer', { data: html, filename: req.query.name.split('-')[0] });
                })
                .done();
        }
        else if (req.query.type === "txt") {
            fs.readFile(path.dirname(require.main.filename) + "\\views\\files\\" + req.query.name, 'utf8', function (err, data) {
                res.render('txtviewer', {
                    filename: req.query.name.split('-')[0],
                    data: data.replace(/(?:\r\n|\r|\n)/g, '<br>')
                });
            })
        }
    }

    static saveFile(fileDetails) {
        return FileModel(fileDetails).save().then(result => {
            return FileModel.find({});
        })
    }



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
    // static saveFile(uploadDetails) {
    //     return signModel(uploadDetails).save().then(result => {
    //         return signModel.find({});
    //     })
    // }

    /*Text Sign */
    static textsign(req, res) {
            res.render('text');
    }

    static signtext(req,res){
          console.log(req.body)
        const Textsign = {
            signname: req.body.encode,
            date: new Date().toDateString(),
        }
        console.log(req.body.encode);
        // UploadFile.saveSign(Textsign).then(data => {
        //     console.lod(data);
        //     //  res.render('text', {data: data})
        // })
    }

    static mail(req, res) {
        res.render('mail');
    }

    static sendemail (req, res) {
        let transporter = nodeMailer.createTransport({
            host: 'smtp.zoho.com',
            port: 465,
            secure: true,
            auth: {
                user: 'gowtham@coralfusion.com',
                pass: 'G34567890?'
            }
        });
        //console.log("sendmail",req.body);
        let mailOptions = {
            from: '"gowtham" <radhika@coralfusion.com>', // sender address
            to: 'gowthambaskar3112@gmail.com, gowtham@coralfusion.com', // list of receivers
            subject: req.body.subject, // Subject line
            text: req.body.body, // plain text body
            html:"<b>NodeJS Email Tutorial</b>" // html body
        };
        //console.log(req.body.body);
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Message %s sent: %s', info.messageId, info.response);
                res.render('index');
            });
        }
        
        static edit(req, res) {

            res.render('edit');
        }

    

    

}