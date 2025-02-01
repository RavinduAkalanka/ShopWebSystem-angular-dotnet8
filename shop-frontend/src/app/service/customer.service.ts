import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ICustomer } from '../model/interface/customer';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  constructor(private http:HttpClient) { }

  getAllCustomers(): Observable<any> {
    return this.http.get<any>(`${environment.API_URL}${environment.endpoints.customers}getall`)
  }

  addCustomer(customerData: any): Observable<any> {
    return this.http.post<any>(`${environment.API_URL}${environment.endpoints.customers}add`, customerData);
  }

  deleteCustomer(id: number): Observable<any> {
    return this.http.delete<any>(`${environment.API_URL}${environment.endpoints.customers}delete/${id}`, { observe: 'response' })
  }

  updateCustomer(customer: any): Observable<any> {
    return this.http.put<any>(`${environment.API_URL}${environment.endpoints.customers}update/${customer.customerId}`, customer);
  }
}
