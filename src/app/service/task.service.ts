import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface TaskResponse {
  id: number;
  title: string;
  estimateHours: number;
  assignee: string | null;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  finishedAt: string | null;
  createdAt: string;
}

export interface UpdateTaskDto {
  title: string;
  estimateHours: number;
  assignee: string | null;
}

@Injectable({ providedIn: 'root' })
export class TaskService {
  private http = inject(HttpClient);
  private base = environment.apiUrl;

  getTask(projectId: number, taskId: number): Observable<TaskResponse> {
    return this.http.get<TaskResponse>(`${this.base}/projects/${projectId}/tasks/${taskId}`);
  }

  updateTask(projectId: number, taskId: number, dto: UpdateTaskDto): Observable<TaskResponse> {
    return this.http.put<TaskResponse>(`${this.base}/projects/${projectId}/tasks/${taskId}`, dto);
  }
}
