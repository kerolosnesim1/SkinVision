import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Report } from '../models/models';

@Injectable({
    providedIn: 'root'
})
export class ReportService {
    private apiUrl = `${environment.apiUrl}`;

    constructor(private http: HttpClient) { }

    generateReport(examinationId: number, title?: string): Observable<Report> {
        return this.http.post<Report>(
            `${this.apiUrl}/examinations/${examinationId}/reports`,
            { title }
        );
    }

    getReportsForExamination(examinationId: number): Observable<Report[]> {
        return this.http.get<Report[]>(
            `${this.apiUrl}/examinations/${examinationId}/reports`
        );
    }

    getAllReports(): Observable<Report[]> {
        return this.http.get<Report[]>(`${this.apiUrl}/reports`);
    }

    getReport(id: number): Observable<Report> {
        return this.http.get<Report>(`${this.apiUrl}/reports/${id}`);
    }

    downloadReport(id: number): Observable<Blob> {
        return this.http.get(`${this.apiUrl}/reports/${id}/download`, {
            responseType: 'blob'
        });
    }

    deleteReport(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/reports/${id}`);
    }
}
