CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('Administrador', 'Usuario')),
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS notes (
    id SERIAL PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    text TEXT NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('Pendiente', 'En curso', 'Hecho')),
    x INTEGER NOT NULL DEFAULT 50,
    y INTEGER NOT NULL DEFAULT 50
);

TRUNCATE TABLE users RESTART IDENTITY CASCADE;

INSERT INTO users (name, email, password, role, is_active)
VALUES 
('Administrador Demo', 'admin@demo.com', '$2a$10$Zf8gT5wXvB8uH4eK8qZ3.O7mK3L5n6P7q8R9s0T1U2V3W4X5Y6Z7a', 'Administrador', true),
('Usuario Demo', 'user@demo.com', '$2a$10$Zf8gT5wXvB8uH4eK8qZ3.O7mK3L5n6P7q8R9s0T1U2V3W4X5Y6Z7a', 'Usuario', true);