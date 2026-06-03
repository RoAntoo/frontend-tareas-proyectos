import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'projects/:projectId/tasks/:taskId/edit',
    loadComponent: () =>
      import('./features/update-task/update-task.component').then((m) => m.UpdateTaskComponent),
  },

  //ACA
];
