import { Routes } from '@angular/router';
import { ProjectListComponent } from './projects/project-list.component';
import { TaskListComponent } from './tasks/task-list.component'; // Ajusta la ruta si lo guardaste en otra carpeta

export const routes: Routes = [
  {
    path: '',
    component: ProjectListComponent,
  },
  {
    path: 'proyectos/:id/tareas',
    component: TaskListComponent,
  },
  {
    path: '**',
    redirectTo: '',
  },
];
