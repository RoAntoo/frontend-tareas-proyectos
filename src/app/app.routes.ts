import { Routes } from '@angular/router';
import { ProjectCreateComponent } from './useCaseCreateProject/project-create.component';

export const routes: Routes = [
  {
    path: 'proyectos/nuevo',
    component: ProjectCreateComponent,
  },
];
