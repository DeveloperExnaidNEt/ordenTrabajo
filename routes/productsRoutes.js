const ProductsController = require('../controllers/productsController');

module.exports = (app, upload) => {
   
    app.get('/api/users/getAll', ProductsController.getAllProducts);
    // Ruta en el backend
    app.get('/api/products', ProductsController.searchProducts);


    app.post('/api/products/create', ProductsController.createProduct);
    app.post('/api/costos/create', ProductsController.createCostos);
    app.post('/api/adiciones/create', ProductsController.createAdiciones);
    app.post('/api/permisos/create', upload.array('image', 1), ProductsController.createPermisos);
    app.post('/api/products/createempleado', ProductsController.createEmpleado);

    app.get('/api/products/getproducts/:idOrden', ProductsController.buscarProducto);
    app.get('/api/products/getpermisos/:idOrden', ProductsController.buscarPermisos);

    app.get('/api/products/getcostos/:idOrden', ProductsController.buscarCosto);  
    app.get('/api/products/getempleados/:idOrden', ProductsController.buscarEmpleado);
    app.get('/api/products/adiciones/:idOrden', ProductsController.buscarAdiciones);
  

}