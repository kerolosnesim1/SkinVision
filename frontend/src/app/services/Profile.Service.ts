import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { DoctorProfile } from '../models/models';

@Injectable({
    providedIn: 'root'
})
export class ProfileService {
    private apiUrl = `${environment.apiUrl}/profile`;

    constructor(private http: HttpClient) { }

    getProfile(): Observable<DoctorProfile> {
        return this.http.get<DoctorProfile>(this.apiUrl);
    }

    updateProfile(profileData: DoctorProfile): Observable<DoctorProfile> {
        return this.http.put<DoctorProfile>(this.apiUrl, profileData);
    }
}
