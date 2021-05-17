import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from './component/page-not-found/page-not-found.component';
import { ProductListComponent } from './component/product/product-list/product-list.component';
import { ProductDetailsComponent } from './component/product/product-details/product-details.component';
import { CartDetailsComponent } from './component/cart/cart-details/cart-details.component';
import { LoginComponent } from './component/login/login.component';
import { RegistrationComponent } from './component/registration/registration.component';
import { PasswordResetComponent } from './component/password/password-reset/password-reset.component';
import { FacilityListComponent } from './component/facility/facility-list/facility-list.component';
import { FacilityDetailsComponent } from './component/facility/facility-details/facility-details.component';
import { InstructorListComponent } from './component/instructor/instructor-list/instructor-list.component';
import { InstructorDetailsComponent } from './component/instructor/instructor-details/instructor-details.component';
import { NgModule } from '@angular/core';
import { AboutUsComponent } from './component/about-us/about-us.component';
import { ContactUsComponent } from './component/contact-us/contact-us.component';
import { AdminProductsComponent } from './component/admin/admin-products/admin-products.component';
import { AdminUsersComponent } from './component/admin/admin-users/admin-users.component';
import { AdminInstructorsComponent } from './component/admin/admin-instructors/admin-instructors.component';
import { AdminFacilitesComponent } from './component/admin/admin-facilites/admin-facilites.component';
import { AdminTransactionsComponent } from './component/admin/admin-transactions/admin-transactions.component';
import { AdminLoginComponent } from './component/admin/admin-login/admin-login.component';
import { AdminIndexComponent } from './component/admin/admin-index/admin-index.component';
import { MenuBarComponent } from './component/menu/menu-bar/menu-bar.component';
import { SuccesPayComponent } from './component/cart/succes-pay/succes-pay.component';
import { UserProfileComponent } from './component/user/user-profile/user-profile.component';
import { UserPurchasesComponent } from './component/user/user-purchases/user-purchases.component';
import { UserTrainingSessionsComponent } from './component/user/user-training-sessions/user-training-sessions.component';
import { InstructorProfileComponent } from './component/instructor/instructor-profile/instructor-profile.component';
import { InstructorProfileSessionsComponent } from './component/instructor/instructor-profile-sessions/instructor-profile-sessions.component';
import { InstructorProfileInstDataComponent } from './component/instructor/instructor-profile-inst-data/instructor-profile-inst-data.component';
import {
  AuthGuardService as AuthGuard, AuthGuardService, RoleAuthGuardService
} from './auth/auth-guard.service';
import { UserCartDetailsComponent } from './component/user/user-cart-details/user-cart-details.component';
import { RegistrationConfirmComponent } from './component/registration/registration-confirm/registration-confirm.component';
import { PasswordResetRequestModel } from './common/password-reset-request-model';
import { PasswordResetRequestComponent } from './component/password/password-reset-request/password-reset-request.component';
import { CommonModule } from '@angular/common';
const routes: Routes = [
  {
    path: '',
    component: MenuBarComponent,
    children: [
      {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full'
      },
      {
        path: 'home',
        loadChildren: () => import('./routing/basic/basic.module').then(m => m.BasicModule)
      },
      { path: "cart-details", component: CartDetailsComponent, canActivate: [AuthGuardService] },
      { path: "products/:id", component: ProductDetailsComponent },
      { path: "products/search/:keyword", component: ProductListComponent },
      { path: "category/:id", component: ProductListComponent, },
      { path: "category", component: ProductListComponent, },
      { path: "products", component: ProductListComponent, },
      { path: "register", component: RegistrationComponent, },
      { path: "instructor/profile", component: InstructorProfileComponent, canActivate: [RoleAuthGuardService], data: { expectedRole: 'instructor' } },
      { path: "instructor/profile/training-sessions", component: InstructorProfileSessionsComponent, canActivate: [RoleAuthGuardService], data: { expectedRole: 'instructor' } },
      { path: "instructor/profile/instr-data", component: InstructorProfileInstDataComponent, canActivate: [RoleAuthGuardService], data: { expectedRole: 'instructor' } },

      { path: "instructors", component: InstructorListComponent, },
      { path: "instructors/:id", component: InstructorDetailsComponent, },
      { path: "facilities/:id", component: FacilityDetailsComponent, },
      { path: "facilities", component: FacilityListComponent, },
      { path: "login", component: LoginComponent },

      { path: "registration/activate", component: RegistrationConfirmComponent },
      { path: "password-reset-request", component: PasswordResetRequestComponent },
      { path: "password-reset", component: PasswordResetComponent },
      { path: "contact-us", component: ContactUsComponent },
      { path: "success-pay", component: SuccesPayComponent, canActivate: [AuthGuardService] },
      { path: "user/purhcases", component: UserPurchasesComponent, canActivate: [RoleAuthGuardService], data: { expectedRole: 'user' } },
      { path: "user/profile", component: UserProfileComponent, canActivate: [RoleAuthGuardService], data: { expectedRole: 'user' } },
      { path: "user/training-sessions", component: UserTrainingSessionsComponent, canActivate: [RoleAuthGuardService], data: { expectedRole: 'user' } },
      { path: "user/cart-details", component: UserCartDetailsComponent, canActivate: [RoleAuthGuardService], data: { expectedRole: 'user' } },
    ]
  },

  {
    path: '',
    component: AdminLoginComponent,
    children: [
      {
        path: '',
        redirectTo: '/admin',
        pathMatch: 'full'
      },
      {
        path: 'admin',
        loadChildren: () => import('./routing/admin-login/admin-login.module').then(m => m.AdminLoginModule)
      },
    ]
  },
  {
    path: '',
    component: AdminIndexComponent,
    canActivate: [RoleAuthGuardService], data: { expectedRole: 'admin' },
    children: [
      {
        path: '',
        redirectTo: '/admin/products',
        pathMatch: 'full',
        canActivate: [RoleAuthGuardService], data: { expectedRole: 'admin' }
      },
      {
        path: 'admin/products',
        loadChildren: () => import('./routing/admin/admin.module').then(m => m.AdminModule)
      },
      { path: "admin/users", component: AdminUsersComponent, canActivate: [RoleAuthGuardService], data: { expectedRole: 'admin' } },
      { path: "admin/instructors", component: AdminInstructorsComponent, canActivate: [RoleAuthGuardService], data: { expectedRole: 'admin' } },
      { path: "admin/facilites", component: AdminFacilitesComponent, canActivate: [RoleAuthGuardService], data: { expectedRole: 'admin' } },
      { path: "admin/transactions", component: AdminTransactionsComponent, canActivate: [RoleAuthGuardService], data: { expectedRole: 'admin' } },

    ]
  },

  { path: "", redirectTo: '/home', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent, pathMatch: 'full' },

];



@NgModule({
  imports: [CommonModule, RouterModule.forRoot(routes)],
  exports: [RouterModule],
  declarations: []
})
export class AppRoutingModule { }
