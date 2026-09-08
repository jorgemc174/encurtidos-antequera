# React + Vite

## Asistente de administración

Para activar el asistente de precios y textos, sigue
[la guía de instalación](docs/activar-asistente.md).
La clave de OpenAI se configura en Supabase, nunca en el código del navegador.
Para el acceso sin correo, sigue [la activación del acceso solo con contraseña](docs/activar-acceso-simple.md).

Comprobaciones: `npm test`, `npm run lint` y `npm run build`.
El archivo único para el editor de Supabase se genera con `npm run build:assistant`.

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
