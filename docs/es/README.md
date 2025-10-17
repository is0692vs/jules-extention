# Extensión de Jules para VSCode

[![VSCode Extension](https://img.shields.io/badge/VSCode-Extension-blue.svg)](https://marketplace.visualstudio.com/items?itemName=YOUR_PUBLISHER.jules-extension)
[![Status](https://img.shields.io/badge/status-development-yellow.svg)](#)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

> "Experimenta el futuro de la codificación con Google Jules en VSCode"

La Extensión de Jules es una extensión que te permite operar el agente de codificación de IA de Google, **Jules**, directamente desde VSCode.
Da la bienvenida a un compañero inteligente a tu flujo de trabajo de codificación.

## ✨ Concepto

Esta extensión fue creada para llevar tu experiencia de desarrollo al siguiente nivel.

- **Integración Perfecta:** Accede a las potentes funciones de Jules sin salir de tu entorno habitual de VSCode.
- **Colaboración en Tiempo Real:** Desde la creación de una sesión de codificación hasta la comprobación de su progreso, todo en tiempo real.
- **Salto de Productividad:** Deja las tareas tediosas a Jules y concéntrate en tu trabajo creativo.

## 🚀 Características Clave

| Característica         | Descripción                                                                          | Comando / Icono                   |
| :--------------------- | :----------------------------------------------------------------------------------- | :-------------------------------- |
| **Establecer Clave API**| Establece y valida de forma segura la clave API para usar la API de Jules.           | `jules-extension.setApiKey`       |
| **Gestión de Sesiones**| Inicia nuevas sesiones de codificación y gestiónalas en una lista.                     | `jules-extension.createSession`   |
| **Monitoreo en Tiempo Real**| Rastrea el estado de las sesiones activas en tiempo real en una vista dedicada con el icono `$(robot)`. | `julesSessionsView`               |
| **Actualización de Progreso**| Obtén la información más reciente sobre sesiones y actividades con un solo botón `$(refresh)`. | `jules-extension.refreshSessions` |
| **Visualización de Actividad**| Consulta los registros detallados de las tareas ejecutadas por Jules.          | `jules-extension.showActivities`  |

### Vista Previa: Vista de Sesiones de Jules

```
┌──────────────────────────────┐
│ ▼ JULES SESSIONS        ↻    │
├──────────────────────────────┤
│  ▶ session-xyz-123 (Running) │
│  ▶ session-abc-456 (Active)  │
│  ⏹ session-def-789 (Done)    │
└──────────────────────────────┘
```

_(Esto es un concepto de la interfaz de usuario. La visualización real puede diferir.)_

## 📦 Instalación

### Desde el Marketplace (Recomendado)

1.  Busca "Jules Extension" en el Marketplace de VSCode (próximamente)
2.  Haz clic en el botón `Install`

### Desde un Archivo VSIX (Instalación Manual)

Si quieres probar las últimas funciones que aún no se han publicado en el Marketplace, puedes descargar e instalar el archivo `.vsix` directamente desde la página de lanzamientos.

1.  **Ve a la Página de Lanzamientos:**
    Visita [Lanzamientos de GitHub](https://github.com/your-repo/jules-extension/releases) y encuentra la última versión.

2.  **Descarga el Archivo VSIX:**
    Descarga el archivo `.vsix` (p. ej., `jules-extension-0.1.0.vsix`) desde `Assets`.

3.  **Instala en VSCode:**
    - Abre VSCode.
    - Ve a la vista de `Extensiones` (`Ctrl+Shift+X`).
    - Haz clic en el menú `...` (Más Acciones) en la parte superior de la vista y selecciona `Instalar desde VSIX...`.
    - Selecciona el archivo `.vsix` descargado para instalarlo.

## 🔑 Cómo Obtener tu Clave de API

Para usar la Extensión de Jules, necesitas una clave de API de Jules. Sigue estos pasos para obtener una:

1.  **Crea una Cuenta:**
    - Ve al [Sitio Web Oficial de Jules](https://jules.google/docs).
    - Regístrate para obtener una nueva cuenta o inicia sesión si ya tienes una.

2.  **Genera la Clave de API:**
    - Navega a la sección "Claves de API" o "Configuración de Desarrollador" en el panel de tu cuenta.
    - Haz clic en "Crear una nueva clave secreta".
    - Dale a tu clave un nombre descriptivo (p. ej., "Extensión de VSCode") y genérala.

3.  **Copia y Almacena tu Clave:**
    - Se mostrará tu nueva clave de API. **Esta es la única vez que verás la clave completa, así que cópiala de inmediato.**
    - Guárdala en un lugar seguro.

> **Importante:** Trata tu clave de API como una contraseña. No la compartas públicamente ni la incluyas en el control de versiones.

## Inicio Rápido

1.  Presiona `Ctrl + Shift + P` (o `Cmd + Shift + P`) para abrir la Paleta de Comandos.
2.  Ejecuta `> Jules: Set Jules API Key` e introduce tu clave de API.
3.  Haz clic en el icono `$(robot)` en la barra lateral para abrir la Vista de Sesiones de Jules.
4.  Ejecuta `> Jules: Create Jules Session` para iniciar tu primera sesión de codificación.

## ⚠️ Notas Importantes

- **Renderización de Bloques de Tarjetas:** Al utilizar funciones que se muestran como bloques de tarjetas, ten en cuenta la estructura del contenido para asegurar que se renderice correctamente.

## 🤝 Contribución

Este proyecto acaba de empezar. ¡Agradecemos todas las formas de contribución, incluidos informes de errores, sugerencias de funciones y pull requests!
Por favor, consulta el Rastreador de Problemas y los Pull Requests.

## 📝 Licencia

[MIT](LICENSE)