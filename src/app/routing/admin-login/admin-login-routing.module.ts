import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminLoginComponent } from 'src/app/component/admin/admin-login/admin-login.component';

const routes: Routes = [{
  path: '',
  component: AdminLoginComponent,
  children: [
    {
      path: 'admin',
      component: AdminLoginComponent
    }
  ]
}
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminLoginRoutingModule { }
