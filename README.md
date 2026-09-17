# 📋 Tablero de Notas & Gestión de Usuarios - Full Stack & Emulación AWS

Aplicación web **Full-Stack** desarrollada con **React, Express, PostgreSQL y AWS Lambda emulado**, construida para demostrar buenas prácticas de desarrollo web, seguridad en autenticación mediante **JWT y Bcrypt**, arquitectura de microservicios con **Docker** y despliegue de infraestructura mediante **AWS SAM / CloudFormation**.

---

## 🚀 Requisitos Previos

Para ejecutar la aplicación localmente solo se requiere:

* **Docker** versión 20.10 o superior
* **Docker Compose** versión 2.0 o superior
* **Git**

> **Nota:** No se requiere una cuenta de AWS ni una suscripción de pago para ejecutar el proyecto localmente.

---

## 🛠️ Cuentas de Acceso de Demostración

Al ejecutar la aplicación mediante Docker Compose, las siguientes cuentas quedan configuradas automáticamente para realizar pruebas y evaluación:

| Rol                            | Correo Electrónico   | Contraseña  | Descripción                                                                              |
| ------------------------------ | -------------------- | ----------- | ---------------------------------------------------------------------------------------- |
| **Administrador (Reclutador)** | `evaluador@demo.com` | `12345678q` | Acceso completo de administración. Cumple la regla de contraseña de mínimo 8 caracteres. |
| **Administrador Demo**         | `admin@demo.com`     | `123`       | Acceso de administración original.                                                       |
| **Usuario Estándar**           | `user@demo.com`      | `12345678q` | Acceso a la gestión de notas individuales.                                               |

> ⚠️ **Importante:** Estas credenciales son únicamente para demostración y pruebas locales. No deben utilizarse en entornos de producción.

---

## 💻 Instrucciones para Levantar el Entorno Local

### 1. Clonar el repositorio

Ejecuta:

```bash
git clone https://github.com/juandavid0509/tablero-notas-prueba.git
```

Luego ingresa al directorio del proyecto:

```bash
cd tablero-notas-prueba
```

---

### 2. Iniciar la aplicación completa

Ejecuta Docker Compose:

```bash
docker-compose up --build
```

Este comando construirá las imágenes necesarias e iniciará los diferentes servicios de la aplicación.

Para ejecutar los servicios en segundo plano:

```bash
docker-compose up --build -d
```

---

## 🌐 Endpoints de Acceso

Una vez iniciados los contenedores, puedes acceder a los siguientes servicios:

| Servicio                             | URL                           |
| ------------------------------------ | ----------------------------- |
| 🌐 **Frontend - React**              | http://localhost:5173         |
| ⚙️ **Backend API - Express**         | http://localhost:4000/api     |
| 📊 **Métricas - AWS Lambda Emulado** | http://localhost:5001/metrics |

---

## 🏗️ Arquitectura

El proyecto está compuesto por diferentes servicios que trabajan de manera independiente mediante Docker:

```text
┌─────────────────────────────┐
│       Frontend React        │
│       localhost:5173        │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│       Backend Express       │
│       localhost:4000        │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│         PostgreSQL          │
│       Base de Datos         │
└─────────────────────────────┘

               │
               ▼
┌─────────────────────────────┐
│     AWS Lambda Emulado      │
│       localhost:5001        │
└─────────────────────────────┘
```

---

## 🔐 Seguridad

La aplicación implementa diferentes mecanismos de seguridad:

* **JWT (JSON Web Tokens)** para autenticación.
* **Bcrypt** para el almacenamiento seguro de contraseñas.
* Autenticación y autorización basada en roles.
* Separación entre frontend, backend y base de datos mediante contenedores Docker.
* Variables de entorno para la configuración de los servicios.

---

## 🐳 Tecnologías Utilizadas

### Frontend

* React
* JavaScript
* HTML5
* CSS3

### Backend

* Node.js
* Express
* JWT
* Bcrypt

### Base de Datos

* PostgreSQL

### Infraestructura

* Docker
* Docker Compose
* AWS SAM
* AWS CloudFormation
* AWS Lambda (emulado localmente)

---

## 🛑 Detener la Aplicación

Para detener los contenedores:

```bash
docker-compose down
```

Para detener los contenedores y eliminar también los volúmenes:

```bash
docker-compose down -v
```

> ⚠️ El segundo comando puede eliminar los datos persistidos de PostgreSQL almacenados en los volúmenes de Docker.

---

## 🔄 Reconstruir el Proyecto

Si realizas cambios en el código y necesitas reconstruir las imágenes:

```bash
docker-compose down
docker-compose up --build
```

---

## 📌 Repositorio

El código fuente del proyecto está disponible en:

**GitHub:**
https://github.com/juandavid0509/tablero-notas-prueba

---

## 👨‍💻 Autor

**Juan David Molina Oliveros**

Proyecto desarrollado como demostración de desarrollo **Full-Stack, autenticación, arquitectura basada en contenedores y emulación de servicios AWS**.
