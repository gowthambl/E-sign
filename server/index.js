import path from 'path';
import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
// import nodemailer from 'nodemailer';

import Router from './routes/index'

const app = express();



const Routes = Router();
const server = new http.Server(app);
const port = process.env.APP_PORT;

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'views')));
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.bodyParser());


// console.log(path.join(__dirname,'views'));y

app.use('/', Routes);


server.listen(port, () => {
    console.log('Server started on port %d', port);
});

exports.server = server;