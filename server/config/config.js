process.env.PORT = process.env.PORT || 3000;


process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

let dataBase;

if (process.env.NODE_ENV === 'dev') {
    dataBase = 'mongodb://localhost:27017/express_server_rest';
} else {
    dataBase = process.env.MONGO_URI;
}

process.env.URLDB = dataBase;