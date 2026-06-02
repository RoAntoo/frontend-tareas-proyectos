import { Component, OnInit, ChangeDetectionStrategy, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment';

interface ProjectUpdateRequest {
  name: string;
  startDate: string;
  endDate: string;
  description?: string;
}

interface ProjectResponse {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  status: string;
  description?: string;
}

function dateRangeValidator(control: AbstractControl): ValidationErrors | null {
  const start = control.get('startDate')?.value;
  const end = control.get('endDate')?.value;
  if (start && end && end < start) {
    return { dateRange: true };
  }
  return null;
}

@Component({
  selector: 'app-update-project',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './update-project.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpdateProjectComponent implements OnInit {
  form!: FormGroup;
  projectId!: number;

  loading = signal(false);
  loadError = signal<string | null>(null);
  saveError = signal<string | null>(null);
  nameConflict = signal(false);

  private readonly API = environment.apiUrl;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
  ) {}

  ngOnInit(): void {
    this.projectId = Number(this.route.snapshot.paramMap.get('id'));

    this.form = this.fb.group(
      {
        name: ['', Validators.required],
        startDate: ['', Validators.required],
        endDate: ['', Validators.required],
        description: [''],
      },
      { validators: dateRangeValidator },
    );

    this.loadProject();
  }

  private loadProject(): void {
    this.loading.set(true);
    this.loadError.set(null);

    this.http.get<ProjectResponse>(`${this.API}/projects/${this.projectId}`).subscribe({
      next: (project) => {
        this.form.patchValue({
          name: project.name,
          startDate: project.startDate,
          endDate: project.endDate,
          description: project.description ?? '',
        });
        this.loading.set(false);
      },
      error: (err) => {
        this.loading.set(false);
        if (err.status === 404) {
          this.loadError.set('Proyecto no encontrado.');
        } else {
          this.loadError.set('Error al cargar el proyecto. Intentá de nuevo.');
        }
      },
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    this.saveError.set(null);
    this.nameConflict.set(false);
    this.loading.set(true);

    const body: ProjectUpdateRequest = this.form.value;

    this.http.put<ProjectResponse>(`${this.API}/projects/${this.projectId}`, body).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/projects']);
      },
      error: (err) => {
        this.loading.set(false);
        if (err.status === 409) {
          this.nameConflict.set(true);
        } else if (err.status === 400) {
          this.saveError.set('Datos inválidos. Revisá los campos.');
        } else {
          this.saveError.set('Error al guardar. Intentá de nuevo.');
        }
      },
    });
  }
}
