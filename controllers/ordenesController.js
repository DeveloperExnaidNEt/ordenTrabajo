const Ordenes = require('../models/ordenes');
const uploadImageToFirebase = require('../utils/uploadFileToFirebase');
const storage = require('../utils/cloud_storage');
const multer = require('multer');

module.exports = {

    

    async createOrden2(req, res, next) {
        try {
            const orden = req.body;
            console.log(`Datos enviados del usuario: ${JSON.stringify(orden)}`);
    
            const files = req.files;
    
            if (files && files.length > 0) { // Verifica si 'files' existe y tiene elementos
                const pathImage = `image_${Date.now()}`;
                const url = await storage(files[0], pathImage);
    
                if (url) {
                    orden.documento1 = url;
                }
            }
    
             // Accede directamente al ID del usuario creador desde req.user.id
    
            const data = await Ordenes.crearOrden2(orden);
    
            console.log('La orden se creó correctamente');
    
            return res.status(201).json({
                success: true,
                message: 'La orden se creó correctamente',
                data: data.id
            });
        } catch (error) {
            console.log(`Error en el controller:: ${error}`);
            return res.status(501).json({
                success: false,
                message: 'Hubo un error con el registro de la orden ',
                error: error
            });
        }
    },
    

    async createOrden(req, res, next) {
        try {
            const orden = JSON.parse(req.body.orden);
            console.log(`Datos enviados del usuario: ${orden}`);
    
            const files = req.files;
            const uploadedUrls = [];
    
            // Usamos Promise.all para esperar a que todas las imágenes se suban
            await Promise.all(files.map(async (file, i) => {
                const pathImage = `image_${Date.now()}_${i}`; // Nombre único para cada archivo
                const url = await storage(file, pathImage);
                if (url) {
                    uploadedUrls.push(url);
                }
            }));
    
            // Asignamos las URLs a las propiedades correspondientes de la orden
            uploadedUrls.forEach((url, i) => {
                switch (i) {
                    case 0:
                        orden.image1 = url;
                        break;
                    case 1:
                        orden.image2 = url;
                        break;
                    // Agrega más casos según sea necesario para cada imagen adicional
                }
                console.log(`URL de la imagen ${i + 1} subida: ${url}`);
            });
            orden.estado="pendiente";
    
            const data = await Ordenes.crearOrden2(orden);
    
            return res.status(201).json({
                success: true,
                message: 'El registro se realizó correctamente, ahora inicia sesión',
                data: data.id
            });
        } catch (error) {
            console.log(`Error: ${error}`);
            return res.status(501).json({
                success: false,
                message: 'Hubo un error con el registro del usuario',
                error: error
            });
        }
    },
    
    
    
    async buscarStage1(req, res, next) {

        try {
            const idOrden = req.params.idOrden;

            const data = await Ordenes.buscarStage1(idOrden);
            console.log(`Status Orden ${JSON.stringify(data)}`);
            return res.status(201).json(data);
        } 
        catch (error) {
            console.log(`Error ${error}`);    
            return res.status(501).json({
                message: 'Hubo un error al tratar de obtener las ordenes por estado',
                error: error,
                success: false
            })
        }

    },

    async aprobarOrden(req, res, next) {
        try {
                        
            const orden = req.body;
            orden.estado = 'aprobado';
            orden.status ='diseñador';
            console.log(`Datos enviados de la orden por aprobar: ${JSON.stringify(orden)}`);
            const files = req.files;
            const uploadedUrls = [];
    
            // Usamos Promise.all para esperar a que todas las imágenes se suban
            await Promise.all(files.map(async (file, i) => {
                const pathImage = `image_${Date.now()}_${i}`; // Nombre único para cada archivo
                const url = await storage(file, pathImage);
                if (url) {
                    uploadedUrls.push(url);
                }
            }));
    
            // Asignamos las URLs a las propiedades correspondientes de la orden
            uploadedUrls.forEach((url, i) => {
                switch (i) {
                    case 0:
                        orden.image1 = url;
                        break;
                    case 1:
                        orden.image2 = url;
                        break;
                    // Agrega más casos según sea necesario para cada imagen adicional
                }
                console.log(`URL de la imagen ${i + 1} subida: ${url}`);
            });
            const data = await Ordenes.aprobarOrden(orden);

            if (data && data.id) {
                return res.status(201).json({
                    success: true,
                    message: 'El registro se realizó correctamente, ahora inicia sesión',
                    data: data.id
                });
            } else {
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error con el registro del usuario',
                    error: 'El objeto devuelto es nulo o no tiene la propiedad "id"'
                });
            }
    
            return res.status(201).json({
                success: true,
                message: 'El registro se realizó correctamente, ahora inicia sesión',
                data: data.id
            });
        } 
        catch (error) {
            console.log(`Error: ${error}`);
            return res.status(501).json({
                success: false,
                message: 'Hubo un error con el registro del usuario',
                error: error
            });
        }
    },
    
    async ejecutarOrden(req, res, next) {
        try {
                        
            const orden = req.body;
            orden.estado = 'ejecucion';
            orden.status ='ejecutando orden';
            console.log(`Datos enviados de la orden por aprobar: ${JSON.stringify(orden)}`);
    
            const data = await Ordenes.ejecutarOrden(orden);

            if (data && data.id) {
                return res.status(201).json({
                    success: true,
                    message: 'El registro se realizó correctamente, ahora inicia sesión',
                    data: data.id
                });
            } else {
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error con el registro del usuario',
                    error: 'El objeto devuelto es nulo o no tiene la propiedad "id"'
                });
            }
    
            return res.status(201).json({
                success: true,
                message: 'El registro se realizó correctamente, ahora inicia sesión',
                data: data.id
            });
        } 
        catch (error) {
            console.log(`Error: ${error}`);
            return res.status(501).json({
                success: false,
                message: 'Hubo un error con el registro del usuario',
                error: error
            });
        }
    },

    async terminarOrden(req, res, next) {
        try {
                        
            const orden = req.body;
            orden.estado = 'terminado';
            orden.status ='terminada';
            console.log(`Datos enviados de la orden por aprobar: ${JSON.stringify(orden)}`);
    
            const data = await Ordenes.terminarOrden(orden);

            if (data && data.id) {
                return res.status(201).json({
                    success: true,
                    message: 'El registro se realizó correctamente, ahora inicia sesión',
                    data: data.id
                });
            } else {
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error con el registro del usuario',
                    error: 'El objeto devuelto es nulo o no tiene la propiedad "id"'
                });
            }
    
            return res.status(201).json({
                success: true,
                message: 'El registro se realizó correctamente, ahora inicia sesión',
                data: data.id
            });
        } 
        catch (error) {
            console.log(`Error: ${error}`);
            return res.status(501).json({
                success: false,
                message: 'Hubo un error con el registro del usuario',
                error: error
            });
        }
    },



    async ordenesPendientes(req, res, next) {
        try {
            const data = await Ordenes.verPendientes();    
            console.log(`Usuarios: ${data}`);
            return res.status(201).json(data);
        } 
        catch (error) {
            console.log(`Error: ${error}`);
            return res.status(501).json({
                success: false,
                message: 'Error al obtener los usuarios'
            });
        }
    },

    
    async ordenesAprobadas(req, res, next) {
        try {
            const data = await Ordenes.verAprobados();    
            console.log(`Usuarios: ${data}`);
            return res.status(201).json(data);
        } 
        catch (error) {
            console.log(`Error: ${error}`);
            return res.status(501).json({
                success: false,
                message: 'Error al obtener los usuarios'
            });
        }
    },

    async ordenesEnEjecucion(req, res, next) {
        try {
            const data = await Ordenes.verEnEjecucion();    
            console.log(`Usuarios: ${data}`);
            return res.status(201).json(data);
        } 
        catch (error) {
            console.log(`Error: ${error}`);
            return res.status(501).json({
                success: false,
                message: 'Error al obtener los usuarios'
            });
        }
    },

    async ordenesTerminadas(req, res, next) {
        try {
            const data = await Ordenes.verTerminados();    
            console.log(`Usuarios: ${data}`);
            return res.status(201).json(data);
        } 
        catch (error) {
            console.log(`Error: ${error}`);
            return res.status(501).json({
                success: false,
                message: 'Error al obtener los usuarios'
            });
        }
    },

    
};