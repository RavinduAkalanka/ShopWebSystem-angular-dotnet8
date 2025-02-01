import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Product } from '../model/class/Product';

@Injectable({
  providedIn: 'root',
})
export class InventoryService {
  constructor(private http: HttpClient) {}

  getAllProducts(): Observable<any> {
    return this.http.get<any>(`${environment.API_URL}${environment.endpoints.products}getall`);
  }

  addProduct(Obj: Product): Observable<any> {
    return this.http.post<any>(`${environment.API_URL}${environment.endpoints.products}add`, Obj);
  }

  deleteProduct(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${environment.API_URL}${environment.endpoints.products}delete/${id}`, { observe: 'response' });
  }

  updateProduct(id: number, Obj: Product): Observable<HttpResponse<any>> {
    return this.http.put<any>(`${environment.API_URL}${environment.endpoints.products}update/${id}`, Obj, { observe: 'response' });
  }
  
}