import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Examination, ExaminationListItem, ExaminationStats, CreateExamination } from '../models/models';

@Injectable({
    providedIn: 'root'
})
export class ExaminationService {
    private apiUrl = `${environment.apiUrl}/examinations`;

    constructor(private http: HttpClient) { }

    getExaminations(searchQuery?: string, riskLevel?: string): Observable<ExaminationListItem[]> {
        let params = new HttpParams();
        if (searchQuery) params = params.set('searchQuery', searchQuery);
        if (riskLevel) params = params.set('riskLevel', riskLevel);

        return this.http.get<ExaminationListItem[]>(this.apiUrl, { params });
    }

    getExamination(id: number): Observable<Examination> {
        return this.http.get<Examination>(`${this.apiUrl}/${id}`);
    }

    createExamination(data: CreateExamination): Observable<Examination> {
        return this.http.post<Examination>(this.apiUrl, data);
    }

    updateExamination(id: number, data: any): Observable<Examination> {
        return this.http.put<Examination>(`${this.apiUrl}/${id}`, data);
    }

    deleteExamination(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

    getStats(): Observable<ExaminationStats> {
        return this.http.get<ExaminationStats>(`${this.apiUrl}/stats`);
    }
}
