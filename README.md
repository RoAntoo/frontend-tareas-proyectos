# FrontendTareasProyectos

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.2.7.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

## 🎨 Lineamientos de Diseño Visual del Proyecto (Sistema de Colores Pasteles)

Para garantizar la coherencia estética en toda la aplicación y alejar el diseño del estándar genérico de Bootstrap 5, se define la siguiente paleta de colores global:

- **Fondo de la Aplicación (Body):** Blanco roto/hueso (`#FAFAFA`) para reducir la fatiga visual.
- **Color Primario (Navbar y Éxito):** Verde Menta Pastel (`#E8F5E9` como fondo, con acentos en `#A5D6A7`). Se mapea para reemplazar las acciones principales y cabeceras de éxito (`bg-success`, `btn-success`).
- **Color Secundario (Acentos y Destacados):** Rosa Pastel (`#FCE4EC` como fondo, con acentos en `#F8BBD0`). Se utiliza en el contenedor del Home, alertas visuales y estados de tareas/proyectos específicos (`PLANNED`).
- **Textos y Tipografía:** Gris oscuro (`#2C3E50`) aplicado a los títulos y textos para asegurar un contraste accesible sobre los fondos claros.
- **Estructura:** Uso estricto de tarjetas redondeadas (`border-radius: 12px;`) con sombras muy sutiles (`shadow-sm`) para un aspecto moderno y limpio.
