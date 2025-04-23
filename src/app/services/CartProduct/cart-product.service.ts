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

  agregarProductoAlCarrito(data: {
    item_id: number;
    person_id: number;
    quantity: number;
  }) {
    return this.http.post('http://127.0.0.1:8000/api/cart/add', data);
  }
  vaciarCarrito(personId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}carrito/${personId}/vaciar`);
  }
  
  
  // Eliminar producto del carrito
  eliminarProductoDelCarrito(personId: number, itemId: number) {
    return this.http.delete(`${this.baseUrl}cart/person/${personId}/remove-item/${itemId}`);
  }
  

  
 // Obtener productos en el carrito
obtenerProductosEnCarrito(personId: number = 1): Observable<any> {
  return this.http.get(`${this.baseUrl}cart/${personId}/items`);
}

}