require('./config/config');
const express = require('express')
const app = express()
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.get('/user', function (req, res) {
  res.json('get user');
})

app.post('/user', function (req, res) {
    res.json('create user');
})

app.put('/user/:id', function (req, res) {
    res.json('update user');
})

app.delete('/user/:id', function (req, res) {
    let id = req.params.id;
    res.json('delete user ' + id);
})
 
app.listen(process.env.PORT, () => {
    console.log(`Listen on port ${process.env.PORT}`);
})