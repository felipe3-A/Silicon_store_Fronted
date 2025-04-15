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
  
  // Eliminar producto del carrito
  eliminarProductoDelCarrito(personId: number, item_id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}cart/remove-item/${item_id}`, {
      params: { person_id: personId } // Asegúrate de enviar el ID de la persona si es necesario
    });
  }

  
 // Obtener productos en el carrito
obtenerProductosEnCarrito(personId: number = 1): Observable<any> {
  return this.http.get(`${this.baseUrl}cart/${personId}/items`);
}

}