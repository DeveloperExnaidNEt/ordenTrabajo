const db = require('../config/config');

const EmpleadosOrdenes = {};



EmpleadosOrdenes.create = (id_order, id_product, quantity) => {
    const sql = `
    INSERT INTO
        costos(
            id_order,
            id_product,
            quantity,
            created_at,
            updated_at
        )
    VALUES($1, $2, $3, $4, $5)
    `;

    return db.none(sql, [
        id_order,
        id_product,
        quantity,
        new Date(),
        new Date()
    ]);
}

module.exports = OrderHasProducts;