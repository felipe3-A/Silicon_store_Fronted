import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "environments/environment";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class SolicitudServiceService {
  private baseUrl = environment.apiUrl; // URL base desde el archivo de configuración

  constructor(private http: HttpClient) { }

   // Método para listar los productos
   listarSolicitudes(): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/solicitud/solicitudes`); // Asumiendo que la ruta de los productos es /api/products
  }

  crearSolicitud(formData: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/solicitud/solicitudes`, formData); // Asegúrate de que esta URL sea la correcta
  }

  crearGaleriaSolicitud(formData: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/solicitud/upload_gallery_solicitudes`, formData); // Asegúrate de que esta URL sea la correcta
  }

  listarGaleriasSolicitudes(): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/solicitud/upload_gallery_solicitudes`); // Asegúrate de que esta URL sea la correcta
  }

  listarTipoServicio(): Observable<any>{
    return this.http.get(`${this.baseUrl}/api/solicitud/tipoArticulo`); // Asegúrate de que esta URL sea la correcta

  }

  listarTipoArticulo(): Observable<any>{
    return this.http.get(`${this.baseUrl}/api/solicitud/tipoServicio`); // Asegúrate de que esta URL sea la correcta

  }
}
