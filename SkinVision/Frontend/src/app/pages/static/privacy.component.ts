import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-privacy',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="page">
      <section class="hero-section">
        <div class="container">
          <h1>Privacy Policy</h1>
          <p class="lead">Last updated: January 2026</p>
        </div>
      </section>

      <section class="content-section">
        <div class="container">
          <div class="legal-content">
            <h2>1. Introduction</h2>
            <p>
              SkinVision is committed to protecting your privacy and the privacy of your patients. 
              This Privacy Policy explains how we collect, use, and safeguard information when you 
              use our service.
            </p>

            <h2>2. Information We Collect</h2>
            <h3>Account Information</h3>
            <p>When you register, we collect:</p>
            <ul>
              <li>Full name and professional credentials</li>
              <li>Email address</li>
              <li>Clinic name and address</li>
              <li>Phone number</li>
            </ul>

            <h3>Examination Data</h3>
            <p>During use of the service, the following data is stored:</p>
            <ul>
              <li>Patient information (name, age, contact details)</li>
              <li>Dermascope images</li>
              <li>AI analysis results</li>
              <li>Diagnosis and treatment records</li>
            </ul>

            <h2>3. How We Use Your Information</h2>
            <p>We use collected information to:</p>
            <ul>
              <li>Provide and maintain the SkinVision service</li>
              <li>Process AI analysis of dermascope images</li>
              <li>Generate examination reports</li>
              <li>Improve our AI models (using anonymized data only)</li>
              <li>Communicate service updates and support</li>
            </ul>

            <h2>4. Data Security</h2>
            <p>
              We implement industry-standard security measures to protect your data:
            </p>
            <ul>
              <li>Encryption of data in transit and at rest</li>
              <li>Secure server infrastructure</li>
              <li>Access controls and authentication</li>
              <li>Regular security audits</li>
            </ul>

            <h2>5. Data Retention</h2>
            <p>
              Examination data is retained for as long as your account is active or as needed to 
              provide services. You may request deletion of your data by contacting us.
            </p>

            <h2>6. Patient Privacy</h2>
            <p>
              As a healthcare provider, you are responsible for:
            </p>
            <ul>
              <li>Obtaining patient consent for data collection</li>
              <li>Complying with applicable healthcare privacy laws</li>
              <li>Informing patients about how their data is used</li>
            </ul>

            <h2>7. Third-Party Sharing</h2>
            <p>
              We do not sell or share personal information with third parties for marketing purposes. 
              Data may be shared with:
            </p>
            <ul>
              <li>Service providers who assist in operating our platform</li>
              <li>Legal authorities when required by law</li>
            </ul>

            <h2>8. Your Rights</h2>
            <p>You have the right to:</p>
            <ul>
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Export your data</li>
            </ul>

            <h2>9. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy periodically. We will notify you of significant 
              changes via email or through the service.
            </p>

            <h2>10. Contact Us</h2>
            <p>
              For privacy-related inquiries, please <a routerLink="/contact">contact us</a> or 
              email privacy&#64;skinvision.com.
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

    .legal-content h3 {
      font-size: 16px;
      color: var(--text-dark);
      margin: 20px 0 12px 0;
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
export class PrivacyComponent {}
