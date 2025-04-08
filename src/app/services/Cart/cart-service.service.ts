import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CartServiceService {
  private baseUrl = `${environment.apiUrl}cart`; // Base URL ajustada

  constructor(private http: HttpClient) { }

  // Obtener el carrito de un usuario (el más reciente o activo)
  obtenerCarrito(usuarioId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/validar/${usuarioId}`);
  }

  // Agregar producto a un carrito específico o al más reciente del usuario
  agregarProductoAlCarrito(cartId: number | null, usuarioId: number, productId: number, cantidad: number): Observable<any> {
    const body = {
      cart_id: cartId, // Puede ser null para usar el del usuario
      person_id: usuarioId,
      item_id: productId,
      quantity: cantidad
    };
    return this.http.post(`${this.baseUrl}/add`, body);
  }

  // Eliminar producto del carrito
  eliminarProductoDelCarrito(cartId: number, productId: number): Observable<any> {
    const body = { cart_id: cartId, item_id: productId };
    return this.http.post(`${this.baseUrl}/remove`, body);
  }
}
