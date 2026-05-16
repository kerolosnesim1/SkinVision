<p align="center">
  <img 
    src="assets/images/skinvision-banner.png" 
    alt="SkinVision Banner"
    width="92%"
    height="240"
    style="object-fit: cover; border-radius: 16px;"
  />
</p>



<p align="center">
  <strong>
    AI-powered dermatology platform for lesion classification,
    examination management, and professional medical reporting.
  </strong>
</p>

<p align="center">
  <a href="#demo">Demo</a> ·
  <a href="#highlights">Highlights</a> ·
  <a href="#architecture">Architecture</a> ·
  <a href="#getting-started">Getting Started</a> ·
  <a href="#api-reference">API</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/.NET-9.0-512BD4?logo=dotnet" alt=".NET 9" />
  <img src="https://img.shields.io/badge/Angular-21-DD0031?logo=angular" alt="Angular 21" />
  <img src="https://img.shields.io/badge/Python-3.11-3776AB?logo=python&logoColor=white" alt="Python" />
  <img src="https://img.shields.io/badge/PyTorch-EfficientNet--B3-EE4C2C?logo=pytorch&logoColor=white" alt="PyTorch" />
  <img src="https://img.shields.io/badge/SQL%20Server-2022-CC2927?logo=microsoftsqlserver&logoColor=white" alt="SQL Server" />
  <img src="https://img.shields.io/badge/Clean-Architecture-0A0A0A" alt="Clean Architecture" />
</p>

---

# Why SkinVision?

SkinVision was built to simulate the engineering challenges of a real-world AI-powered medical platform.

Instead of focusing only on machine learning accuracy, the project emphasizes:

- scalable backend architecture
- fault-tolerant AI integration
- secure doctor-scoped workflows
- auditability of medical records
- production-oriented infrastructure patterns
- separation between clinical workflows and AI inference

The goal is to demonstrate how modern healthcare AI systems can be engineered responsibly — where AI assists clinicians without becoming a system dependency.

---

# Demo

> Demo video coming soon — full workflow walkthrough:
>
> authentication → examination creation → image upload → AI classification → diagnosis → PDF report generation

<p align="center">
  <img src="assets/screenshots/dashboard.png" alt="Dashboard" width="85%" />
</p>

<details>
<summary>More screenshots</summary>
<br>

| Dashboard | AI Analysis | Generated Report |
|:---:|:---:|:---:|
| ![Dashboard](assets/screenshots/dashboard.png) | ![AI Result](assets/screenshots/ai-analysis.png) | ![Report](assets/screenshots/report.png) |

</details>

---

# Highlights

## AI & Medical Workflow

- Multimodal EfficientNet-B3 lesion classification
- AI-assisted examination workflow
- Professional PDF medical report generation
- Fault-tolerant AI processing pipeline
- Medical record traceability and auditability

## Security

- JWT authentication with role-based authorization
- BCrypt password hashing
- Doctor-scoped resource access
- IDOR-safe examination ownership validation
- Secure file upload handling

## Infrastructure & Backend

- Clean Architecture with strict layer separation
- Independent FastAPI/PyTorch ML microservice
- Azure Blob Storage-ready abstraction layer
- Async end-to-end API pipeline
- Structured logging with Serilog

## Performance

- Optimized image preprocessing pipeline
- Lightweight inference using `torch.no_grad()`
- SQL-level filtering and optimized querying
- Storage architecture prepared for scaling

---

# What It Does

SkinVision helps doctors:

- manage patient examinations
- upload dermoscopy images
- receive AI-assisted lesion classifications
- record diagnoses
- generate downloadable PDF reports

The platform is designed around real-world backend engineering concerns including:
- secure doctor-scoped access
- image-heavy workflows
- AI fault tolerance
- scalable storage
- auditability of medical records

> AI predictions are advisory only and never replace clinical judgment.

---

# AI Model

SkinVision uses a multimodal EfficientNet-B3 model trained on the ISIC 2019 dataset (~25k dermoscopy images across 9 diagnostic classes).

The model combines:
- dermoscopy image features
- patient metadata (age, sex, anatomical site)

to improve classification quality beyond image-only inference.

## Supported classifications

| Code | Condition |
|------|-----------|
| MEL | Melanoma |
| NV | Melanocytic Nevus |
| BCC | Basal Cell Carcinoma |
| AK | Actinic Keratosis |
| BKL | Benign Keratosis |
| DF | Dermatofibroma |
| VASC | Vascular Lesion |
| SCC | Squamous Cell Carcinoma |

> AI predictions are advisory only and do not replace clinical diagnosis.

---

# Architecture

The backend follows **Clean Architecture** — dependencies point inward, and no layer references the one above it.

| Layer | Project | Responsibility |
|-------|---------|---------------|
| API | `SkinVision.API` | Controllers, middleware, DI, CORS, Swagger |
| Application | `SkinVision.Application` | Services, DTOs, interfaces, business rules |
| Domain | `SkinVision.Domain` | Entities, enums, domain invariants |
| Infrastructure | `SkinVision.Infrastructure` | EF Core context, repositories, storage, PDF generation |

---

## System Architecture Diagram

> Add your Excalidraw architecture diagram here.

<p align="center">
  <img src="assets/diagrams/system-architecture.png" alt="System Architecture" width="95%" />
</p>

---

# Engineering Decisions

## Independent ML Microservice

AI inference runs inside a separate FastAPI/PyTorch service instead of the main .NET process. This keeps the API lightweight, allows independent scaling/versioning, and isolates ML failures from core examination workflows.

## Storage Abstraction

Uploads are handled through an `IFileStorageService` abstraction. Local storage is used during development while the production design targets Azure Blob Storage without changing application logic.

## Fault-Tolerant AI Workflow

Examinations and uploads succeed even if ML inference fails. AI predictions are treated as optional workflow enhancements rather than critical dependencies.

## Traceable Medical Records

Predictions, images, reports, and examinations are stored independently to preserve auditability and historical traceability.

## Performance-Oriented Pipeline

The platform uses:
- async request handling
- SQL-level filtering
- optimized tensor preprocessing
- lightweight inference execution
- scalable storage abstractions

---

# Features

## Backend

- Clean Architecture backend
- RESTful ASP.NET Core API
- Structured logging with Serilog
- Repository and service abstraction patterns
- Async request pipeline

## AI

- Multimodal lesion classification
- EfficientNet-B3 inference pipeline
- Metadata-enhanced prediction workflow
- Independent ML microservice

## Security

- JWT authentication
- BCrypt password hashing
- Role-based authorization
- Secure doctor-scoped access control

## Frontend

- Angular 21 dashboard
- Responsive Tailwind UI
- Route guards and JWT interceptors
- Server-side filtering and search

---

# Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend API | .NET 9, ASP.NET Core, EF Core, Serilog |
| Frontend | Angular 21, TypeScript, Tailwind CSS |
| ML Service | Python 3.11, FastAPI, PyTorch |
| Database | SQL Server |
| Authentication | JWT Bearer Tokens, BCrypt |
| PDF Generation | QuestPDF |
| Testing | xUnit, Vitest |

---

# Project Structure

```text
SkinVision/
├── SkinVision.API/              # ASP.NET Core Web API
│   ├── Controllers/
│   ├── Extensions/
│   └── Properties/
├── SkinVision.Application/      # Business logic layer
│   ├── DTOs/
│   ├── Interfaces/
│   └── Services/
├── SkinVision.Domain/           # Core domain
│   ├── Entities/
│   └── Enums/
├── SkinVision.Infrastructure/
│   ├── Data/
│   ├── Repositories/
│   ├── Services/
│   └── Migrations/
├── SkinVision.ML/
│   ├── app/
│   │   ├── main.py
│   │   ├── model.py
│   │   ├── inference.py
│   │   └── schemas.py
│   └── model/
├── frontend/
│   └── src/app/
│       ├── pages/
│       ├── services/
│       ├── guards/
│       ├── interceptors/
│       └── models/
└── assets/
```

---

# Security

- JWT Bearer authentication
- BCrypt password hashing
- Doctor-owned resource scoping
- IDOR-safe access validation
- Secure file upload validation
- Centralized exception handling
- Role-based authorization

---

# Testing

| Layer | Testing |
|-------|---------|
| Backend | xUnit |
| Frontend | Vitest |
| API | Integration testing |
| ML Service | Inference validation |

---

# API Reference

## Authentication

| Method | Endpoint |
|--------|----------|
| POST | `/api/auth/register` |
| POST | `/api/auth/login` |
| POST | `/api/auth/change-password` |
| POST | `/api/auth/forgot-password` |
| POST | `/api/auth/reset-password` |

---

## Examinations

| Method | Endpoint |
|--------|----------|
| GET | `/api/examinations` |
| POST | `/api/examinations` |
| GET | `/api/examinations/{id}` |
| PUT | `/api/examinations/{id}` |
| DELETE | `/api/examinations/{id}` |
| POST | `/api/examinations/{id}/images` |
| GET | `/api/examinations/stats` |

---

## Reports

| Method | Endpoint |
|--------|----------|
| POST | `/api/examinations/{id}/reports` |
| GET | `/api/reports` |
| GET | `/api/reports/{id}/download` |
| DELETE | `/api/reports/{id}` |

---

## ML Service

| Method | Endpoint |
|--------|----------|
| POST | `/predict` |
| GET | `/health` |

---

# Getting Started

## Prerequisites

- .NET 9 SDK
- Node.js 20+
- Python 3.11+
- SQL Server

---

## Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/SkinVision.git
cd SkinVision
```

---

## Backend API

```bash
cd SkinVision.API
dotnet ef database update
dotnet run
```

Swagger available in development at:

```text
/swagger
```

---

## ML Service

```bash
cd SkinVision.ML
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

---

## Frontend

```bash
cd frontend
npm install
ng serve
```

Frontend runs at:

```text
http://localhost:4200
```

---

# Roadmap

- [ ] Azure Blob Storage integration
- [ ] Redis caching
- [ ] Kubernetes deployment
- [ ] Dockerized multi-container deployment
- [ ] Background job processing
- [ ] AI confidence thresholding
- [ ] Multi-image ensemble inference
- [ ] CI/CD pipeline with automated testing
- [ ] SignalR real-time notifications

---

# License

Licensed under the MIT License.

See `LICENSE` for details.

---

<p align="center">
  Built with clinical precision and modern backend engineering.
</p>