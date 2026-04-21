import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterLink, CommonModule],
  template: `
    <!-- Hero Section (NEW) -->
    <section class="hero">
      <div class="hero-bg-accent"></div>
      <div class="container hero-container">
        <div class="hero-content">
          <div class="badge-wrapper">
            <span class="hero-badge">
              <span class="badge-dot"></span>
              AI-Powered Dermatology Platform
            </span>
          </div>
          <h1>
            Precision Dermatology
            <span class="gradient-text">Powered by AI</span>
          </h1>
          <p class="hero-text">
            Elevate your diagnostic accuracy with our intelligent dermatological assistant. 
            Instant analysis, risk assessment, and professional reporting in one secure workflow.
          </p>
          <div class="hero-actions">
            <a routerLink="/register" class="btn btn-primary btn-lg">
              Get Started
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </a>
            <a routerLink="/login" class="btn btn-outline btn-lg">Doctor Login</a>
          </div>
          <div class="trust-indicator">
            <div class="trust-avatars">
              <span>👨‍⚕️</span>
              <span>👩‍⚕️</span>
              <span>👨‍⚕️</span>
            </div>
            <p>Trusted by <strong>Best Dermatologists</strong></p>
          </div>
        </div>
        
        <div class="hero-visual">
          <div class="interface-card main-card">
            <div class="card-header">
              <div class="dots">
                <span></span><span></span><span></span>
              </div>
              <span class="header-title">SkinVision AI Analysis</span>
            </div>
            <div class="card-body">
              <div class="scan-area">
                <div class="scan-line"></div>
                <div class="scan-overlay"></div>
                <div class="lesion-spot"></div>
              </div>
              <div class="analysis-results">
                <div class="result-row">
                  <span class="label">Diagnosis</span>
                  <span class="value highlight">Melanocytic Nevus</span>
                </div>
                <div class="result-row">
                  <span class="label">Confidence</span>
                  <div class="confidence-bar">
                    <div class="fill" style="width: 98%"></div>
                  </div>
                  <span class="value">98%</span>
                </div>
              </div>
            </div>
          </div>
          
          <div class="floating-badge badge-top">
            <span class="icon">⚡</span>
            <div class="text">
              <span class="title">Instant</span>
              <span class="subtitle">Analysis</span>
            </div>
          </div>
          
          <div class="floating-badge badge-bottom">
            <span class="icon"></span>
            <div class="text">
              <span class="title">Lesion
</span>
              <span class="subtitle">Detected</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section (OLD) -->
    <section class="features">
      <div class="container">
        <div class="section-header">
          <span class="section-tag">Features</span>
          <h2>Everything You Need for<br>Modern Dermatology Practice</h2>
        </div>
        
        <div class="features-grid">
          <div class="feature-card featured">
            <div class="feature-icon-wrapper">
              <span class="feature-icon">🤖</span>
            </div>
            <h3>AI-Powered Analysis</h3>
            <p>Advanced deep learning model trained to identify common skin conditions from dermascope images.</p>
          </div>
          <div class="feature-card featured">
            <div class="feature-icon-wrapper">
              <span class="feature-icon">📷</span>
            </div>
            <h3>Image Capture</h3>
            <p>Upload multiple dermascope images per examination for comprehensive analysis.</p>
          </div>
          <div class="feature-card featured">
            <div class="feature-icon-wrapper">
              <span class="feature-icon">📋</span>
            </div>
            <h3>Digital Records</h3>
            <p>Store all examinations digitally with searchable history and easy retrieval.</p>
          </div>
          <div class="feature-card featured">
            <div class="feature-icon-wrapper">
              <span class="feature-icon">📄</span>
            </div>
            <h3>PDF Reports</h3>
            <p>Generate professional medical reports with one click to share with patients.</p>
          </div>
          <div class="feature-card featured">
            <div class="feature-icon-wrapper">
              <span class="feature-icon">🔒</span>
            </div>
            <h3>Secure & Private</h3>
            <p>All data encrypted and stored securely following healthcare privacy standards.</p>
          </div>
          <div class="feature-card featured">
            <div class="feature-icon-wrapper">
              <span class="feature-icon">⚡</span>
            </div>
            <h3>Fast & Simple</h3>
            <p>Intuitive interface designed for busy clinicians. No training required.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- How It Works (OLD) -->
    <section class="workflow">
      <div class="container">
        <div class="section-header">
          <span class="section-tag">How It Works</span>
          <h2>Simple 4-Step Workflow</h2>
        </div>
        
        <div class="workflow-steps">
          <div class="workflow-step">
            <div class="step-number">01</div>
            <div class="step-content">
              <h3>Start Examination</h3>
              <p>Enter patient details and reason for visit</p>
            </div>
          </div>
          <div class="workflow-connector"></div>
          <div class="workflow-step">
            <div class="step-number">02</div>
            <div class="step-content">
              <h3>Capture Images</h3>
              <p>Upload dermascope images of the affected area</p>
            </div>
          </div>
          <div class="workflow-connector"></div>
          <div class="workflow-step">
            <div class="step-number">03</div>
            <div class="step-content">
              <h3>AI Analysis</h3>
              <p>Get instant classification from our AI model</p>
            </div>
          </div>
          <div class="workflow-connector"></div>
          <div class="workflow-step">
            <div class="step-number">04</div>
            <div class="step-content">
              <h3>Complete & Report</h3>
              <p>Record diagnosis and generate PDF report</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- AI Section (NEW) with Deep Learning Animation -->
    <section class="ai-section">
      <div class="container">
        <div class="ai-content">
          <div class="ai-text">
            <span class="section-tag">AI Technology</span>
            <h2>Powered by Deep Learning</h2>
            <p>Our AI model is trained on dermatological images to assist in identifying common skin conditions. It serves as a supportive tool for your clinical expertise.</p>
            <ul class="ai-list">
              <li>
                <span class="check">✓</span>
                Trained on diverse dermatological dataset
              </li>
              <li>
                <span class="check">✓</span>
                Identifies 7+ common skin conditions
              </li>
              <li>
                <span class="check">✓</span>
                Continuous learning and improvement
              </li>
              <li>
                <span class="check">✓</span>
                Advisory tool - supports your diagnosis
              </li>
            </ul>
          </div>
          
          <div class="ai-visual">
            <!-- Deep Learning Neural Network Animation -->
            <div class="neural-network-container">
              <svg class="neural-network" viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
                <!-- Layer 1: Input Layer -->
                <g class="layer input-layer">
                  <circle cx="60" cy="60" r="18" class="node node-input"/>
                  <circle cx="60" cy="150" r="18" class="node node-input"/>
                  <circle cx="60" cy="240" r="18" class="node node-input"/>
                  <text x="60" y="64" class="node-label">Img</text>
                  <text x="60" y="154" class="node-label">Img</text>
                  <text x="60" y="244" class="node-label">Img</text>
                </g>

                <!-- Layer 2: Hidden Layer 1 -->
                <g class="layer hidden-layer-1">
                  <circle cx="160" cy="50" r="20" class="node node-hidden"/>
                  <circle cx="160" cy="110" r="20" class="node node-hidden"/>
                  <circle cx="160" cy="170" r="20" class="node node-hidden"/>
                  <circle cx="160" cy="230" r="20" class="node node-hidden"/>
                </g>

                <!-- Layer 3: Hidden Layer 2 -->
                <g class="layer hidden-layer-2">
                  <circle cx="260" cy="80" r="20" class="node node-hidden"/>
                  <circle cx="260" cy="150" r="20" class="node node-hidden"/>
                  <circle cx="260" cy="220" r="20" class="node node-hidden"/>
                </g>

                <!-- Layer 4: Output Layer -->
                <g class="layer output-layer">
                  <circle cx="350" cy="100" r="22" class="node node-output"/>
                  <circle cx="350" cy="200" r="22" class="node node-output"/>
                </g>

                <!-- Connections - Layer 1 to 2 -->
                <g class="connections conn-1-2">
                  <path d="M60 60 Q110 50 160 50" class="connection"/>
                  <path d="M60 60 Q110 80 160 110" class="connection"/>
                  <path d="M60 60 Q110 120 160 170" class="connection"/>
                  <path d="M60 60 Q110 160 160 230" class="connection"/>
                  <path d="M60 150 Q110 40 160 50" class="connection"/>
                  <path d="M60 150 Q110 80 160 110" class="connection"/>
                  <path d="M60 150 Q110 120 160 170" class="connection"/>
                  <path d="M60 150 Q110 160 160 230" class="connection"/>
                  <path d="M60 240 Q110 50 160 50" class="connection"/>
                  <path d="M60 240 Q110 80 160 110" class="connection"/>
                  <path d="M60 240 Q110 120 160 170" class="connection"/>
                  <path d="M60 240 Q110 160 160 230" class="connection"/>
                </g>

                <!-- Connections - Layer 2 to 3 -->
                <g class="connections conn-2-3">
                  <path d="M160 50 Q210 65 260 80" class="connection"/>
                  <path d="M160 50 Q210 115 260 150" class="connection"/>
                  <path d="M160 50 Q210 165 260 220" class="connection"/>
                  <path d="M160 110 Q210 65 260 80" class="connection"/>
                  <path d="M160 110 Q210 115 260 150" class="connection"/>
                  <path d="M160 110 Q210 165 260 220" class="connection"/>
                  <path d="M160 170 Q210 65 260 80" class="connection"/>
                  <path d="M160 170 Q210 115 260 150" class="connection"/>
                  <path d="M160 170 Q210 165 260 220" class="connection"/>
                  <path d="M160 230 Q210 65 260 80" class="connection"/>
                  <path d="M160 230 Q210 115 260 150" class="connection"/>
                  <path d="M160 230 Q210 165 260 220" class="connection"/>
                </g>

                <!-- Connections - Layer 3 to 4 -->
                <g class="connections conn-3-4">
                  <path d="M260 80 Q305 90 350 100" class="connection"/>
                  <path d="M260 80 Q305 150 350 200" class="connection"/>
                  <path d="M260 150 Q305 90 350 100" class="connection"/>
                  <path d="M260 150 Q305 150 350 200" class="connection"/>
                  <path d="M260 220 Q305 90 350 100" class="connection"/>
                  <path d="M260 220 Q305 150 350 200" class="connection"/>
                </g>

                <!-- Data Packets Animation -->
                <g class="data-packets">
                  <circle r="4" class="packet packet-1">
                    <animateMotion dur="2s" repeatCount="indefinite" path="M60 60 Q110 50 160 50"/>
                    <animate attributeName="opacity" values="0;1;1;0" dur="2s" repeatCount="indefinite"/>
                  </circle>
                  <circle r="4" class="packet packet-2">
                    <animateMotion dur="2.3s" repeatCount="indefinite" path="M60 150 Q110 120 160 170"/>
                    <animate attributeName="opacity" values="0;1;1;0" dur="2.3s" repeatCount="indefinite"/>
                  </circle>
                  <circle r="4" class="packet packet-3">
                    <animateMotion dur="1.8s" repeatCount="indefinite" path="M60 240 Q110 160 160 230"/>
                    <animate attributeName="opacity" values="0;1;1;0" dur="1.8s" repeatCount="indefinite"/>
                  </circle>
                  <circle r="4" class="packet packet-4">
                    <animateMotion dur="2.1s" repeatCount="indefinite" path="M160 110 Q210 115 260 150"/>
                    <animate attributeName="opacity" values="0;1;1;0" dur="2.1s" repeatCount="indefinite"/>
                  </circle>
                  <circle r="4" class="packet packet-5">
                    <animateMotion dur="2.5s" repeatCount="indefinite" path="M260 150 Q305 150 350 200"/>
                    <animate attributeName="opacity" values="0;1;1;0" dur="2.5s" repeatCount="indefinite"/>
                  </circle>
                </g>

                <!-- Processing Particles -->
                <g class="particles">
                  <circle r="2" class="particle particle-1">
                    <animate attributeName="opacity" values="0;1;0" dur="1.5s" repeatCount="indefinite"/>
                    <animateTransform attributeName="transform" type="scale" values="0.5;1.5;0.5" dur="1.5s" repeatCount="indefinite"/>
                  </circle>
                  <circle r="2" class="particle particle-2">
                    <animate attributeName="opacity" values="0;1;0" dur="1.8s" repeatCount="indefinite"/>
                    <animateTransform attributeName="transform" type="scale" values="0.5;1.5;0.5" dur="1.8s" repeatCount="indefinite"/>
                  </circle>
                  <circle r="2" class="particle particle-3">
                    <animate attributeName="opacity" values="0;1;0" dur="2s" repeatCount="indefinite"/>
                    <animateTransform attributeName="transform" type="scale" values="0.5;1.5;0.5" dur="2s" repeatCount="indefinite"/>
                  </circle>
                </g>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section (OLD) -->
    <section class="cta">
      <div class="container">
        <div class="cta-card">
          <h2>Ready to Modernize Your Practice?</h2>
          <p>Join dermatologists using AI to enhance their diagnostic workflow.</p>
          <div class="cta-buttons">
            <a routerLink="/register" class="btn btn-white">Get Started</a>
            <a routerLink="/contact" class="btn btn-ghost">Contact Us</a>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer (OLD) -->
    <footer class="footer">
      <div class="container">
        <div class="footer-grid">
          <div class="footer-brand">
            <div class="footer-logo">
              <span class="logo-mark">S</span>
              <span>SkinVision</span>
            </div>
            <p>AI-powered dermatology examination tool for modern medical practices.</p>
          </div>
          <div class="footer-links">
            <div class="footer-col">
              <h4>Product</h4>
              <a routerLink="/register">Get Started</a>
              <a routerLink="/login">Sign In</a>
              <a routerLink="/about">About</a>
            </div>
            <div class="footer-col">
              <h4>Support</h4>
              <a routerLink="/contact">Contact</a>
              <a href="mailto:support@skinvision.com">Email Us</a>
            </div>
            <div class="footer-col">
              <h4>Legal</h4>
              <a routerLink="/terms">Terms of Service</a>
              <a routerLink="/privacy">Privacy Policy</a>
            </div>
          </div>
        </div>
        <div class="footer-bottom">
          <p>&copy; 2026 SkinVision. All rights reserved.</p>
          <p class="footer-disclaimer">For professional medical use only. AI analysis is advisory.</p>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    /* Global Variables Re-enforcement */
    :host {
      --primary-color: #167D7E;
      --primary-dark: #126364;
      --secondary-color: #2BB1B8;
      --accent-color: #E8F5F6;
      --text-dark: #1F2937;
      --text-light: #6B7280;
      --white: #FFFFFF;
      --glass-bg: rgba(255, 255, 255, 0.9);
      --glass-border: rgba(255, 255, 255, 0.2);
    }

    /* Base Layout */
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 24px;
    }

    .section-header {
      text-align: center;
      margin-bottom: 60px;
    }

    .section-tag {
      display: inline-block;
      padding: 6px 16px;
      background: var(--accent-color);
      color: var(--primary-color);
      border-radius: 100px;
      font-size: 13px;
      font-weight: 600;
      margin-bottom: 20px;
      letter-spacing: 0.5px;
      text-transform: uppercase;
    }

    .section-header h2 {
      font-size: 40px;
      color: var(--text-dark);
      line-height: 1.2;
      font-weight: 800;
      margin: 0;
    }

    /* Enhanced Hero Section (NEW Styles) */
    .hero {
      position: relative;
      min-height: 100vh;
      display: flex;
      align-items: center;
      padding: 120px 0 80px;
      overflow: hidden;
      background: linear-gradient(135deg, #F8FAFC 0%, #FFFFFF 100%);
    }

    .hero-bg-accent {
      position: absolute;
      top: -20%;
      right: -10%;
      width: 800px;
      height: 800px;
      background: radial-gradient(circle, rgba(43, 177, 184, 0.08) 0%, transparent 70%);
      pointer-events: none;
    }

    .hero-container {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 80px;
      align-items: center;
      position: relative;
      z-index: 10;
    }

    .hero-content {
      max-width: 600px;
    }

    .hero-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      background: var(--white);
      border: 1px solid rgba(22, 125, 126, 0.15);
      border-radius: 100px;
      font-size: 13px;
      font-weight: 600;
      color: var(--primary-color);
      margin-bottom: 32px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.03);
    }

    .badge-dot {
      width: 6px;
      height: 6px;
      background: var(--primary-color);
      border-radius: 50%;
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0% { box-shadow: 0 0 0 0 rgba(22, 125, 126, 0.4); }
      70% { box-shadow: 0 0 0 6px rgba(22, 125, 126, 0); }
      100% { box-shadow: 0 0 0 0 rgba(22, 125, 126, 0); }
    }

    .hero h1 {
      font-size: 60px;
      line-height: 1.1;
      color: var(--text-dark);
      margin: 0 0 24px 0;
      font-weight: 800;
      letter-spacing: -1.5px;
    }

    .gradient-text {
      background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .hero-text {
      font-size: 20px;
      line-height: 1.6;
      color: var(--text-light);
      margin: 0 0 40px 0;
    }

    .hero-actions {
      display: flex;
      gap: 16px;
      margin-bottom: 48px;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      padding: 16px 32px;
      border-radius: 12px;
      font-size: 16px;
      font-weight: 600;
      text-decoration: none;
      transition: all 0.2s ease;
      cursor: pointer;
    }

    .btn-primary {
      background: var(--primary-color);
      color: white;
      box-shadow: 0 10px 25px rgba(22, 125, 126, 0.25);
    }

    .btn-primary:hover {
      background: var(--primary-dark);
      transform: translateY(-2px);
      box-shadow: 0 15px 35px rgba(22, 125, 126, 0.35);
    }

    .btn-outline {
      background: white;
      color: var(--text-dark);
      border: 1px solid rgba(0,0,0,0.1);
    }

    .btn-outline:hover {
      border-color: var(--primary-color);
      color: var(--primary-color);
      background: var(--accent-color);
    }

    .trust-indicator {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .trust-avatars {
      display: flex;
      margin-left: 10px;
    }

    .trust-avatars span {
      width: 36px;
      height: 36px;
      background: white;
      border: 3px solid white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-left: -12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      font-size: 18px;
    }

    .trust-indicator p {
      font-size: 14px;
      color: var(--text-light);
      margin: 0;
    }

    .trust-indicator strong {
      color: var(--text-dark);
    }

    /* Hero Visual - Glassmorphism Interface (NEW Styles) */
    .hero-visual {
      position: relative;
      height: 500px;
      display: flex;
      align-items: center;
      justify-content: center;
      perspective: 1000px;
    }

    .interface-card {
      background: white;
      border-radius: 20px;
      box-shadow: 
        0 20px 50px rgba(0,0,0,0.1),
        0 0 0 1px rgba(0,0,0,0.05);
      overflow: hidden;
      width: 400px;
      transform: rotateY(-10deg) rotateX(5deg);
      transition: transform 0.5s ease;
    }

    .hero-visual:hover .interface-card {
      transform: rotateY(-5deg) rotateX(2deg);
    }

    .card-header {
      padding: 16px 20px;
      background: #FAFAFA;
      border-bottom: 1px solid #EEEEEE;
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .dots {
      display: flex;
      gap: 6px;
    }

    .dots span {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: #E5E7EB;
    }

    .dots span:nth-child(1) { background: #EF4444; }
    .dots span:nth-child(2) { background: #F59E0B; }
    .dots span:nth-child(3) { background: #10B981; }

    .header-title {
      font-size: 12px;
      font-weight: 600;
      color: #9CA3AF;
      letter-spacing: 0.5px;
    }

    .card-body {
      padding: 24px;
    }

    .scan-area {
      height: 200px;
      background: linear-gradient(135deg, #FFE4C4, #DEB887);
      border-radius: 12px;
      margin-bottom: 24px;
      position: relative;
      overflow: hidden;
    }

    .scan-line {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 2px;
      background: var(--primary-color);
      box-shadow: 0 0 15px var(--primary-color);
      animation: scan 3s infinite linear;
      z-index: 5;
    }

    .scan-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(180deg, rgba(22, 125, 126, 0.1) 0%, transparent 100%);
      transform-origin: top;
      animation: scan-overlay 3s infinite linear;
      z-index: 2;
    }

    .lesion-spot {
      position: absolute;
      top: 45%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 42px;
      height: 36px;
      background: radial-gradient(circle at 30% 30%, #5D4037, #3E2723);
      border-radius: 40% 60% 60% 40% / 50% 60% 40% 50%;
      box-shadow: 
        inset 2px 2px 4px rgba(255,255,255,0.1),
        0 0 4px rgba(62, 39, 35, 0.3);
      opacity: 0.85;
      z-index: 1;
    }

    @keyframes scan {
      0% { top: 0; }
      100% { top: 100%; }
    }

    .analysis-results {
      background: #F8FAFC;
      border-radius: 12px;
      padding: 16px;
    }

    .result-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
    }

    .result-row:last-child {
      margin-bottom: 0;
    }

    .result-row .label {
      font-size: 13px;
      color: var(--text-light);
    }

    .result-row .value {
      font-size: 14px;
      font-weight: 600;
      color: var(--text-dark);
    }

    .result-row .value.highlight {
      color: var(--primary-color);
    }

    .confidence-bar {
      flex: 1;
      height: 6px;
      background: #E5E7EB;
      border-radius: 100px;
      margin: 0 12px;
      overflow: hidden;
    }

    .confidence-bar .fill {
      height: 100%;
      background: #10B981;
      border-radius: 100px;
    }

    /* Floating Badges */
    .floating-badge {
      position: absolute;
      background: white;
      padding: 16px 24px;
      border-radius: 16px;
      box-shadow: 0 15px 40px rgba(0,0,0,0.08);
      display: flex;
      align-items: center;
      gap: 12px;
      z-index: 20;
      animation: float 4s ease-in-out infinite;
    }

    .badge-top {
      top: 80px;
      left: -20px;
      animation-delay: 0s;
    }

    .badge-bottom {
      bottom: 60px;
      right: -10px;
      animation-delay: 2s;
    }

    .floating-badge .icon {
      font-size: 24px;
    }

    .floating-badge .text {
      display: flex;
      flex-direction: column;
    }

    .floating-badge .title {
      font-size: 14px;
      font-weight: 700;
      color: var(--text-dark);
    }

    .floating-badge .subtitle {
      font-size: 11px;
      color: var(--text-light);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    }

    /* Features (OLD Styles) */
    .features {
      padding: 100px 0;
      background: white;
    }

    .features-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 24px;
    }

    .feature-card {
      padding: 32px;
      background: #F8FAFC;
      border-radius: 16px;
      transition: all 0.3s;
    }

    .feature-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 32px rgba(0, 0, 0, 0.08);
    }

    .feature-card.featured {
      background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
      color: white;
    }

    .feature-card.featured .feature-icon-wrapper {
      background: rgba(255, 255, 255, 0.2);
    }

    .feature-card.featured h3 {
      color: white;
    }

    .feature-card.featured p {
      color: rgba(255, 255, 255, 0.9);
    }

    .feature-icon-wrapper {
      width: 56px;
      height: 56px;
      background: white;
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 20px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
    }

    .feature-icon {
      font-size: 28px;
    }

    .feature-card h3 {
      font-size: 18px;
      color: var(--text-dark);
      margin: 0 0 12px 0;
    }

    .feature-card p {
      font-size: 14px;
      color: var(--text-light);
      line-height: 1.6;
      margin: 0;
    }

    /* Workflow (OLD Styles) */
    .workflow {
      padding: 100px 0;
      background: #F8FAFC;
    }

    .workflow-steps {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
    }

    .workflow-step {
      flex: 1;
      max-width: 220px;
      text-align: center;
    }

    .step-number {
      font-size: 48px;
      font-weight: 700;
      color: var(--primary-color);
      opacity: 0.3;
      margin-bottom: 16px;
    }

    .step-content h3 {
      font-size: 18px;
      color: var(--text-dark);
      margin: 0 0 8px 0;
    }

    .step-content p {
      font-size: 14px;
      color: var(--text-light);
      margin: 0;
    }

    .workflow-connector {
      width: 60px;
      height: 2px;
      background: linear-gradient(90deg, var(--primary-color), transparent);
      margin-top: 36px;
      opacity: 0.3;
    }

    /* AI Section (OLD Styles) */
    .ai-section {
      padding: 100px 0;
      background: white;
    }

    .ai-content {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 80px;
      align-items: center;
    }

    .ai-text h2 {
      font-size: 36px;
      color: var(--text-dark);
      margin: 16px 0;
    }

    .ai-text > p {
      font-size: 16px;
      color: var(--text-light);
      line-height: 1.7;
      margin-bottom: 32px;
    }

    .ai-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .ai-list li {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 0;
      font-size: 15px;
      color: var(--text-dark);
    }

    .check {
      width: 24px;
      height: 24px;
      background: rgba(22, 125, 126, 0.1);
      color: var(--primary-color);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: 700;
    }

    .ai-visual {
      display: flex;
      justify-content: center;
      align-items: center;
    }

    /* Neural Network Animation Styles */
    .neural-network-container {
      position: relative;
      width: 400px;
      height: 300px;
      background: linear-gradient(145deg, #E8F5F6 0%, #D4EDEA 50%, #C9E6E2 100%);
      border-radius: 20px;
      padding: 20px;
      box-shadow: 
        0 25px 60px rgba(22, 125, 126, 0.2),
        0 10px 25px rgba(22, 125, 126, 0.1),
        0 0 0 1px rgba(22, 125, 126, 0.08);
    }

    .neural-network {
      width: 100%;
      height: 100%;
    }

    /* Network Nodes */
    .node {
      transition: all 0.3s ease;
    }

    .node-input {
      fill: #167D7E;
      filter: drop-shadow(0 0 8px rgba(22, 125, 126, 0.5));
    }

    .node-hidden {
      fill: #2BB1B8;
      filter: drop-shadow(0 0 10px rgba(43, 177, 184, 0.5));
      animation: nodePulse 2s ease-in-out infinite;
    }

    .node-output {
      fill: #167D7E;
      filter: drop-shadow(0 0 12px rgba(22, 125, 126, 0.6));
      animation: nodePulse 2s ease-in-out infinite 0.5s;
    }

    @keyframes nodePulse {
      0%, 100% {
        transform: scale(1);
        filter: drop-shadow(0 0 8px currentColor);
      }
      50% {
        transform: scale(1.1);
        filter: drop-shadow(0 0 20px currentColor);
      }
    }

    .node:hover {
      transform: scale(1.2);
      cursor: pointer;
    }

    /* Node Labels */
    .node-label {
      font-size: 8px;
      fill: #167D7E;
      font-weight: 600;
      text-anchor: middle;
    }

    /* Connections */
    .connection {
      fill: none;
      stroke: rgba(22, 125, 126, 0.3);
      stroke-width: 1.5;
      stroke-linecap: round;
    }

    .connections path {
      stroke-dasharray: 4 2;
      animation: dashFlow 1s linear infinite;
    }

    .conn-1-2 path {
      animation-delay: 0s;
    }

    .conn-2-3 path {
      animation-delay: 0.3s;
    }

    .conn-3-4 path {
      animation-delay: 0.6s;
    }

    @keyframes dashFlow {
      to {
        stroke-dashoffset: -12;
      }
    }

    /* Data Packets */
    .packet {
      fill: #167D7E;
      filter: drop-shadow(0 0 6px rgba(22, 125, 126, 0.8));
    }

    .packet-1 { fill: #167D7E; }
    .packet-2 { fill: #2BB1B8; }
    .packet-3 { fill: #3CC4C8; }
    .packet-4 { fill: #4DD4D8; }
    .packet-5 { fill: #167D7E; }

    /* Particles */
    .particle {
      fill: #167D7E;
    }

    .particle-1 {
      transform-origin: 160px 110px;
    }

    .particle-2 {
      transform-origin: 260px 150px;
    }

    .particle-3 {
      transform-origin: 350px 150px;
    }

    /* CTA (OLD Styles) */
    .cta {
      padding: 100px 0;
      background: #F8FAFC;
    }

    .cta-card {
      background: linear-gradient(135deg, var(--primary-color), #1a8a8b);
      padding: 60px;
      border-radius: 24px;
      text-align: center;
    }

    .cta-card h2 {
      font-size: 32px;
      color: white;
      margin: 0 0 12px 0;
    }

    .cta-card p {
      font-size: 16px;
      color: rgba(255, 255, 255, 0.85);
      margin: 0 0 32px 0;
    }

    .cta-buttons {
      display: flex;
      justify-content: center;
      gap: 16px;
    }

    .btn-white {
      background: white;
      color: var(--primary-color);
    }

    .btn-white:hover {
      background: #f5f5f5;
    }

    .btn-ghost {
      background: transparent;
      color: white;
      border: 2px solid rgba(255, 255, 255, 0.3);
    }

    .btn-ghost:hover {
      border-color: white;
    }

    /* Footer (OLD Styles) */
    .footer {
      background: #0f172a;
      color: white;
      padding: 60px 0 24px;
    }

    .footer-grid {
      display: grid;
      grid-template-columns: 1.5fr 2fr;
      gap: 60px;
      padding-bottom: 40px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .footer-logo {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 20px;
      font-weight: 700;
      margin-bottom: 16px;
    }

    .logo-mark {
      width: 36px;
      height: 36px;
      background: var(--primary-color);
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
    }

    .footer-brand p {
      font-size: 14px;
      color: rgba(255, 255, 255, 0.6);
      line-height: 1.6;
      max-width: 280px;
    }

    .footer-links {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 40px;
    }

    .footer-col h4 {
      font-size: 13px;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: rgba(255, 255, 255, 0.4);
      margin: 0 0 20px 0;
    }

    .footer-col a {
      display: block;
      color: rgba(255, 255, 255, 0.7);
      text-decoration: none;
      font-size: 14px;
      margin-bottom: 12px;
      transition: color 0.2s;
    }

    .footer-col a:hover {
      color: white;
    }

    .footer-bottom {
      display: flex;
      justify-content: space-between;
      padding-top: 24px;
    }

    .footer-bottom p {
      font-size: 13px;
      color: rgba(255, 255, 255, 0.4);
      margin: 0;
    }

    .footer-disclaimer {
      font-style: italic;
    }

    /* Responsive */
    @media (max-width: 1024px) {
      .hero-container {
        grid-template-columns: 1fr;
        text-align: center;
        gap: 50px;
      }
      
      .hero-content {
        max-width: 600px;
        margin: 0 auto;
      }

      .hero-actions {
        justify-content: center;
      }

      .trust-indicator {
        justify-content: center;
      }

      .hero-visual {
        display: none;
      }
      
      .ai-content {
        grid-template-columns: 1fr;
      }

      .features-grid, .footer-links {
        grid-template-columns: 1fr;
      }
      
      .footer-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class LandingComponent { }
