import { Routes } from '@angular/router';
import { ProjectCreateComponent } from './features/create-project/project-create.component';

export const routes: Routes = [
  {
    path: 'proyectos/nuevo',
    component: ProjectCreateComponent,
  },
];
