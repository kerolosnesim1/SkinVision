import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { User, DoctorProfile } from '../models/models';

@Injectable({
    providedIn: 'root'
})
export class ProfileService {
    private apiUrl = `${environment.apiUrl}/profile`;

    constructor(private http: HttpClient) { }

    getProfile(): Observable<User> {
        return this.http.get<User>(this.apiUrl);
    }

    updateProfile(profileData: DoctorProfile): Observable<User> {
        return this.http.put<User>(this.apiUrl, profileData);
    }
}
