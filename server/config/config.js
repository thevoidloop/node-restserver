//Puerto

process.env.PORT = process.env.PORT || 3000;

//Entorno

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//Vencimiento del token

process.env.CADUCIDAD_TOKEN = '48h';
//SEED de auntenticacion

process.env.SEED = process.env.SEED || 'desarrollo';

//Base de datos

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.URLDB;
};

process.env.URI = urlDB;

//google client id

process.env.CLIENT_ID = process.env.CLIENT_ID || '182116470098-ne8i03vjhhivr6vtad69vhqs0iomurpl.apps.googleusercontent.com';