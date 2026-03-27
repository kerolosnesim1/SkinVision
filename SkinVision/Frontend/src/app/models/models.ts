// User and Auth models
export interface User {
    userId: number;
    username: string;
    email: string;
    role?: string;
    doctorProfile?: DoctorProfile;
}

export interface DoctorProfile {
    doctorId: number;
    specialization?: string;
    yearsExperience?: number;
    hospitalAffiliation?: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    token: string;
    user: User;
}

// Examination models
export interface Examination {
    diagnosisId: number;
    patientName: string;
    patientPhone?: string;
    patientAge?: number;
    reason: string;
    diagnosis: string;
    treatment?: string;
    followUp?: string;
    riskLevel?: string;
    followUpDate?: Date;
    createdAt?: Date;
    updatedAt?: Date;
    images: Image[];
    aiAnalysis?: Prediction;
    doctor?: DoctorProfile;
}

export interface ExaminationListItem {
    diagnosisId: number;
    patientName: string;
    patientPhone?: string;
    reason: string;
    diagnosis: string;
    riskLevel?: string;
    createdAt?: Date;
}

export interface ExaminationStats {
    total: number;
    today: number;
    aiAnalyses: number;
}

export interface CreateExamination {
    patientName: string;
    patientPhone?: string;
    patientAge?: number;
    reason: string;
    diagnosis: string;
    treatment: string;
    followUp?: string;
    riskLevel: string;
    followUpDate?: Date;
    imageIds: number[];
}

// Image and Prediction models
export interface Image {
    imageId: number;
    filePath?: string;
    format?: string;
    size?: number;
    uploadDate?: Date;
    patientName?: string;
    patientAge?: number;
    examinationReason?: string;
    bodyPart?: string;
    aiResult?: Prediction;
}

export interface Prediction {
    predictionId: number;
    classification?: string;
    confidenceScore?: number;
    modelVersion?: string;
    createdAt?: Date;
    findings: string[];
}
