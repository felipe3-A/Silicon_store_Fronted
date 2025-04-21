import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoriaServiceService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  listarCategorias(): Observable<any> {
    return this.http.get(`${this.baseUrl}categorias`);
  }

  // Método para crear una nueva categoría
  crearCategorias(formdata: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/categoria/categoria_upload`,formdata);
  }
  

  // Método para editar una categoría
  editarCategoria(id_categoria: number, categoriaData: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/categoria_upload/${id_categoria}`, categoriaData);
  }

  // Método para eliminar una categoría
  eliminarCategoria(id_categoria: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/categoria_upload/${id_categoria}`);
  }
  // Método para listar categorías con productos
  // categoria-service.service.ts
obtenerProductosPorCategoria(nombreCategoria: string): Observable<any[]> {
  return this.http.get<any[]>(`${this.baseUrl}categoria/${nombreCategoria}`);
}

}

