import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component'; // <-- Sumamos el Home
import { ProjectListComponent } from './features/get-projects/project-list.component';
import { ProjectCreateComponent } from './features/create-project/project-create.component';
import { CreateTaskComponent } from './features/create-task/create-task.component';
import { TaskListComponent } from './features/get-tasks/task-list.component';
import { UpdateProjectComponent } from './features/update-project/update-project.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent, // El Home toma la pantalla inicial
  },
  {
    path: 'projects',
    component: ProjectListComponent, // El listado se muda a su ruta correspondiente
  },
  {
    path: 'projects/new',
    component: ProjectCreateComponent, // Normalizado a plural
  },
  {
    path: 'projects/:projectId/edit',
    component: UpdateProjectComponent, // Unificamos el parámetro a :projectId
  },
  {
    path: 'projects/:projectId/tasks',
    component: TaskListComponent, // Normalizado a plural y parámetro unificado
  },
  {
    path: 'projects/:projectId/tasks/new',
    component: CreateTaskComponent,
  },
  {
    path: 'projects/:projectId/tasks/:taskId/edit',
    loadComponent: () =>
      import('./features/update-task/update-task.component').then((m) => m.UpdateTaskComponent),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
