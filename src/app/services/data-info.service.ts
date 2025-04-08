import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface DataInfo {
  iddata_info?: number;
  data: string;
  info: string;
  icono: string;
}

@Injectable({
  providedIn: 'root'
})
export class DataInfoService {

  private apiUrl = 'http://127.0.0.1:8000/api/data_info';

  constructor(private http: HttpClient) {}

  create(dataInfo: DataInfo): Observable<DataInfo> {
    return this.http.post<DataInfo>(this.apiUrl, dataInfo);
  }

  getAll(): Observable<DataInfo[]> {
    return this.http.get<DataInfo[]>(this.apiUrl);
  }

  getById(id: number): Observable<DataInfo> {
    return this.http.get<DataInfo>(`${this.apiUrl}/${id}`);
  }

  update(id: number, dataInfo: DataInfo): Observable<DataInfo> {
    return this.http.put<DataInfo>(`${this.apiUrl}/${id}`, dataInfo);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
