import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [FormsModule, CommonModule],
  template: `
    <div class="page">
      <section class="hero-section">
        <div class="container">
          <h1>Contact Us</h1>
          <p class="lead">Have questions? We'd love to hear from you.</p>
        </div>
      </section>

      <section class="content-section">
        <div class="container">
          <div class="contact-grid">
            <div class="contact-form-wrapper">
              <h2>Send us a message</h2>
              <form (ngSubmit)="onSubmit()" class="contact-form">
                <div class="form-row">
                  <div class="form-group">
                    <label>Full Name</label>
                    <input type="text" [(ngModel)]="form.name" name="name" placeholder="Your name" required>
                  </div>
                  <div class="form-group">
                    <label>Email</label>
                    <input type="email" [(ngModel)]="form.email" name="email" placeholder="your@email.com" required>
                  </div>
                </div>
                <div class="form-group">
                  <label>Subject</label>
                  <select [(ngModel)]="form.subject" name="subject">
                    <option value="general">General Inquiry</option>
                    <option value="support">Technical Support</option>
                    <option value="feedback">Feedback</option>
                    <option value="partnership">Partnership</option>
                  </select>
                </div>
                <div class="form-group">
                  <label>Message</label>
                  <textarea [(ngModel)]="form.message" name="message" rows="5" 
                            placeholder="How can we help you?" required></textarea>
                </div>
                <button type="submit" class="btn btn-primary" [disabled]="submitted">
                  {{ submitted ? 'Message Sent!' : 'Send Message' }}
                </button>
              </form>
            </div>

            <aside class="contact-info">
              <div class="info-card">
                <div class="info-icon">📧</div>
                <h4>Email</h4>
                <p>support&#64;skinvision.com</p>
              </div>
              <div class="info-card">
                <div class="info-icon">📍</div>
                <h4>Location</h4>
                <p>Cairo, Egypt</p>
              </div>
              <div class="info-card">
                <div class="info-icon">⏰</div>
                <h4>Response Time</h4>
                <p>Within 24-48 hours</p>
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

    .contact-grid {
      display: grid;
      grid-template-columns: 1fr 300px;
      gap: 48px;
    }

    .contact-form-wrapper h2 {
      font-size: 24px;
      color: var(--text-dark);
      margin: 0 0 24px 0;
    }

    .contact-form {
      background: var(--background-color);
      padding: 32px;
      border-radius: 12px;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    .form-group {
      margin-bottom: 20px;
    }

    .form-group label {
      display: block;
      font-size: 14px;
      font-weight: 600;
      color: var(--text-dark);
      margin-bottom: 8px;
    }

    .form-group input,
    .form-group select,
    .form-group textarea {
      width: 100%;
      padding: 12px 14px;
      border: 2px solid var(--border-color);
      border-radius: 8px;
      font-size: 15px;
      transition: border-color 0.2s;
    }

    .form-group input:focus,
    .form-group select:focus,
    .form-group textarea:focus {
      outline: none;
      border-color: var(--primary-color);
    }

    .form-group textarea {
      resize: vertical;
    }

    .btn {
      display: inline-block;
      padding: 14px 28px;
      background: var(--primary-color);
      color: white;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      font-size: 15px;
      cursor: pointer;
      transition: background 0.2s;
    }

    .btn:hover:not(:disabled) {
      background: #126465;
    }

    .btn:disabled {
      background: #28a745;
    }

    .contact-info {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .info-card {
      background: white;
      padding: 24px;
      border-radius: 12px;
      border: 1px solid var(--border-color);
    }

    .info-icon {
      font-size: 28px;
      margin-bottom: 12px;
    }

    .info-card h4 {
      font-size: 16px;
      color: var(--text-dark);
      margin: 0 0 8px 0;
    }

    .info-card p {
      font-size: 14px;
      color: var(--text-light);
      margin: 0;
    }

    @media (max-width: 768px) {
      .contact-grid {
        grid-template-columns: 1fr;
      }

      .form-row {
        grid-template-columns: 1fr;
      }

      .contact-info {
        flex-direction: row;
        flex-wrap: wrap;
      }

      .info-card {
        flex: 1;
        min-width: 140px;
      }
    }
  `]
})
export class ContactComponent {
  form = {
    name: '',
    email: '',
    subject: 'general',
    message: ''
  };
  submitted = false;

  onSubmit() {
    if (this.form.name && this.form.email && this.form.message) {
      this.submitted = true;
      setTimeout(() => {
        this.form = { name: '', email: '', subject: 'general', message: '' };
        this.submitted = false;
      }, 3000);
    }
  }
}
