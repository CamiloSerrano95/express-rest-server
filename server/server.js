require('./config/config');
const express = require('express')
const mongoose = require('mongoose');
const app = express()
const bodyParser = require('body-parser');
const path = require('path');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.static(path.resolve(__dirname, '../public')));

app.use(require('./routes/index'));

mongoose.connect(process.env.URLDB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true
}, (err, res) => {
  if (err) throw err;
  console.log('Data base is online in port 27017');
});

app.listen(process.env.PORT, () => {
    console.log(`Listen on port ${process.env.PORT}`);
})