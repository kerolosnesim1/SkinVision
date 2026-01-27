import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [FormsModule, CommonModule],
  template: `
    <div class="page">
      <section class="hero">
        <h1>Contact Us</h1>
        <p>We're here to help</p>
      </section>

      <section class="content">
        <div class="container">
          <div class="contact-info">
            <div class="info-item"><span>📧</span><div><strong>Email</strong><p>support&#64;skinvision.com</p></div></div>
            <div class="info-item"><span>📞</span><div><strong>Phone</strong><p>+20 123 456 7890</p></div></div>
            <div class="info-item"><span>📍</span><div><strong>Address</strong><p>Cairo, Egypt</p></div></div>
          </div>

          <form (ngSubmit)="onSubmit()" class="form">
            <div class="form-row">
              <input type="text" [(ngModel)]="form.name" name="name" placeholder="Your Name" required>
              <input type="email" [(ngModel)]="form.email" name="email" placeholder="Your Email" required>
            </div>
            <textarea [(ngModel)]="form.message" name="message" placeholder="Your Message" rows="4" required></textarea>
            <button type="submit">Send Message</button>
          </form>

          <div *ngIf="submitted" class="success">Message sent! We'll get back to you soon.</div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .page { padding-top: 100px; }
    .hero { background: linear-gradient(135deg, #167D7E, #2BB1B8); padding: 60px 20px; text-align: center; color: white; }
    .hero h1 { font-size: 36px; margin-bottom: 10px; }
    .hero p { opacity: 0.9; }
    .content { padding: 60px 20px; }
    .container { max-width: 600px; margin: 0 auto; }
    .contact-info { display: flex; justify-content: center; gap: 40px; margin-bottom: 40px; flex-wrap: wrap; }
    .info-item { display: flex; gap: 12px; align-items: flex-start; }
    .info-item span { font-size: 24px; }
    .info-item strong { display: block; color: #333; font-size: 14px; }
    .info-item p { margin: 0; color: #167D7E; font-size: 14px; }
    .form { display: flex; flex-direction: column; gap: 15px; }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
    .form input, .form textarea { padding: 14px 16px; border: 2px solid #e5e5e5; border-radius: 10px; font-size: 15px; font-family: inherit; }
    .form input:focus, .form textarea:focus { outline: none; border-color: #167D7E; }
    .form button { padding: 14px; background: linear-gradient(135deg, #167D7E, #2BB1B8); color: white; border: none; border-radius: 10px; font-size: 16px; font-weight: 600; cursor: pointer; }
    .form button:hover { opacity: 0.9; }
    .success { margin-top: 20px; padding: 15px; background: #d4edda; color: #155724; border-radius: 10px; text-align: center; }
    @media (max-width: 600px) { .form-row { grid-template-columns: 1fr; } .contact-info { flex-direction: column; align-items: center; } }
  `]
})
export class ContactComponent {
  form = { name: '', email: '', message: '' };
  submitted = false;

  onSubmit() {
    this.submitted = true;
    setTimeout(() => this.submitted = false, 5000);
    this.form = { name: '', email: '', message: '' };
  }
}
