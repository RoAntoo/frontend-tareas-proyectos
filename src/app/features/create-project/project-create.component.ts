import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ProjectService, ProjectRequest, ProjectStatus } from '../../service/project.service';

function dateValidator(control: AbstractControl): ValidationErrors | null {
  const start = control.get('startDate')?.value;
  const end = control.get('endDate')?.value;
  if (!start || !end) return null;

  const startDate = new Date(start);
  const endDate = new Date(end);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const errors: any = {};
  if (endDate < startDate) {
    errors.endBeforeStart = true;
  }
  if (endDate < today) {
    errors.endBeforeToday = true;
  }

  return Object.keys(errors).length > 0 ? errors : null;
}

@Component({
  selector: 'app-create-project',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './project-create.component.html',
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
export class ProjectCreateComponent {
  private fb = inject(FormBuilder);
  private projectService = inject(ProjectService);
  private router = inject(Router);

  loading = signal(false);
  error = signal<string | null>(null);
  success = signal<string | null>(null);

  projectForm = this.fb.group(
    {
      name: this.fb.control('', { validators: Validators.required, nonNullable: true }),
      startDate: this.fb.control('', { validators: Validators.required, nonNullable: true }),
      endDate: this.fb.control('', { validators: Validators.required, nonNullable: true }),
      status: this.fb.control<ProjectStatus>('PLANNED', {
        validators: Validators.required,
        nonNullable: true,
      }),
      description: this.fb.control(''),
    },
    { validators: dateValidator },
  );

  onSubmit() {
    if (this.projectForm.invalid) {
      this.projectForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.error.set(null);
    this.success.set(null);

    const formValue = this.projectForm.getRawValue();
    const request: ProjectRequest = {
      id: null,
      name: formValue.name,
      startDate: formValue.startDate,
      endDate: formValue.endDate,
      status: formValue.status,
      description: formValue.description || undefined,
    };

    this.projectService.createProject(request).subscribe({
      next: () => {
        this.loading.set(false);
        this.error.set(null);
        this.success.set('¡Proyecto creado con éxito! Redirigiendo...');

        this.projectForm.reset({ status: 'PLANNED' });

        setTimeout(() => {
          this.router.navigate(['/projects']);
        }, 2000);
      },
      error: (err) => {
        this.loading.set(false);
        this.success.set(null);

        if (err.status === 409) {
          this.error.set('Recurso duplicado: El nombre del proyecto ya existe.');
        } else if (err.status === 400) {
          this.error.set('Error de validación: Revisa los datos ingresados.');
        } else {
          this.error.set('Ocurrió un error inesperado al intentar crear el proyecto.');
        }
      },
    });
  }
}
