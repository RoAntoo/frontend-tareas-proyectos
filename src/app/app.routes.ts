import { Routes } from '@angular/router';
import { ProjectListComponent } from './features/get-projects/project-list.component';
import { ProjectCreateComponent } from './features/create-project/project-create.component';
import { CreateTaskComponent } from './features/create-task/create-task.component';
import { TaskListComponent } from './features/get-tasks/task-list.component';
import { UpdateProjectComponent } from './features/update-project/update-project.component';

export const routes: Routes = [
  { path: '', component: ProjectListComponent },
  { path: 'project/new', component: ProjectCreateComponent },
  { path: 'projects/:projectId/tasks/new', component: CreateTaskComponent },
  { path: 'project/:id/task', component: TaskListComponent },
  { path: 'projects/:id/edit', component: UpdateProjectComponent },
  { path: '**', redirectTo: '' },
];