process.env.PORT = process.env.PORT || 3000;


process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

let dataBase;

if (process.env.NODE_ENV === 'dev') {
    dataBase = 'mongodb://localhost:27017/express_server_rest';
} else {
    dataBase = 'mongodb://serrano95:Ca1067943114*-+@ds039155.mlab.com:39155/express_server_rest';
}

process.env.URLDB = dataBase;