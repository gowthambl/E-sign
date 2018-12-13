
import express from 'express';
import Uploader from './uploader';
import Sample from './sample';
import Zipper from './zipper';


export default () => {
    const router = new express.Router();

    router.get('/',  function(req, res){
        res.render('index', { title: '' });
    });
    router.get('/list', Uploader.list);
    router.post('/upload', Uploader.Upload);
    router.get('/viewer', Uploader.viewer);

    router.get('/sign', Uploader.sign);
    router.post('/signcode', Uploader.signcode);

    router.get('/uploadsign', Uploader.uploadsign);
    router.post('/postsign', Uploader.Postsign);


    router.get('/textsign',Uploader.textsign);
    router.post('/signtext',Uploader.signtext);


    // router.get('/decodesign',Uploader.decodesign);

     router.get('/mail',Uploader.mail);
     router.post('/sendemail',Uploader.sendemail);

    router.get('/getjson',Sample.getjson);
    
    router.get('/edit',Uploader.edit);


    router.get('/zip',Zipper.zip);
    router.post('/uploadzip',Zipper.uploadzip);


    return router;
}