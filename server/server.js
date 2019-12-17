require('./config/config');

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();


// Habilitad la carpeta public

app.use(express.static(path.resolve(__dirname, '../public')));


app.use(require('./routes'));

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

mongoose.connect(process.env.URI, (err, res) => {
    if (err) throw err;
    console.log('Base de datos ONLINE');
});

app.listen(process.env.PORT, () => {
    console.log('Escuchando el puerto: ', process.env.PORT);
});