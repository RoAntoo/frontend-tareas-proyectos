# Prompt de implementación — Eliminar Proyecto

Implementar la funcionalidad de eliminación de proyectos dentro del listado existente.

## Requerimientos

1. **Servicio Angular:**
   - En el `ProjectService` agregar el método `deleteProject(id: number): Observable<void>` para consumir la API `DELETE /projects/{id}`.

2. **Botón de Acción en UI:**
   - En la tarjeta (`project-card`) de `ProjectListComponent`, añadir un botón de "Eliminar" junto a las opciones de "Ver Tareas" y "Editar".
   - Usar un icono de basura de Bootstrap Icons (`bi-trash`) y un estilo personalizado de color rojo pastel (`.btn-danger-custom`) que mantenga la estética suave y moderna del resto de la aplicación.

3. **Confirmación Interactiva:**
   - Al hacer clic en el botón de eliminar, abrir un diálogo interactivo de confirmación nativo `confirm` preguntando: *"¿Estás seguro de que deseas eliminar el proyecto "{nombre}"? Esta acción no se puede deshacer y borrará permanentemente todas sus tareas."*

4. **Flujo de Éxito:**
   - Si el usuario acepta la confirmación, se suscribe al servicio de borrado.
   - En la respuesta exitosa, refrescar reactivamente la lista de proyectos en pantalla invocando nuevamente a `loadProjects()`.

5. **Manejo de Errores:**
   - En caso de falla en el borrado (por ejemplo, error de red o de permisos), capturar el error y mostrar un mensaje de alerta en el contenedor superior del componente indicando *"Error al eliminar el proyecto: {mensaje}"*.
