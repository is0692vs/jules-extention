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

| Característica         | Descripción                                                                                                                                                                                                  | Comando / Icono                   |
| :--------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-------------------------------- |
| **Establecer Clave API**| En el primer uso, establece tu clave de API para conectarte a tu cuenta de Jules. La clave se almacena de forma segura en el SecretStorage de VSCode y se utiliza automáticamente para todas las solicitudes posteriores. | `jules-extension.setApiKey`       |
| **Gestión de Sesiones**| Usa el comando `> Jules: Create Session` para asignar una nueva tarea de codificación a Jules. Las sesiones pasadas también se enumeran, lo que te permite reanudar el trabajo o revisar el historial de tareas completadas en cualquier momento. | `jules-extension.createSession`   |
| **Monitoreo en Tiempo Real**| Obtén una vista rápida del estado de trabajo actual de Jules (`Running`, `Active`, `Done`, etc.) en una vista de barra lateral dedicada. No más cambios de ida y vuelta entre tu navegador y tu editor.  | `julesSessionsView`               |
| **Actualización de Progreso**| ¿Tienes curiosidad por saber cuánto ha progresado Jules? Haz clic en el botón `↻` (actualizar) para obtener y mostrar instantáneamente el estado de la sesión más reciente y la lista de actividades.    | `jules-extension.refreshSessions` |
| **Visualización de Actividad**| Selecciona una sesión para ver los registros detallados de los comandos que Jules ha ejecutado, los archivos que ha editado y su proceso de pensamiento. Proporciona una experiencia de desarrollo transparente, como si estuvieras mirando dentro de la mente de Jules. | `jules-extension.showActivities`  |

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

## 🔑 Cómo Obtener tu Clave de API

Para usar la Extensión de Jules, necesitas una clave de API de Jules. Sigue estos pasos para obtener una:

1.  **Crea una Cuenta:**
    - Ve al [Sitio Web Oficial de Jules](https://jules.google/docs).
    - Regístrate para obtener una nueva cuenta o inicia sesión si ya tienes una.

2.  **Genera la Clave de API:**
    - Navega a la sección "Claves de API" o "Configuración de Desarrollador" en el panel de tu cuenta.
    - Haz clic en "Crear una nueva clave secreta".
    - Dale a tu clave un nombre descriptivo (p. ej., "Extensión de VSCode") y genérala.

3.  **Copia Tu Clave:**
    - Se mostrará tu nueva clave de API. Cópiala a tu portapapeles.
    - Si necesitas ver tu clave de nuevo más tarde, siempre puedes encontrarla en tu página de configuración de Jules.

> **Importante:** Trata tu clave de API como una contraseña. No la compartas públicamente ni la incluyas en el control de versiones.

## Inicio Rápido

1.  Presiona `Ctrl + Shift + P` (o `Cmd + Shift + P`) para abrir la Paleta de Comandos.
2.  Ejecuta `> Jules: Set Jules API Key` e introduce tu clave de API.
3.  Haz clic en el icono `$(robot)` en la barra lateral para abrir la Vista de Sesiones de Jules.
4.  Ejecuta `> Jules: Create Jules Session` para iniciar tu primera sesión de codificación.

## 📚 Referencias

- [Sitio Web Oficial de Jules](https://jules.google/docs)
- [Documentación de la API de Jules](https://developers.google.com/jules/api)

## 🤝 Contribución

Este proyecto acaba de empezar. ¡Agradecemos todas las formas de contribución, incluidos informes de errores, sugerencias de funciones y pull requests!
Por favor, consulta el Rastreador de Problemas y los Pull Requests.

## 📝 Licencia

[MIT](../../LICENSE)