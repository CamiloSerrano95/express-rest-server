const express = require('express')
const app = express()
const { validateToken, validateAdminRol } = require('../middlewares/authentication');
const Product = require('../models/product');

app.get('/products', validateToken, (req, res) => {
    let since = req.query.since || 0;
    since = Number(since);
    let page = req.query.page || 5;
    page = Number(page);

    Product.find({ avalaible: true })
    .skip(since)
    .limit(5)
    .populate('user', 'nombre email')
    .populate('categorie', 'description')
    .exec((err, productDB) => {
        if (err) {
            return res.status(500).json({
                status: false,
                error: err
            });
        }

        if (!productDB) {
            return res.status(400).json({
                status: false,
                error: err
            });
        }

        res.json({
            status: true,
            products: productDB
        });

    });
});

app.get('/product/:id', validateToken, (req, res) => {
    let id = req.params.id;

    Product.findById(id)
    .populate('user', 'nombre email')
    .populate('categorie', 'description')
    .exec((err, productDB) => {
        if (err) {
            return res.status(500).json({
                status: false,
                error: err
            });
        }

        if (!productDB) {
            return res.status(400).json({
                status: false,
                error: {
                    message: "No existe el producto"
                }
            });
        }

        res.json({
            status: true,
            product: productDB
        });

    });
});

app.get('/products/search/:term', validateToken, (req, res) => {

    let term = req.params.term;

    let regex = new RegExp(term, 'i');

    Product.find({ name: regex })
    .populate('categorie', 'name')
    .exec((err, products) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                error: err
            });
        }
        
        res.json({
            ok: true,
            products
        });
    });
});

app.post('/product', validateToken, (req, res) => {
    let body = req.body;

    let product = new Product({
        name: body.name,
        price_uni: body.price_uni,
        description: body.description,
        avalaible: body.avalaible,
        categorie_id: body.categorie_id,
        user_id: req.user._id,
    });

    product.save((err, productDB) => {
        if (err) {
            return res.status(500).json({
                status: false,
                error: err
            });
        }

        if (!productDB) {
            return res.status(400).json({
                status: false,
                error: err
            });
        }

        res.status(201).json({
            status: true,
            product: productDB
        });
    })
});

app.put('/product/:id', validateToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;

    Product.findById(id, (err, productDB) => {
        if (err) {
            return res.status(500).json({
                status: false,
                error: err
            });
        }

        if (!productDB) {
            return res.status(400).json({
                status: false,
                error: {
                    message: "No existe el producto"
                }
            });
        }

        productDB.name = body.name;
        productDB.price_uni = body.price_uni;
        productDB.description = body.description;
        productDB.avalaible = body.avalaible;
        productDB.categorie_id = body.categorie_id;

        productDB.save((err, productSave) => {
            if (err) {
                return res.status(500).json({
                    status: false,
                    error: err
                });
            }
    
            if (!productDB) {
                return res.status(400).json({
                    status: false,
                    error: err
                });
            }
    
            res.status(201).json({
                status: true,
                product: productSave
            });
        })

    });
});

app.delete('/product/:id', validateToken, function (req, res) {
    let id = req.params.id;
    
    Product.findById(id, (err, productDB) => {
        if (err) {
            return res.status(400).json({
                status: false,
                error: err
            });
        }

        if (!productDB) {
            return res.status(400).json({
                status: false,
                error: {
                    message: 'Producto no encontrado'
                }
            });
        }

        productDB.avalaible = false;

        productDB.save((err, productSave) => {
            if (err) {
                return res.status(500).json({
                    status: false,
                    error: err
                });
            }
    
            if (!productSave) {
                return res.status(400).json({
                    status: false,
                    error: err
                });
            }
    
            res.status(201).json({
                status: true,
                message: "Producto borrado"
            });
        })
    });
})

module.exports = app;