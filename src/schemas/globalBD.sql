create table roles (
    id SERIAL primary key,
    name varchar(50) unique not null,
    description text
) create table menus (
    id serial primary key,
    label varchar(50) not null,
    route varchar(100) not null,
    icon varchar(50)
);
create table role_menus (
    role_id int references roles(id),
    menu_id int references menus(id),
    primary key (role_id, menu_id)
);
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    contraseña VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    role_id INT REFERENCES roles(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);
CREATE TABLE clients (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) not NULL,
    phone VARCHAR(20) NOT NULL,
    notes TEXT,
    created_by INT REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE services (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    duration_minutes INT NOT NULL,
    -- Ej: 30, 60
    price DECIMAL(10, 2)
);
CREATE TABLE appointments (
    id SERIAL PRIMARY KEY,
    client_id INT REFERENCES clients(id),
    staff_id INT REFERENCES users(id),
    service_id INT REFERENCES services(id),
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    notes TEXT
);
create table staff_services(
    staff_id INT references users(id) on delete cascade,
    service_id INT references services(id) on delete cascade,
    primary key (staff_id, service_id)
);
create table staff_avalibility(
    id serial primary key,
    staff_id INT references users(id) on delete cascade,
    day_of_week int not null check (
        day_of_week between 0 and 6
    ),
    start_time time not null,
    end_time time not null,
    unique (staff_id, day_of_week, start_time, end_time)
);
CREATE TABLE IF NOT EXISTS puestos (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    capacity INTEGER,
    status BOOLEAN DEFAULT TRUE,
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
-- Crear índice para mejorar búsquedas por nombre
CREATE INDEX IF NOT EXISTS idx_puestos_name ON puestos(name);
-- Crear índice para mejorar búsquedas por estado
CREATE INDEX IF NOT EXISTS idx_puestos_status ON puestos(status);
alter table staff_avalibility
modify column day_of_week VARCHAR(30);
alter table users
    rename column full_name to name_user;
ALTER TABLE staff_avalibility
ALTER COLUMN day_of_week TYPE VARCHAR(30);
ALTER TABLE staff_avalibility
    RENAME COLUMN day_of_week_id_id TO day_of_week_id;
--day_of_week_id_id
select concat(c.name_client, ' ', c.last_name) as full_name,
    *
from clients c;
-- Actualizar staff_services
select *
from staff_services sa;
-- Actualizar puestos
select *
from puestos;
alter table puestos
    rename column location to description;
-- Actualizar usuarios
select *
from users u
    inner join roles r on r.id = u.role_id
order by u.id;
-- Actualizar servicios
update services s
set description
delete from services
where id = 4;
-- Agregar puesto_id a appointments
ALTER TABLE appointments
ADD COLUMN puesto_id INT REFERENCES puestos(id);