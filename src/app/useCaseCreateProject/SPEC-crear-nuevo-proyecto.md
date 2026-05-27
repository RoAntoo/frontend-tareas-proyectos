# SPEC: Crear un nuevo proyecto

**Nombre de la feature:**
Crear un nuevo proyecto.

**Descripción general:**
El usuario autenticado puede crear un nuevo proyecto ingresando su nombre, fechas de inicio y fin, estado y una descripción. Esto permite inicializar el contenedor para futuras tareas.

**Endpoints involucrados:**
POST /projects
- Auth: Bearer token en header Authorization.
- Request body: { "id": null, "name": "...", "startDate": "...", "endDate": "...", "status": "...", "description": "..." }
- Response: 201 Created con body ProjectResponse
- Errores: 400 Bad Request (errores de validación), 409 Conflict (nombre duplicado).

**Restricciones de negocio:**
- El nombre del proyecto (Project.name) debe ser único.
- La fecha de fin debe ser mayor o igual a la fecha de inicio (Project.endDate >= Project.startDate).
- Al crear, la fecha de fin debe ser mayor o igual a la fecha actual (endDate >= today).
- Todos los campos requeridos deben estar presentes.

**Lineamientos técnicos:**
Standalone components, Angular 17, Reactive Forms (para manejar las validaciones de fechas), HttpClient con interceptor JWT para la autenticación, manejo de estado de carga/error con Signals.

**Criterios de aceptación:**
1. Dado que el usuario completa el formulario con datos válidos, cuando envía el formulario, entonces el proyecto se crea exitosamente (HTTP 201) y es redirigido al listado de proyectos.
2. Dado que el usuario ingresa una fecha de fin anterior a hoy, cuando intenta enviar el formulario, entonces el botón de guardado se deshabilita y se muestra un mensaje de error de validación local.
3. Dado que el usuario ingresa un nombre de proyecto que ya existe, cuando envía el formulario, entonces el backend devuelve un error 409 y se muestra un mensaje de "Recurso duplicado" en la pantalla.

**Prompts utilizados:**
Actúa como un desarrollador senior de Angular 17 con experiencia en aplicaciones empresariales.

Contexto del sistema:
Estoy desarrollando el frontend de una aplicación de gestión de tareas y proyectos. El backend es una API REST en Java (Spring Boot) con autenticación JWT que se envía en el header Authorization. El frontend utiliza Angular 17 con standalone components, Signals para el manejo de estado local y Reactive Forms.

Feature a implementar:
A continuación te detallo la especificación de la feature "Crear un nuevo proyecto":

Restricciones técnicas:
- Utilizar HttpClient para la comunicación con el backend. Asumir que el interceptor JWT ya está configurado y funcionando.
- El servicio para comunicarse con la API debe llamarse ProjectService.
- El componente debe ser standalone y utilizar ChangeDetectionStrategy.OnPush para optimizar el rendimiento.
- Implementar Reactive Forms. Es obligatorio crear validadores sincrónicos personalizados (custom validators) para las reglas de negocio de las fechas (endDate >= startDate, y al crear, endDate >= hoy).
- Manejar los estados de la interfaz (loading, error, éxito) estrictamente utilizando Signals de Angular (`signal`).
- Proveer un manejo de errores robusto en el componente para capturar el error 409 (Conflicto) y mostrar el mensaje de "Recurso duplicado", y los errores 400 (Bad Request).

Formato de salida esperado:
Por favor, genera el código completo y listo para usar de los siguientes archivos:
1. El servicio `project.service.ts` (incluyendo las interfaces de TypeScript necesarias para el request y response).
2. El componente `project-create.component.ts`.
3. El template HTML `project-create.component.html` (utilizando clases de Bootstrap 5 para el maquetado del formulario y los mensajes de error).

spec para diseño