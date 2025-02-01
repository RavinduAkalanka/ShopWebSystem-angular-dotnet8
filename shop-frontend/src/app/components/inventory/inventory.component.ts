import { Component, inject, OnInit } from '@angular/core'; // Add ViewChild import
import { InventoryService } from '../../service/inventory.service';
import { IProduct } from '../../model/interface/product';
import { CommonModule } from '@angular/common';
import { Product } from '../../model/class/Product';
import { FormsModule, NgForm } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { fakeAsync } from '@angular/core/testing';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-inventory',
  imports: [CommonModule, FormsModule, NgxPaginationModule],
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.css',
})
export class InventoryComponent implements OnInit {
  inventoryService = inject(InventoryService);
  ProductsList: IProduct[] = [];
  productObj: Product = new Product();

  isEditMode: boolean = false;
  isLoading: boolean = true;

  // Pagination
  p: number = 1;

  errorMessage: string = '';
  successMessage: string = '';


  ngOnInit(): void {
    this.getAllProducts();
  }

  hideMessage(messageType: 'success' | 'error', timeout: number) {
    setTimeout(() => {
      if (messageType === 'success') {
        this.successMessage = '';
      } else if (messageType === 'error') {
        this.errorMessage = '';
      }
    }, timeout);
  }

  resetForm() {
    this.productObj = new Product(); // Reset the productObj to its initial state
    this.isEditMode = false;
  }


  getAllProducts() {
    this.isLoading = true;
    this.inventoryService.getAllProducts().subscribe(
      (res: IProduct[]) => {
        console.log('Fetched Products:', res);
        this.ProductsList = res.sort((a, b) => b.productId - a.productId);
        this.isLoading = false;
      },
      (error) => {
        alert('An error occurred while fetching products');
        this.isLoading = false;
      }
    );
  }


  addProducts() {
    this.inventoryService.addProduct(this.productObj).subscribe(
      (res: any) => {
        if (res) {
          this.successMessage = 'Product added successfully.';
          this.getAllProducts();
          this.resetForm();
          this.hideMessage('success', 10000);
        } else {
          this.errorMessage = 'Failed to add Product.';
          this.hideMessage('error', 10000);
        }
      },
      (err: any) => {
        console.error('Backend error:', err);

        if (err.status === 409) {
          this.errorMessage = err.error || 'Product code or name already exists.';
        } else {
          this.errorMessage = 'Something went wrong!';
        }
        this.hideMessage('error', 10000);
      }
    );
  }

  deleteProduct(id: number) {
    const isDelete = confirm('Are you sure you want to delete this product?');
    if (isDelete) {
      this.inventoryService.deleteProduct(id).subscribe(
        (res: any) => {
          if (res.status === 204) {
            this.successMessage = 'Product delete successfully.';
            this.getAllProducts();
            this.hideMessage('success', 10000);
          } else {
            this.errorMessage = 'Failed to delete product.';
            this.hideMessage('error', 10000);
          }
        },
        (err: any) => {
          this.errorMessage =
            err.error || 'An error occurred while deleting the product.';
        }
      );
    }
  }

  editProduct(product: Product): void {
    this.productObj = { ...product }; // Clone the product to avoid direct mutation
    this.isEditMode = true;
  }

  updateProduct() {
    this.inventoryService
      .updateProduct(this.productObj.productId, this.productObj)
      .subscribe(
        (res: any) => {
          if (res) {
            this.successMessage = 'Product updated successfully.';
            this.getAllProducts(); 
            this.resetForm();
            this.isEditMode = false;
            this.hideMessage('success', 10000);
          } else {
            this.errorMessage = 'Failed to edit Product.';
            this.hideMessage('error', 10000);
          }
        },
        (err: any) => {
          if (err.status === 400) {
            this.errorMessage = err.error; 
          } else if (err.status === 404) {
            this.errorMessage =
              'The product with the specified ID was not found.';
          } else if (err.status === 409) {
            this.errorMessage = err.error; // Handle conflict errors for ProductCode or ProductName
          } else {
            this.errorMessage =
              'Failed to update product due to an unexpected error.';
          }
          console.error(err);
          this.hideMessage('error', 10000); 
        }
      );
  }

  generatePDF() {
    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.text('Inventory Details', 14, 10);
  
    // Define the table headers and rows
    const headers = [
      ['Product Code', 'Product Name', 'Product Category', 'Unit Price ($)', 'Stock Available', 'Reorder Point'],
    ];
  
    const rows = this.ProductsList.map(product => [
      product.productCode,
      product.productName,
      product.productCategory,
      product.unitPrice.toFixed(2), // Format price as decimal
      product.stock,
      product.reorderPoint,
    ]);
  
    // Use autoTable to add the table
    autoTable(doc, {
      startY: 20,
      head: headers,
      body: rows,
      theme: 'grid',
      styles: { fontSize: 10 },
      headStyles: { fillColor: [41, 128, 185] },
    });
  
    doc.setFontSize(12);
    // Add a footer with the generation date
    doc.text(
      'Generated on: ' + new Date().toLocaleDateString(), 
      14, 
      doc.internal.pageSize.height - 10 // Bottom of the page
    );
  
    // Save the PDF
    doc.save('inventory-details.pdf');
  }
  
}
