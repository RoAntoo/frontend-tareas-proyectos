import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Task } from './task.model';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8081/projects';

  getTasksByProjectId(projectId: string): Observable<Task[]> {
    return this.http
      .get<Task[]>(`${this.apiUrl}/${projectId}/tasks`)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ocurrio un error desconocido';
    if (error.status === 403 || error.status === 401) {
      errorMessage = 'No tienes permisos para ver este proyecto o la sesion expiro.';
    } else if (error.status === 404) {
      errorMessage = 'Proyecto no encontrado.';
    } else if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    }
    return throwError(() => new Error(errorMessage));
  }
}
