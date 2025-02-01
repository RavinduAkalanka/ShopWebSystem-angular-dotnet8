import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { CustomerService } from '../../service/customer.service';
import { InventoryService } from '../../service/inventory.service';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, DatePipe,RouterOutlet],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  totalProducts: number = 0;
  totalCustomers: number = 0;
  lowStockProducts: any[] = [];
  recentCustomers: any[] = [];

  customerService = inject(CustomerService);
  inventoryService = inject(InventoryService);

  ngOnInit(): void {
    this.fetchSummary();
  }

  fetchSummary() {
    this.inventoryService.getAllProducts().subscribe(
      (products: any) => {
        console.log('Products:', products); 
        this.totalProducts = products.length;
        this.lowStockProducts = products.filter((product: any) => product.stock < 3);
      },
      (error) => {
        alert('An error occurred while fetching products');
      }
    );

    this.customerService.getAllCustomers().subscribe(
      (customers: any) => {
        console.log('Customers:', customers); 
        this.totalCustomers = customers.length;
        customers.sort((a:any, b:any) => new Date(b.registrationDate).getTime() - new Date(a.registrationDate).getTime());
        this.recentCustomers = customers.slice(0, 3);
      },
      (error) => {
        alert('An error occurred while fetching customers');
      }
    );
  }
}
