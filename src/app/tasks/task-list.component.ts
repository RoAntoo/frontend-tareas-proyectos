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
  template: `
    <div class="task-container">
      <h2>Tareas del Proyecto</h2>

      <div class="filter-section">
        <label for="statusFilter">Filtrar por estado: </label>
        <select id="statusFilter" (change)="onFilterChange($event)">
          <option value="TODAS">Todas</option>
          <option value="pendiente">Pendiente</option>
          <option value="en progreso">En Progreso</option>
          <option value="completada">Completada</option>
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
                <h3>{{ task.titulo }}</h3>
                <p>
                  <strong>Estado:</strong>
                  <span class="badge {{ task.estado | lowercase }}">{{ task.estado }}</span>
                </p>
                <p>
                  <strong>Fecha límite:</strong>
                  {{ task.fechaLimite ? task.fechaLimite : 'Sin fecha' }}
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
      .pendiente {
        background-color: #fff3e0;
        color: #e65100;
      }
      .en {
        background-color: #e3f2fd;
        color: #1565c0;
      } /* Para 'en progreso' */
      .completada {
        background-color: #e8f5e9;
        color: #2e7d32;
      }
    `,
  ],
  imports: [LowerCasePipe],
})
export class TaskListComponent implements OnInit {
  private taskService = inject(TaskService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  // Signals para el estado
  tasks = signal<Task[]>([]);
  loading = signal<boolean>(false);
  error = signal<string | null>(null);
  filterStatus = signal<string>('TODAS');

  // Computed signal: se recalcula automáticamente cuando cambia 'tasks' o 'filterStatus'
  filteredTasks = computed(() => {
    const currentFilter = this.filterStatus();
    const allTasks = this.tasks();

    if (currentFilter === 'TODAS') {
      return allTasks;
    }
    return allTasks.filter((t) => t.estado.toLowerCase() === currentFilter.toLowerCase());
  });

  ngOnInit(): void {
    // Obtener el ID del proyecto desde la URL (/proyectos/:id/tareas)
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

        // Manejo de expiración de token o falta de permisos (403/401)
        if (err.message.includes('permisos') || err.message.includes('expiró')) {
          // this.router.navigate(['/login']); // Descomentar cuando el login exista
        }
      },
    });
  }

  onFilterChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.filterStatus.set(selectElement.value);
  }
}
