import { Routes } from '@angular/router';
import { ProjectListComponent } from './features/get-projects/project-list.component';
import { TaskListComponent } from './features/get-tasks/task-list.component'; // Ajusta la ruta

export const routes: Routes = [
  {
    path: '', // Ruta raíz (página de inicio)
    component: ProjectListComponent,
  },
  {
    path: 'proyectos/:id/tareas', // ruta
    component: TaskListComponent,
  },
  {
    path: '**', // inicio
    redirectTo: '',
  },
];
