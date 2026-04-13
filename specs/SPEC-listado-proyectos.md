# SPEC: Listado de Proyectos

| Campo | Descripción y criterio de calidad |
| :--- | :--- |
| **Nombre de la feature** | Ver listado general de proyectos. |

| **Descripción general** | El usuario puede visualizar todos los proyectos registrados en el sistema. Cada proyecto muestra su nombre, estado, fecha de inicio y fecha de fin. Permite filtrar los proyectos rápidamente según su estado. |

| **Endpoints involucrados** | **GET /projects**<br> - Parámetros de entrada (opcionales): `status`, `startDate`, `endDate`<br> - Response: array de objetos `{ id, name, startDate, endDate, status, description }`<br> - Códigos: 200 OK, 500 Internal Server Error. |

| **Restricciones de negocio** | - El campo `status` solo puede tomar los valores: `PLANNED`, `ACTIVE` o `CLOSED`.<br> - Si no hay proyectos cargados, se debe mostrar un mensaje amigable al usuario en lugar de una tabla vacía. |

| **Lineamientos técnicos** | - Angular 17+ con Standalone Components.<br> - Estilos con CSS puro (o Bootstrap si se decide agregar).<br> - Comunicación con backend: `HttpClient` encapsulado en un `ProjectService`.<br> - Gestión de estado: Uso de `Signals` para almacenar el listado y el filtro de estado. |

| **Criterios de aceptación** | **Criterio 1: Carga exitosa**<br> *Dado* que existen proyectos en la base de datos,<br> *Cuando* el usuario navega a la ruta principal `/proyectos`,<br> *Entonces* ve una tabla o grilla con la lista de proyectos mostrando nombre, fechas y estado.<br><br> **Criterio 2: Listado vacío**<br> *Dado* que no hay proyectos en el sistema,<br> *Cuando* el usuario ingresa a la pantalla,<br> *Entonces* ve el mensaje "No hay proyectos registrados actualmente".<br><br> **Criterio 3: Filtrado por estado**<br> *Dado* que el usuario está viendo el listado,<br> *Cuando* selecciona el filtro "ACTIVE",<br> *Entonces* la vista se actualiza para mostrar únicamente los proyectos con ese estado. |

| **Prompts utilizados** | *()* |