# SPEC: Página de Inicio (Home) y Barra de Navegación Global

**Nombre de la feature:**
Diseñar e implementar la página de inicio y la barra de navegación global con estilo personalizado.

**Descripción general:**
El usuario puede acceder a una pantalla de bienvenida centralizada que introduce el propósito de la aplicación y ofrece accesos directos. Además, dispone de una barra de navegación superior fija (Navbar) que actúa como el control maestro de rutas para navegar de forma fluida (SPA) por todos los módulos del sistema sin recargar la página.

**Endpoints involucrados:**
No aplica directamente para la renderización estática del Home, pero la Navbar interactúa con el sistema de rutas de Angular local.
- Errores globales de ruteo: 404 / Redirección automática si la URL no existe.

**Restricciones de negocio:**
- La barra de navegación debe ser visible y fija en todas las pantallas de la aplicación.
- Los accesos en la Navbar deben respetar las convenciones de rutas en plural del sistema (`/projects`, `/projects/new`).
- La sección de bienvenida ("Hero") debe centralizar las acciones principales del usuario basándose en los módulos disponibles.

**Lineamientos técnicos:**
Standalone components, Angular 17, RouterModule (encargado de la navegación SPA mediante `routerLink` y `<router-outlet>`), ChangeDetectionStrategy.OnPush para optimizar el rendimiento. Se hereda el uso de Bootstrap 5 (integrado mediante CDN de jsDelivr en `index.html` para agilidad y evitar duplicación local en bundle) para el esqueleto estructural, pero se anula el estilo clásico inyectando una paleta de colores pasteles personalizada de forma global.

**Lineamientos de diseño visual:**
- **Paleta de colores pasteles:** - Verde Menta Pastel (`#E8F5E9` / `#A5D6A7` para estados activos): Aplicado como fondo principal de la Navbar superior y botones de éxito.
  - Rosa Pastel (`#FCE4EC` / `#F8BBD0` para acentos): Aplicado como fondo del contenedor principal del Home ("Hero") y etiquetas de destacados.
  - Texto: Gris oscuro (`#2C3E50`) para asegurar la legibilidad sobre los fondos pasteles.
- **Layout:** - Navbar fija en el tope de la ventana (`fixed-top` o estructural fuera del outlet).
  - El contenido del Home se presenta centrado vertical y horizontalmente en una sección "Hero" con bordes redondeados suaves (`border-radius: 15px`) y un sombreado estético muy leve.
- **Mensajes de sistema y errores:** En caso de navegar a una ruta inexistente, el sistema aplicará una redirección silenciosa e inmediata al inicio, evitando pantallas de error rotas.

**Criterios de aceptación:**
1. Dado que el usuario se encuentra en cualquier pantalla de la aplicación, cuando visualiza el tope de la página, entonces la Navbar pastel se mantiene fija en su posición sin desaparecer ni recargarse al hacer scroll.
2. Dado que el usuario hace clic en el enlace "Crear Proyecto" o "Ver Proyectos" de la Navbar, cuando el Router de Angular intercepta la acción, entonces la pantalla cambia instantáneamente al componente correspondiente de forma fluida (SPA) sin pestañeo blanco ni recarga tradicional del navegador.
3. Dado que el usuario escribe manualmente una ruta que no existe en la barra de direcciones (ej: `/cualquier-cosa`), cuando presiona Enter, entonces el sistema intercepta el error de ruteo y lo redirige automáticamente a la página de inicio (Home).

**Prompts utilizados:**
- Agente IA: Gemini (gemini.ai)
- Prompt principal: ver archivo prompt-home.md adjunto en el PR.
