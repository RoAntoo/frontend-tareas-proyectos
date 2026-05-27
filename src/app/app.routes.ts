import { Routes } from '@angular/router';
import { ProjectCreateComponent } from './use-case-create-project/project-create.component';

export const routes: Routes = [
  {
    path: 'proyectos/nuevo',
    component: ProjectCreateComponent,
  },
];
