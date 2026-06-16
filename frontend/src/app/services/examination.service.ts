import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpEventType } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { tap, filter, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Examination, ExaminationListItem, ExaminationStats, CreateExamination, Image, UpdateExamination, Prediction } from '../models/models';

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
    uploadImage(id: number, file: File): Observable<Image> {
        const formData = new FormData();
        formData.append('file', file);
        return this.http.post<Image>(`${this.apiUrl}/${id}/images`, formData);
    }

    /** Upload image with progress tracking. Emits progress (0-100) and final Image result. */
    uploadImageWithProgress(id: number, file: File): Observable<{ progress: number; result?: Image }> {
        const formData = new FormData();
        formData.append('file', file);
        return this.http.post<Image>(`${this.apiUrl}/${id}/images`, formData, {
            reportProgress: true,
            observe: 'events'
        }).pipe(
            map(event => {
                if (event.type === HttpEventType.UploadProgress) {
                    const progress = event.total ? Math.round((event.loaded / event.total) * 100) : 0;
                    return { progress };
                }
                if (event.type === HttpEventType.Response) {
                    return { progress: 100, result: event.body as Image };
                }
                return { progress: 0 };
            }),
            filter(data => data.progress > 0 || data.result !== undefined)
        );
    }

    /** Upload image only (no AI prediction). Used for decoupled upload + analyze flow. */
    uploadImageOnly(id: number, file: File): Observable<Image> {
        const formData = new FormData();
        formData.append('file', file);
        return this.http.post<Image>(`${this.apiUrl}/${id}/images/upload`, formData);
    }

    /** Upload image only with progress tracking. Emits progress (0-100) and final Image result. */
    uploadImageOnlyWithProgress(id: number, file: File): Observable<{ progress: number; result?: Image }> {
        const formData = new FormData();
        formData.append('file', file);
        return this.http.post<Image>(`${this.apiUrl}/${id}/images/upload`, formData, {
            reportProgress: true,
            observe: 'events'
        }).pipe(
            map(event => {
                if (event.type === HttpEventType.UploadProgress) {
                    const progress = event.total ? Math.round((event.loaded / event.total) * 100) : 0;
                    return { progress };
                }
                if (event.type === HttpEventType.Response) {
                    return { progress: 100, result: event.body as Image };
                }
                return { progress: 0 };
            }),
            filter(data => data.progress > 0 || data.result !== undefined)
        );
    }

    /** Run AI analysis on an already-uploaded image. Returns Prediction result. */
    analyzeImage(examinationId: number, imageId: number): Observable<Prediction> {
        return this.http.post<Prediction>(`${this.apiUrl}/${examinationId}/images/${imageId}/analyze`, {});
    }

}
