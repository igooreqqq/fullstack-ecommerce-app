import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { User } from '../common/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = 'http://localhost:8080/api/v1/auth';

  private authTokenKey = 'authToken';

  private loggedInUserSubject = new BehaviorSubject<User | null>(null);
  loggedInUser$ = this.loggedInUserSubject.asObservable();

  private isLoginPageSubject = new BehaviorSubject<boolean>(false);
  isLoginPage$ = this.isLoginPageSubject.asObservable();

  private isRegisterPageSubject = new BehaviorSubject<boolean>(false);
  isRegisterPage$ = this.isRegisterPageSubject.asObservable();

  constructor(private http: HttpClient) { 
    // Sprawdenie, czy istnieje token w local storage po odświeżeniu strony
    const storedToken = this.getAuthToken();
    if (storedToken) {
      this.refreshUser(storedToken);
    }
  }

  setIsLoginPage(value: boolean): void {
    this.isLoginPageSubject.next(value);
  }

  setIsRegisterPage(value: boolean): void {
    this.isRegisterPageSubject.next(value);
  }

  register(user: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, user);
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/authenticate`, { email, password })
      .pipe(
        tap(response => {
          const token = response.token;
          if (token) {
            this.setAuthToken(token);
            this.refreshUser(token).subscribe(
              user => {
                this.loggedInUserSubject.next(user);
                // Zapisanie informacji o użytkowniku w localStorage
                localStorage.setItem('loggedInUser', JSON.stringify(user));
              },
              error => {
                console.error('Error refreshing user:', error);
              }
            );
          }
        })
      );
  }
  
  getLoggedInUserFromLocalStorage(): User | null {
    const userString = localStorage.getItem('loggedInUser');
    return userString ? JSON.parse(userString) : null;
  }

  setAuthToken(token: string): void {
    localStorage.setItem(this.authTokenKey, token);
  }

  getAuthToken(): string | null {
    return localStorage.getItem(this.authTokenKey);
  }

  removeAuthToken(): void {
    localStorage.removeItem(this.authTokenKey);
  }

  refreshUser(token: string): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/user`, { headers: { 'Authorization': `Bearer ${token}` } })
      .pipe(
        tap(user => this.loggedInUserSubject.next(user))
      );
  }

  logout(): void {
    this.removeAuthToken();
    this.loggedInUserSubject.next(null);
    localStorage.removeItem('loggedInUser');
  }
}