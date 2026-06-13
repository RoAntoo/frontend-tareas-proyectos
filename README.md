# 🌿 Nivi — Sistema de Gestión de Proyectos y Tareas

Nivi es una aplicación web moderna y reactiva para la planificación y seguimiento de proyectos y sus respectivas tareas, desarrollada utilizando **Angular 17+** con una arquitectura basada en componentes independientes (**Standalone Components**) y reactividad moderna mediante **Signals**.

---

## 🎨 Lineamientos de Diseño Visual (Sistema de Colores Pasteles)

Para garantizar la coherencia estética en toda la aplicación y alejar el diseño del estándar genérico de Bootstrap 5, se define la siguiente paleta de colores global y pautas estéticas:

- **Fondo de la Aplicación (Body):** Blanco roto/hueso (`#FAFAFA`) para reducir la fatiga visual.
- **Color Primario (Navbar y Éxito):** Verde Menta Pastel (`#E8F5E9` como fondo, con acentos en `#A5D6A7`). Se mapea para reemplazar las acciones principales y cabeceras de éxito (`bg-success`, `btn-success`).
- **Color Secundario (Acentos y Destacados):** Rosa Pastel (`#FCE4EC` como fondo, con acentos en `#F8BBD0`). Se utiliza en el contenedor del Home, alertas visuales y estados de tareas/proyectos específicos (`PLANNED`).
- **Textos y Tipografía:** Gris oscuro (`#2C3E50`) aplicado a los títulos y textos para asegurar un contraste accesible sobre los fondos claros.
- **Estructura:** Uso estricto de tarjetas redondeadas (`border-radius: 12px;` o `16px;`) con sombras muy sutiles (`shadow-sm`) y micro-animaciones (transiciones suaves al hacer hover sobre los botones y tarjetas) para un aspecto moderno, fluido y limpio.

---

## 🚀 Funcionalidades Principales

### 📈 Panel de Inicio (Home)
- Cuadro de mando/Dashboard que muestra una bienvenida interactiva y accesos rápidos a las secciones principales del sistema.

### 📁 Gestión de Proyectos
- **CRUD Completo:** Creación, consulta, edición y eliminación de proyectos.
- **Validación Avanzada:** Validación reactiva de fechas (la fecha de fin no puede ser anterior a la de inicio ni anterior al día de hoy).
- **Filtros en Tiempo Real:** Filtrado reactivo en pantalla por estado del proyecto (`PLANNED`, `ACTIVE`, `CLOSED`, `TODOS`) usando signals calculados (`computed`).
- **Eliminación Segura y UX:** El borrado de proyectos cuenta con un modal de confirmación no bloqueante y diferido que permanece en pantalla y muestra un indicador de carga (`isLoading` / spinner animado) hasta que la petición HTTP finaliza con éxito o error.

### 📋 Gestión de Tareas
- **Listado por Proyecto:** Visualización y administración de tareas asociadas de forma única a cada proyecto.
- **CRUD Completo de Tareas:** Alta, edición y actualización de estados (`PENDING`, `IN_PROGRESS`, `COMPLETED`) y niveles de prioridad (`LOW`, `MEDIUM`, `HIGH`).
- **Baja en Cascada:** Al confirmar la eliminación de un proyecto, el backend procesa el borrado automático de todas sus tareas correspondientes.

### 🧩 Componentes Standalone y Reutilizables
- **ConfirmationModalComponent:** Componente standalone global ubicado en `src/app/shared/components/confirmation-modal/` con su propio template HTML y estilos CSS independientes. Se reutiliza fácilmente para cualquier confirmación interactiva pasando parámetros y escuchando eventos mediante inputs y outputs reactivos.

---

## 🛠️ Arquitectura y Estructura del Proyecto

El código está estructurado siguiendo las directrices recomendadas por la guía de estilo de Angular, desacoplando la lógica de la presentación:

```bash
src/app/
├── core/             # Modelos de datos e interfaces tipadas
├── features/         # Componentes organizados por lógica de negocio (Home, Get Projects, Edit, etc.)
│   ├── get-projects/ # Listado de proyectos (CSS, HTML y TS separados)
│   ├── delete-project/# Especificaciones (SPEC) y prompts de borrado
│   └── ...           # Demás características (update, create)
├── service/          # Servicios HTTP inyectables de Angular
└── shared/           # Elementos compartidos
    └── components/   # Componentes globales reutilizables (ConfirmationModalComponent)
