const express = require('express');
const bodyParser = require('body-parser');
const _ = require('underscore');



const { verificaToken } = require('../middlewares/autenticacion');
const app = express();
const Categoria = require('../models/categoria');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


//=================================
// Mostrar todas las categorias
//=================================


app.get('/categoria', verificaToken, (req, res) => {

    Categoria.find({})
        .sort('descripcion')
        .populate('usuario', 'name email')
        .exec((err, categorias) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err: err
                });
            }
            res.json({
                ok: true,
                categorias
            });

        });
});

//=================================
// Mostrar una categoria por id
//=================================


app.get('/categoria/:id', verificaToken, (req, res) => {

    let id = req.params.id;
    Categoria.findById(id, (err, categoriaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err: err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB,
            creado: req.usuario
        });
    });
});

//=================================
// Crea una nueva categoria
//=================================


app.post('/categoria', verificaToken, (req, res) => {

    let categoria = new Categoria({
        descripcion: req.body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err: err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB,
            creado: req.usuario
        });
    });
});

//=================================
// Modificamos una categoria
//=================================


app.put('/categoria/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let body = req.body.descripcion;

    Categoria.findByIdAndUpdate(id, body, { new: true }, (err, categoriaDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err: err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });

    });
});


//=================================
// Borramos una categoria
//=================================


app.delete('/categoria/:id', verificaToken, (req, res) => {
    let role = req.usuario.role;
    let id = req.params.id;

    if (role != 'ADMIN_ROLE') {
        return res.status(400).json({
            ok: false,
            mensagge: 'Es necesarion ser Administrador para poder eliminar'
        });
    }

    Categoria.findByIdAndRemove(id, (err, categoriaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err: err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });

});

module.exports = app;