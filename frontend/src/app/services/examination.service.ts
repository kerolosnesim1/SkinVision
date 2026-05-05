import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Examination, ExaminationListItem, ExaminationStats, CreateExamination, Image, UpdateExamination } from '../models/models';

@Injectable({
    providedIn: 'root'
})
export class ExaminationService {
    private apiUrl = `${environment.apiUrl}/examinations`;

    private _changed = new Subject<void>();
    /** Emits whenever an examination is created or updated successfully. */
    readonly changed$ = this._changed.asObservable();

    constructor(private http: HttpClient) { }

    getExaminations(searchQuery?: string, riskLevel?: string, date?: string): Observable<ExaminationListItem[]> {
        let params = new HttpParams();
        if (searchQuery) params = params.set('searchQuery', searchQuery);
        if (riskLevel) params = params.set('riskLevel', riskLevel);
        if (date) params = params.set('date', date);

        return this.http.get<ExaminationListItem[]>(this.apiUrl, { params });
    }

    getExamination(id: number): Observable<Examination> {
        return this.http.get<Examination>(`${this.apiUrl}/${id}`);
    }

    createExamination(data: CreateExamination): Observable<Examination> {
        return this.http.post<Examination>(this.apiUrl, data).pipe(
            tap(() => this._changed.next())
        );
    }

    updateExamination(id: number, data: UpdateExamination): Observable<Examination> {
        return this.http.put<Examination>(`${this.apiUrl}/${id}`, data).pipe(
            tap(() => this._changed.next())
        );
    }

    deleteExamination(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

    getStats(): Observable<ExaminationStats> {
        return this.http.get<ExaminationStats>(`${this.apiUrl}/stats`);
    }
    uploadImage(id: number, file: File, metadata?: { bodyPart?: string }): Observable<Image> {
        const formData = new FormData();
        formData.append('file', file);
        if (metadata?.bodyPart) {
            formData.append('bodyPart', metadata.bodyPart);
        }
        return this.http.post<Image>(`${this.apiUrl}/${id}/images`, formData);
    }

}
