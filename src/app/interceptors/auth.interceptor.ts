import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private router: Router) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const token = localStorage.getItem('token');
    console.log('Interceptando solicitud a:', request.url);
    console.log('Token enviado:', token);
    

    if (token) {
      // Clona la solicitud y añade el encabezado Authorization
      request = request.clone({
        setHeaders: {
          Authorization: `${token}`,
        },
      });
    }

    return next.handle(request).pipe(
      catchError((error) => {
        if (error.status === 401) {
            console.error('Error 401: Token inválido o expirado', error);
          // Si el token expira o es inválido, redirige al inicio de sesión
          localStorage.removeItem('token'); // Limpia el token
          this.router.navigate(['/login']);
        }
        return throwError(error);
      })
    );
  }
}
