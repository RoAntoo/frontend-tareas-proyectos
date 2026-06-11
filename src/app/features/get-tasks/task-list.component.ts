import {
  Component,
  OnInit,
  inject,
  signal,
  computed,
  ChangeDetectionStrategy,
} from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { LowerCasePipe } from '@angular/common';
import { TaskService, TaskResponse } from '../../service/task.service';

@Component({
  selector: 'app-task-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LowerCasePipe, RouterLink],
  template: `
    <div class="task-container">
      <div class="header-section">
        <h2>Tareas del Proyecto</h2>
        <a class="btn-primary" [routerLink]="['/projects', projectId, 'tasks', 'new']">
          + Nueva Tarea
        </a>
      </div>

      <div class="filter-and-actions">
        <div class="filter-section">
          <label for="statusFilter" class="fw-semibold">Filtrar por estado: </label>
          <select id="statusFilter" (change)="onFilterChange($event)">
            <option value="TODAS">Todas</option>
            <option value="TODO">Pendiente</option>
            <option value="IN_PROGRESS">En Progreso</option>
            <option value="DONE">Completada</option>
          </select>
        </div>
        <a class="btn-secondary" routerLink="/projects">
          ← Volver a Proyectos
        </a>
      </div>

      @if (loading()) {
        <p class="loading">Cargando tareas...</p>
      }

      @if (error()) {
        <div class="error-card">
          <p>{{ error() }}</p>
        </div>
      }

      @if (!loading() && !error()) {
        @if (filteredTasks().length > 0) {
          <div class="task-grid">
            @for (task of filteredTasks(); track task.id) {
              <div class="task-card">
                <div class="card-content">
                  <h3>{{ task.title }}</h3>
                  <p>
                    <strong>Estado:</strong>
                    <span class="badge {{ task.status | lowercase }}">{{ task.status }}</span>
                  </p>
                  <p>
                    <strong>Fecha límite:</strong>
                    {{ task.finishedAt ? task.finishedAt : 'Sin fecha' }}
                  </p>
                </div>
                <div class="card-actions">
                  <a class="btn-edit" [routerLink]="['/projects', projectId, 'tasks', task.id, 'edit']">
                    Editar Tarea
                  </a>
                </div>
              </div>
            }
          </div>
        } @else {
          <p class="empty-state">No hay tareas que coincidan con el estado seleccionado.</p>
        }
      }
    </div>
  `,
  styles: [
    `
      .task-container {
        max-width: 900px;
        margin: 0 auto;
        padding: 20px;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      }
      .header-section {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
        border-bottom: 2px solid #eee;
        padding-bottom: 15px;
      }
      .header-section h2 {
        margin: 0;
        color: #2c3e50;
      }
      .filter-and-actions {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 25px;
        background: #f9f9f9;
        padding: 15px;
        border-radius: 10px;
        flex-wrap: wrap;
        gap: 15px;
      }
      .filter-section {
        display: flex;
        align-items: center;
        gap: 10px;
      }
      select {
        padding: 8px 12px;
        border-radius: 6px;
        border: 1px solid #ccc;
        font-size: 14px;
        background: white;
      }
      .btn-primary {
        padding: 10px 20px;
        background-color: #a5d6a7;
        color: #2c3e50;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-weight: bold;
        transition: background-color 0.2s;
        text-align: center;
        text-decoration: none;
      }
      .btn-primary:hover {
        background-color: #81c784;
        color: #2c3e50;
      }
      .btn-secondary {
        padding: 8px 16px;
        background-color: #fce4ec;
        color: #2c3e50;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-weight: bold;
        transition: background-color 0.2s;
        text-align: center;
        text-decoration: none;
        font-size: 0.9em;
      }
      .btn-secondary:hover {
        background-color: #f8bbd0;
        color: #2c3e50;
      }
      .btn-edit {
        width: 100%;
        padding: 8px;
        background-color: #ffffff;
        color: #2c3e50;
        border: 1px solid #ccc;
        border-radius: 6px;
        cursor: pointer;
        font-weight: bold;
        transition: all 0.2s;
        text-align: center;
        text-decoration: none;
        display: block;
      }
      .btn-edit:hover {
        background-color: #f5f5f5;
        border-color: #999;
        color: #2c3e50;
      }
      .loading {
        color: #555;
        font-style: italic;
      }
      .error-card {
        background-color: #ffebee;
        color: #c62828;
        padding: 15px;
        border-radius: 8px;
        margin-bottom: 20px;
        border-left: 5px solid #c62828;
      }
      .empty-state {
        text-align: center;
        color: #777;
        padding: 40px;
        border: 2px dashed #ccc;
        border-radius: 8px;
        background: #fafafa;
      }
      .task-grid {
        display: grid;
        gap: 20px;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      }
      .task-card {
        display: flex;
        flex-direction: column;
        border: 1px solid #e0e0e0;
        border-radius: 10px;
        background-color: #fff;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        overflow: hidden;
        transition: transform 0.2s, box-shadow 0.2s;
      }
      .task-card:hover {
        transform: translateY(-3px);
        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.08);
      }
      .card-content {
        padding: 20px;
        flex-grow: 1;
      }
      .task-card h3 {
        margin: 0 0 15px 0;
        color: #2c3e50;
        font-size: 1.25em;
      }
      .task-card p {
        margin: 8px 0;
        font-size: 0.9em;
      }
      .card-actions {
        padding: 15px 20px;
        background-color: #f8f9fa;
        border-top: 1px solid #eee;
      }
      .badge {
        padding: 4px 10px;
        border-radius: 12px;
        font-size: 0.8em;
        font-weight: bold;
        text-transform: uppercase;
      }
      .todo {
        background-color: #fff3e0;
        color: #e65100;
      }
      .in_progress {
        background-color: #e3f2fd;
        color: #1565c0;
      }
      .done {
        background-color: #e8f5e9;
        color: #2e7d32;
      }
    `,
  ],
})
export class TaskListComponent implements OnInit {
  private taskService = inject(TaskService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  projectId: string = '';
  tasks = signal<TaskResponse[]>([]);
  loading = signal<boolean>(false);
  error = signal<string | null>(null);
  filterStatus = signal<string>('TODAS');

  filteredTasks = computed(() => {
    const currentFilter = this.filterStatus();
    const allTasks = this.tasks();

    if (currentFilter === 'TODAS') {
      return allTasks;
    }
    return allTasks.filter(
      (t) => t.status && t.status.toLowerCase() === currentFilter.toLowerCase(),
    );
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('projectId');

    if (id) {
      this.projectId = id;
      this.loadTasks(id);
    } else {
      this.error.set('No se especificó un proyecto válido en la ruta.');
    }
  }

  loadTasks(projectId: string): void {
    this.loading.set(true);
    this.error.set(null);

    this.taskService.getTasksByProjectId(projectId).subscribe({
      next: (data) => {
        this.tasks.set(data);
        this.loading.set(false);
      },
      error: (err: Error) => {
        this.error.set(err.message);
        this.loading.set(false);
      },
    });
  }

  onFilterChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.filterStatus.set(selectElement.value);
  }
}
