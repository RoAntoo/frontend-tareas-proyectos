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
import { ProjectService } from '../../service/project.service';
import { ProjectResponse } from '../../core/models/project.models';

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [RouterLink, LowerCasePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="project-container">
      <div class="header">
        <h2><i class="bi bi-folder2-open text-mint"></i> Listado de Proyectos</h2>
        <a class="btn-create" routerLink="/projects/new">
          <i class="bi bi-plus-lg"></i> Nuevo Proyecto
        </a>
      </div>

      <div class="filter-section">
        <div class="filter-wrapper">
          <label for="statusFilter" class="fw-semibold">
            <i class="bi bi-funnel text-pink"></i> Filtrar por estado:
          </label>
          <select id="statusFilter" (change)="onFilterChange($event)">
            <option value="TODOS">Todos los proyectos</option>
            <option value="PLANNED">Planificado (PLANNED)</option>
            <option value="ACTIVE">Activo (ACTIVE)</option>
            <option value="CLOSED">Cerrado (CLOSED)</option>
          </select>
        </div>
      </div>

      @if (loading()) {
        <div class="loading-container">
          <div class="spinner"></div>
          <p class="loading">Cargando proyectos desde el servidor...</p>
        </div>
      }

      @if (error()) {
        <div class="error-card">
          <i class="bi bi-exclamation-triangle-fill"></i>
          <p>{{ error() }}</p>
        </div>
      }

      @if (!loading() && !error()) {
        @if (filteredProjects().length > 0) {
          <div class="project-grid">
            @for (project of filteredProjects(); track project.id) {
              <div class="project-card">
                <div class="card-content">
                  <div class="card-header-project">
                    <h3>{{ project.name }}</h3>
                    <span class="badge {{ project.status | lowercase }}">{{ project.status }}</span>
                  </div>
                  <p class="description">{{ project.description || 'Sin descripción disponible.' }}</p>
                  
                  <div class="project-dates">
                    <div class="date-item">
                      <i class="bi bi-calendar-event text-mint"></i>
                      <span><strong>Inicio:</strong> {{ project.startDate }}</span>
                    </div>
                    <div class="date-item">
                      <i class="bi bi-calendar-check text-pink"></i>
                      <span><strong>Fin:</strong> {{ project.endDate }}</span>
                    </div>
                  </div>
                </div>
                <div class="card-actions">
                  <a class="btn-action btn-primary-custom" [routerLink]="['/projects', project.id, 'tasks']">
                    <i class="bi bi-list-task"></i> Ver Tareas
                  </a>
                  <a class="btn-action btn-secondary-custom" [routerLink]="['/projects', project.id, 'edit']">
                    <i class="bi bi-pencil-square"></i> Editar
                  </a>
                </div>
              </div>
            }
          </div>
        } @else {
          <div class="empty-state">
            <i class="bi bi-folder-x"></i>
            @if (projects().length === 0) {
              <p>No hay proyectos registrados actualmente.</p>
            } @else {
              <p>No se encontraron proyectos con el estado seleccionado.</p>
            }
          </div>
        }
      }
    </div>
  `,
  styles: [
    `
      .project-container {
        max-width: 1100px;
        margin: 0 auto;
        padding: 20px;
        animation: fadeIn 0.4s ease-out;
      }
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 25px;
        border-bottom: 2px solid rgba(0, 0, 0, 0.05);
        padding-bottom: 15px;
      }
      .header h2 {
        font-weight: 800;
        color: #2c3e50;
        margin: 0;
        font-size: 1.75rem;
      }
      .text-mint {
        color: #66bb6a;
      }
      .text-pink {
        color: #f06292;
      }
      .btn-create {
        padding: 10px 20px;
        background-color: var(--primary-mint, #a5d6a7);
        color: #2c3e50;
        font-weight: 700;
        border-radius: 12px;
        text-decoration: none;
        box-shadow: 0 4px 12px rgba(165, 214, 167, 0.3);
        transition: all 0.25s ease;
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 0.95rem;
      }
      .btn-create:hover {
        background-color: var(--primary-mint-hover, #81c784);
        transform: translateY(-2px);
        box-shadow: 0 6px 15px rgba(165, 214, 167, 0.45);
      }
      .filter-section {
        margin-bottom: 30px;
        background: rgba(255, 255, 255, 0.65);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.8);
        padding: 15px 20px;
        border-radius: 14px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.02);
      }
      .filter-wrapper {
        display: flex;
        align-items: center;
        gap: 12px;
        flex-wrap: wrap;
      }
      .filter-wrapper label {
        color: #2c3e50;
      }
      select {
        padding: 8px 16px;
        border-radius: 10px;
        border: 1px solid rgba(0, 0, 0, 0.08);
        font-size: 0.9rem;
        background-color: #fff;
        color: #2c3e50;
        outline: none;
        cursor: pointer;
        transition: border-color 0.2s, box-shadow 0.2s;
        min-width: 200px;
      }
      select:focus {
        border-color: #a5d6a7;
        box-shadow: 0 0 0 3px rgba(165, 214, 167, 0.25);
      }
      .loading-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 50px 0;
        gap: 15px;
      }
      .spinner {
        width: 40px;
        height: 40px;
        border: 4px solid rgba(165, 214, 167, 0.2);
        border-top-color: #a5d6a7;
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
      .loading {
        color: #5a6b7c;
        font-weight: 500;
      }
      .error-card {
        background-color: #ffebee;
        color: #c62828;
        padding: 15px 20px;
        border-radius: 12px;
        margin-bottom: 25px;
        border-left: 5px solid #c62828;
        display: flex;
        align-items: center;
        gap: 12px;
        font-weight: 500;
        box-shadow: 0 4px 12px rgba(198, 40, 40, 0.08);
      }
      .error-card i {
        font-size: 1.25rem;
      }
      .error-card p {
        margin: 0;
      }
      .empty-state {
        text-align: center;
        color: #5a6b7c;
        padding: 50px 20px;
        border: 2px dashed rgba(165, 214, 167, 0.4);
        border-radius: 16px;
        background: rgba(255, 255, 255, 0.5);
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 10px;
      }
      .empty-state i {
        font-size: 3rem;
        color: #f8bbd0;
      }
      .empty-state p {
        margin: 0;
        font-size: 1.1rem;
        font-weight: 500;
      }
      .project-grid {
        display: grid;
        gap: 25px;
        grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      }
      .project-card {
        display: flex;
        flex-direction: column;
        border: 1px solid rgba(0, 0, 0, 0.04);
        border-radius: 16px;
        background-color: #ffffff;
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.02);
        overflow: hidden;
        transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
        height: 100%;
      }
      .project-card:hover {
        transform: translateY(-6px);
        box-shadow: 0 15px 30px rgba(248, 187, 208, 0.25);
        border-color: rgba(248, 187, 208, 0.4);
      }
      .card-content {
        padding: 24px;
        flex-grow: 1;
        display: flex;
        flex-direction: column;
      }
      .card-header-project {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 12px;
        margin-bottom: 12px;
      }
      .card-header-project h3 {
        margin: 0;
        color: #2c3e50;
        font-size: 1.25rem;
        font-weight: 700;
        line-height: 1.3;
      }
      .description {
        color: #5a6b7c;
        font-size: 0.92rem;
        margin-bottom: 20px;
        line-height: 1.5;
        flex-grow: 1;
      }
      .project-dates {
        border-top: 1px dashed rgba(0, 0, 0, 0.08);
        padding-top: 15px;
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
      .date-item {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 0.88rem;
        color: #5a6b7c;
      }
      .badge {
        padding: 6px 12px;
        border-radius: 20px;
        font-size: 0.72rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.5px;
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
        background-color: #fce4ec;
        color: #c2185b;
      }
      .card-actions {
        padding: 16px 24px;
        background-color: rgba(250, 250, 250, 0.8);
        border-top: 1px solid rgba(0, 0, 0, 0.04);
        display: flex;
        gap: 12px;
      }
      .btn-action {
        flex: 1;
        padding: 9px 12px;
        border-radius: 10px;
        font-weight: 700;
        font-size: 0.88rem;
        text-align: center;
        text-decoration: none;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 6px;
        transition: all 0.2s ease;
      }
      .btn-primary-custom {
        background-color: #a5d6a7;
        color: #2c3e50;
      }
      .btn-primary-custom:hover {
        background-color: #81c784;
        transform: scale(1.02);
      }
      .btn-secondary-custom {
        background-color: #fce4ec;
        color: #2c3e50;
      }
      .btn-secondary-custom:hover {
        background-color: #f8bbd0;
        transform: scale(1.02);
      }
    `,
  ],
})
export class ProjectListComponent implements OnInit {
  private projectService = inject(ProjectService);

  // Signals
  projects = signal<ProjectResponse[]>([]);
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
