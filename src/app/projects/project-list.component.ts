import {
  Component,
  OnInit,
  inject,
  signal,
  computed,
  ChangeDetectionStrategy,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { LowerCasePipe } from '@angular/common';
import { ProjectService } from './project.service';
import { Project } from './project.model';

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [RouterLink, LowerCasePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="project-container">
      <div class="header">
        <h2>Listado de Proyectos</h2>
      </div>

      <div class="filter-section">
        <label for="statusFilter">Filtrar por estado: </label>
        <select id="statusFilter" (change)="onFilterChange($event)">
          <option value="TODOS">Todos los proyectos</option>
          <option value="PLANNED">Planificado (PLANNED)</option>
          <option value="ACTIVE">Activo (ACTIVE)</option>
          <option value="CLOSED">Cerrado (CLOSED)</option>
        </select>
      </div>

      @if (loading()) {
        <p class="loading">Cargando proyectos desde el servidor...</p>
      }

      @if (error()) {
        <div class="error-card">
          <p>{{ error() }}</p>
        </div>
      }

      @if (!loading() && !error()) {
        @if (filteredProjects().length > 0) {
          <div class="project-grid">
            @for (project of filteredProjects(); track project.id) {
              <div class="project-card">
                <div class="card-content">
                  <h3>{{ project.name }}</h3>
                  <p class="description">{{ project.description }}</p>
                  <p>
                    <strong>Estado:</strong>
                    <span class="badge {{ project.status | lowercase }}">{{ project.status }}</span>
                  </p>
                  <p><strong>Inicio:</strong> {{ project.startDate }}</p>
                  <p><strong>Fin:</strong> {{ project.endDate }}</p>
                </div>
                <div class="card-actions">
                  <button class="btn-primary" [routerLink]="['/proyectos', project.id, 'tareas']">
                    Ver Tareas
                  </button>
                </div>
              </div>
            }
          </div>
        } @else {
          <div class="empty-state">
            <p>No se encontraron proyectos con el estado seleccionado.</p>
          </div>
        }
      }
    </div>
  `,
  styles: [
    `
      .project-container {
        max-width: 1000px;
        margin: 0 auto;
        padding: 20px;
        font-family: sans-serif;
      }
      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
        border-bottom: 2px solid #eee;
        padding-bottom: 10px;
      }
      .filter-section {
        margin-bottom: 25px;
        background: #f9f9f9;
        padding: 15px;
        border-radius: 8px;
      }
      select {
        padding: 8px 12px;
        border-radius: 6px;
        border: 1px solid #ccc;
        font-size: 14px;
        margin-left: 10px;
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
      .project-grid {
        display: grid;
        gap: 20px;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      }
      .project-card {
        display: flex;
        flex-direction: column;
        border: 1px solid #e0e0e0;
        border-radius: 10px;
        background-color: #fff;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        overflow: hidden;
        transition: transform 0.2s;
      }
      .project-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
      }
      .card-content {
        padding: 20px;
        flex-grow: 1;
      }
      .card-content h3 {
        margin: 0 0 10px 0;
        color: #2c3e50;
        font-size: 1.3em;
      }
      .description {
        color: #666;
        font-size: 0.9em;
        margin-bottom: 15px;
        line-height: 1.4;
      }
      .card-content p {
        margin: 5px 0;
        font-size: 0.9em;
      }
      .badge {
        padding: 4px 10px;
        border-radius: 12px;
        font-size: 0.8em;
        font-weight: bold;
      }
      .planned {
        background-color: #e3f2fd;
        color: #1565c0;
      }
      .active {
        background-color: #e8f5e9;
        color: #2e7d32;
      }
      .closed {
        background-color: #f5f5f5;
        color: #616161;
      }
      .card-actions {
        padding: 15px 20px;
        background-color: #f8f9fa;
        border-top: 1px solid #eee;
      }
      .btn-primary {
        width: 100%;
        padding: 10px;
        background-color: #007bff;
        color: white;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-weight: bold;
        transition: background-color 0.2s;
      }
      .btn-primary:hover {
        background-color: #0056b3;
      }
    `,
  ],
})
export class ProjectListComponent implements OnInit {
  private projectService = inject(ProjectService);

  // Signals
  projects = signal<Project[]>([]);
  loading = signal<boolean>(false);
  error = signal<string | null>(null);
  filterStatus = signal<string>('TODOS');

  // Computed Signal para el filtro
  filteredProjects = computed(() => {
    const currentFilter = this.filterStatus();
    const allProjects = this.projects();

    if (currentFilter === 'TODOS') {
      return allProjects;
    }
    return allProjects.filter((p) => p.status === currentFilter);
  });

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects(): void {
    this.loading.set(true);
    this.error.set(null);

    this.projectService.getProjects().subscribe({
      next: (data) => {
        this.projects.set(data);
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
