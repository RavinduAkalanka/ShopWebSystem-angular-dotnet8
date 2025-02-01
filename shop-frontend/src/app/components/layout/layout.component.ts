import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-layout',
  imports: [RouterOutlet,RouterModule,RouterLink],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {
  router = inject(Router);

  signOut() {
    localStorage.removeItem('AngularToken');
    this.router.navigateByUrl('/login');
  }
}
