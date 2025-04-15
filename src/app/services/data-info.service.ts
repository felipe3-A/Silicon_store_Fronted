import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';

export interface DataInfo {
  iddata_info?: number;
  data: string;
  info: string;
  icono: string;
}

@Injectable({
  providedIn: 'root',
})
export class DataInfoService {
  private baseUrl = environment.apiUrl; // Usa el entorno configurado

  constructor(private http: HttpClient) {}

  // Listar todos
  getAll(): Observable<DataInfo[]> {
    return this.http.get<DataInfo[]>(`${this.baseUrl}data_info`);
  }

  // Obtener por ID
  getById(id: number): Observable<DataInfo> {
    return this.http.get<DataInfo>(`${this.baseUrl}data_info/${id}`);
  }

  // Crear nuevo registro
  create(data: DataInfo): Observable<any> {
    return this.http.post(`${this.baseUrl}data_info`, data);
  }

  // Actualizar
  update(iddata_info: number, data: DataInfo): Observable<any> {
    return this.http.put(`${this.baseUrl}data_info/${iddata_info}`, data);
  }

  // Eliminar
  delete(iddata_info: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}data_info/${iddata_info}`);
  }
}
