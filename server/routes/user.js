const express = require('express')
const app = express()
const User = require('../models/user');
const bcrypt = require('bcrypt');
const _ = require('underscore');

app.get('/user', function (req, res) {

    let since = req.query.since || 0;
    since = Number(since);
    let page = req.query.page || 5;
    page = Number(page);

    User.find({status: true}, 'name email role google')
    .limit(page)
    .skip(since)
    .exec((err, users) => {
        if (err) {
            return res.status(400).json({
                status: false,
                error: err
            });
        }

        User.count({status: true}, (err, cant) => {
            res.json({
                status: true,
                count: cant,
                users
            });
        })
    });
})

app.post('/user', function (req, res) {
    let body = req.body;

    let user = new User({
        name: body.name,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });


    user.save((err, userDB) => {
        if (err) {
            return res.status(400).json({
                status: false,
                error: err
            });
        }

        res.json({
            status: true,
            user: userDB
        });
    });

})

app.put('/user/:id', function (req, res) {
    let id = req.params.id;
    let body = _.pick(req.body, ['name', 'email', 'img', 'role', 'status']);

    User.findByIdAndUpdate(id, body, {new: true, runValidators: true, context: 'query'}, (err, userDB) => {
        if (err) {
            return res.status(400).json({
                status: false,
                error: err
            });
        }

        res.json({
            status: true,
            user: userDB
        });
    })
})

app.delete('/user/:id', function (req, res) {
    let id = req.params.id;
    let changeStatus = {
        status: false
    }
    //User.findByIdAndRemove(id, (err, userDelete) => {
    User.findByIdAndUpdate(id, changeStatus, {new: true }, (err, userDelete) => {
        if (err) {
            return res.status(400).json({
                status: false,
                error: err
            });
        }

        if (!userDelete) {
            return res.status(400).json({
                status: false,
                error: {
                    message: 'Usuario no encontrado'
                }
            });
        }

        res.json({
            status: true,
            user: userDelete
        });
    });
})

module.exports = app;