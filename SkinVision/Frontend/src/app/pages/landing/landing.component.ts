import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="container">
      <h1>SkinVision</h1>
      <p>Dermatology Management System</p>
      
      <div class="content">
        <p>A comprehensive platform for managing dermatology consultations, patient records, and medical workflows.</p>
        
        <div class="features">
          <div class="feature">
            <h3>For Patients</h3>
            <p>Access your medical records and schedule appointments</p>
          </div>
          <div class="feature">
            <h3>For Doctors</h3>
            <p>Manage consultations and review patient cases</p>
          </div>
          <div class="feature">
            <h3>Secure & Private</h3>
            <p>Your data is protected with enterprise-grade security</p>
          </div>
        </div>
        
        <a routerLink="/login" class="cta-button">Get Started</a>
      </div>
    </div>
  `,
  styles: [`
    .container {
      max-width: 900px;
      margin: 0 auto;
      padding: 40px 20px;
      text-align: center;
    }
    h1 {
      color: #333;
      font-size: 36px;
      margin-bottom: 10px;
    }
    .container > p {
      color: #666;
      font-size: 18px;
      margin-bottom: 40px;
    }
    .content {
      margin-top: 40px;
    }
    .content > p {
      font-size: 16px;
      color: #555;
      margin-bottom: 40px;
      line-height: 1.6;
    }
    .features {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 30px;
      margin-bottom: 50px;
    }
    .feature {
      padding: 30px;
      background: #f8f9fa;
      border-radius: 8px;
      border: 1px solid #e9ecef;
    }
    .feature h3 {
      color: #333;
      margin-bottom: 10px;
    }
    .feature p {
      color: #666;
      font-size: 14px;
    }
    .cta-button {
      display: inline-block;
      padding: 12px 30px;
      background: #007bff;
      color: white;
      text-decoration: none;
      border-radius: 4px;
      font-size: 16px;
      font-weight: 500;
    }
    .cta-button:hover {
      background: #0056b3;
    }
  `]
})
export class LandingComponent {}

