import { Injectable,EventEmitter } from '@angular/core';
import { environment } from 'environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private baseUrl = environment.apiUrl; // URL base desde el archivo de configuración
  loginStatusChanged = new EventEmitter<boolean>();

  constructor(private http: HttpClient) {}

  // Método para obtener el token desde localStorage o un servicio
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token'); // Obtén el token desde localStorage
    return new HttpHeaders({
      Authorization: `Bearer ${token}`, // Incluye el token en los encabezados
    });
  }

  obtenerUbicaciones(): Observable<any> {
    return this.http.get<any>('assets/data/ubicaciones.json');
  }

  obtenerUsuarios(): Observable<any> {
    return this.http.get(`${this.baseUrl}/usuarios`, {
      headers: this.getHeaders(),
    });
  }

  crearUsuario(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}people`, data, {
      headers: this.getHeaders(),
    });
  }

  editarUsuario(id: number, ProductoData: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/usuarios/${id}`, ProductoData, {
      headers: this.getHeaders(),
    });
  }

  eliminarUsuario(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/usuarios/${id}`, {
      headers: this.getHeaders(),
    });
  }

  obtenerUsuarioId(id:string):Observable<any>{
    return this.http.get<any>(`${this.baseUrl}/usuarios/${id}`)
  }

  login(usuario: string, contrasena: string): Observable<any> {
    const loginData = { email: usuario, identificacion: contrasena }; // Ajusta según el backend
  
    return this.http.post(`${this.baseUrl}/login`, loginData).pipe(
      tap((response: any) => {
        localStorage.setItem('token', response.token); // Guarda el token en localStorage
        this.loginStatusChanged.emit(true);

      })
    );
  }

 

  
}
