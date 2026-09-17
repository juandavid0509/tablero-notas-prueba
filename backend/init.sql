-- init.sql: Estructura e Inicialización limpia de la Base de Datos

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('Administrador', 'Usuario')),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS notes (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(150) NOT NULL,
    text TEXT NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('Pendiente', 'En curso', 'Hecho')),
    x INTEGER NOT NULL DEFAULT 350,
    y INTEGER NOT NULL DEFAULT 180,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Limpiar tablas al reiniciar contenedor
TRUNCATE TABLE notes, users RESTART IDENTITY CASCADE;

-- Insertar Cuentas Predeterminadas de Fábrica
INSERT INTO users (name, email, password, role, is_active)
VALUES 
('Administrador Demo', 'admin@demo.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVym5p4Wd7kPExvW./8d/Y2a', 'Administrador', true),
('Reclutador Evaluador', 'evaluador@demo.com', '$2a$10$E.rVlh5nSkgWJzW5vWf0ue3C1VjL4S9R7N2g3n.4k8a9b0c1d2e3f', 'Administrador', true),
('Usuario Demo', 'user@demo.com', '$2a$10$E.rVlh5nSkgWJzW5vWf0ue3C1VjL4S9R7N2g3n.4k8a9b0c1d2e3f', 'Usuario', true);

-- Insertar Notas Iniciales
INSERT INTO notes (user_id, title, text, status, x, y) VALUES
(1, 'Revisión de Seguridad', 'Verificar la longitud mínima de contraseña en el backend.', 'Hecho', 120, 100),
(1, 'Prueba de AWS Lambda', 'Probar la invocación de métricas desde el Dashboard.', 'En curso', 400, 150),
(2, 'Diseño UI/UX', 'Organizar la tabla de usuarios de forma compacta.', 'Pendiente', 250, 320);