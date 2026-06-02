import { Routes } from '@angular/router';
import { ProjectListComponent } from './projects/project-list.component'; // Ajusta la ruta si lo guardaste en otra carpeta
import { TaskListComponent } from './tasks/task-list.component'; // Ajusta la ruta si lo guardaste en otra carpeta

export const routes: Routes = [
  {
    path: '', // Ruta raíz (página de inicio)
    component: ProjectListComponent,
  },
  {
    path: 'proyectos/:id/tareas', // La ruta que armamos antes
    component: TaskListComponent,
  },
  {
    path: '**', // Si el usuario escribe cualquier cosa rara en la URL, lo mandamos al inicio
    redirectTo: '',
  },
];
