import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment'; // Asegúrate de que la ruta sea correcta

@Injectable({
  providedIn: 'root'
})
export class ValoresCaracteristicasServicesService {

  private apiUrl = `${environment.apiUrl}/valoresCaracteristicas`; // Ajusta la URL según tu API

  constructor(private http: HttpClient) {}

  getAllValoresCaracteristicas(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getValoresByProducto(id_imagen: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/producto/${id_imagen}`);
  }

  createValorCaracteristica(valuesCaracteristicas: FormData): Observable<any> {
    const url = `${this.apiUrl}`;
    return this.http.post<any>(url, valuesCaracteristicas);  }
}
