import { Injectable, EventEmitter } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private baseUrl = environment.apiUrl;
  loginStatusChanged = new EventEmitter<boolean>();

  private userId: number | null = null;
  private userData: any = null;

  constructor(
    private httpClient: HttpClient,
    private jwtHelper: JwtHelperService,
    private router: Router
  ) {}

  postLogin(formValue: any): Observable<any> {
    const url = `${this.baseUrl}login`;

    return this.httpClient.post<any>(url, formValue).pipe(
      map((response) => {
        if (response.token) {
          localStorage.setItem('token', response.token);
          const decodedToken = this.jwtHelper.decodeToken(response.token);

          // Suponiendo que el token tiene un campo idusuario y idperfil
          this.userData = decodedToken;
          this.userId = decodedToken.idusuario;
          
          localStorage.setItem('userId', this.userId?.toString() ?? '');
          localStorage.setItem('idperfil', decodedToken.idperfil?.toString() ?? '');
          localStorage.setItem('person_id', response.user.person_id.toString());

          console.log('✅ Usuario logueado correctamente');
          console.log('👤 Datos del usuario:', this.userData);
        }

        this.loginStatusChanged.emit(true);
        return response;
      })
    );
  }


  

  // Obtener el perfil del usuario desde el token
  public getUserPerfil(): string | null {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = this.jwtHelper.decodeToken(token);
      return decodedToken.idperfil ?? null;
    }
    return null;
  }

  getUserId(): string | null {
    return this.userId?.toString() ?? localStorage.getItem('userId');
  }

  getUserCarrito(): string | null {
    return this.userId?.toString() ?? localStorage.getItem('person_id');
  }
  

  
  
  getPersonId(): string | null {
  const token = localStorage.getItem('token');
  if (token) {
    const decodedToken = this.jwtHelper.decodeToken(token);
    return decodedToken.person_id ?? null;
  }
  return null;
}


  getUserData(): any {
    if (this.userData) return this.userData;

    const token = localStorage.getItem('token');
    if (token) {
      this.userData = this.jwtHelper.decodeToken(token);
      return this.userData;
    }

    return null;
  }

  
setUserData(data: any) {
  this.userData = data;
}

  cerrarSesion(): Observable<any> {
    const token = localStorage.getItem('token');

    if (!token) {
      return throwError(() => 'No se encontró un token de autenticación en el almacenamiento local.');
    }

    const url = `${this.baseUrl}logout`;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      Accept: 'application/json'
    });
    

    return this.httpClient.post<any>(url, null, { headers }).pipe(
      map((response) => {
        this.removerToken();
        localStorage.removeItem('isLoggedIn');
        return response;
      })
    );
  }

  removerToken() {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('idperfil');
    this.userId = null;
    this.userData = null;
  }

  isLoggedIn(): boolean {
    const token = localStorage.getItem('token');
    return token !== null && !this.jwtHelper.isTokenExpired(token);
  }
}
