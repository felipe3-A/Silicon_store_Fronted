import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "environments/environment";

@Injectable({
  providedIn: 'root'
})
export class GrupoServiceService {
  private baseUrl = environment.apiUrl; // URL base desde el archivo de configuración


  constructor(private http: HttpClient) { }

  listarGrupos(): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/grupos/uploads_grupo`);
  }
  crearGrupos(formdata: FormData): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/api/grupos/uploads_grupo`,
      formdata
    );
  }
  

   // Eliminar un tipo
   eliminarGrupo(id_grupo: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/api/grupos/uploads_grupo/${id_grupo}`);
  }

}
