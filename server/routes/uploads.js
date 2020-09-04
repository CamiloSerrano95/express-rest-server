const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const User = require('../models/user');
const Product = require('../models/product');
const fs = require('fs');
const path = require('path');

app.use(fileUpload());

app.put('/uploads/:type/:id', function(req, res) {
    let validTypes = ['users', 'products'];
    let type = req.params.type;
    let id = req.params.id;

    if (!req.files || Object.keys(req.files).length === 0)
        return res.status(400).json({
            status: false,
            error: {
                message: 'No files were uploaded.'
            }
        });

    if (validTypes.indexOf(type) < 0) {
        return res.status(400).json({
            status: false,
            error: {
                message: "Los tipos permitidos son: " + validTypes.join(', ')
            }
        });
    }
    
    let file_upload = req.files.fileupload;
    let nameFile = file_upload.name.split('.');
    let extension = nameFile[nameFile.length - 1];
    let extensions = ['png', 'jpg', 'gif', 'jpeg'];
    

    if (extensions.indexOf(extension) < 0) {
        return res.status(400).json({
            status: false,
            error: {
                message: "Las extesiones permitidas son: " + extensions.join(', ')
            }
        });
    }
    
    let name_file = `${id}-${new Date().getMilliseconds()}.${extension}`

    file_upload.mv(`uploads/${type}/${name_file}`, (err) => {
        if (err)
            return res.status(500).json({
              status: false,
              error: err
            });

        switch (type) {
            case 'users':
                imageUser(id, res, name_file);
                break;
            case 'users':
                imageProduct(id, res, name_file);
                break;
            default:
                break;
        }
    });
})

function imageUser(id, res, name_file) {
    User.findById(id, (err, userDB) => {
        if (err) {
            deleteFile(name_file, 'users');
            return res.status(500).json({
                status: false,
                error: err
            });
        }

        if (!userDB) {
            deleteFile(name_file, 'users');
            return res.status(400).json({
                status: false,
                error: {
                    message: "El usuario no existe"
                }
            });
        }

        deleteFile(userDB.img, 'users');
        userDB.img = name_file;

        userDB.save((err, user) => {
            res.json({
                status: true,
                user,
                image: name_file
            })
        })
    });
}

function imageProduct(id, res, name_file) {
    Product.findById(id, (err, productDB) => {
        if (err) {
            deleteFile(name_file, 'products');
            return res.status(500).json({
                status: false,
                error: err
            });
        }

        if (!productDB) {
            deleteFile(name_file, 'products');
            return res.status(400).json({
                status: false,
                error: {
                    message: "El producto no existe"
                }
            });
        }

        deleteFile(productDB.img, 'users');
        productDB.img = name_file;

        productDB.save((err, product) => {
            res.json({
                status: true,
                product,
                image: name_file
            })
        })
    });
}

function deleteFile(nameFile, type) {
    let pathImage = path.resolve(__dirname, `../../uploads/${type}/${nameFile}`);
    if (fs.existsSync(pathImage)) {
        fs.unlinkSync(pathImage);
    }
}

module.exports = app;