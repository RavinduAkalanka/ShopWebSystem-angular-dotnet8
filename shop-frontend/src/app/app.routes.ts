import { Routes } from '@angular/router';
import { InventoryComponent } from './components/inventory/inventory.component';
import { CustomerComponent } from './components/customer/customer.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { authGuard } from './guard/auth.guard';
import { LayoutComponent } from './components/layout/layout.component';

export const routes: Routes = [
    {
      path: '',
      redirectTo: 'login',
      pathMatch: 'full'
    },
    {
      path: 'login',
      component: LoginComponent
    },
    {
      path: 'register',
      component: RegisterComponent
    },
    {
      path: '',
      component: LayoutComponent,
      canActivate: [authGuard],
      children: [
        { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
        { path: 'inventory', component: InventoryComponent, canActivate: [authGuard] },
        { path: 'customer', component: CustomerComponent, canActivate: [authGuard] }
      ]
    }
  ];
  