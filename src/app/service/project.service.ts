import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export type ProjectStatus = 'PLANNED' | 'ACTIVE' | 'CLOSED';

export interface ProjectRequest {
  id: null;
  name: string;
  startDate: string;
  endDate: string;
  status: ProjectStatus;
  description?: string;
}

export interface ProjectResponse {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  status: ProjectStatus;
  description?: string;
}

@Injectable({ providedIn: 'root' })
export class ProjectService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/projects`;

  createProject(project: ProjectRequest): Observable<ProjectResponse> {
    return this.http.post<ProjectResponse>(this.apiUrl, project);
  }
}
