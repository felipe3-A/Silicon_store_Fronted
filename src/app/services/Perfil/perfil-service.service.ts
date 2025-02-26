
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class PerfilServiceService {

  private baseUrl = environment.apiUrl;

  constructor(private httpClient: HttpClient) {}

  obtenerPerfiles(): Observable<any> {
    const url = `${this.baseUrl}/api/listPerfil`;

    return this.httpClient.get<any>(url);
  }

  crearPerfil(perfilData: any): Observable<any> {
    const url = `${this.baseUrl}crearPerfil`;
    return this.httpClient.post<any>(url, perfilData);
  }

  editarPerfil(idperfil: number, nuevoPerfilData: any): Observable<any> {
    const url = `${this.baseUrl}editPerfil/${idperfil}`;
    return this.httpClient.put<any>(url, nuevoPerfilData);
  }

  eliminarPerfil(idperfil: number): Observable<any> {
    const url = `${this.baseUrl}EliminarPerfil/${idperfil}`;
    return this.httpClient.delete<any>(url);
  }
}
