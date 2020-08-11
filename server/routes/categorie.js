const express = require('express')
const app = express()
const { validateToken, validateAdminRol } = require('../middlewares/authentication');
const Categorie = require('../models/categorie');

app.get('/categories', validateToken, (req, res) => {
    Categorie.find({})
    .sort('description')
    .populate('user', 'nombre email')
    .exec((err, categorieDB) => {
        if (err) {
            return res.status(500).json({
                status: false,
                error: err
            });
        }

        if (!categorieDB) {
            return res.status(400).json({
                status: false,
                error: err
            });
        }

        res.json({
            status: true,
            categories: categorieDB
        });

    });
});

app.get('/categorie/:id', validateToken, (req, res) => {
    let id = req.params.id;

    Categorie.findById(id, (err, categorieDB) => {
        if (err) {
            return res.status(500).json({
                status: false,
                error: err
            });
        }

        if (!categorieDB) {
            return res.status(400).json({
                status: false,
                error: {
                    message: "No existe la categoria"
                }
            });
        }

        res.json({
            status: true,
            categorie: categorieDB
        });

    });
});

app.post('/categorie', validateToken, (req, res) => {
    let body = req.body;

    let categorie = new Categorie({
        description: body.description,
        user_id: req.user._id
    });

    categorie.save((err, categorieDB) => {
        if (err) {
            return res.status(500).json({
                status: false,
                error: err
            });
        }

        if (!categorieDB) {
            return res.status(400).json({
                status: false,
                error: err
            });
        }

        res.json({
            status: true,
            categorie: categorieDB
        });
    })

});

app.put('/categorie/:id', validateToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;

    let updateCategorie = {
        description: body.description
    }

    Categorie.findByIdAndUpdate(id, updateCategorie, {new: true, runValidators: true, context: 'query'}, (err, categorieDB) => {
        if (err) {
            return res.status(500).json({
                status: false,
                error: err
            });
        }

        if (!categorieDB) {
            return res.status(400).json({
                status: false,
                error: err
            });
        }

        res.json({
            status: true,
            categorie: categorieDB
        });
    })

});

app.delete('/categorie/:id', [validateToken, validateAdminRol], (req, res) => {
    let id = req.params.id;

    Categorie.findByIdAndRemove(id, (err, categorieDB) => {
        if (err) {
            return res.status(500).json({
                status: false,
                error: err
            });
        }

        if (!categorieDB) {
            return res.status(400).json({
                status: false,
                error: {
                    message: "Esta categoria no existe"
                }
            });
        }

        res.json({
            status: true,
            message: "Categoria eliminada"
        });
    });
});

module.exports = app;