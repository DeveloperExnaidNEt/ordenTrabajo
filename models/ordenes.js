const db = require('../config/config');

const Ordenes = {};


Ordenes.crearOrden = (orden) => {
    orden.estado = 'pendiente'
    const sql = `
    INSERT INTO 
        ordenes(
            id_usuariocreador,
             nombre,
             direccion, 
             fechaorden, 
             descripcion,              
             estado, 
             doc1
        )
    VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id
    `;

    return db.oneOrNone(sql, [
        orden.id_usuariocreador,
        orden.nombre,
        orden.direccion,
        new Date(),
        orden.descripcion, 
        orden.estado,       
        orden.image
    ]);
}

Ordenes.crearOrden2 = (orden) => {
    const sql = `
    INSERT INTO 
        ordentrabajo( 
            fecha,
            ciudad, 
            elabora, 
            entregapactada, 
            entregareal, 
            tipoproyecto, 
            cliente, 
            solicitadopor, 
            disenador, 
            fechaasignacion, 
            promesaentrega, 
            entregaproduccion, 
            horasrequeridas, 
            valorinicial, 
            adiciones, 
            valortotal, 
            gastomaximo, 
            sumagastos, 
            rentabilidad, 
            estado,
            doc1
        )
    VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21) RETURNING id
    `;

    return db.oneOrNone(sql, [
        new Date(),
        orden.ciudad, 
        orden.elabora, 
        orden.entregapactada, 
        orden.entregareal, 
        orden.tipoproyecto, 
        orden.cliente, 
        orden.solicitadopor, 
        orden.disenador, 
        orden.fechaasignacion, 
        orden.promesaentrega, 
        orden.entregaproduccion, 
        orden.horasrequeridas, 
        orden.valorinicial, 
        orden.adiciones, 
        orden.valortotal, 
        orden.gastomaximo, 
        orden.sumagastos, 
        orden.rentabilidad, 
        orden.estado,
        orden.image1
    ]);
}

Ordenes.verPendientes = () => {
    const sql = `
    SELECT 
        *
    FROM
        ordentrabajo
    WHERE
        estado = 'pendiente'
    `;

    return db.manyOrNone(sql);
}

Ordenes.verAprobados = () => {
    const sql = `
    SELECT 
        *
    FROM
        ordentrabajo 
    WHERE
        estado = 'aprobado'
    `;

    return db.manyOrNone(sql);
}

Ordenes.verEnEjecucion = () => {
    const sql = `
    SELECT 
        *
    FROM
       ordentrabajo
    WHERE
        estado = 'ejecucion'
    `;

    return db.manyOrNone(sql);
}

Ordenes.verTerminados = () => {
    const sql = `
    SELECT 
        *
    FROM
        ordentrabajo
    WHERE
        estado = 'terminada'
    `;

    return db.manyOrNone(sql);
}


Ordenes.buscarStage1 = (idOrden) => {
    const sql = `
    SELECT 
        eo.id,
        eo.fecha,
        eo.ciudad,
        eo.elabora,
        eo.entregapactada,
        eo.entregareal,
        eo.tipoproyecto,
        eo.cliente,
        eo.solicitadopor,
        (SELECT name FROM users WHERE id = eo.disenador) AS nombre_disenador,
        eo.fechaasignacion,
        eo.promesaentrega,
        eo.entregaproduccion,
        eo.horasrequeridas,
        eo.valorinicial,
        eo.adiciones,
        eo.valortotal,
        eo.gastomaximo,
        eo.sumagastos,
        eo.rentabilidad,
        eo.estado,
        eo.doc1,
        eo.doc2,
        eo.status,
        (SELECT name FROM users WHERE id = eo.supervisor) AS nombre_supervisor,
        eo.encargado,
        eo.fechainicio,
        eo.fechafin
    FROM
        ordentrabajo eo
    WHERE
        eo.id = $1

    `;

    return db.manyOrNone(sql,idOrden);
}

Ordenes.aprobarOrden = (orden) => {
    const sql = `
    UPDATE
        ordentrabajo
    SET
        doc2 =$2,
        status = $3,
        disenador = $4,
        supervisor = $5,
        valorinicial= $6,        
        estado = $7,
        encargado = $8
        
    WHERE
        id = $1
    `;

    return db.oneOrNone(sql, [
        
        orden.id,
        orden.image1,
        orden.status,
        orden.disenador,
        orden.supervisor,
        orden.valorinicial,       
        orden.estado,
        orden.encargado
    ]);
}


Ordenes.ejecutarOrden = (orden) => {
    const sql = `
    UPDATE
        ordentrabajo
    SET
        status = $2,
        estado = $3,        
        fechainicio = $4,
        fechafin = $5
        
    WHERE
        id = $1
    `;

    return db.oneOrNone(sql, [
        orden.id,
        orden.status,
        orden.estado,
        orden.fechainicio,
        orden.fechafin
    ]);
}

Ordenes.terminarOrden = (orden) => {
    const sql = `
    UPDATE
        ordentrabajo
    SET
        adiciones = $2,
        valortotal = $3,
        gastomaximo = $4,
        rentabilidad = $5,
        estado = $6,              
        status = $7,   
        fechafin = $8       
        
    WHERE
        id = $1
    `;

    return db.oneOrNone(sql, [
        orden.id,
        orden.adiciones,
        orden.valortotal,
        orden.gastomaximo,
        orden.rentabilidad,
        orden.status,
        orden.estado,
        orden.fechafin
      
    ]);
}



module.exports = Ordenes;