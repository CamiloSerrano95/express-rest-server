const express = require('express')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const app = express()
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

app.post('/login', (req, res) => {
    let body = req.body;

    User.findOne({email: body.email}, (err, userDB) => {
        if (err) {
            return res.status(500).json({
                status: false,
                error: err
            });
        }

        if(!userDB) {
            return res.status(400).json({
                status: false,
                error: {
                    message: '(Usuario) o contraseña incorrectos'
                }
            });
        }
        
        if (!bcrypt.compareSync(body.password, userDB.password)) {
            return res.status(400).json({
                status: false,
                error: {
                    message: 'Usuario o (contraseña) incorrectos'
                }
            });
        }

        let token = jwt.sign({
            user: userDB
        }, process.env.SEED, { expiresIn: process.env.EXPIRE_TOKEN });

        res.json({
            status: true,
            token,
            user: userDB
        });
    });
})

async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    //const userid = payload['sub'];
    return {
        name: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
}

app.post('/google', async (req, res) => {
    let token = req.body.idtoken;

    let googleUser = await verify(token).catch(e => {
        return res.status(403).json({
            status: false,
            error: e
        });
    });

    console.log(googleUser);

    User.findOne({ email: googleUser.email }, (err, userDB) => {
        if (err) {
            return res.status(500).json({
                status: false,
                error: err
            });
        }

        if (userDB) {
            if (userDB.google === false) {
                return res.status(400).json({
                    status: false,
                    error: {
                        messaage: 'No puedes autenticarte con google, correo ya registrado por autenticacion manual'
                    }
                });
            } else {
                let token = jwt.sign({
                    user: userDB
                }, process.env.SEED, { expiresIn: process.env.EXPIRE_TOKEN });

                return res.json({
                    status: true,
                    user: userDB,
                    token
                })
            }
        } else {
            let user = new User();

            user.name = googleUser.name;
            user.email = googleUser.email;
            user.img = googleUser.img;
            user.google = true;
            user.password = ':)';

            user.save((err, userDB) => {
                if (err) {
                    return res.status(500).json({
                        status: false,
                        error: err
                    });
                }

                let token = jwt.sign({
                    user: userDB
                }, process.env.SEED, { expiresIn: process.env.EXPIRE_TOKEN });

                return res.json({
                    status: true,
                    user: userDB,
                    token
                })
            })
        }
    })
});

module.exports = app;
