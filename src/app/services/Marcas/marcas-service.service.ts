import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';


@Injectable({
  providedIn: 'root'
})
export class MarcasServiceService {
  private baseUrl = environment.apiUrl; // URL base desde el archivo de configuración

  constructor(private http: HttpClient) { }
  listarMarcas(): Observable <any>{
    return this.http.get(`${this.baseUrl}/api/marca/upload_marca`);
  }

  crearMarca(formData: FormData): Observable<any>{
    return this.http.post(`${this.baseUrl}/api/marca/upload_marca`, formData); // Asegúrate de que esta URL sea la correcta
  }

     // Nuevo método para obtener la galería por ID
     obtenerMarcaPorId(id_marca: number): Observable<any> {
      return this.http.get<any>(`${this.baseUrl}/api/marca/upload_marca/${id_marca}`);
    }

}
