import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TaskService, TaskResponse } from '../../service/task.service';

@Component({
  selector: 'app-update-task',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './update-task.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      .card {
        border-radius: 12px !important;
        border: 1px solid #e0e0e0 !important;
        overflow: hidden;
      }
      .card-header {
        background-color: #E8F5E9 !important;
        color: #2C3E50 !important;
        border-bottom: 1px solid #e0e0e0 !important;
        padding: 15px 20px !important;
      }
      .btn-primary {
        background-color: #A5D6A7 !important;
        border: none !important;
        color: #2C3E50 !important;
        border-radius: 8px !important;
        font-weight: bold !important;
        transition: background-color 0.2s ease-in-out !important;
        padding: 10px 20px !important;
      }
      .btn-primary:hover:not(:disabled) {
        background-color: #81C784 !important;
        color: #2C3E50 !important;
      }
      .btn-outline-secondary {
        border-radius: 8px !important;
        font-weight: bold !important;
        border-color: #ccc !important;
        color: #555 !important;
        padding: 10px 20px !important;
      }
      .btn-outline-secondary:hover {
        background-color: #fce4ec !important;
        color: #2C3E50 !important;
        border-color: #f8bbd0 !important;
      }
    `
  ]
})
export class UpdateTaskComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private taskService = inject(TaskService);

  projectId!: number;
  taskId!: number;

  // Estado local con signals
  isLoading = signal(false);
  isSaving = signal(false);
  errorMessage = signal<string | null>(null);
  task = signal<TaskResponse | null>(null);

  form = this.fb.group({
    title: ['', [Validators.required, Validators.pattern(/\S+/)]],
    estimateHours: [1, [Validators.required, Validators.min(1)]],
    assignee: [''],
  });

  ngOnInit(): void {
    this.projectId = Number(this.route.snapshot.paramMap.get('projectId'));
    this.taskId = Number(this.route.snapshot.paramMap.get('taskId'));
    this.loadTask();
  }

  private loadTask(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.taskService.getTask(this.projectId, this.taskId).subscribe({
      next: (task) => {
        this.task.set(task);
        this.form.patchValue({
          title: task.title,
          estimateHours: task.estimateHours,
          assignee: task.assignee ?? '',
        });
        this.isLoading.set(false);
      },
      error: (err) => {
        const msg =
          err.status === 404
            ? 'Tarea no encontrada.'
            : 'Error al cargar la tarea. Intentá de nuevo.';
        this.errorMessage.set(msg);
        this.isLoading.set(false);
      },
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    this.isSaving.set(true);
    this.errorMessage.set(null);

    const { title, estimateHours, assignee } = this.form.getRawValue();

    this.taskService
      .updateTask(this.projectId, this.taskId, {
        title: title!.trim(),
        estimateHours: estimateHours!,
        assignee: assignee?.trim() || null,
      })
      .subscribe({
        next: () => {
          this.isSaving.set(false);
          this.router.navigate(['/projects', this.projectId, 'tasks']);
        },
        error: (err) => {
          const msg = err.error?.message || 'Ocurrió un error al guardar. Intentá de nuevo.';
          this.errorMessage.set(msg);
          this.isSaving.set(false);
        },
      });
  }
}
