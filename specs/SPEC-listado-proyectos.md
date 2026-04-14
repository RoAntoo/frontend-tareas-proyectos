# SPEC: Listado de Proyectos

| Campo | Descripción y criterio de calidad |
| :--- | :--- |
| **Nombre de la feature** | Ver listado general de proyectos. |

| **Descripción general** | El usuario puede visualizar todos los proyectos registrados en el sistema. Cada proyecto muestra su nombre, estado, fecha de inicio y fecha de fin. Permite filtrar los proyectos rápidamente según su estado. |

| **Endpoints involucrados** | **GET /projects**<br> - Parámetros de entrada (opcionales): `status`, `startDate`, `endDate`<br> - Response: array de objetos `{ id, name, startDate, endDate, status, description }`<br> - Códigos: 200 OK, 500 Internal Server Error. |

| **Restricciones de negocio** | - El campo `status` solo puede tomar los valores: `PLANNED`, `ACTIVE` o `CLOSED`.<br> - Si no hay proyectos cargados, se debe mostrar un mensaje amigable al usuario en lugar de una tabla vacía. |

| **Lineamientos técnicos** | - Angular 17+ con Standalone Components.<br> - Estilos con CSS puro (o Bootstrap si se decide agregar).<br> - Comunicación con backend: `HttpClient` encapsulado en un `ProjectService`.<br> - Gestión de estado: Uso de `Signals` para almacenar el listado y el filtro de estado. |

| **Criterios de aceptación** | **Criterio 1: Carga exitosa**<br> *Dado* que existen proyectos en la base de datos,<br> *Cuando* el usuario navega a la ruta principal `/proyectos`,<br> *Entonces* ve una tabla o grilla con la lista de proyectos mostrando nombre, fechas y estado.<br><br> **Criterio 2: Listado vacío**<br> *Dado* que no hay proyectos en el sistema,<br> *Cuando* el usuario ingresa a la pantalla,<br> *Entonces* ve el mensaje "No hay proyectos registrados actualmente".<br><br> **Criterio 3: Filtrado por estado**<br> *Dado* que el usuario está viendo el listado,<br> *Cuando* selecciona el filtro "ACTIVE",<br> *Entonces* la vista se actualiza para mostrar únicamente los proyectos con ese estado. |

| **Prompts utilizados** | *(1. Rol: Actúa como un desarrollador Senior de Angular 17+ con experiencia en aplicaciones empresariales y uso de Standalone Components.

2. Contexto del sistema:
Estoy desarrollando el frontend de una app de gestión de tareas y proyectos. El backend es una API REST en Java.

3. Especificación de la Feature:
Implementa el componente para el "Listado de tareas de un proyecto".

Endpoint: GET /proyectos/:id/tareas

Muestra una lista donde cada tarea tiene: título, estado y fecha límite (si es null, mostrar "Sin fecha").

Debe permitir filtrar por estado usando Signals.

Manejar estado de carga, lista vacía y errores (como un 403 o token expirado).

4. Restricciones Técnicas:

Angular 17+ con componentes standalone (ChangeDetectionStrategy.OnPush).

Usa HttpClient. (Asume que el interceptor JWT ya existirá, no lo crees).

Usa Signals de Angular para el estado de las tareas y el filtro, no uses BehaviorSubjects.

Usa CSS simple para que se vea ordenado.

5. Formato de Salida:
Genera el código para:

task.model.ts (la interfaz de la tarea).

task.service.ts (el servicio que hace el GET, recibiendo el ID del proyecto).

task-list.component.ts (el componente con su template HTML y estilos).)* |