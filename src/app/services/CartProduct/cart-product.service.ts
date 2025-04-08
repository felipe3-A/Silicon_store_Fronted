import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CartProductsService {
  private baseUrl = environment.apiUrl; // URL base desde el archivo de configuración

  constructor(private http: HttpClient) { }

  agregarProductoAlCarrito(productoData: { carrito_id: number; id_imagen: number; cantidad: number; precio:number }): Observable<any> {
    return this.http.post(`${this.baseUrl}/add`, productoData);
  }
  // Eliminar producto del carrito
  eliminarProductoDelCarrito(carritoId: number, idImagen: number): Observable<any> {
    const body = { carrito_id: carritoId, id_imagen: idImagen };
    return this.http.post(`${this.baseUrl}/remove`, body);
  }

  
 // Obtener productos en el carrito
obtenerProductosEnCarrito(personId: number = 1): Observable<any> {
  return this.http.get(`${this.baseUrl}cart/${personId}/items`);
}

}