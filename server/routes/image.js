const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const { validateTokenUrl } = require('../middlewares/authentication');

app.get('/imagen/:type/:img', validateTokenUrl, (req, res) => {
    let type = req.params.type;
    let image = req.params.img;

    let pathImage = path.resolve(__dirname, `../../uploads/${type}/${image}`);
    if (fs.existsSync(pathImage)) {
        res.sendFile(pathImage);  
    } else {
        let noImagePath = path.resolve(__dirname, '../assets/no-image.png');
        res.sendFile(noImagePath);  
    }    
});

module.exports = app;