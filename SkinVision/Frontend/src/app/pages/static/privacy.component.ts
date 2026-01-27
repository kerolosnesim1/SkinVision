import { Component } from '@angular/core';

@Component({
  selector: 'app-privacy',
  standalone: true,
  template: `
    <div class="page">
      <section class="hero">
        <h1>Privacy Policy</h1>
        <p>Last updated: January 2026</p>
      </section>

      <section class="content">
        <div class="container">
          <h2>1. Information We Collect</h2>
          <p>We collect personal information, medical data (health history, skin images), and usage data to provide our services.</p>

          <h2>2. How We Use Your Data</h2>
          <p>Your data powers consultations, AI analysis, and service improvements. We never sell your data.</p>

          <h2>3. Data Security</h2>
          <p>Enterprise-grade encryption (TLS/SSL, AES-256), strict access controls, and regular security audits protect your information.</p>

          <h2>4. Your Rights</h2>
          <p>You can access, correct, or delete your data. Contact privacy&#64;skinvision.com to exercise these rights.</p>

          <h2>5. Contact</h2>
          <p>Privacy questions? Email privacy&#64;skinvision.com</p>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .page { padding-top: 100px; }
    .hero { background: linear-gradient(135deg, #167D7E, #2BB1B8); padding: 60px 20px; text-align: center; color: white; }
    .hero h1 { font-size: 36px; margin-bottom: 10px; }
    .hero p { opacity: 0.9; font-size: 14px; }
    .content { padding: 60px 20px; }
    .container { max-width: 700px; margin: 0 auto; }
    h2 { font-size: 20px; color: #167D7E; margin: 35px 0 12px; }
    h2:first-child { margin-top: 0; }
    p { color: #555; line-height: 1.8; }
  `]
})
export class PrivacyComponent {}
