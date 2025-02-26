import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoriaServiceService {
  private baseUrl = 'http://localhost:3000';  // Cambia esto a la URL de tu API

  constructor(private http: HttpClient) { }

  listarCategorias(): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/categoria/categoria_upload`);
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
  listarCategoriasConProductos(): Observable<{ message: string; data: any[] }> {
    return this.http.get<{ message: string; data: any[] }>(`${this.baseUrl}/api/categoria/categorias_con_productos`);
  }
}

