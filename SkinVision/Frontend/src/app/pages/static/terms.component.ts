import { Component } from '@angular/core';

@Component({
  selector: 'app-terms',
  standalone: true,
  template: `
    <div class="page">
      <section class="hero">
        <h1>Terms of Service</h1>
        <p>Last updated: January 2026</p>
      </section>

      <section class="content">
        <div class="container">
          <h2>1. Acceptance of Terms</h2>
          <p>By accessing SkinVision, you agree to these Terms. If you disagree, please do not use our service.</p>

          <h2>2. Our Services</h2>
          <p>SkinVision connects patients with licensed dermatologists using AI-powered skin analysis.</p>

          <h2>3. Medical Disclaimer</h2>
          <p><strong>Important:</strong> SkinVision is not a substitute for professional medical advice. Always consult healthcare providers for medical decisions.</p>

          <h2>4. User Accounts</h2>
          <p>You must provide accurate information and maintain security of your credentials.</p>

          <h2>5. Privacy</h2>
          <p>Your data is protected with enterprise-grade security. See our Privacy Policy for details.</p>

          <h2>6. Contact</h2>
          <p>Questions? Contact us at legal&#64;skinvision.com</p>
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
    strong { color: #333; }
  `]
})
export class TermsComponent {}
