import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-terms',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="page">
      <section class="hero-section">
        <div class="container">
          <h1>Terms of Service</h1>
          <p class="lead">Last updated: January 2026</p>
        </div>
      </section>

      <section class="content-section">
        <div class="container">
          <div class="legal-content">
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing or using SkinVision, you agree to be bound by these Terms of Service. 
              If you do not agree to these terms, please do not use our service.
            </p>

            <h2>2. Description of Service</h2>
            <p>
              SkinVision is an AI-assisted dermatology examination tool designed for use by licensed 
              medical professionals. The service provides:
            </p>
            <ul>
              <li>Image capture and management for dermatological examinations</li>
              <li>AI-powered analysis suggestions for skin conditions</li>
              <li>Digital documentation and report generation</li>
              <li>Examination history and record management</li>
            </ul>

            <h2>3. Professional Use Only</h2>
            <p>
              SkinVision is intended exclusively for licensed healthcare professionals. By using this 
              service, you represent that you are a licensed medical professional authorized to practice 
              in your jurisdiction.
            </p>

            <h2>4. AI Advisory Disclaimer</h2>
            <p>
              The AI analysis provided by SkinVision is advisory only and is not intended to replace 
              professional medical judgment. All diagnostic decisions remain the sole responsibility 
              of the treating physician. The AI suggestions should be used as a supportive tool 
              alongside clinical examination and expertise.
            </p>

            <h2>5. User Responsibilities</h2>
            <p>As a user of SkinVision, you agree to:</p>
            <ul>
              <li>Provide accurate and truthful information</li>
              <li>Maintain the confidentiality of your account credentials</li>
              <li>Use the service in compliance with applicable laws and regulations</li>
              <li>Not share access to your account with unauthorized parties</li>
              <li>Exercise independent clinical judgment in all diagnostic decisions</li>
            </ul>

            <h2>6. Patient Data</h2>
            <p>
              You are responsible for obtaining appropriate patient consent before capturing and 
              storing patient images and information in SkinVision. You must comply with all 
              applicable healthcare privacy laws and regulations.
            </p>

            <h2>7. Intellectual Property</h2>
            <p>
              SkinVision and its original content, features, and functionality are owned by 
              SkinVision and are protected by international copyright and trademark laws.
            </p>

            <h2>8. Limitation of Liability</h2>
            <p>
              SkinVision shall not be liable for any indirect, incidental, special, consequential, 
              or punitive damages resulting from your use of the service. The AI analysis is provided 
              "as is" without warranty of any kind.
            </p>

            <h2>9. Changes to Terms</h2>
            <p>
              We reserve the right to modify these terms at any time. Continued use of the service 
              after changes constitutes acceptance of the new terms.
            </p>

            <h2>10. Contact</h2>
            <p>
              For questions about these Terms of Service, please <a routerLink="/contact">contact us</a>.
            </p>
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
      max-width: 800px;
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
      font-size: 16px;
      color: var(--text-light);
      margin: 0;
    }

    .content-section {
      padding: 60px 0;
    }

    .legal-content h2 {
      font-size: 20px;
      color: var(--text-dark);
      margin: 36px 0 16px 0;
    }

    .legal-content h2:first-child {
      margin-top: 0;
    }

    .legal-content p {
      font-size: 15px;
      color: var(--text-light);
      line-height: 1.7;
      margin-bottom: 16px;
    }

    .legal-content ul {
      margin: 0 0 16px 0;
      padding-left: 24px;
    }

    .legal-content li {
      font-size: 15px;
      color: var(--text-light);
      line-height: 1.7;
      margin-bottom: 8px;
    }

    .legal-content a {
      color: var(--primary-color);
      text-decoration: none;
    }

    .legal-content a:hover {
      text-decoration: underline;
    }
  `]
})
export class TermsComponent {}
