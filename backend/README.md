# Backend de Nivi

API de proyectos y tareas compatible con los servicios Angular de este repositorio. Usa Java 21, Spring Boot 3.5 y H2 persistente. Puerto predeterminado: **8081**.

## Ejecutar y verificar

Desde esta carpeta, con JDK 21 configurado:

```powershell
# Ejemplo para la instalación de Java 21 disponible en esta computadora:
$env:JAVA_HOME = 'C:\Program Files\Java\jdk-21'
.\mvnw.cmd clean verify
.\mvnw.cmd spring-boot:run
```

En Linux/macOS, usar `./mvnw`. No hace falta instalar Maven. El frontend se inicia desde la raíz del repositorio con `npm start`.

Los tests usan H2 en memoria y un reloj fijo en las pruebas de API; no acceden a la base de datos local. Cubren casos de uso y peticiones HTTP mediante MockMvc con los adaptadores JPA reales, incluidos el aislamiento por proyecto y el rollback del borrado en cascada.

## Arquitectura

```text
core/
  model/       Modelos de dominio Java, factories y reglas
  input/       Puertos de entrada y DTOs de los casos de uso
  output/      Contratos de repositorios sin dependencias de JPA
  usecase/     Un caso de uso por operación
  exception/   Errores de dominio
adapter/
  persistence/
    entity/      Entidades JPA y relaciones
    repository/  Repositorios Spring Data
    *Adapter     Implementaciones de los puertos de salida
    *Mapper      Conversión entre persistencia y dominio
  web/
    *Controller  Rutas y códigos HTTP
    service/     Límites transaccionales y conversión de respuestas
    mapper/      Conversión a DTOs
config/          Ensamblado de casos de uso y configuración CORS
```

El núcleo no importa Spring, JPA, Jackson ni adaptadores. Las consultas con filtros se traducen a Specifications en persistencia. Los controladores delegan en servicios transaccionales que invocan los puertos de entrada; las reglas están en el núcleo.

Las entidades conservan las tablas `projects`, `tasks` y la relación `project_id`. Eliminar un proyecto elimina sus tareas en la misma transacción. Las lecturas de proyectos no cargan sus tareas; el listado de tareas usa una consulta por proyecto con carga del proyecto asociada para evitar consultas repetidas.

## Contrato HTTP

| Método | Ruta | Resultado |
| --- | --- | --- |
| GET | /projects | 200, array de proyectos |
| POST | /projects | 201, proyecto creado |
| GET | /projects/{projectId} | 200, proyecto |
| PUT | /projects/{projectId} | 200, proyecto actualizado |
| DELETE | /projects/{projectId} | 204, sin cuerpo; elimina también sus tareas |
| GET | /projects/{projectId}/tasks | 200, array de tareas |
| POST | /projects/{projectId}/tasks | 201, tarea creada |
| GET | /projects/{projectId}/tasks/{taskId} | 200, tarea |
| PUT | /projects/{projectId}/tasks/{taskId} | 200, tarea actualizada |

Una tarea consultada o editada bajo otro proyecto devuelve **404**. Un proyecto existente sin tareas devuelve `[]`; un proyecto inexistente devuelve 404.

`GET /projects` acepta `status`, `startDate` y `endDate`. Las fechas seleccionan proyectos cuyo período se superpone con el rango solicitado. Las listas se ordenan por ID ascendente.

Crear proyecto:

```json
{
  "name": "Nivi",
  "startDate": "2026-10-04",
  "endDate": "2026-11-04",
  "status": "ACTIVE",
  "description": "Proyecto de ejemplo"
}
```

Estados de proyecto: `PLANNED`, `ACTIVE`, `CLOSED`. La actualización admite `name`, `startDate`, `endDate`, `description`, como el frontend actual; conserva el estado. El nombre no puede repetirse, la fecha de fin no puede preceder al inicio y una fecha de fin ingresada no puede estar en el pasado.

Crear tarea:

```json
{
  "title": "Preparar entrega",
  "estimateHours": 4,
  "assignee": "Ro",
  "status": "TODO"
}
```

Estados de tarea: `TODO`, `IN_PROGRESS`, `DONE`. El valor antiguo `COMPLETED` se normaliza a `DONE` por compatibilidad. No se crean tareas en proyectos cerrados. Las horas deben ser un entero positivo y el título no puede estar vacío.

La actualización de tareas acepta `title`, `estimateHours`, `assignee` y conserva el estado. `assignee: null` borra la asignación, como envía el formulario Angular; si se omite ese campo también queda sin asignar. Los campos título y horas omitidos se conservan.

Los campos adicionales `id: null` que envía Angular al crear son aceptados. Los IDs los genera el backend. Las respuestas incluyen los mismos campos que los modelos del frontend; las tareas también incluyen `projectId`, `createdAt` y `finishedAt`. Una tarea creada en `DONE` recibe ambas fechas desde el reloj del servidor.

Los errores de validación, recursos inexistentes y conflictos usan:

```json
{ "error": "Not Found", "message": "Project not found with id: 123" }
```

- **400:** JSON, parámetros, estado o campos obligatorios inválidos.
- **404:** proyecto o tarea inexistente dentro del proyecto solicitado.
- **409:** nombre duplicado, reglas de negocio o conflicto de integridad.

## Configuración

| Variable de entorno | Predeterminado |
| --- | --- |
| SERVER_PORT | 8081 |
| DB_URL | jdbc:h2:file:~/db/proyecto-db |
| DB_USERNAME | sa |
| DB_PASSWORD | vacío |
| CORS_ALLOWED_ORIGINS | http://localhost:4200,http://localhost:8100,http://localhost,https://localhost,capacitor://localhost |

`CORS_ALLOWED_ORIGINS` acepta una lista separada por comas. Agregar el origen del frontend desplegado o de la vista previa en red cuando corresponda.

Para un teléfono físico, la URL de API del frontend debe apuntar a una dirección accesible del backend, no a `localhost`. CORS ya contempla los orígenes predeterminados de Angular, Ionic y Capacitor; la configuración y prueba nativa de Ionic/Capacitor sigue siendo un trabajo del frontend.

La consigna académica original se conserva en [docs/consigna-original.md](docs/consigna-original.md).