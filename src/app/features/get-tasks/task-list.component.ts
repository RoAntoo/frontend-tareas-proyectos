import {
  Component,
  OnInit,
  inject,
  signal,
  computed,
  ChangeDetectionStrategy,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LowerCasePipe } from '@angular/common';
import { TaskService } from './task.service';
import { Task } from './task.model';

@Component({
  selector: 'app-task-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LowerCasePipe],
  template: `
    <div class="task-container">
      <h2>Tareas del Proyecto</h2>

      <div class="filter-section">
        <label for="statusFilter">Filtrar por estado: </label>
        <select id="statusFilter" (change)="onFilterChange($event)">
          <option value="TODAS">Todas</option>
          <option value="TODO">Pendiente</option>
          <option value="IN_PROGRESS">En Progreso</option>
          <option value="DONE">Completada</option>
        </select>
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
        max-width: 800px;
        margin: 0 auto;
        padding: 20px;
        font-family: sans-serif;
      }
      .filter-section {
        margin-bottom: 20px;
      }
      select {
        padding: 8px;
        border-radius: 4px;
        border: 1px solid #ccc;
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
      }
      .empty-state {
        text-align: center;
        color: #777;
        padding: 30px;
        border: 1px dashed #ccc;
        border-radius: 8px;
      }
      .task-grid {
        display: grid;
        gap: 15px;
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      }
      .task-card {
        border: 1px solid #e0e0e0;
        padding: 15px;
        border-radius: 8px;
        background-color: #fafafa;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
      }
      .task-card h3 {
        margin-top: 0;
        color: #333;
      }
      .badge {
        padding: 4px 8px;
        border-radius: 12px;
        font-size: 0.8em;
        font-weight: bold;
        text-transform: uppercase;
      }
      /* Los colores ahora coinciden con los estados en inglés de tu JavaBUSCAR???????? */
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

  tasks = signal<Task[]>([]);
  loading = signal<boolean>(false);
  error = signal<string | null>(null);
  filterStatus = signal<string>('TODAS');

  filteredTasks = computed(() => {
    const currentFilter = this.filterStatus();
    const allTasks = this.tasks();

    if (currentFilter === 'TODAS') {
      return allTasks;
    }
    // Usamos status en lugar de estado
    return allTasks.filter(
      (t) => t.status && t.status.toLowerCase() === currentFilter.toLowerCase(),
    );
  });

  ngOnInit(): void {
    const projectId = this.route.snapshot.paramMap.get('id');

    if (projectId) {
      this.loadTasks(projectId);
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
