import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { SelectModule } from 'primeng/select';
import { AuthService } from '../../core/auth/auth.service';
import { AppRole } from '../../core/models/team-pulse.models';
import { AppLogoComponent } from '../../shared/components/app-logo/app-logo.component';

interface RoleOption {
  label: string;
  value: AppRole;
  email: string;
  password: string;
}

@Component({
  selector: 'tp-login-page',
  standalone: true,
  imports: [AppLogoComponent, ButtonModule, CardModule, InputTextModule, PasswordModule, ReactiveFormsModule, SelectModule],
  template: `
    <main class="login-page">
      <section class="login-hero">
        <tp-app-logo size="large" />
        <div class="hero-copy">
          <p class="eyebrow">Fake Auth Lab</p>
          <h1>Signal-rich team management for Angular practice.</h1>
          <p>Use seeded backend users, real HTTP calls, and a local-only fake session.</p>
        </div>
      </section>

      <p-card styleClass="login-card">
        <ng-template #title>Workshop Login</ng-template>
        <ng-template #subtitle>Pick a role, load demo credentials, and enter TeamPulse.</ng-template>

        <form [formGroup]="form" (ngSubmit)="login()">
          <label>
            Role
            <p-select
              formControlName="role"
              [options]="roleOptions"
              optionLabel="label"
              optionValue="value"
              (onChange)="applySelectedRoleHint()"
            />
          </label>

          <label>
            Email
            <input pInputText type="email" formControlName="email" autocomplete="username" />
          </label>

          <label>
            Password
            <p-password formControlName="password" [feedback]="false" [toggleMask]="true" autocomplete="current-password" />
          </label>

          <div class="hint">
            <strong>{{ selectedHint().label }}</strong>
            <span>{{ selectedHint().email }} / {{ selectedHint().password }}</span>
          </div>

          @if (error()) {
            <p class="error">{{ error() }}</p>
          }

          <div class="actions">
            <button pButton type="button" label="Demo Credentials" icon="pi pi-sparkles" severity="secondary" (click)="fillDemoCredentials()"></button>
            <button pButton type="submit" label="Login" icon="pi pi-arrow-right" [disabled]="form.invalid || busy()"></button>
          </div>
        </form>
      </p-card>
    </main>
  `,
  styles: [
    `
      .login-page {
        display: grid;
        min-height: 100vh;
        grid-template-columns: minmax(0, 1.15fr) minmax(23rem, 0.85fr);
        gap: 2rem;
        align-items: center;
        background:
          linear-gradient(135deg, color-mix(in srgb, var(--tp-accent) 20%, transparent), transparent 32%),
          linear-gradient(315deg, color-mix(in srgb, var(--tp-hot) 18%, transparent), transparent 35%),
          var(--tp-surface);
        padding: 2rem;
      }

      .login-hero {
        display: grid;
        gap: 2rem;
      }

      .hero-copy {
        max-width: 45rem;
      }

      .eyebrow {
        display: inline-block;
        margin: 0 0 1rem;
        border: 3px solid var(--tp-ink);
        background: var(--tp-warning);
        box-shadow: 5px 5px 0 var(--tp-ink);
        color: #121212;
        font-weight: 900;
        padding: 0.35rem 0.6rem;
        text-transform: uppercase;
      }

      h1 {
        margin: 0;
        font-size: clamp(2.4rem, 7vw, 5.75rem);
        line-height: 0.95;
      }

      .hero-copy p:last-child {
        max-width: 35rem;
        color: var(--tp-muted);
        font-size: 1.1rem;
        line-height: 1.6;
      }

      :host ::ng-deep .login-card {
        border: 3px solid var(--tp-ink);
        border-radius: 0.5rem;
        background: var(--tp-panel);
        box-shadow: 10px 10px 0 var(--tp-ink);
      }

      form {
        display: grid;
        gap: 1rem;
      }

      label {
        display: grid;
        gap: 0.4rem;
        font-weight: 900;
      }

      input,
      p-select,
      p-password {
        width: 100%;
      }

      .hint,
      .error {
        border: 2px solid var(--tp-ink);
        padding: 0.75rem;
      }

      .hint {
        display: grid;
        gap: 0.2rem;
        background: color-mix(in srgb, var(--tp-accent) 16%, var(--tp-panel));
      }

      .error {
        margin: 0;
        background: color-mix(in srgb, var(--tp-danger) 22%, var(--tp-panel));
        font-weight: 800;
      }

      .actions {
        display: flex;
        flex-wrap: wrap;
        gap: 0.75rem;
        justify-content: flex-end;
      }

      @media (max-width: 900px) {
        .login-page {
          grid-template-columns: 1fr;
        }
      }
    `
  ]
})
export class LoginPageComponent {
  private readonly auth = inject(AuthService);
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  protected readonly busy = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly roleOptions: RoleOption[] = [
    { label: 'Manager', value: 'Manager', email: 'manager1@teampulse.demo', password: 'TeamPulse-Manager-2026!' },
    { label: 'Team Member', value: 'TeamMember', email: 'member1@teampulse.demo', password: 'TeamPulse-Member-2026!' }
  ];

  protected readonly form = this.fb.nonNullable.group({
    role: this.fb.nonNullable.control<AppRole>('Manager', Validators.required),
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  protected readonly selectedHint = signal<RoleOption>(this.roleOptions[0]);

  constructor() {
    this.fillDemoCredentials();
  }

  protected applySelectedRoleHint(): void {
    this.selectedHint.set(this.getSelectedRoleOption());
    this.fillDemoCredentials();
  }

  protected fillDemoCredentials(): void {
    const hint = this.getSelectedRoleOption();
    this.selectedHint.set(hint);
    this.form.patchValue({ email: hint.email, password: hint.password });
  }

  protected login(): void {
    if (this.form.invalid) {
      return;
    }

    this.busy.set(true);
    this.error.set(null);
    this.auth.login({ email: this.form.controls.email.value, password: this.form.controls.password.value }).subscribe({
      next: () => {
        const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') ?? '/dashboard';
        this.router.navigateByUrl(returnUrl);
      },
      error: () => {
        this.error.set('Login failed. Use one of the seeded demo users.');
        this.busy.set(false);
      },
      complete: () => this.busy.set(false)
    });
  }

  private getSelectedRoleOption(): RoleOption {
    const role = this.form.controls.role.value;
    return this.roleOptions.find((option) => option.value === role) ?? this.roleOptions[0];
  }
}
