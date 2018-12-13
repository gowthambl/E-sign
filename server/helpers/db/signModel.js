import MongoClient from 'mongoose';
import Client from './index';


let signSchema = new MongoClient.Schema({
    sign: {
        type: String,
        required: true
    },
    date:{
        type: String,
        required: true
    }
});

let signModel = Client.model("sign", signSchema);

export default signModel;