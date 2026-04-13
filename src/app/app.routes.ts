import { Routes } from '@angular/router';
import { TaskListComponent } from './tasks/task-list.component';

export const routes: Routes = [
  // Otras rutas...
  {
    path: 'proyectos/:id/tareas',
    component: TaskListComponent,
  },
];
