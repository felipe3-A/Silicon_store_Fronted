import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('token');
    
    if (token) {
      // AQUÍ se clona la solicitud y se agrega el token en la cabecera Authorization
      const authRequest = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}` // <-- cambia esto si el backend espera otro formato
        }
      });
      
      return next.handle(authRequest);
    } else {
      return next.handle(request);
    }
  }
}
