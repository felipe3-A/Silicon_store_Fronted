import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "environments/environment";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class ProductService {
  private baseUrl = environment.apiUrl; // URL base desde el archivo de configuración

  constructor(private http: HttpClient) {}

  // Método para listar los productos
  listarProductos(): Observable<any> {
    return this.http.get(`${this.baseUrl}items`); // Asumiendo que la ruta de los productos es /api/products
  }

  listarProductosPorGrupo(id_grupo: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/imagenes/upload_grupo/${id_grupo}`); // Asegúrate de que la ruta sea correcta
  }

  crearProducto(formData: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/imagenes/upload`, formData); // Asegúrate de que esta URL sea la correcta
  }

  crearGaleria(formData: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/imagenes_gallery/uploads_gallery`, formData); // Asegúrate de que esta URL sea la correcta
  }

  eliminarProducto(id_imagen: number): Observable<any> {
    return this.http.delete<any>(
      `${this.baseUrl}/api/imagenes/upload/${id_imagen}`
    );
  }

  editarProducto(id_imagen: number, ProductoData: any): Observable<any> {
    return this.http.put<any>(
      `${this.baseUrl}/api/imagenes/upload/${id_imagen}`,
      ProductoData
    );
  }
  listarTodasGalerias(): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/imagenes_gallery/uploads_gallery`); // Asumiendo que la ruta de los productos es /api/products
  }

  listarProductosPorCategoria(id_categoria: number): Observable<{ data: any[] }> {
    return this.http.get<{ data: any[] }>(`api/imagenes/categoria/${id_categoria}`);
  }

  // listarProductosPorCategoriaS(id_categoriaS: number[]): Observable<any[]> {
  //   return this.http.get<any[]>(`api/imagenes/categoria/${id_categoriaS}`);
  // }


  listarProductoId(id_imagen: number): Observable<any> {
    return this.http.get<any>(`/api/imagenes/upload/${id_imagen}`);
  }

  listarProductosPorMarca(id_marca: number): Observable<any[]> {
    return this.http
      .get<any>(`${this.baseUrl}/categoriaProducto/${id_marca}`)
      .pipe(
        map((response) => response.data || []) // Devuelve un arreglo vacío si `data` no existe
      );
  }

  // Nuevo método para obtener la galería por ID
  obtenerGaleriaPorId(id_galeria: number): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/api/imagenes/upload_gallery/${id_galeria}`
    );
  }

  // En tu servicio de Angular
  getProductos() {
    return this.http.get<any[]>("http://localhost:3000/productos"); // Cambia la URL por la correcta
  }
}
