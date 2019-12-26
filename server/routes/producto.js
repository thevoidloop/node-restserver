const express = require('express');
const bodyParser = require('body-parser');
const _ = require('underscore');



const { verificaToken } = require('../middlewares/autenticacion');
const app = express();
const Producto = require('../models/producto');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


//=================================
// Mostrar todas las categorias
//=================================


app.get('/producto', verificaToken, (req, res) => {

    Producto.find({ disponible: true })
        .sort('name')
        .populate('usuario', 'name email')
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err: err
                });
            }
            res.json({
                ok: true,
                productos
            });

        });
});

//=================================
// Mostrar una categoria por id
//=================================


app.get('/producto/:id', verificaToken, (req, res) => {

    let id = req.params.id;
    Producto.findById(id)
        .populate('usuario', 'name email')
        .populate('categoria', 'descripcion')
        .exec((err, productoDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err: err
                });
            }

            res.json({
                ok: true,
                producto: productoDB
            });
        });
});


//=================================
// Buscar un producto 
//=================================

app.get('/producto/buscar/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i');

    Producto.find({ nombre: regex })
        .populate('categoria', 'nombre')
        .exec((err, productos) => {


            if (err) {
                return res.status(400).json({
                    ok: false,
                    err: err
                });
            }

            res.json({
                ok: true,
                productos
            });


        })
});

//=================================
// Crea un nuevo producto
//=================================


app.post('/producto', verificaToken, (req, res) => {

    let producto = new Producto({
        nombre: req.body.nombre,
        precioUni: req.body.precioUni,
        descripcion: req.body.descripcion,
        categoria: req.body.categoria,
        usuario: req.usuario._id
    });

    producto.save((err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err: err
            });
        }

        res.status(201).json({
            ok: true,
            producto: productoDB
        });
    });
});

//=================================
// Modificamos una categoria
//=================================


app.put('/producto/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let body = req.body

    Producto.findByIdAndUpdate(id, body, { new: true }, (err, productoDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err: err
            });
        }

        res.json({
            ok: true,
            categoria: productoDB
        });

    });
});


//=================================
// Borramos una categoria
//=================================


app.delete('/producto/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let disponible = { disponible: false };

    Producto.findByIdAndUpdate(id, disponible, { new: true }, (err, userDelet) => {


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
                    mensaje: 'producto no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            message: 'Producto eliminado'
        });

    });

});

module.exports = app;