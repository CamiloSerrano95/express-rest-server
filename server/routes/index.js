const express = require('express')
const app = express()

app.use(require('./user'));
app.use(require('./login'));
app.use(require('./categorie'));
app.use(require('./product'));
app.use(require('./uploads'));
app.use(require('./image'));

module.exports = app;