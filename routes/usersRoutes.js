const UsersController = require('../controllers/usersController');
const passport = require('passport');

module.exports = (app, upload) => {

    // TRAER DATOS
    app.get('/api/users/optenersupervisores', UsersController.optenerSupervisores);
    app.get('/api/users/optenerempleados', UsersController.optenerempleados);
    app.get('/api/users/optenerdisenadores', UsersController.optenerdisenadores);
    app.get('/api/users/getAll', UsersController.getAll);
    app.get('/api/users/detalles/:idusuario', UsersController.getDetalleUsuario);
    app.get('/api/users/roles/:idusuario', UsersController.getRolUsuario);
    app.get('/api/user/supervisor/:supervisor', UsersController.getSupervisor);
    app.get('/api/users/findById/:id', passport.authenticate('jwt', {session:false}),UsersController.findById);
   
    // GUARDAR DATOS
    app.post('/api/users/create', upload.array('image', 1), UsersController.registerWithImage);
    app.post('/api/user/createrol', UsersController.createRol);
   
    app.post('/api/users/login', UsersController.login);
    app.post('/api/users/logout', UsersController.logout);

    // ACTUALIZAR DATOS
    app.put('/api/users/update', passport.authenticate('jwt', {session:false}), upload.array('image', 1), UsersController.update );
    app.put('/api/users/updateNotificationToken', UsersController.updateNotificationToken);
}