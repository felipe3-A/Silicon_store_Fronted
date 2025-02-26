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
      // Clonar la solicitud y agregar el token a las cabeceras
      const authRequest = request.clone({
        setHeaders: {
          Authorization: `${token}`
        }
      });
      
      return next.handle(authRequest);
    } else {
      return next.handle(request);
    }
  }

}
