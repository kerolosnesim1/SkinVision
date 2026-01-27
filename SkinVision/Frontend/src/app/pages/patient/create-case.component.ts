import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-case',
  standalone: true,
  imports: [RouterLink, FormsModule, CommonModule],
  template: `
    <div class="create-case-container">
      <div class="card">
        <div class="page-header">
          <h1>Create New Case</h1>
          <p class="subtitle">Upload images and describe your condition</p>
        </div>

        <form (ngSubmit)="onSubmit()">
          <!-- Case Description -->
          <div class="form-section">
            <h3>Case Information</h3>
            
            <div class="form-group">
              <label>Brief Description *</label>
              <input type="text" [(ngModel)]="caseData.title" name="title" 
                     placeholder="e.g., Suspicious mole on left arm" required>
            </div>

            <div class="form-group">
              <label>Detailed Description *</label>
              <textarea [(ngModel)]="caseData.description" name="description" 
                        rows="4" placeholder="Describe your symptoms, when they started, any changes, etc." required></textarea>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Affected Area</label>
                <select [(ngModel)]="caseData.affectedArea" name="affectedArea">
                  <option value="">Select area</option>
                  <option value="Face">Face</option>
                  <option value="Neck">Neck</option>
                  <option value="Chest">Chest</option>
                  <option value="Back">Back</option>
                  <option value="Arms">Arms</option>
                  <option value="Legs">Legs</option>
                  <option value="Hands">Hands</option>
                  <option value="Feet">Feet</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div class="form-group">
                <label>Duration</label>
                <select [(ngModel)]="caseData.duration" name="duration">
                  <option value="">Select duration</option>
                  <option value="Less than a week">Less than a week</option>
                  <option value="1-2 weeks">1-2 weeks</option>
                  <option value="2-4 weeks">2-4 weeks</option>
                  <option value="1-3 months">1-3 months</option>
                  <option value="More than 3 months">More than 3 months</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Image Upload -->
          <div class="form-section">
            <h3>Upload Images *</h3>
            <p class="helper-text">At least one image is required. Maximum 10MB per image. Supported formats: JPEG, PNG</p>

            <div class="upload-area" (click)="fileInput.click()">
              <div class="upload-icon">📷</div>
              <p>Click to upload images</p>
              <p class="upload-hint">or drag and drop</p>
              <input #fileInput type="file" accept="image/jpeg,image/png" multiple 
                     (change)="onFileSelect($event)" style="display: none;">
            </div>

            <div class="image-preview-grid" *ngIf="selectedImages.length > 0">
              <div *ngFor="let image of selectedImages; let i = index" class="image-preview">
                <img [src]="image.preview" [alt]="image.name">
                <button type="button" class="remove-btn" (click)="removeImage(i)">×</button>
                <p class="image-name">{{ image.name }}</p>
              </div>
            </div>
          </div>

          <!-- Payment Info (if required) -->
          <div class="form-section info-box">
            <h3>💳 Payment Information</h3>
            <p>A one-time consultation fee of <strong>$50</strong> will be charged after case submission.</p>
            <p class="note">You will be redirected to our secure payment gateway.</p>
          </div>

          <!-- Submit Actions -->
          <div class="form-actions">
            <a routerLink="/patient" class="btn btn-secondary">Cancel</a>
            <button type="submit" class="btn btn-primary" [disabled]="!isFormValid()">
              Submit Case
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .create-case-container {
      max-width: 900px;
      margin: 0 auto;
      padding: 100px 20px 40px;
    }

    .page-header {
      margin-bottom: 30px;
    }

    .page-header h1 {
      color: var(--primary-color);
      margin-bottom: 5px;
    }

    .subtitle {
      color: var(--text-light);
      margin: 0;
    }

    .form-section {
      margin-bottom: 30px;
      padding-bottom: 30px;
      border-bottom: 1px solid var(--border-color);
    }

    .form-section:last-of-type {
      border-bottom: none;
    }

    .form-section h3 {
      color: var(--primary-color);
      margin-bottom: 15px;
      font-size: 18px;
    }

    .helper-text {
      font-size: 14px;
      color: var(--text-light);
      margin-bottom: 15px;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }

    .upload-area {
      border: 2px dashed var(--border-color);
      border-radius: 8px;
      padding: 40px;
      text-align: center;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .upload-area:hover {
      border-color: var(--primary-color);
      background: var(--background-color);
    }

    .upload-icon {
      font-size: 48px;
      margin-bottom: 10px;
    }

    .upload-area p {
      margin: 5px 0;
      color: var(--text-dark);
    }

    .upload-hint {
      font-size: 14px;
      color: var(--text-light);
    }

    .image-preview-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
      gap: 15px;
      margin-top: 20px;
    }

    .image-preview {
      position: relative;
      border: 1px solid var(--border-color);
      border-radius: 8px;
      overflow: hidden;
    }

    .image-preview img {
      width: 100%;
      height: 150px;
      object-fit: cover;
    }

    .remove-btn {
      position: absolute;
      top: 5px;
      right: 5px;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      background: var(--error);
      color: var(--white);
      border: none;
      cursor: pointer;
      font-size: 20px;
      line-height: 1;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .remove-btn:hover {
      background: #d32f2f;
    }

    .image-name {
      padding: 8px;
      font-size: 12px;
      color: var(--text-light);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      margin: 0;
      background: var(--background-color);
    }

    .info-box {
      background: var(--background-color);
      padding: 20px;
      border-radius: 8px;
    }

    .info-box h3 {
      margin-bottom: 10px;
    }

    .info-box p {
      margin: 5px 0;
      color: var(--text-dark);
    }

    .note {
      font-size: 14px;
      color: var(--text-light);
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 15px;
      margin-top: 30px;
    }

    @media (max-width: 768px) {
      .form-row {
        grid-template-columns: 1fr;
      }

      .image-preview-grid {
        grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
      }
    }
  `]
})
export class CreateCaseComponent {
  caseData = {
    title: '',
    description: '',
    affectedArea: '',
    duration: ''
  };

  selectedImages: Array<{file: File, preview: string, name: string}> = [];

  onFileSelect(event: any) {
    const files = event.target.files;
    if (files) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Validate file type
        if (!file.type.match('image/jpeg') && !file.type.match('image/png')) {
          alert('Only JPEG and PNG images are allowed');
          continue;
        }

        // Validate file size (10MB)
        if (file.size > 10 * 1024 * 1024) {
          alert('File size must be less than 10MB');
          continue;
        }

        // Create preview
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.selectedImages.push({
            file: file,
            preview: e.target.result,
            name: file.name
          });
        };
        reader.readAsDataURL(file);
      }
    }
  }

  removeImage(index: number) {
    this.selectedImages.splice(index, 1);
  }

  isFormValid(): boolean {
    return this.caseData.title.trim() !== '' && 
           this.caseData.description.trim() !== '' && 
           this.selectedImages.length > 0;
  }

  onSubmit() {
    if (!this.isFormValid()) {
      alert('Please fill all required fields and upload at least one image');
      return;
    }

    console.log('Case submitted:', this.caseData, this.selectedImages);
    // TODO: Implement case creation with payment
  }
}

