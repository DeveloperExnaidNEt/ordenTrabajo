const db = require('../config/config');
const crypto = require('crypto');

const Product = {};

// Zona Vmarkets

Product.getAllProducts = () => {
    const sql = `
    SELECT 
        *
    FROM
        producto
    `;

    return db.manyOrNone(sql);
}

Product.searchProducts = (query) => {
    const sql = `
        SELECT *
        FROM producto
        WHERE name LIKE $1`; // Filtrar por nombre que coincide con el texto de búsqueda
    return db.manyOrNone(sql, [`%${query}%`]); // Usar '%' para coincidencias parciales
}

Product.createProduct = (producto) => {
    const sql = `
    INSERT INTO
        productos(
            id_orden,
            nombre,
            cantidad,
            precio,
            creado
        )
    VALUES($1, $2, $3, $4, $5) RETURNING id
    `;
    return db.oneOrNone(sql, [
        producto.id_orden,
        producto.nombre,
        producto.cantidad,
        producto.valortotal,
        new Date()
    ]);
}

Product.createCosto = (costos) => {
    const sql = `
    INSERT INTO
        costos(
            id_orden, 
            nombre, 
            precio, 
            descripcion, 
            creado
        )
    VALUES($1, $2, $3, $4, $5) RETURNING id
    `;
    return db.oneOrNone(sql, [
        costos.id_orden,
        costos.nombre,
        costos.valortotal,
        costos.descripcion,
        new Date()
    ]);
}

Product.createAdiciones = (costos) => {
    const sql = `
    INSERT INTO
        adiciones(
            id_orden, 
            nombre, 
            precio, 
            descripcion, 
            creado
        )
    VALUES($1, $2, $3, $4, $5) RETURNING id
    `;
    return db.oneOrNone(sql, [
        costos.id_orden,
        costos.nombre,
        costos.valortotal,
        costos.descripcion,
        new Date()
    ]);
}


Product.createPermisos = (permisos) => {
    const sql = `
    INSERT INTO
        permisos(
            id_orden, 
            fecha,
            notas,              
            doc1
        )
    VALUES($1, $2, $3, $4) RETURNING id
    `;
    return db.oneOrNone(sql, [
        permisos.id,
        new Date(),
        permisos.notas,
        permisos.image1
       
    ]);
}



Product.createEmpleado = (empleado) => {
    const sql = `
    INSERT INTO
        empleadosorden(
            id_orden, 
            nombre, 
            resena,
            creado
        )
    VALUES($1, $2, $3, $4) RETURNING id
    `;
    return db.oneOrNone(sql, [
        empleado.id_orden,
        empleado.idempleado,
        empleado.resena,
        new Date()
    ]);
}


Product.buscarProducto = (idOrden) => {
    const sql = `
    SELECT 
        *
    FROM
        productos
    WHERE
        id_orden = $1
    `;

    return db.manyOrNone(sql,idOrden);
}

Product.buscarPermisos = (idOrden) => {
    const sql = `
    SELECT 
        *
    FROM
        permisos
    WHERE
        id_orden = $1
    `;

    return db.manyOrNone(sql,idOrden);
}

Product.buscarcosto = (idOrden) => {
    const sql = `
    SELECT 
        *
    FROM
        costos
    WHERE
        id_orden = $1
    `;

    return db.manyOrNone(sql,idOrden);
}

Product.buscarempleado = (idOrden) => {
    const sql = `
    SELECT 
        eo.id,
        eo.id_orden, 
        eo.nombre AS id_empleado, 
        (SELECT name FROM users WHERE id = eo.nombre) AS nombre_empleado, 
        eo.resena, 
        eo.creado
    FROM 
        empleadosorden eo
    WHERE
        eo.id_orden = $1;

    `;

    return db.manyOrNone(sql,idOrden);
}

Product.buscaradiciones = (idOrden) => {
    const sql = `
    SELECT 
        *
    FROM
        adiciones
    WHERE
        id_orden = $1
    `;

    return db.manyOrNone(sql,idOrden);
}




module.exports = Product;