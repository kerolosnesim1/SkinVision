import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterLink, CommonModule],
  template: `
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-bg"></div>
      <div class="hero-content">
        <div class="hero-badge">AI-Powered Dermatology Platform</div>
        <h1>Your Skin Health,<br><span>Our Priority</span></h1>
        <p class="hero-subtitle">
          Get expert dermatological consultations from certified doctors, powered by 
          advanced AI diagnostics. Upload images, receive analysis, and connect with 
          specialists — all from the comfort of your home.
        </p>
        <div class="hero-buttons">
          <a routerLink="/register" class="btn-primary-lg">Get Started Free</a>
          <a routerLink="/login" class="btn-secondary-lg">Sign In</a>
        </div>
        <div class="hero-stats">
          <div class="stat">
            <span class="stat-number">10,000+</span>
            <span class="stat-label">Patients Served</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat">
            <span class="stat-number">500+</span>
            <span class="stat-label">Expert Doctors</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat">
            <span class="stat-number">98%</span>
            <span class="stat-label">Accuracy Rate</span>
          </div>
        </div>
      </div>
      <div class="hero-image">
        <div class="floating-card card-1">
          <div class="card-icon success">✓</div>
          <div class="card-text">
            <strong>Analysis Complete</strong>
            <span>No concerns detected</span>
          </div>
        </div>
        <div class="floating-card card-2">
          <div class="card-icon info">🔬</div>
          <div class="card-text">
            <strong>AI Processing</strong>
            <span>87% confidence</span>
          </div>
        </div>
        <div class="hero-illustration">
          <div class="illustration-circle"></div>
          <div class="illustration-inner">
            <div class="scan-line"></div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="features" id="features">
      <div class="section-container">
        <div class="section-header">
          <span class="section-badge">Features</span>
          <h2>Everything You Need for<br>Better Skin Health</h2>
          <p>Our comprehensive platform connects patients with dermatologists through cutting-edge technology</p>
        </div>
        
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon" style="background: linear-gradient(135deg, #167D7E, #2BB1B8);">
              <span>📸</span>
            </div>
            <h3>Easy Image Upload</h3>
            <p>Simply upload photos of your skin concerns. Our system accepts high-quality images for accurate analysis.</p>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon" style="background: linear-gradient(135deg, #2BB1B8, #4caf50);">
              <span>🤖</span>
            </div>
            <h3>AI-Powered Analysis</h3>
            <p>Advanced machine learning algorithms analyze your images and provide preliminary assessments within seconds.</p>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon" style="background: linear-gradient(135deg, #167D7E, #135f60);">
              <span>👨‍⚕️</span>
            </div>
            <h3>Expert Consultation</h3>
            <p>Certified dermatologists review your case and provide professional diagnosis and treatment plans.</p>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon" style="background: linear-gradient(135deg, #ff9800, #f44336);">
              <span>💬</span>
            </div>
            <h3>Real-time Chat</h3>
            <p>Communicate directly with your assigned doctor through our secure messaging system.</p>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon" style="background: linear-gradient(135deg, #2196f3, #167D7E);">
              <span>📋</span>
            </div>
            <h3>Digital Reports</h3>
            <p>Receive detailed PDF reports with diagnosis, treatment recommendations, and follow-up instructions.</p>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon" style="background: linear-gradient(135deg, #4caf50, #2BB1B8);">
              <span>🔒</span>
            </div>
            <h3>Secure & Private</h3>
            <p>Your medical data is encrypted and protected with enterprise-grade security standards.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- How It Works Section -->
    <section class="how-it-works">
      <div class="section-container">
        <div class="section-header">
          <span class="section-badge">Process</span>
          <h2>How SkinVision Works</h2>
          <p>Get professional dermatological care in just four simple steps</p>
        </div>
        
        <div class="steps-container">
          <div class="step">
            <div class="step-number">1</div>
            <div class="step-content">
              <h3>Create Account</h3>
              <p>Sign up and complete your medical profile with relevant health history</p>
            </div>
          </div>
          
          <div class="step-connector"></div>
          
          <div class="step">
            <div class="step-number">2</div>
            <div class="step-content">
              <h3>Submit Case</h3>
              <p>Upload clear images of your skin concern and describe your symptoms</p>
            </div>
          </div>
          
          <div class="step-connector"></div>
          
          <div class="step">
            <div class="step-number">3</div>
            <div class="step-content">
              <h3>AI + Doctor Review</h3>
              <p>Our AI analyzes your images, then a certified dermatologist reviews your case</p>
            </div>
          </div>
          
          <div class="step-connector"></div>
          
          <div class="step">
            <div class="step-number">4</div>
            <div class="step-content">
              <h3>Get Results</h3>
              <p>Receive your diagnosis, treatment plan, and follow-up recommendations</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- User Types Section -->
    <section class="user-types">
      <div class="section-container">
        <div class="user-type-grid">
          <div class="user-type-card patient-card">
            <div class="user-type-icon">👤</div>
            <h3>For Patients</h3>
            <ul>
              <li>Create and track cases easily</li>
              <li>Upload multiple skin images</li>
              <li>View AI analysis results</li>
              <li>Chat with assigned doctors</li>
              <li>Download diagnosis reports</li>
              <li>Manage medical history</li>
            </ul>
            <a routerLink="/register" class="user-type-btn">Register as Patient</a>
          </div>
          
          <div class="user-type-card doctor-card">
            <div class="user-type-icon">👨‍⚕️</div>
            <h3>For Doctors</h3>
            <ul>
              <li>Manage patient queue efficiently</li>
              <li>Access patient medical history</li>
              <li>Trigger AI analysis on images</li>
              <li>Provide diagnosis and treatment</li>
              <li>Generate professional reports</li>
              <li>Set availability status</li>
            </ul>
            <a routerLink="/register" class="user-type-btn">Join as Doctor</a>
          </div>
        </div>
      </div>
    </section>

    <!-- Trust Section -->
    <section class="trust-section">
      <div class="section-container">
        <div class="trust-grid">
          <div class="trust-item">
            <div class="trust-icon">🏥</div>
            <h4>Medical Grade</h4>
            <p>Compliant with healthcare standards</p>
          </div>
          <div class="trust-item">
            <div class="trust-icon">🔐</div>
            <h4>HIPAA Compliant</h4>
            <p>Your data is always protected</p>
          </div>
          <div class="trust-item">
            <div class="trust-icon">✅</div>
            <h4>Verified Doctors</h4>
            <p>All doctors are certified professionals</p>
          </div>
          <div class="trust-item">
            <div class="trust-icon">⚡</div>
            <h4>Fast Response</h4>
            <p>Get results within 24-48 hours</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section">
      <div class="section-container">
        <div class="cta-content">
          <h2>Ready to Take Care of Your Skin Health?</h2>
          <p>Join thousands of patients who trust SkinVision for their dermatological needs</p>
          <div class="cta-buttons">
            <a routerLink="/register" class="btn-white">Get Started Now</a>
            <a routerLink="/login" class="btn-outline">I Already Have an Account</a>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
      <div class="section-container">
        <div class="footer-content">
          <div class="footer-brand">
            <h3>SkinVision</h3>
            <p>AI-Powered Dermatology Platform</p>
          </div>
          <div class="footer-links">
            <a href="#">About Us</a>
            <a href="#">Contact</a>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
          <div class="footer-copyright">
            <p>© 2026 SkinVision. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    /* Hero Section */
    .hero {
      min-height: 90vh;
      display: grid;
      grid-template-columns: 1fr 1fr;
      align-items: center;
      padding: 60px 5%;
      position: relative;
      overflow: hidden;
      background: linear-gradient(135deg, #F0F8F9 0%, #ffffff 100%);
    }

    .hero-bg {
      position: absolute;
      top: -50%;
      right: -20%;
      width: 80%;
      height: 150%;
      background: linear-gradient(135deg, rgba(22, 125, 126, 0.05) 0%, rgba(43, 177, 184, 0.08) 100%);
      border-radius: 50%;
      z-index: 0;
    }

    .hero-content {
      z-index: 1;
      max-width: 600px;
    }

    .hero-badge {
      display: inline-block;
      padding: 8px 16px;
      background: linear-gradient(135deg, rgba(22, 125, 126, 0.1), rgba(43, 177, 184, 0.1));
      color: #167D7E;
      border-radius: 30px;
      font-size: 14px;
      font-weight: 600;
      margin-bottom: 20px;
      border: 1px solid rgba(22, 125, 126, 0.2);
    }

    .hero h1 {
      font-size: 52px;
      font-weight: 700;
      color: #333333;
      line-height: 1.2;
      margin-bottom: 20px;
    }

    .hero h1 span {
      color: #167D7E;
    }

    .hero-subtitle {
      font-size: 18px;
      color: #666666;
      line-height: 1.7;
      margin-bottom: 30px;
    }

    .hero-buttons {
      display: flex;
      gap: 15px;
      margin-bottom: 40px;
    }

    .btn-primary-lg {
      padding: 16px 32px;
      background: linear-gradient(135deg, #167D7E, #2BB1B8);
      color: white;
      text-decoration: none;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 600;
      transition: all 0.3s ease;
      box-shadow: 0 4px 15px rgba(22, 125, 126, 0.3);
    }

    .btn-primary-lg:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(22, 125, 126, 0.4);
    }

    .btn-secondary-lg {
      padding: 16px 32px;
      background: white;
      color: #167D7E;
      text-decoration: none;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 600;
      border: 2px solid #167D7E;
      transition: all 0.3s ease;
    }

    .btn-secondary-lg:hover {
      background: #167D7E;
      color: white;
    }

    .hero-stats {
      display: flex;
      align-items: center;
      gap: 30px;
      padding: 25px 30px;
      background: white;
      border-radius: 16px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
    }

    .stat {
      text-align: center;
    }

    .stat-number {
      display: block;
      font-size: 28px;
      font-weight: 700;
      color: #167D7E;
    }

    .stat-label {
      font-size: 13px;
      color: #666666;
    }

    .stat-divider {
      width: 1px;
      height: 40px;
      background: #e0e0e0;
    }

    .hero-image {
      position: relative;
      z-index: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 500px;
    }

    .hero-illustration {
      width: 350px;
      height: 350px;
      background: linear-gradient(135deg, #167D7E, #2BB1B8);
      border-radius: 50%;
      position: relative;
      box-shadow: 0 20px 60px rgba(22, 125, 126, 0.3);
    }

    .illustration-circle {
      position: absolute;
      top: -20px;
      left: -20px;
      right: -20px;
      bottom: -20px;
      border: 2px dashed rgba(22, 125, 126, 0.3);
      border-radius: 50%;
      animation: rotate 20s linear infinite;
    }

    .illustration-inner {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 280px;
      height: 280px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 50%;
      overflow: hidden;
    }

    .scan-line {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: rgba(255, 255, 255, 0.8);
      animation: scan 2s ease-in-out infinite;
    }

    @keyframes scan {
      0%, 100% { top: 0; }
      50% { top: 100%; }
    }

    @keyframes rotate {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    .floating-card {
      position: absolute;
      background: white;
      padding: 15px 20px;
      border-radius: 12px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
      display: flex;
      align-items: center;
      gap: 12px;
      animation: float 3s ease-in-out infinite;
    }

    .card-1 {
      top: 80px;
      right: 50px;
      animation-delay: 0s;
    }

    .card-2 {
      bottom: 100px;
      left: 20px;
      animation-delay: 1.5s;
    }

    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    }

    .card-icon {
      width: 40px;
      height: 40px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
    }

    .card-icon.success {
      background: rgba(76, 175, 80, 0.1);
      color: #4caf50;
    }

    .card-icon.info {
      background: rgba(33, 150, 243, 0.1);
      color: #2196f3;
    }

    .card-text {
      display: flex;
      flex-direction: column;
    }

    .card-text strong {
      font-size: 14px;
      color: #333;
    }

    .card-text span {
      font-size: 12px;
      color: #666;
    }

    /* Section Styles */
    .section-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 20px;
    }

    .section-header {
      text-align: center;
      margin-bottom: 60px;
    }

    .section-badge {
      display: inline-block;
      padding: 6px 16px;
      background: rgba(22, 125, 126, 0.1);
      color: #167D7E;
      border-radius: 20px;
      font-size: 13px;
      font-weight: 600;
      margin-bottom: 15px;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .section-header h2 {
      font-size: 40px;
      color: #333333;
      margin-bottom: 15px;
      font-weight: 700;
    }

    .section-header p {
      font-size: 18px;
      color: #666666;
      max-width: 600px;
      margin: 0 auto;
    }

    /* Features Section */
    .features {
      padding: 100px 20px;
      background: white;
    }

    .features-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 30px;
    }

    .feature-card {
      padding: 35px;
      background: #F0F8F9;
      border-radius: 16px;
      transition: all 0.3s ease;
      border: 1px solid transparent;
    }

    .feature-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 15px 40px rgba(22, 125, 126, 0.15);
      border-color: rgba(22, 125, 126, 0.2);
    }

    .feature-icon {
      width: 60px;
      height: 60px;
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 28px;
      margin-bottom: 20px;
    }

    .feature-card h3 {
      font-size: 20px;
      color: #333333;
      margin-bottom: 12px;
      font-weight: 600;
    }

    .feature-card p {
      font-size: 15px;
      color: #666666;
      line-height: 1.6;
    }

    /* How It Works Section */
    .how-it-works {
      padding: 100px 20px;
      background: linear-gradient(135deg, #F0F8F9 0%, #ffffff 100%);
    }

    .steps-container {
      display: flex;
      align-items: flex-start;
      justify-content: center;
      gap: 20px;
      flex-wrap: wrap;
    }

    .step {
      text-align: center;
      max-width: 220px;
    }

    .step-number {
      width: 60px;
      height: 60px;
      background: linear-gradient(135deg, #167D7E, #2BB1B8);
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      font-weight: 700;
      margin: 0 auto 20px;
      box-shadow: 0 8px 25px rgba(22, 125, 126, 0.3);
    }

    .step-content h3 {
      font-size: 18px;
      color: #333333;
      margin-bottom: 10px;
      font-weight: 600;
    }

    .step-content p {
      font-size: 14px;
      color: #666666;
      line-height: 1.6;
    }

    .step-connector {
      width: 60px;
      height: 2px;
      background: linear-gradient(90deg, #167D7E, #2BB1B8);
      margin-top: 30px;
    }

    /* User Types Section */
    .user-types {
      padding: 100px 20px;
      background: white;
    }

    .user-type-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 40px;
      max-width: 900px;
      margin: 0 auto;
    }

    .user-type-card {
      padding: 40px;
      border-radius: 20px;
      text-align: center;
    }

    .patient-card {
      background: linear-gradient(135deg, rgba(22, 125, 126, 0.05), rgba(43, 177, 184, 0.1));
      border: 2px solid rgba(22, 125, 126, 0.15);
    }

    .doctor-card {
      background: linear-gradient(135deg, rgba(43, 177, 184, 0.05), rgba(76, 175, 80, 0.1));
      border: 2px solid rgba(43, 177, 184, 0.15);
    }

    .user-type-icon {
      font-size: 50px;
      margin-bottom: 20px;
    }

    .user-type-card h3 {
      font-size: 24px;
      color: #333333;
      margin-bottom: 25px;
      font-weight: 600;
    }

    .user-type-card ul {
      list-style: none;
      padding: 0;
      margin: 0 0 30px 0;
      text-align: left;
    }

    .user-type-card li {
      padding: 10px 0;
      color: #555555;
      font-size: 15px;
      border-bottom: 1px solid rgba(0, 0, 0, 0.05);
      position: relative;
      padding-left: 25px;
    }

    .user-type-card li::before {
      content: "✓";
      position: absolute;
      left: 0;
      color: #167D7E;
      font-weight: bold;
    }

    .user-type-btn {
      display: inline-block;
      padding: 14px 28px;
      background: linear-gradient(135deg, #167D7E, #2BB1B8);
      color: white;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
      transition: all 0.3s ease;
    }

    .user-type-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(22, 125, 126, 0.3);
    }

    /* Trust Section */
    .trust-section {
      padding: 60px 20px;
      background: #F0F8F9;
    }

    .trust-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 30px;
    }

    .trust-item {
      text-align: center;
      padding: 25px;
    }

    .trust-icon {
      font-size: 36px;
      margin-bottom: 15px;
    }

    .trust-item h4 {
      font-size: 16px;
      color: #333333;
      margin-bottom: 8px;
      font-weight: 600;
    }

    .trust-item p {
      font-size: 14px;
      color: #666666;
    }

    /* CTA Section */
    .cta-section {
      padding: 100px 20px;
      background: linear-gradient(135deg, #167D7E, #2BB1B8);
    }

    .cta-content {
      text-align: center;
      max-width: 700px;
      margin: 0 auto;
    }

    .cta-content h2 {
      font-size: 36px;
      color: white;
      margin-bottom: 15px;
      font-weight: 700;
    }

    .cta-content p {
      font-size: 18px;
      color: rgba(255, 255, 255, 0.9);
      margin-bottom: 30px;
    }

    .cta-buttons {
      display: flex;
      justify-content: center;
      gap: 15px;
    }

    .btn-white {
      padding: 16px 32px;
      background: white;
      color: #167D7E;
      text-decoration: none;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 600;
      transition: all 0.3s ease;
    }

    .btn-white:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
    }

    .btn-outline {
      padding: 16px 32px;
      background: transparent;
      color: white;
      text-decoration: none;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 600;
      border: 2px solid white;
      transition: all 0.3s ease;
    }

    .btn-outline:hover {
      background: white;
      color: #167D7E;
    }

    /* Footer */
    .footer {
      padding: 40px 20px;
      background: #333333;
    }

    .footer-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 20px;
    }

    .footer-brand h3 {
      color: white;
      font-size: 20px;
      margin-bottom: 5px;
    }

    .footer-brand p {
      color: rgba(255, 255, 255, 0.6);
      font-size: 13px;
    }

    .footer-links {
      display: flex;
      gap: 25px;
    }

    .footer-links a {
      color: rgba(255, 255, 255, 0.7);
      text-decoration: none;
      font-size: 14px;
      transition: color 0.3s ease;
    }

    .footer-links a:hover {
      color: white;
    }

    .footer-copyright p {
      color: rgba(255, 255, 255, 0.5);
      font-size: 13px;
    }

    /* Responsive Design */
    @media (max-width: 1024px) {
      .hero {
        grid-template-columns: 1fr;
        text-align: center;
        padding: 40px 5%;
        min-height: auto;
      }

      .hero-content {
        max-width: 100%;
      }

      .hero h1 {
        font-size: 40px;
      }

      .hero-buttons {
        justify-content: center;
      }

      .hero-stats {
        justify-content: center;
      }

      .hero-image {
        display: none;
      }

      .features-grid {
        grid-template-columns: repeat(2, 1fr);
      }

      .user-type-grid {
        grid-template-columns: 1fr;
      }

      .trust-grid {
        grid-template-columns: repeat(2, 1fr);
      }

      .step-connector {
        display: none;
      }

      .steps-container {
        gap: 40px;
      }
    }

    @media (max-width: 768px) {
      .hero h1 {
        font-size: 32px;
      }

      .hero-subtitle {
        font-size: 16px;
      }

      .hero-buttons {
        flex-direction: column;
        align-items: center;
      }

      .hero-stats {
        flex-direction: column;
        gap: 15px;
      }

      .stat-divider {
        width: 40px;
        height: 1px;
      }

      .section-header h2 {
        font-size: 28px;
      }

      .features-grid {
        grid-template-columns: 1fr;
      }

      .trust-grid {
        grid-template-columns: 1fr;
      }

      .footer-content {
        flex-direction: column;
        text-align: center;
      }

      .footer-links {
        flex-wrap: wrap;
        justify-content: center;
      }

      .cta-buttons {
        flex-direction: column;
        align-items: center;
      }
    }
  `]
})
export class LandingComponent {}

