import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ProjectRequest {
  id: null;
  name: string;
  startDate: string;
  endDate: string;
  status: string;
  description?: string;
}

export interface ProjectResponse {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  status: string;
  description?: string;
}

@Injectable({ providedIn: 'root' })
export class ProjectService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8081/projects';

  createProject(project: ProjectRequest): Observable<ProjectResponse> {
    return this.http.post<ProjectResponse>(this.apiUrl, project);
  }
}
