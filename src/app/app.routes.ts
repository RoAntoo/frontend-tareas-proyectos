import { Routes } from '@angular/router';
import { CreateTaskComponent } from './features/create-task/create-task.component';
import { ProjectCreateComponent } from './features/create-project/project-create.component';
import { ProjectListComponent } from './features/get-projects/project-list.component';
import { TaskListComponent } from './features/get-tasks/task-list.component';

export const routes: Routes = [
  {
    path: ``,
    component: ProjectListComponent,
  },
  {
    path: `project/new`,
    component: ProjectCreateComponent,
  },
  {
    path: 'projects/:projectId/tasks/new',
    component: CreateTaskComponent,
  },
  {
    path: `project/:id/task`,
    component: TaskListComponent,
  },
  {
    path: `**`,
    redirectTo: ``,
  }
];

