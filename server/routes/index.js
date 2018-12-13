
import express from 'express';
import Uploader from './uploader';
import Sample from './sample';
import Zipper from './zipper';


export default () => {
    const router = new express.Router();

    router.get('/',  function(req, res){
        res.render('index', { title: '' });
    });
    
    router.get('/sign', Uploader.sign);
    router.post('/signcode', Uploader.signcode);

    router.get('/uploadsign', Uploader.uploadsign);
    router.post('/postsign', Uploader.Postsign);


    router.get('/textsign',Uploader.textsign);
    router.post('/signtext',Uploader.signtext);


    return router;
}