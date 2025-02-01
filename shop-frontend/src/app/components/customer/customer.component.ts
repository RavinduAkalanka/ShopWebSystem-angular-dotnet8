import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ICustomer } from '../../model/interface/customer';
import { CustomerService } from '../../service/customer.service';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-customer',
  imports: [CommonModule, DatePipe, ReactiveFormsModule,NgxPaginationModule],
  templateUrl: './customer.component.html',
  styleUrl: './customer.component.css',
})
export class CustomerComponent implements OnInit {
  CustomerList: ICustomer[] = [];
  customerService = inject(CustomerService);
  showModel: boolean = false;
  isLoading: boolean = true;
  isEditMode: boolean = false;

  errorMessage: string = '';
  successMessage: string = '';

  // Pagination
  p: number = 1;

  customerForm = new FormGroup({
    customerId: new FormControl(0),
    customerName: new FormControl('', [
      Validators.required,
      Validators.minLength(4),
    ]),
    email: new FormControl('', [Validators.required, Validators.email]),
    phoneNo: new FormControl('', [Validators.required]),
    registrationDate: new FormControl(''),
  });

  openModel() {
    this.showModel = true;
  }

  closeModel() {
    this.showModel = false;
    this.resetForm();
  }

  ngOnInit(): void {
    this.getAllCustomers();
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
    this.customerForm.reset({
      customerId: 0,
      customerName: '',
      email: '',
      phoneNo: '',
      registrationDate: '',
    });
    this.isEditMode = false;
  }

  getAllCustomers() {
    this.isLoading = true;
    this.customerService.getAllCustomers().subscribe(
      (res: ICustomer[]) => {
        console.log('Fetch customers:', res);
        this.CustomerList = res;
        this.CustomerList.sort((a, b) => new Date(b.registrationDate).getTime() - new Date(a.registrationDate).getTime());
        this.isLoading = false;
      },
      (error) => {
        alert('An error occurred while fetching customers');
        this.isLoading = false;
      }
    );
  }

  addCustomer() {
    const formValue = this.customerForm.value;
    if (this.isEditMode) {
      this.updateCustomer(formValue);
    } else {
      this.customerService.addCustomer(formValue).subscribe(
        (res: any) => {
          if (res) {
            this.successMessage = 'Product added successfully.';
            this.getAllCustomers();
            this.resetForm();
            this.closeModel();
            this.hideMessage('success', 10000);
          } else {
            this.errorMessage = 'Faild to add customer';
            this.hideMessage('error', 10000);
          }
        },
        (err: any) => {
          console.error('Backend error:', err);

          if (err.status === 409) {
            this.errorMessage = err.error || 'Email already exists!';
          } else {
            this.errorMessage = 'Something went wrong!';
          }
          this.hideMessage('error', 10000);
        }
      );
    }
  }

  updateCustomer(customer: any) {
    this.customerService.updateCustomer(customer).subscribe(
      (res: any) => {
        this.successMessage = 'Customer updated successfully.';
        this.getAllCustomers();
        this.resetForm();
        this.closeModel();
        this.hideMessage('success', 10000);
      },
      (err: any) => {
        if (err.status === 409) {
          this.errorMessage = ' Email already exists.';
        } else {
          this.errorMessage = 'Failed to update customer.';
        }
        this.hideMessage('error', 10000);
      }
    );
  }

  editCustomer(customer: any) {
    this.isEditMode = true;
    this.customerForm.patchValue(customer);
    this.openModel();
  }

  deleteCustomer(id: number) {
    const isDelete = confirm('Are you sure you want to delete this customer?');
    if (isDelete) {
      this.customerService.deleteCustomer(id).subscribe(
        (res: any) => {
          if (res.status === 204) {
            this.successMessage = 'Customer delete successfully.';
            this.getAllCustomers();
            this.hideMessage('success', 10000);
          } else {
            this.errorMessage = 'Failed to delete customer.';
            this.hideMessage('error', 10000);
          }
        },
        (err: any) => {
          this.errorMessage =
            err.error || 'An error occurred while deleting the customer.';
        }
      );
    }
  }
}
