import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'projects',
    loadComponent: () =>
      import('./features/get-projects/project-list.component').then((m) => m.ProjectListComponent),
  },
  {
    path: 'projects/new',
    loadComponent: () =>
      import('./features/create-project/project-create.component').then((m) => m.ProjectCreateComponent),
  },
  {
    path: 'projects/:projectId/edit',
    loadComponent: () =>
      import('./features/update-project/update-project.component').then((m) => m.UpdateProjectComponent),
  },
  {
    path: 'projects/:projectId/tasks',
    loadComponent: () =>
      import('./features/get-tasks/task-list.component').then((m) => m.TaskListComponent),
  },
  {
    path: 'projects/:projectId/tasks/new',
    loadComponent: () =>
      import('./features/create-task/create-task.component').then((m) => m.CreateTaskComponent),
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
