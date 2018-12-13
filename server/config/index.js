import './lib';

const {
    APP_PORT,
    MONGO_HOST,
    MONGO_PORT,
    MONGO_DB
} = process.env;

export default {
    APP_PORT: APP_PORT || 8080,
    MONGO_HOST,
    MONGO_PORT,
    MONGO_DB
};