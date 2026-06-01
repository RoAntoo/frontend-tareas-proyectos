import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService } from '../service/task.service';

@Component({
  selector: 'app-create-task',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './create-task.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateTaskComponent {
  private fb = inject(FormBuilder);
  private taskService = inject(TaskService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  loading = signal(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  form = this.fb.group({
    title: ['', Validators.required],
    estimateHours: [null as number | null, [Validators.required, Validators.min(1)]],
    assignee: [''],
    status: ['TODO', Validators.required],
  });

  onSubmit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    const projectId = Number(this.route.snapshot.paramMap.get('projectId'));
    this.loading.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);

    this.taskService
      .createTask(projectId, {
        id: null,
        title: this.form.value.title!,
        estimateHours: this.form.value.estimateHours!,
        assignee: this.form.value.assignee || null,
        status: this.form.value.status as 'TODO' | 'IN_PROGRESS' | 'DONE',
      })
      .subscribe({
        next: () => {
          this.loading.set(false);
          this.successMessage.set('Tarea creada exitosamente.');
          this.form.reset({ status: 'TODO' });
        },
        error: (err) => {
          this.loading.set(false);
          if (err.status === 409) {
            this.errorMessage.set('No se pueden agregar tareas a un proyecto cerrado.');
          } else if (err.status === 404) {
            this.errorMessage.set('El proyecto no existe.');
          } else {
            this.errorMessage.set('Error al crear la tarea. Revisá los datos e intentá de nuevo.');
          }
        },
      });
  }
}
