import { Routes } from '@angular/router';
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
    path: `project/:id/task`,
    component: TaskListComponent,
  },
  {
    path: `**`,
    redirectTo: ``,
  }
];
