const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const app = express();
const bodyParser = require('body-parser');
const User = require('../models/usuario');
const { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/usuario', verificaToken, (req, res) => {

    // return res.json({
    //     usuario: req.usuario,
    //     nombre: req.usuario.name,
    //     email: req.usuario.email
    // });

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    User.find({ status: true }, 'name email role status google img')
        .skip(desde)
        .limit(limite)
        .exec((err, users) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err: err
                });
            }
            User.countDocuments({ status: true }, (err, count) => {
                res.json({
                    ok: true,
                    users: users,
                    conteo: count
                });
            });

        });

});

app.post('/usuario', [verificaToken, verificaAdmin_Role], (req, res) => {
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
                ok: false,
                err: err
            });
        }

        res.json({
            ok: true,
            user: userDB
        });
    });
});

app.put('/usuario/:id', [verificaToken, verificaAdmin_Role], (req, res) => {

    let id = req.params.id;
    let body = _.pick(req.body, ['name', 'email', 'img', 'role']);

    User.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, userDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err: err
            });
        }

        res.json({
            ok: true,
            user: userDB
        });

    });


});

app.delete('/usuario/:id', [verificaToken, verificaAdmin_Role], (req, res) => {

    let id = req.params.id;
    let estado = { status: false };

    User.findByIdAndUpdate(id, estado, { new: true }, (err, userDelet) => {


        if (err) {
            return res.status(400).json({
                ok: false,
                err: err
            });
        }

        if (!userDelet) {

            return res.status(400).json({
                ok: false,
                err: {
                    mensaje: 'usuario no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            user: userDelet
        });

    })
});

module.exports = app;