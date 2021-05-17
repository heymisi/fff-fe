import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminProductsComponent } from 'src/app/component/admin/admin-products/admin-products.component';

const routes: Routes = [{
  path: '',
  component: AdminProductsComponent,
  children: [
    {
      path: 'admin/products',
      component: AdminProductsComponent,
    }
  ]
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
