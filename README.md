# 🚀 DICRI -- Sistema de Registro y Gestión de Evidencias

Este proyecto es una aplicación desarrollada en **React** para la
gestión integral de expedientes, evidencias, usuarios, roles y flujos de
trabajo del sistema **DICRI**.\
La solución fue construida por **mi persona**, con el objetivo de
ofrecer una interfaz moderna, ágil y escalable que facilite los procesos
de registro, evaluación y trazabilidad de expedientes.

## 📌 Características principales

-   🔐 **Autenticación con JWT** y control de acceso por roles.
-   📁 **Gestión de expedientes:** consulta detallada, edición y
    visualización completa.
-   🧾 **Administración de indicios (evidencias).**
-   🔄 **Cambio de estado del expediente:** revisión, aprobación y
    rechazo.
-   📝 **Historial y bitácora de auditoría** para control de cambios.
-   🎨 UI moderna basada en componentes reutilizables.
-   ⚡ Arquitectura modular optimizada para mantenimiento y
    escalabilidad.

## 🛠️ Tecnologías utilizadas

-   **React 18**
-   **Vite**
-   **CoreUI React** (como framework visual)
-   **Axios** -- consumo de APIs
-   **React Router**
-   **Context API & Hooks**
-   **SCSS / estilos personalizados**
-   **ESLint + Prettier**

## 🧩 Estructura del proyecto

    src/
    ├── assets/        # Recursos gráficos
    ├── components/    # Componentes reutilizables
    ├── views/         # Pantallas del sistema
    ├── layouts/       # Estructuras de diseño
    ├── context/       # Estados globales y autenticación
    ├── hooks/         # Hooks personalizados
    ├── services/      # Comunicación con API
    └── App.js         # Entrada principal de la aplicación

## ▶️ Ejecución del proyecto

### 1. Instalar dependencias

``` bash
npm install
```

### 2. Ejecutar en modo desarrollo

``` bash
npm start
```

Aplicación disponible en:

👉 http://localhost:3000

### 3. Crear build de producción

``` bash
npm run build
```

Salida generada en `/build`.

## 📡 Integración con API

La aplicación consume servicios REST externos, entre ellos:

-   `/v1/auth/login`
-   `/v1/expedientes`
-   `/v1/expedientes/{id}/indicios`
-   `/v1/expedientes/{id}/estado`
-   `/v1/auditoria`
-   Otros endpoints utilizados para el flujo completo de expedientes.

## 👤 Autor

**Emanuel Mazariegos**\
Desarrollador Full Stack -- Guatemala\
Especializado en integración de APIs, automatización, arquitectura de
software y desarrollo frontend moderno.

## 📄 Licencia

Proyecto publico. Uso autorizado únicamente para fines institucionales y
de desarrollo.
