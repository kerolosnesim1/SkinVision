import { Component, OnInit } from '@angular/core';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-case-detail',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  template: `
    <div class="case-detail-container">
      <div class="page-header">
        <div>
          <h1>Case #{{ caseData.id }}</h1>
          <span class="case-status" [class]="'status-' + caseData.status.toLowerCase()">
            {{ caseData.status }}
          </span>
        </div>
        <a routerLink="/patient/cases" class="btn btn-secondary">← Back to Cases</a>
      </div>

      <div class="case-content">
        <!-- Left Side: Case Details -->
        <div class="case-info">
          <div class="card section">
            <h2>Case Information</h2>
            <div class="info-grid">
              <div class="info-item">
                <label>Submitted</label>
                <p>{{ caseData.submittedDate }}</p>
              </div>
              <div class="info-item">
                <label>Last Updated</label>
                <p>{{ caseData.lastUpdated }}</p>
              </div>
              <div class="info-item">
                <label>Affected Area</label>
                <p>{{ caseData.affectedArea }}</p>
              </div>
              <div class="info-item">
                <label>Duration</label>
                <p>{{ caseData.duration }}</p>
              </div>
            </div>

            <div class="description">
              <label>Description</label>
              <p>{{ caseData.description }}</p>
            </div>
          </div>

          <!-- Images -->
          <div class="card section">
            <h2>Uploaded Images ({{ caseData.images.length }})</h2>
            <div class="image-gallery">
              <div *ngFor="let image of caseData.images" class="gallery-item" (click)="viewImage(image)">
                <img [src]="image.url" [alt]="image.name">
                <p class="image-date">{{ image.uploadDate }}</p>
              </div>
            </div>
          </div>

          <!-- Doctor Assignment -->
          <div class="card section" *ngIf="caseData.doctor">
            <h2>Assigned Doctor</h2>
            <div class="doctor-info">
              <div class="doctor-avatar">👨‍⚕️</div>
              <div>
                <h3>{{ caseData.doctor.name }}</h3>
                <p>{{ caseData.doctor.specialization }}</p>
                <p class="doctor-meta">{{ caseData.doctor.experience }} years experience</p>
              </div>
            </div>
          </div>

          <!-- Diagnosis (if completed) -->
          <div class="card section" *ngIf="caseData.diagnosis">
            <h2>Diagnosis & Treatment Plan</h2>
            <div class="diagnosis-content">
              <div class="diagnosis-section">
                <label>Diagnosis</label>
                <p>{{ caseData.diagnosis.findings }}</p>
              </div>
              <div class="diagnosis-section">
                <label>Treatment Plan</label>
                <p>{{ caseData.diagnosis.treatment }}</p>
              </div>
              <div class="diagnosis-section">
                <label>Follow-up</label>
                <p>{{ caseData.diagnosis.followUp }}</p>
              </div>
              <button class="btn btn-primary" (click)="downloadReport()">📄 Download PDF Report</button>
            </div>
          </div>
        </div>

        <!-- Right Side: Chat -->
        <div class="chat-section">
          <div class="card chat-card">
            <h2>Messages</h2>
            
            <div class="chat-messages" #chatMessages>
              <div *ngFor="let msg of messages" 
                   class="message" 
                   [class.message-sent]="msg.sender === 'patient'"
                   [class.message-received]="msg.sender !== 'patient'">
                <div class="message-header">
                  <strong>{{ msg.senderName }}</strong>
                  <span class="message-time">{{ msg.time }}</span>
                </div>
                <div class="message-body">
                  {{ msg.text }}
                  <div *ngIf="msg.attachment" class="message-attachment">
                    📎 {{ msg.attachment }}
                  </div>
                </div>
              </div>

              <div *ngIf="messages.length === 0" class="empty-chat">
                <p>No messages yet. Start a conversation with your doctor.</p>
              </div>
            </div>

            <div class="chat-input">
              <input type="text" 
                     [(ngModel)]="newMessage" 
                     placeholder="Type your message..." 
                     (keyup.enter)="sendMessage()"
                     [disabled]="caseData.status === 'Closed'">
              <button class="btn btn-primary" 
                      (click)="sendMessage()" 
                      [disabled]="!newMessage.trim() || caseData.status === 'Closed'">
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .case-detail-container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 100px 20px 40px;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 30px;
    }

    .page-header h1 {
      color: var(--primary-color);
      margin: 0 10px 0 0;
      display: inline-block;
    }

    .case-status {
      padding: 6px 16px;
      border-radius: 16px;
      font-size: 14px;
      font-weight: 500;
    }

    .status-pending { background: #fff3cd; color: #856404; }
    .status-assigned { background: #cce5ff; color: #004085; }
    .status-inreview { background: #d1ecf1; color: #0c5460; }
    .status-completed { background: #d4edda; color: #155724; }
    .status-closed { background: #e2e3e5; color: #383d41; }

    .case-content {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 20px;
    }

    .case-info {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .section {
      margin-bottom: 0;
    }

    .section h2 {
      color: var(--primary-color);
      margin: 0 0 20px 0;
      font-size: 20px;
    }

    .info-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
      margin-bottom: 20px;
    }

    .info-item label {
      display: block;
      font-size: 12px;
      color: var(--text-light);
      margin-bottom: 5px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .info-item p {
      margin: 0;
      font-size: 16px;
      color: var(--text-dark);
      font-weight: 500;
    }

    .description {
      padding-top: 20px;
      border-top: 1px solid var(--border-color);
    }

    .description label {
      display: block;
      font-weight: 600;
      color: var(--text-dark);
      margin-bottom: 10px;
    }

    .description p {
      line-height: 1.6;
      color: var(--text-dark);
    }

    .image-gallery {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 15px;
    }

    .gallery-item {
      border: 1px solid var(--border-color);
      border-radius: 8px;
      overflow: hidden;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .gallery-item:hover {
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
      transform: translateY(-2px);
    }

    .gallery-item img {
      width: 100%;
      height: 200px;
      object-fit: cover;
    }

    .image-date {
      padding: 8px;
      font-size: 12px;
      color: var(--text-light);
      background: var(--background-color);
      margin: 0;
    }

    .doctor-info {
      display: flex;
      gap: 15px;
      align-items: center;
    }

    .doctor-avatar {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: var(--background-color);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 32px;
    }

    .doctor-info h3 {
      margin: 0 0 5px 0;
      color: var(--text-dark);
    }

    .doctor-info p {
      margin: 0;
      color: var(--text-light);
      font-size: 14px;
    }

    .doctor-meta {
      font-size: 12px !important;
    }

    .diagnosis-content {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .diagnosis-section label {
      display: block;
      font-weight: 600;
      color: var(--text-dark);
      margin-bottom: 8px;
    }

    .diagnosis-section p {
      margin: 0;
      line-height: 1.6;
      color: var(--text-dark);
    }

    .chat-card {
      position: sticky;
      top: 20px;
      display: flex;
      flex-direction: column;
      height: calc(100vh - 140px);
      max-height: 800px;
    }

    .chat-messages {
      flex: 1;
      overflow-y: auto;
      padding: 20px 0;
      display: flex;
      flex-direction: column;
      gap: 15px;
    }

    .message {
      max-width: 80%;
      padding: 12px;
      border-radius: 12px;
    }

    .message-sent {
      align-self: flex-end;
      background: var(--primary-color);
      color: var(--white);
    }

    .message-received {
      align-self: flex-start;
      background: var(--background-color);
      color: var(--text-dark);
    }

    .message-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 5px;
      font-size: 12px;
      opacity: 0.8;
    }

    .message-body {
      font-size: 14px;
      line-height: 1.5;
    }

    .message-attachment {
      margin-top: 8px;
      padding: 8px;
      background: rgba(0, 0, 0, 0.1);
      border-radius: 4px;
      font-size: 12px;
    }

    .empty-chat {
      text-align: center;
      color: var(--text-light);
      padding: 40px 20px;
    }

    .chat-input {
      display: flex;
      gap: 10px;
      padding-top: 20px;
      border-top: 1px solid var(--border-color);
    }

    .chat-input input {
      flex: 1;
    }

    @media (max-width: 1024px) {
      .case-content {
        grid-template-columns: 1fr;
      }

      .chat-card {
        position: relative;
        height: 500px;
      }
    }
  `]
})
export class CaseDetailComponent implements OnInit {
  caseId: string = '';
  newMessage: string = '';

  caseData = {
    id: '1234',
    status: 'InReview',
    submittedDate: '2024-12-20',
    lastUpdated: '2024-12-24 10:30 AM',
    affectedArea: 'Left Arm',
    duration: '2-4 weeks',
    description: 'I noticed a dark mole on my left arm that has been growing slowly over the past few weeks. It has irregular borders and seems to be getting darker. No pain or itching, but I\'m concerned about the changes.',
    images: [
      { url: 'https://via.placeholder.com/400x300/167D7E/ffffff?text=Image+1', name: 'Mole Overview', uploadDate: 'Dec 20, 2024' },
      { url: 'https://via.placeholder.com/400x300/2BB1B8/ffffff?text=Image+2', name: 'Close-up', uploadDate: 'Dec 20, 2024' },
      { url: 'https://via.placeholder.com/400x300/F0F8F9/333333?text=Image+3', name: 'Side View', uploadDate: 'Dec 20, 2024' }
    ],
    doctor: {
      name: 'Dr. Sarah Johnson',
      specialization: 'Dermatology',
      experience: 12
    },
    diagnosis: null as any
  };

  messages = [
    {
      sender: 'doctor',
      senderName: 'Dr. Sarah Johnson',
      text: 'Hello! I\'ve reviewed your case and images. Can you tell me if you\'ve noticed any changes in the past week?',
      time: '10:30 AM',
      attachment: null
    },
    {
      sender: 'patient',
      senderName: 'You',
      text: 'Hi Doctor, yes it seems slightly darker than before. Should I be concerned?',
      time: '11:15 AM',
      attachment: null
    },
    {
      sender: 'doctor',
      senderName: 'Dr. Sarah Johnson',
      text: 'I\'ve triggered an AI analysis to get additional insights. I\'ll provide my diagnosis shortly.',
      time: '11:20 AM',
      attachment: null
    }
  ];

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.caseId = this.route.snapshot.params['id'] || '1234';
  }

  sendMessage() {
    if (!this.newMessage.trim()) return;

    this.messages.push({
      sender: 'patient',
      senderName: 'You',
      text: this.newMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      attachment: null
    });

    this.newMessage = '';

    // Mock doctor response
    setTimeout(() => {
      this.messages.push({
        sender: 'doctor',
        senderName: 'Dr. Sarah Johnson',
        text: 'Thank you for the information. I\'ll review and get back to you soon.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        attachment: null
      });
    }, 2000);
  }

  viewImage(image: any) {
    alert('Image viewer: ' + image.name);
    // TODO: Implement fullscreen image viewer
  }

  downloadReport() {
    alert('PDF Report downloaded!');
    // TODO: Implement actual PDF download
  }
}

