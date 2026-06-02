Soy un desarrollador de Angular (versión estable vigente) trabajando en una aplicación de gestión de tareas y proyectos.
Contexto del sistema:
El backend es una API REST en Java (Spring Boot) con autenticación JWT en el header Authorization. El frontend usa Angular con standalone components, Bootstrap 5, Reactive Forms y HttpClient con un interceptor JWT ya existente en auth.interceptor.ts.
Feature a implementar: Editar proyecto existente
[pegá acá el contenido del SPEC.md]
Restricciones técnicas:

Usar HttpClient con el interceptor JWT ya existente, no generarlo
El servicio debe llamarse ProjectService y vivir en src/app/services/
El componente debe ser standalone con ChangeDetectionStrategy.OnPush
Ruta: /projects/:id/edit
El componente carga los datos actuales del proyecto con GET /projects/:id al inicializar y pre-popula el formulario
Manejar estados de carga, error 404, error 409 (nombre duplicado) y error de red en el template
Validación sincrónica en cliente: campos requeridos y endDate >= startDate
Al guardar con éxito redirigir a /projects

Generar:

update-project.component.ts
update-project.component.html

No generar: el interceptor JWT, el módulo de routing completo.
