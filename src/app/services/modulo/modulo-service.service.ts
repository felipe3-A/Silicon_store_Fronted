import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ModuloServiceService {
  private baseUrl = environment.apiUrl;

  constructor(private httpClient: HttpClient) {}

  obtenerModulos(): Observable<any> {
    const url = `${this.baseUrl}/api/obtenerModulos`;

    return this.httpClient.get<any>(url);
  }

  crearModulo(moduloData: any): Observable<any> {
    const url = `${this.baseUrl}/api/crearModulo`;
    return this.httpClient.post<any>(url, moduloData);
  }

  editarModulo(idmodulo: number, moduloData: any): Observable<any> {
    const url = `${this.baseUrl}editarpormodulo/${idmodulo}`;
    return this.httpClient.put<any>(url, moduloData);
  }

  eliminarModulo(idmodulo: number): Observable<any> {
    const url = `${this.baseUrl}eliminarmodulo/${idmodulo}`; 
    return this.httpClient.delete<any>(url);
  }
}
