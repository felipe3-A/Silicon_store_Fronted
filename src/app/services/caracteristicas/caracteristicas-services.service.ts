import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment'; // Asegúrate de que la ruta sea correcta
import { CaracteristicasResponse } from 'app/model/caracteristica.model';



@Injectable({
  providedIn: 'root'
})
export class CaracteristicasServicesService {
  private baseUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}

  getAllCaracteristicas(): Observable<CaracteristicasResponse> {
    return this.http.get<CaracteristicasResponse>(`${this.baseUrl}/caracteristicas`);
  }

  getCaracteristicaById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }

  createCaracteristica(caracteristicaData: any): Observable<any> {
    const url = `${this.baseUrl}/caracteristicas`;
    return this.http.post<any>(url, caracteristicaData);
  }

  //Administarr Subcategorias

  createsubCaracteristica(subcaracteristicaData: any): Observable<any> {
    const url = `${this.baseUrl}/subcaracteristica`;
    return this.http.post<any>(url, subcaracteristicaData);
  }
  
}