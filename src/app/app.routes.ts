import { Routes } from '@angular/router';
import { CreateTaskComponent } from './features/create-task/create-task.component';

export const routes: Routes = [
  {
    path: 'projects/:projectId/tasks/new',
    component: CreateTaskComponent,
  },
];
