import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class TokenValidationService {
  constructor(private jwtHelper: JwtHelperService) {}

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Verifica si el token es un JWT válido
  public isValidToken(token: string): boolean {
    if (token && this.isJwt(token)) {
      try {
        return !this.jwtHelper.isTokenExpired(token);
      } catch (error) {
        console.error('Error al verificar token JWT:', error);
        return false;
      }
    }
    return false; // Si no es JWT, se considera inválido
  }

  // Devuelve los datos del usuario solo si es un JWT válido
  public getUserData(token: string): any {
    if (this.isJwt(token)) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload;
      } catch (e) {
        console.error('Error al decodificar el token:', e);
        return null;
      }
    } else {
      console.warn('El token no es un JWT válido. No se puede decodificar.');
      return null;
    }
  }
  
  // Método auxiliar para verificar si el token tiene formato JWT
  private isJwt(token: string): boolean {
    return token.split('.').length === 3;
  }
}
