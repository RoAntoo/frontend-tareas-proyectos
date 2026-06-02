import { Routes } from '@angular/router';
import { UpdateProjectComponent } from './features/update-project/update-project.component';

export const routes: Routes = [{ path: 'projects/:id/edit', component: UpdateProjectComponent }];
