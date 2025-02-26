import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment'; 
import { CaracteristicasResponse } from 'app/model/caracteristica.model';

@Injectable({
  providedIn: 'root'
})
export class SubCaracteristicasServicesService {

  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getAllCaracteristicas(): Observable<CaracteristicasResponse> {
    return this.http.get<CaracteristicasResponse>(`${this.baseUrl}/subcaracteristica`);
  }

  getSubcaracteristicaById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }

  createSubcaracteristica(subcaracteristicasData: any): Observable<any> {
    const url = `${this.baseUrl}/subcaracteristica`;
    return this.http.post<any>(url, subcaracteristicasData);  }
}