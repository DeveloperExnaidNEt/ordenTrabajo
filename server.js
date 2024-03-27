const express = require('express');
const app = express();
const http = require('http');
const logger = require('morgan');
const cors = require('cors');
const server = http.createServer(app);
const multer = require('multer');
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

const port = process.env.PORT || 3000;
/* INICIALIZACION DE FIREBASE ADMIN */

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)

})
const upload = multer({
    storage: multer.memoryStorage()
})

/*Rutas*/
const products = require('./routes/productsRoutes');
const users = require('./routes/usersRoutes');
const ordenes = require('./routes/ordenesRoutes');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

app.use(cors());
app.disable('x-powered-by');

app.set('port', port);
users(app, upload);
products(app, upload);
ordenes(app, upload);

server.listen(3000, '192.168.1.18' || 'localhost', function(){
    console.log('Aplicacion de Node servicio catering en el puerto: ' + port + ' fue  iniciada correctamente...')
});



// ERROR HANDLER

app.use((err, req, res, next) =>{
    console.log(err);
    res.status(err.status || 500).send(err.stack);
});

// 200 = RESPUESTA EXITOSA
// 404 = URL NO EXISTE
// 500 = ERROR SERVIDOR INTERNO 