DROP TABLE IF EXISTS roles CASCADE;
CREATE TABLE roles(
	id BIGSERIAL PRIMARY KEY,
	name VARCHAR(180) NOT NULL UNIQUE,
	image VARCHAR(255) NULL, 
	route VARCHAR(255) NULL,
	created_at TIMESTAMP(0) NOT NULL,
	updated_at TIMESTAMP(0) NOT NULL
);

INSERT INTO roles (
	name,
	route,
	created_at,
	updated_at
)
VALUES(
	'ADMINISTRADOR',
	'client/products/list',
	'2021-05-22',
	'2021-05-22'
);


INSERT INTO roles (
	name,
	route,
	created_at,
	updated_at
)
VALUES(
	'EJECUTORA',
	'restaurant/orders/list',
	'2021-05-22',
	'2021-05-22'
);

INSERT INTO roles (
	name,
	route,
	created_at,
	updated_at
)
VALUES(
	'SUPERVISOR',
	'delivery/orders/list',
	'2021-05-22',
	'2021-05-22'
);
INSERT INTO roles (
	name,
	route,
	created_at,
	updated_at
)
VALUES(
	'EMPLEADO',
	'delivery/orders/list',
	'2021-05-22',
	'2021-05-22'
);



DROP TABLE IF EXISTS users CASCADE;
CREATE TABLE users(
	id BIGSERIAL PRIMARY KEY,
	email VARCHAR(255) NOT NULL UNIQUE,
	name VARCHAR(255) NOT NULL,
	lastname VARCHAR(255) NOT NULL,
	phone VARCHAR(80) NOT NULL UNIQUE,
	image VARCHAR(255) NULL,
	password VARCHAR(255) NOT NULL,
	is_available BOOLEAN NULL,
	session_token VARCHAR(255) NULL,
	notification_token VARCHAR(255) NULL,
	created_at TIMESTAMP(0) NOT NULL,
	updated_at TIMESTAMP(0) NOT NULL
);

DROP TABLE IF EXISTS user_has_roles CASCADE;
CREATE TABLE user_has_roles(
	id_user BIGSERIAL NOT NULL,
	id_rol BIGSERIAL NOT NULL,
	created_at TIMESTAMP(0) NOT NULL,
	updated_at TIMESTAMP(0) NOT NULL,
	FOREIGN KEY(id_user) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
	FOREIGN KEY(id_rol) REFERENCES roles(id) ON UPDATE CASCADE ON DELETE CASCADE,
	PRIMARY KEY(id_user, id_rol)
);

-- Tabla de órdenes de trabajo
CREATE TABLE ordenes (
    id SERIAL PRIMARY KEY,
    id_usuariocreador INT REFERENCES users(id),
    Nombre VARCHAR(255),
    Direccion VARCHAR(255),
    FechaOrden DATE,
    Descripcion TEXT,
    Supervisor INT REFERENCES users(id),
    Estado VARCHAR(50),
    ValorCotizado NUMERIC(10, 2),
    CostoTotal NUMERIC(10, 2),
    MargenGanancia NUMERIC(10, 2)
);

-- Tabla de productos
CREATE TABLE productos (
    id SERIAL PRIMARY KEY,
    id_orden INT REFERENCES ordenes(id),
    nombre VARCHAR(255),
    descripcion TEXT,
    precio NUMERIC(10, 2)
);

-- Tabla de costos
CREATE TABLE costos (
    id SERIAL PRIMARY KEY,
    id_orden INT REFERENCES ordenes(id),
    nombre VARCHAR(255),
    precio NUMERIC(10, 2),
    descripcion TEXT
);

-- Tabla de empleados de la orden
CREATE TABLE empleadosOrden (
    id SERIAL PRIMARY KEY,
    id_orden INT REFERENCES ordenes(id),
    nombre VARCHAR(255),
    resena TEXT
);
