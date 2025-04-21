import {Item}   from './../model/ProductosModel';
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


  getGalleryByItemId(itemId: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}store-item-galleries/${itemId}`);
  }
  
  // Método para listar los productos
  listarProductos(): Observable<any> {
    return this.http.get(`${this.baseUrl}items`); // Asumiendo que la ruta de los productos es /api/products
  }

  buscarProductos(q: string): Observable<any> {
    return this.http.get(`${this.baseUrl}items?q=${q}&type=track&limit=10`);
  }

  getGaleriaPorItemId(itemId: number) {
    return this.http.get<string[]>(`${this.baseUrl}galeria/item/${itemId}`);
  }
  

  listarProductoId(item_id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}items/${item_id}`);
  }

  obtenerGaleriaPorItem(item_id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}galeria/item/${item_id}`);
  }
  

  uploadImagesAsJson(data: { item_id: number; images: string[] }) {
    return this.http.post(`${this.baseUrl}store-item-galleries`, data);
  }
  
  listarProductosPorGrupo(id_grupo: number): Observable<any> {
    return this.http.get(
      `${this.baseUrl}/api/imagenes/upload_grupo/${id_grupo}`
    ); // Asegúrate de que la ruta sea correcta
  }

  crearProducto(formData: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/imagenes/upload`, formData); // Asegúrate de que esta URL sea la correcta
  }

  crearGaleria(formData: FormData): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/api/imagenes_gallery/uploads_gallery`,
      formData
    ); // Asegúrate de que esta URL sea la correcta
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
    return this.http.get(
      `${this.baseUrl}/api/imagenes_gallery/uploads_gallery`
    ); // Asumiendo que la ruta de los productos es /api/products
  }

  listarProductosPorCategoria(
    id_categoria: number
  ): Observable<{ data: any[] }> {
    return this.http.get<{ data: any[] }>(
      `api/imagenes/categoria/${id_categoria}`
    );
  }

  // listarProductosPorCategoriaS(id_categoriaS: number[]): Observable<any[]> {
  //   return this.http.get<any[]>(`api/imagenes/categoria/${id_categoriaS}`);
  // }

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



  //agregar galeria ala imagen
  
  uploadImages(itemId: number, files: File[]) {
    const formData = new FormData();
    formData.append('item_item_id', itemId.toString());

    files.forEach(file => formData.append('image_gallery[]', file));

    return this.http.post(`${this.baseUrl}store-item-galleries`, formData);
  }



  obtenerGaleriaPorItemId(item_id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}galeria/item/${item_id}`);
  }
  
  eliminarImagen(item_id: number, posicion: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}galeria/${item_id}/imagen/${posicion}`);
  }
  
  reemplazarImagen(item_id: number, posicion: number, archivo: File): Observable<any> {
    const formData = new FormData();
    formData.append(`image_gallery[${posicion}]`, archivo);
    formData.append(`replace[${posicion}]`, 'true');
  
    return this.http.post(`${this.baseUrl}store-item-galleries/${item_id}`, formData);
  }
  
  




}

