import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {

  private userRole: string = 'user'; // Cambiar a 'admin' para pruebas

  constructor() {}

  getUserRole(): Observable<string> {
    // Simula la obtención del rol (puedes cambiarlo por una llamada HTTP)
    return of(this.userRole);
  }
}
