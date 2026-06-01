import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';

export interface TaskRequest {
  id: null;
  title: string;
  estimateHours: number;
  assignee: string | null;
  status: TaskStatus;
}

export interface TaskResponse {
  id: number;
  title: string;
  estimateHours: number;
  assignee: string | null;
  status: TaskStatus;
  createdAt: string;
  finishedAt: string | null;
}

@Injectable({ providedIn: 'root' })
export class TaskService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  createTask(projectId: number, task: TaskRequest): Observable<TaskResponse> {
    return this.http.post<TaskResponse>(`${this.baseUrl}/projects/${projectId}/tasks`, task);
  }
}
