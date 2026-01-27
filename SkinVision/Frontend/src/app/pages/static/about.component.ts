import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="page">
      <section class="hero">
        <div class="container">
          <h1>About SkinVision</h1>
          <p>AI-powered dermatology care for everyone</p>
        </div>
      </section>

      <section class="mission">
        <div class="container">
          <div class="mission-content">
            <h2>Our Mission</h2>
            <p>At SkinVision, we believe quality dermatological care should be accessible to everyone. Our platform connects patients with expert dermatologists who use cutting-edge AI tools for faster, more accurate diagnoses.</p>
            <p>Founded in 2024, we've helped thousands of patients get professional skin health assessments from certified doctors — all from the comfort of their homes.</p>
          </div>
          <div class="stats-box">
            <div class="stat">
              <span class="number">10,000+</span>
              <span class="label">Patients Helped</span>
            </div>
            <div class="stat">
              <span class="number">500+</span>
              <span class="label">Expert Doctors</span>
            </div>
            <div class="stat">
              <span class="number">98%</span>
              <span class="label">Accuracy Rate</span>
            </div>
          </div>
        </div>
      </section>

      <section class="values">
        <div class="container">
          <h2>Our Values</h2>
          <div class="values-grid">
            <div class="value-card">
              <span class="icon">🔬</span>
              <h3>Innovation</h3>
              <p>Pushing boundaries in telemedicine and AI diagnostics</p>
            </div>
            <div class="value-card">
              <span class="icon">🤝</span>
              <h3>Trust</h3>
              <p>Maintaining highest standards of medical ethics</p>
            </div>
            <div class="value-card">
              <span class="icon">❤️</span>
              <h3>Care</h3>
              <p>Patient well-being at the heart of everything</p>
            </div>
            <div class="value-card">
              <span class="icon">🌍</span>
              <h3>Accessibility</h3>
              <p>Quality healthcare for everyone, everywhere</p>
            </div>
          </div>
        </div>
      </section>

      <section class="cta">
        <div class="container">
          <h2>Ready to Get Started?</h2>
          <p>Join thousands who trust SkinVision</p>
          <a routerLink="/register" class="btn">Create Free Account</a>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .page { padding-top: 100px; }
    
    .hero {
      background: linear-gradient(135deg, #167D7E, #2BB1B8);
      padding: 80px 20px;
      text-align: center;
      color: white;
    }
    .hero h1 { font-size: 42px; margin-bottom: 12px; }
    .hero p { font-size: 18px; opacity: 0.9; }
    
    .container { max-width: 1000px; margin: 0 auto; padding: 0 20px; }
    
    .mission {
      padding: 80px 20px;
      background: white;
    }
    .mission .container {
      display: grid;
      grid-template-columns: 1.5fr 1fr;
      gap: 60px;
      align-items: center;
    }
    .mission-content h2 {
      font-size: 32px;
      color: #167D7E;
      margin-bottom: 20px;
    }
    .mission-content p {
      color: #555;
      line-height: 1.8;
      margin-bottom: 15px;
    }
    
    .stats-box {
      background: #F0F8F9;
      padding: 40px;
      border-radius: 20px;
    }
    .stat {
      text-align: center;
      padding: 25px 0;
      border-bottom: 1px solid #e0e0e0;
    }
    .stat:last-child { border-bottom: none; }
    .stat .number {
      display: block;
      font-size: 40px;
      font-weight: 700;
      color: #167D7E;
    }
    .stat .label {
      font-size: 14px;
      color: #666;
    }
    
    .values {
      padding: 80px 20px;
      background: #F0F8F9;
    }
    .values h2 {
      text-align: center;
      font-size: 32px;
      color: #333;
      margin-bottom: 50px;
    }
    .values-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 25px;
    }
    .value-card {
      background: white;
      padding: 35px 25px;
      border-radius: 16px;
      text-align: center;
      box-shadow: 0 5px 20px rgba(0,0,0,0.05);
    }
    .value-card .icon { font-size: 40px; display: block; margin-bottom: 15px; }
    .value-card h3 { color: #333; margin-bottom: 10px; font-size: 18px; }
    .value-card p { color: #666; font-size: 14px; line-height: 1.6; }
    
    .cta {
      padding: 80px 20px;
      background: linear-gradient(135deg, #167D7E, #2BB1B8);
      text-align: center;
      color: white;
    }
    .cta h2 { font-size: 32px; margin-bottom: 12px; }
    .cta p { margin-bottom: 30px; opacity: 0.9; }
    .btn {
      display: inline-block;
      padding: 16px 35px;
      background: white;
      color: #167D7E;
      text-decoration: none;
      border-radius: 10px;
      font-weight: 600;
      font-size: 16px;
      transition: transform 0.3s;
    }
    .btn:hover { transform: translateY(-2px); }
    
    @media (max-width: 900px) {
      .mission .container { grid-template-columns: 1fr; }
      .values-grid { grid-template-columns: repeat(2, 1fr); }
    }
    @media (max-width: 600px) {
      .values-grid { grid-template-columns: 1fr; }
      .hero h1 { font-size: 32px; }
    }
  `]
})
export class AboutComponent {}
