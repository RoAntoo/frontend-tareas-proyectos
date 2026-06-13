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
        <h2><i class="bi bi-folder-check text-mint"></i> Tareas del Proyecto</h2>
        <a class="btn-create" [routerLink]="['/projects', projectId, 'tasks', 'new']">
          <i class="bi bi-plus-lg"></i> Nueva Tarea
        </a>
      </div>

      <!-- Dashboard de Progreso -->
      @if (!loading() && !error() && tasks().length > 0) {
        <div class="dashboard-card">
          <div class="progress-info">
            <div class="progress-text">
              <span class="progress-title"><i class="bi bi-activity text-mint"></i> Progreso del Proyecto</span>
              <span class="progress-stats">
                <strong>{{ completedTasks() }}</strong> de <strong>{{ totalTasks() }}</strong> completadas
              </span>
            </div>
            <div class="progress-bar-container">
              <div class="progress-bar-fill" [style.width.%]="progressPercentage()">
                <span class="percentage-label">{{ progressPercentage() }}%</span>
              </div>
            </div>
          </div>
          
          <div class="counters-grid">
            <div class="counter-card todo-card">
              <span class="counter-icon">📝</span>
              <div class="counter-details">
                <span class="counter-count">{{ todoCount() }}</span>
                <span class="counter-label">Pendientes</span>
              </div>
            </div>
            <div class="counter-card in-progress-card">
              <span class="counter-icon">⚡</span>
              <div class="counter-details">
                <span class="counter-count">{{ inProgressCount() }}</span>
                <span class="counter-label">En Progreso</span>
              </div>
            </div>
            <div class="counter-card done-card">
              <span class="counter-icon">✅</span>
              <div class="counter-details">
                <span class="counter-count">{{ doneCount() }}</span>
                <span class="counter-label">Completadas</span>
              </div>
            </div>
          </div>
        </div>
      }

      <div class="filter-and-actions">
        <div class="filter-section">
          <label for="statusFilter" class="fw-semibold">
            <i class="bi bi-funnel text-pink"></i> Filtrar por estado: 
          </label>
          <select id="statusFilter" (change)="onFilterChange($event)">
            <option value="TODAS">Todas las tareas</option>
            <option value="TODO">Pendiente</option>
            <option value="IN_PROGRESS">En Progreso</option>
            <option value="DONE">Completada</option>
          </select>
        </div>
        <a class="btn-back" routerLink="/projects">
          <i class="bi bi-arrow-left"></i> Volver a Proyectos
        </a>
      </div>

      @if (loading()) {
        <div class="loading-container">
          <div class="spinner"></div>
          <p class="loading">Cargando tareas...</p>
        </div>
      }

      @if (error()) {
        <div class="error-card">
          <i class="bi bi-exclamation-triangle-fill"></i>
          <p>{{ error() }}</p>
        </div>
      }

      @if (!loading() && !error()) {
        @if (filteredTasks().length > 0) {
          <div class="task-grid">
            @for (task of filteredTasks(); track task.id) {
              <div class="task-card">
                <div class="card-content">
                  <div class="card-header-task">
                    <h3>{{ task.title }}</h3>
                    <span class="badge {{ task.status | lowercase }}">{{ task.status === 'TODO' ? 'Pendiente' : task.status === 'IN_PROGRESS' ? 'En Progreso' : 'Completada' }}</span>
                  </div>
                  <div class="task-info">
                    <div class="info-item">
                      <i class="bi bi-clock text-pink"></i>
                      <span><strong>Estimación:</strong> {{ task.estimateHours }} hs</span>
                    </div>
                    <div class="info-item">
                      <i class="bi bi-person text-mint"></i>
                      <span><strong>Asignado:</strong> {{ task.assignee || 'Sin asignar' }}</span>
                    </div>
                    <div class="info-item">
                      <i class="bi bi-calendar-check text-muted"></i>
                      <span><strong>Finalizado:</strong> {{ task.finishedAt ? task.finishedAt : 'En curso' }}</span>
                    </div>
                  </div>
                </div>
                <div class="card-actions">
                  <a class="btn-edit" [routerLink]="['/projects', projectId, 'tasks', task.id, 'edit']">
                    <i class="bi bi-pencil-square"></i> Editar Tarea
                  </a>
                </div>
              </div>
            }
          </div>
        } @else {
          <div class="empty-state">
            <i class="bi bi-clipboard-x text-pink"></i>
            @if (tasks().length === 0) {
              <p>Este proyecto aún no tiene tareas creadas.</p>
            } @else {
              <p>No hay tareas que coincidan con el estado seleccionado.</p>
            }
          </div>
        }
      }
    </div>
  `,
  styles: [
    `
      .task-container {
        max-width: 1000px;
        margin: 0 auto;
        padding: 20px;
        animation: fadeIn 0.4s ease-out;
      }
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .header-section {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 25px;
        border-bottom: 2px solid rgba(0, 0, 0, 0.05);
        padding-bottom: 15px;
      }
      .header-section h2 {
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
      .dashboard-card {
        background: rgba(255, 255, 255, 0.65);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.8);
        padding: 24px;
        border-radius: 18px;
        margin-bottom: 30px;
        box-shadow: 0 8px 30px rgba(0, 0, 0, 0.02);
        display: flex;
        flex-direction: column;
        gap: 20px;
      }
      .progress-info {
        display: flex;
        flex-direction: column;
        gap: 10px;
      }
      .progress-text {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 0.95rem;
        color: #5a6b7c;
      }
      .progress-title {
        font-weight: 700;
        color: #2c3e50;
        display: flex;
        align-items: center;
        gap: 6px;
      }
      .progress-stats {
        font-size: 0.9rem;
      }
      .progress-bar-container {
        width: 100%;
        height: 18px;
        background-color: rgba(0, 0, 0, 0.05);
        border-radius: 10px;
        overflow: hidden;
        border: 1px solid rgba(0, 0, 0, 0.01);
      }
      .progress-bar-fill {
        height: 100%;
        background: linear-gradient(90deg, #a5d6a7 0%, #81c784 100%);
        border-radius: 10px;
        transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        display: flex;
        align-items: center;
        justify-content: flex-end;
        padding-right: 10px;
        min-width: 25px;
      }
      .percentage-label {
        color: #2c3e50;
        font-size: 0.72rem;
        font-weight: 800;
      }
      .counters-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 15px;
      }
      @media (max-width: 576px) {
        .counters-grid {
          grid-template-columns: 1fr;
        }
      }
      .counter-card {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px 16px;
        border-radius: 12px;
        background-color: #fff;
        border: 1px solid rgba(0, 0, 0, 0.03);
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.01);
      }
      .todo-card {
        border-left: 4px solid #ffb74d;
        background: linear-gradient(135deg, #fff 0%, #fffbf5 100%);
      }
      .in-progress-card {
        border-left: 4px solid #64b5f6;
        background: linear-gradient(135deg, #fff 0%, #f6faff 100%);
      }
      .done-card {
        border-left: 4px solid #81c784;
        background: linear-gradient(135deg, #fff 0%, #f7fdf7 100%);
      }
      .counter-icon {
        font-size: 1.35rem;
      }
      .counter-details {
        display: flex;
        flex-direction: column;
      }
      .counter-count {
        font-size: 1.25rem;
        font-weight: 800;
        color: #2c3e50;
        line-height: 1.1;
      }
      .counter-label {
        font-size: 0.78rem;
        color: #5a6b7c;
        font-weight: 600;
      }
      .filter-and-actions {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 25px;
        background: rgba(255, 255, 255, 0.65);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.8);
        padding: 15px 20px;
        border-radius: 14px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.02);
        flex-wrap: wrap;
        gap: 15px;
      }
      .filter-section {
        display: flex;
        align-items: center;
        gap: 10px;
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
        min-width: 180px;
      }
      select:focus {
        border-color: #a5d6a7;
        box-shadow: 0 0 0 3px rgba(165, 214, 167, 0.25);
      }
      .btn-back {
        padding: 8px 16px;
        background-color: #fce4ec;
        color: #2c3e50;
        font-weight: 700;
        border-radius: 10px;
        text-decoration: none;
        transition: all 0.2s ease;
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 0.9rem;
      }
      .btn-back:hover {
        background-color: #f8bbd0;
        transform: translateX(-2px);
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
      .error-card p {
        margin: 0;
      }
      .empty-state {
        text-align: center;
        color: #5a6b7c;
        padding: 50px 20px;
        border: 2px dashed rgba(248, 187, 208, 0.4);
        border-radius: 16px;
        background: rgba(255, 255, 255, 0.5);
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 10px;
      }
      .empty-state i {
        font-size: 3rem;
      }
      .empty-state p {
        margin: 0;
        font-size: 1.1rem;
        font-weight: 500;
      }
      .task-grid {
        display: grid;
        gap: 25px;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      }
      .task-card {
        display: flex;
        flex-direction: column;
        border: 1px solid rgba(0, 0, 0, 0.04);
        border-radius: 16px;
        background-color: #fff;
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.02);
        overflow: hidden;
        transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
      }
      .task-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 15px 30px rgba(165, 214, 167, 0.2);
        border-color: rgba(165, 214, 167, 0.4);
      }
      .card-content {
        padding: 24px;
        flex-grow: 1;
        display: flex;
        flex-direction: column;
      }
      .card-header-task {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 12px;
        margin-bottom: 20px;
      }
      .card-header-task h3 {
        margin: 0;
        color: #2c3e50;
        font-size: 1.2rem;
        font-weight: 700;
        line-height: 1.3;
      }
      .task-info {
        display: flex;
        flex-direction: column;
        gap: 10px;
        flex-grow: 1;
      }
      .info-item {
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 0.88rem;
        color: #5a6b7c;
      }
      .card-actions {
        padding: 16px 24px;
        background-color: rgba(250, 250, 250, 0.8);
        border-top: 1px solid rgba(0, 0, 0, 0.04);
      }
      .btn-edit {
        width: 100%;
        padding: 9px 12px;
        background-color: #ffffff;
        color: #2c3e50;
        border: 1px solid rgba(0, 0, 0, 0.08);
        border-radius: 10px;
        font-weight: 700;
        transition: all 0.2s ease;
        text-align: center;
        text-decoration: none;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        font-size: 0.88rem;
      }
      .btn-edit:hover {
        background-color: rgba(165, 214, 167, 0.15);
        border-color: #a5d6a7;
        color: #2e7d32;
      }
      .badge {
        padding: 6px 12px;
        border-radius: 20px;
        font-size: 0.72rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.5px;
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

  // Computed signals para el dashboard de progreso y contadores
  totalTasks = computed(() => this.tasks().length);
  completedTasks = computed(() => this.tasks().filter(t => t.status === 'DONE').length);
  progressPercentage = computed(() => {
    const total = this.totalTasks();
    if (total === 0) return 0;
    return Math.round((this.completedTasks() / total) * 100);
  });
  
  todoCount = computed(() => this.tasks().filter(t => t.status === 'TODO').length);
  inProgressCount = computed(() => this.tasks().filter(t => t.status === 'IN_PROGRESS').length);
  doneCount = computed(() => this.tasks().filter(t => t.status === 'DONE').length);

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

