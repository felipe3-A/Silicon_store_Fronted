import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CartServiceService {
  private baseUrl = environment.apiUrl; // URL base desde el archivo de configuración

  constructor(private http: HttpClient) { }

  // Crear un nuevo carrito
  crearCarrito(usuarioId: number, estado: string = 'CREATED'): Observable<any> {
    const body = { usuario_id: usuarioId, estado };
    return this.http.post(`${this.baseUrl}/create`, body);
  }

  // Obtener el carrito de un usuario
  obtenerCarrito(usuarioId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/list/${usuarioId}`);
  }

  // Agregar producto al carrito
  agregarProductoAlCarrito(usuarioId: number, productId: number, cantidad: number): Observable<any> {
    const body = { usuario_id: usuarioId, product_id: productId, quantity: cantidad };
    return this.http.post(`${this.baseUrl}/add`, body);
  }

  // Eliminar producto del carrito
  eliminarProductoDelCarrito(usuarioId: number, productId: number): Observable<any> {
    const body = { usuario_id: usuarioId, product_id: productId };
    return this.http.post(`${this.baseUrl}/remove`, body);
  }
}