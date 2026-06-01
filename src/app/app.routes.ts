import { Routes } from '@angular/router';
import { ProjectCreateComponent } from './features/project-create/project-create.component';

export const routes: Routes = [
  {
    path: 'proyectos/nuevo',
    component: ProjectCreateComponent,
  },
];
