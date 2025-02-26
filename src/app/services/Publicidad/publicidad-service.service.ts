import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "environments/environment";
@Injectable({
  providedIn: "root",
})
export class PublicidadServiceService {
  private baseUrl = environment.apiUrl; // URL base desde el archivo de configuración

  constructor(private http: HttpClient) {}

  listarPublicidad(): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/publicidad/uploads_publicidad`);
  }
  crearPublicidad(formdata: FormData): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/api/publicidad/uploads_publicidad`,
      formdata
    );
  }
  eliminarPublicidad(id_imagen_publicitaria: number): Observable<any> {
    return this.http.delete<any>(
      `${this.baseUrl}/api/publicidad/uploads_publicidad/${id_imagen_publicitaria}`
    );
  }

  // Listar Imagenes para publicidad
  listarImagenesPorTipo(idTipo: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/publicidad/tipo/${idTipo}`); // Aquí la URL es de la ruta que configuraste en el backend
  }

  //Listar imagen publictaria por id al que pertenezca
  obtenerImagenPublicidad(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/publicidad/buscar/${id}`);
  }
}
