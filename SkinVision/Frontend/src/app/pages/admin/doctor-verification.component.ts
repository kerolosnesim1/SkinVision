import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-doctor-verification',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="container">
      <h1>Doctor Verification</h1>
      <p>Verify pending doctor registrations</p>
      <a routerLink="/admin" class="btn btn-primary">Back to Dashboard</a>
    </div>
  `,
  styles: [`
    .container { max-width: 1200px; margin: 0 auto; padding: 100px 20px 40px; }
    h1 { color: var(--primary-color); }
  `]
})
export class DoctorVerificationComponent {}

