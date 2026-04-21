import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { LoginRequest, LoginResponse, User } from '../models/models';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = `${environment.apiUrl}/auth`;
    private currentUserSubject = new BehaviorSubject<User | null>(null);
    public currentUser$ = this.currentUserSubject.asObservable();

    constructor(private http: HttpClient) {
        this.loadUserFromStorage();
    }

    login(email: string, password: string): Observable<LoginResponse> {
        const request: LoginRequest = { email, password };
        return this.http.post<LoginResponse>(`${this.apiUrl}/login`, request).pipe(
            tap(response => {
                localStorage.setItem('token', response.token);
                localStorage.setItem('currentUser', JSON.stringify(response.user));
                this.currentUserSubject.next(response.user);
            })
        );
    }

    register(data: {
        fullName: string;
        email: string;
        phone: string;
        password: string;
        clinicName: string;
        clinicAddress: string;
    }): Observable<LoginResponse> {
        const body = {
            fullName: data.fullName,
            email: data.email,
            password: data.password,
            phone: data.phone,
            clinicName: data.clinicName,
            clinicAddress: data.clinicAddress
        };
        return this.http.post<LoginResponse>(`${this.apiUrl}/register`, body).pipe(
            tap((response) => {
                localStorage.setItem('token', response.token);
                localStorage.setItem('currentUser', JSON.stringify(response.user));
                this.currentUserSubject.next(response.user);
            })
        );
    }

    logout(): void {
        localStorage.removeItem('token');
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
    }

    updateCurrentUser(user: User): void {
        this.currentUserSubject.next(user);
    }

    getCurrentUser(): User | null {
        return this.currentUserSubject.value;
    }

    isAuthenticated(): boolean {
        return !!localStorage.getItem('token');
    }

    private loadUserFromStorage(): void {
        const userJson = localStorage.getItem('currentUser');
        if (userJson) {
            this.currentUserSubject.next(JSON.parse(userJson));
        }
    }
}
