import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private jwtHelper: JwtHelperService, private router: Router) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('token'); // Usa el nombre correcto: "token"

    if (token) {
      // Verificar si el token ha expirado
      if (this.jwtHelper.isTokenExpired(token)) {
        this.removerToken(); // Realiza logout automático
        this.router.navigate(['/login']); // Redirige al login
        return throwError(() => new Error('Token expirado, redirigiendo al login.'));
      }

      // Si el token es válido, agregarlo al encabezado Authorization
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          console.error('❌ Error 401: Token inválido o expirado');
        }
        return throwError(() => error);
      })
    );
  }

  private removerToken() {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('idperfil');
  }
}
