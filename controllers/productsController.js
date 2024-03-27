const Product = require('../models/product');
const storage = require('../utils/cloud_storage');


module.exports = {
    // Zona Vmarkets

    async getAllProducts(req, res, next) {
        try {
            const data = await Product.getAllProducts();    
            console.log(`Productos: ${data}`);
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

    async searchProducts(req, res, next) {
        try {
            const query = req.query.q; // Obtener el texto de búsqueda de la consulta
            const data = await Product.searchProducts(query); // Función para buscar productos filtrados
            return res.status(200).json(data);
        } catch (error) {
            console.error('Error al buscar productos:', error);
            return res.status(500).json({ error: 'Error al buscar productos' });
        }
    },
    

    async createProduct(req, res, next) {
        try {
            const producto = req.body;
            const data = Product.createProduct(producto);
    
            return res.status(201).json({
                success: true,
                message: 'El producto se registró correctamente',
                data: data.id
            });
        } catch (error) {
            console.log(`Error: ${error}`);
            return res.status(501).json({
                success: false,
                message: 'Hubo un error con el registro del producto',
                error: error
            });
        }
    },

    async createCostos(req, res, next) {
        try {
            const costos = req.body;
            const data = Product.createCosto(costos);
    
            return res.status(201).json({
                success: true,
                message: 'El costo se registró correctamente',
                data: data.id
            });
        } catch (error) {
            console.log(`Error: ${error}`);
            return res.status(501).json({
                success: false,
                message: 'Hubo un error con el registro del costo',
                error: error
            });
        }
    },

    async createAdiciones(req, res, next) {
        try {
            const adiciones = req.body;
            const data = Product.createAdiciones(adiciones);
    
            return res.status(201).json({
                success: true,
                message: 'El costo se registró correctamente',
                data: data.id
            });
        } catch (error) {
            console.log(`Error: ${error}`);
            return res.status(501).json({
                success: false,
                message: 'Hubo un error con el registro del costo',
                error: error
            });
        }
    },

    async createPermisos(req, res, next) {
        try {
            const permisos = req.body;
            const files = req.files;
            const uploadedUrls = [];
            
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
                        permisos.image1 = url;
                        break;
                    case 1:
                        permisos.image2 = url;
                        break;
                    // Agrega más casos según sea necesario para cada imagen adicional
                }
                console.log(`URL de la imagen ${i + 1} subida: ${url}`);
            });
            const data = Product.createPermisos(permisos);
            
    
            return res.status(201).json({
                success: true,
                message: 'El costo se registró correctamente',
                data: data.id
            });
        } catch (error) {
            console.log(`Error: ${error}`);
            return res.status(501).json({
                success: false,
                message: 'Hubo un error con el registro del costo',
                error: error
            });
        }
    },

    async createEmpleado(req, res, next) {
        try {
            const empleado = req.body;
            const data = Product.createEmpleado(empleado);
    
            return res.status(201).json({
                success: true,
                message: 'El empleado se registró correctamente',
                data: data.id
            });
        } catch (error) {
            console.log(`Error: ${error}`);
            return res.status(501).json({
                success: false,
                message: 'Hubo un error con el registro del empleado',
                error: error
            });
        }
    },
    
    

    async buscarProducto(req, res, next) {

        try {
            const idOrden = req.params.idOrden;

            const data = await Product.buscarProducto(idOrden);
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

    async buscarPermisos(req, res, next) {

        try {
            const idOrden = req.params.idOrden;

            const data = await Product.buscarPermisos(idOrden);
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

    async buscarCosto(req, res, next) {

        try {
            const idOrden = req.params.idOrden;

            const data = await Product.buscarcosto(idOrden);
            console.log(`Status del costo --------- ${JSON.stringify(data)}`);
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

    async buscarEmpleado(req, res, next) {

        try {
            const idOrden = req.params.idOrden;

            const data = await Product.buscarempleado(idOrden);
            console.log(`resultado de la busqueda de empleados--------- ${JSON.stringify(data)}`);
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

    async buscarAdiciones(req, res, next) {

        try {
            const idOrden = req.params.idOrden;

            const data = await Product.buscaradiciones(idOrden);
            console.log(`Status del costo --------- ${JSON.stringify(data)}`);
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

    async createWithImage(req, res, next) {
        try {
            const product = JSON.parse(req.body.producto);
            console.log(`Datos enviados del usuario: ${product}`);
    
            const files = req.files;
            console.log('Archivos adjuntos:', files);
    
            if (files.length > 0) {
                const pathImage = `image_${Date.now()}`; // NOMBRE DEL ARCHIVO
                console.log('Nombre del archivo:', pathImage);
    
                const url = await storage(files[0], pathImage);
    
                if (url != undefined && url != null) {
                    product.image = url;
                } else {
                    console.log('URL no disponible');
                }
            } else {
                console.log('No se adjuntó ninguna imagen');
            }
    
            const data = await Product.createProduct(product);
    
            return res.status(201).json({
                success: true,
                message: 'El registro se realizó correctamente',
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
    
}