const OrdenesController = require('../controllers/ordenesController');
const passport = require('passport');

module.exports = (app, upload) => {

    app.get('/api/ordenes/stage1/:idOrden', OrdenesController.buscarStage1);
    //MOATRAR DATOS 
    app.get('/api/ordenes/pendientes', OrdenesController.ordenesPendientes);
    app.get('/api/ordenes/aprobadas', OrdenesController.ordenesAprobadas);
    app.get('/api/ordenes/enejecucion', OrdenesController.ordenesEnEjecucion);
    app.get('/api/ordenes/terminadas', OrdenesController.ordenesTerminadas);
    // GUARDAR DATOS
    app.post('/api/ordenes/create', OrdenesController.createOrden2);
    app.post('/api/ordenes/create2', upload.array('image', 1), OrdenesController.createOrden);


    app.post('/api/ordenes/aprobar/:ordenId', upload.array('image', 1),OrdenesController.aprobarOrden);
    app.post('/api/ordenes/ejecutar/:ordenId', OrdenesController.ejecutarOrden);
    app.post('/api/ordenes/terminar/:ordenId', OrdenesController.terminarOrden);
   
  
}