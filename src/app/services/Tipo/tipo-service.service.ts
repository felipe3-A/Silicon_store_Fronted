import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "environments/environment";

@Injectable({
  providedIn: 'root'
})
export class TipoServiceService {
  private baseUrl = environment.apiUrl; // URL base desde el archivo de configuración

  constructor(private http: HttpClient) { }

  listarTipos(): Observable<any> {
      return this.http.get(`${this.baseUrl}/tipos`);
    }
    crearTipos(tipoData: any): Observable<any> {
      return this.http.post(`${this.baseUrl}/tipos`, tipoData);
    }
    
    
      // Editar un tipo
  editarTipo(id: number, tipoData: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/tipos/${id}`, tipoData);
  }

  // Eliminar un tipo
  eliminarTipo(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/tipos/${id}`);
  }
}
