# Tablero de Notas & Gestión de Usuarios - Full Stack & Emulación AWS

Aplicación web Full-Stack desarrollada con **React, Express, PostgreSQL y AWS Lambda emulado**, construida para demostrar buenas prácticas de desarrollo web, seguridad en autenticación (JWT & Bcrypt), arquitectura de microservicios con Docker y despliegue de infraestructura mediante AWS SAM / CloudFormation.

---

## 🚀 Requisitos Previos

Para ejecutar la aplicación localmente solo se requiere:
- **Docker** (versión 20.10 o superior)
- **Docker Compose** (versión 2.0 o superior)
- **Git**

*No se requiere cuenta de AWS ni suscripción de pago.*

---

## 🛠️ Credenciales de Demostración

El sistema se inicializa automáticamente con dos usuarios predeterminados:

| Rol | Correo Electrónico | Contraseña |
| :--- | :--- | :--- |
| **Administrador** | `admin@demo.com` | `12345678q` |
| **Usuario Estándar** | `user@demo.com` | `12345678q` |

---

## 💻 Instrucciones para Levantar el Entorno Local

1. **Clonar el repositorio:**
   ```bash
   git clone <URL_DE_TU_REPOSITORIO_GITHUB>
   cd <NOMBRE_DE_LA_CARPETA>