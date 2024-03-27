const db = require('../config/config');
const crypto = require('crypto');

const User = {};

User.getAll = () => {
    const sql = `
    SELECT 
        *
    FROM
        users
    `;

    return db.manyOrNone(sql);
}

User.getDetalleUsuario = (idUsuario) => {
    const sql = `
    SELECT 
        *
    FROM
        users
    WHERE
        id = $1
    `;

    return db.manyOrNone(sql, idUsuario);
}

User.getRolUsuario = (idUsuario) => {
    const sql = `
    SELECT 
        ur.id_user, 
        (SELECT name FROM roles WHERE id = ur.id_rol) AS nombre_rol,
        ur.created_at
        
    FROM
        user_has_roles ur
    WHERE
        id_user = $1
    `;

    return db.manyOrNone(sql, idUsuario);
}


User.getSupervisor = (supervisor) => {
    const sql = `
    SELECT 
        *
    FROM
        users
    WHERE id = $1
    `;

    return db.manyOrNone(sql, supervisor);
}


User.optenerSupervisores = () => {
    const sql = `
    SELECT 
        u.*
    FROM 
        users u
   JOIN user_has_roles ur ON u.id = ur.id_user
   WHERE
         ur.id_rol = 3;

    `;

    return db.manyOrNone(sql);
}

User.optenerempleados = () => {
    const sql = `
    SELECT 
        u.*
    FROM 
        users u
   JOIN user_has_roles ur ON u.id = ur.id_user
   WHERE
         ur.id_rol = 5;

    `;

    return db.manyOrNone(sql);
}

User.optenerDisenadores = () => {
    const sql = `
    SELECT 
        u.*
    FROM 
        users u
   JOIN user_has_roles ur ON u.id = ur.id_user
   WHERE
         ur.id_rol = 4;

    `;

    return db.manyOrNone(sql);
}


User.findById = (id, callback) => {

    const sql = `
    SELECT
        id,
        email,
        name,
        lastname,
        image,
        phone,
        password,
        session_token
    FROM
        users
    WHERE
        id = $1`;
    
    return db.oneOrNone(sql, id).then(user => { callback(null, user); })

}

User.findByUserId = (id) => {
    const sql = `
    SELECT
        U.id,
        U.email,
        U.name,
        U.lastname,
        U.image,
        U.phone,
        U.password,
        U.session_token,
        json_agg(
            json_build_object(
                'id', R.id,
                'name', R.name,
                'image', R.image,
                'route', R.route
            )
        ) AS roles
    FROM 
        users AS U
    INNER JOIN
        user_has_roles AS UHR
    ON
        UHR.id_user = U.id
    INNER JOIN
        roles AS R
    ON
        R.id = UHR.id_rol
    WHERE
        U.id = $1
    GROUP BY
        U.id
    `
    return db.oneOrNone(sql, id);
}




User.findByEmail = (email) => {
    const sql = `
    SELECT
        U.id,
        U.email,
        U.name,
        U.lastname,
        U.image,
        U.phone,
        U.password,
        U.session_token,
        json_agg(
            json_build_object(
                'id', R.id,
                'name', R.name,
                'image', R.image,
                'route', R.route
            )
        ) AS roles
    FROM 
        users AS U
    INNER JOIN
        user_has_roles AS UHR
    ON
        UHR.id_user = U.id
    INNER JOIN
        roles AS R
    ON
        R.id = UHR.id_rol
    WHERE
        U.email = $1
    GROUP BY
        U.id
    `
    return db.oneOrNone(sql, email);
}

User.getAdminsNotificationTokens = () => {
    const sql = `
    SELECT
        U.notification_token
    FROM 
        users AS U
    INNER JOIN
        user_has_roles AS UHR
    ON
        UHR.id_user = U.id
    INNER JOIN
        roles AS R
    ON
        R.id = UHR.id_rol
    WHERE
        R.id = 2
    `
    return db.manyOrNone(sql);
}

User.getUserNotificationToken = (id) => {
    const sql = `
    SELECT
        U.notification_token
    FROM 
        users AS U
    WHERE
        U.id = $1
    `
    return db.oneOrNone(sql, id);
}

User.create = (user) => {

    const myPasswordHashed = crypto.createHash('md5').update(user.password).digest('hex');
    user.password = myPasswordHashed;

    const sql = `
    INSERT INTO
         users(
            email,
            name,
            lastname,
            phone,
            image,
            password,
            created_at,
            updated_at
         )
    VALUES($1, $2, $3, $4, $5, $6, $7, $8)RETURNING id
    `;

    return db.oneOrNone(sql, [
        user.email,
        user.name,
        user.lastname,
        user.phone,
        user.image,
        user.password,
        new Date(),
        new Date()
    ]);
}

User.createRol = (rol) => {
    const sql = `
    INSERT INTO
     user_has_roles(
        id_user, 
        id_rol, 
        created_at, 
        updated_at
        )
    VALUES($1, $2, $3, $4)
    `;
    return db.oneOrNone(sql, [
        rol.idUsuario,
        rol.idrol,    
        new Date(),
        new Date()
    ]);
}


User.update = (user) => {
    const sql = `
    UPDATE
        users
    SET
        name = $2,
        lastname = $3,
        phone = $4,
        image = $5,
        update_at = $6
    WHERE
        id = $1
    `;

    return db.none(sql, [
        user.id,
        user.name,
        user.lastname,
        user.phone,
        user.image,
        new Date()
    ]);
}

User.updateToken = (id, token) => {
    const sql = `
    UPDATE
        users
    SET
        session_token = $2
    WHERE
        id = $1
    `;

    return db.none(sql, [
        id,
        token
    ]);
}

User.updateNotificationToken = (id, token) => {
    const sql = `
    UPDATE
        users
    SET
        notification_token = $2
    WHERE
        id = $1
    `;

    return db.none(sql, [
        id,
        token
    ]);
}

User.isPasswordMatched = (userPassword, hash) => {
    const myPasswordHashed = crypto.createHash('md5').update(userPassword).digest('hex');
    if (myPasswordHashed === hash) {
        return true;
    }
    return false;
}

module.exports = User;