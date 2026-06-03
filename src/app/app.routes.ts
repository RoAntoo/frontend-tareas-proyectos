import { Routes } from `@angular/router`;
import { ProjectCreateComponent } from `./features/create-project/project-create.component`;
import { ProjectListComponent } from `./features/get-projects/project-list.component`;
import { TaskListComponent } from `./features/get-tasks/task-list.component`;

export const routes: Routes = [
  {
    path: ``, 
    component: ProjectListComponent,
  },
  {
    path: `proyectos/nuevo`,
    component: ProjectCreateComponent,
  },
  {
    path: `proyectos/:id/tareas`,
    component: TaskListComponent,
  },
  {
    path: `**`,
    redirectTo: ``,
  }
];