import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="page">
      <section class="hero-section">
        <div class="container">
          <h1>About SkinVision</h1>
          <p class="lead">Empowering dermatologists with AI-assisted diagnosis tools</p>
        </div>
      </section>

      <section class="content-section">
        <div class="container">
          <div class="content-grid">
            <div class="main-content">
              <h2>Our Mission</h2>
              <p>
                SkinVision is designed to support dermatologists in their diagnostic workflow by combining 
                advanced AI technology with intuitive digital tools. Our goal is to enhance clinical 
                efficiency while maintaining the highest standards of medical practice.
              </p>

              <h2>What We Offer</h2>
              <p>
                Our platform provides a comprehensive examination tool that allows dermatologists to:
              </p>
              <ul>
                <li>Capture and organize dermascope images during patient examinations</li>
                <li>Receive AI-powered analysis to support diagnostic decisions</li>
                <li>Document diagnoses, treatments, and follow-up plans digitally</li>
                <li>Generate professional PDF reports for patient records</li>
                <li>Maintain a searchable history of all examinations</li>
              </ul>

              <h2>AI Technology</h2>
              <p>
                Our AI model is trained on dermatological image datasets to identify common skin 
                conditions. It serves as an advisory tool, providing classification suggestions 
                to support — not replace — the dermatologist's clinical expertise and judgment.
              </p>
              <p>
                The AI can identify several common skin conditions including melanocytic nevi, 
                dermatitis, acne, psoriasis, and more. Results are presented as suggestions 
                for the physician to consider alongside their clinical assessment.
              </p>

              <h2>For Professionals</h2>
              <p>
                SkinVision is designed exclusively for licensed medical professionals. The platform 
                is intended to be used as a clinical support tool during in-person patient examinations, 
                not as a standalone diagnostic system or consumer application.
              </p>

              <div class="cta-box">
                <h3>Ready to get started?</h3>
                <p>Create your free account and explore how SkinVision can enhance your practice.</p>
                <a routerLink="/register" class="btn btn-primary">Create Account</a>
              </div>
            </div>

            <aside class="sidebar">
              <div class="info-card">
                <h4>Key Features</h4>
                <ul>
                  <li>AI-powered image analysis</li>
                  <li>Digital examination records</li>
                  <li>PDF report generation</li>
                  <li>Searchable history</li>
                  <li>Secure data storage</li>
                </ul>
              </div>
              <div class="info-card">
                <h4>Contact</h4>
                <p>Have questions? We're here to help.</p>
                <a routerLink="/contact">Get in Touch →</a>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .page {
      padding-top: 70px;
    }

    .container {
      max-width: 1000px;
      margin: 0 auto;
      padding: 0 24px;
    }

    .hero-section {
      background: linear-gradient(135deg, #f8fffe 0%, #e8f5f5 100%);
      padding: 60px 0;
      text-align: center;
    }

    .hero-section h1 {
      font-size: 36px;
      color: var(--text-dark);
      margin: 0 0 12px 0;
    }

    .lead {
      font-size: 18px;
      color: var(--text-light);
      margin: 0;
    }

    .content-section {
      padding: 60px 0;
    }

    .content-grid {
      display: grid;
      grid-template-columns: 1fr 280px;
      gap: 48px;
    }

    .main-content h2 {
      font-size: 24px;
      color: var(--text-dark);
      margin: 40px 0 16px 0;
    }

    .main-content h2:first-child {
      margin-top: 0;
    }

    .main-content p {
      font-size: 16px;
      color: var(--text-light);
      line-height: 1.7;
      margin-bottom: 16px;
    }

    .main-content ul {
      margin: 0 0 24px 0;
      padding-left: 24px;
    }

    .main-content li {
      font-size: 16px;
      color: var(--text-light);
      line-height: 1.7;
      margin-bottom: 8px;
    }

    .cta-box {
      background: var(--background-color);
      padding: 32px;
      border-radius: 12px;
      margin-top: 40px;
    }

    .cta-box h3 {
      font-size: 20px;
      color: var(--text-dark);
      margin: 0 0 8px 0;
    }

    .cta-box p {
      margin-bottom: 20px;
    }

    .btn {
      display: inline-block;
      padding: 12px 24px;
      background: var(--primary-color);
      color: white;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
      font-size: 14px;
    }

    .btn:hover {
      background: #126465;
    }

    .sidebar {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .info-card {
      background: var(--background-color);
      padding: 24px;
      border-radius: 12px;
    }

    .info-card h4 {
      font-size: 16px;
      color: var(--text-dark);
      margin: 0 0 16px 0;
    }

    .info-card ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .info-card li {
      font-size: 14px;
      color: var(--text-light);
      padding: 8px 0;
      border-bottom: 1px solid var(--border-color);
    }

    .info-card li:last-child {
      border-bottom: none;
    }

    .info-card p {
      font-size: 14px;
      color: var(--text-light);
      margin: 0 0 12px 0;
    }

    .info-card a {
      color: var(--primary-color);
      text-decoration: none;
      font-size: 14px;
      font-weight: 600;
    }

    @media (max-width: 768px) {
      .content-grid {
        grid-template-columns: 1fr;
      }

      .sidebar {
        order: -1;
      }
    }
  `]
})
export class AboutComponent {}
