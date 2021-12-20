import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './components/about/about.component';
import { AdminComponent } from './components/admin/admin.component';
import { CartComponent } from './components/cart/cart.component';
import { CompanyFormComponent } from './components/company-form/company-form.component';
import { CompanyComponent } from './components/company/company.component';
import { ContactComponent } from './components/contact/contact.component';
import { CouponFormComponent } from './components/coupon-form/coupon-form.component';
import { CustomerFormComponent } from './components/customer-form/customer-form.component';
import { CustomerComponent } from './components/customer/customer.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { Page404Component } from './components/page404/page404.component';
import { RestoreCouponsComponent } from './components/restore-coupons/restore-coupons.component';
import { RestoreComponent } from './components/restore/restore.component';
import { SingleCouponComponent } from './components/single-coupon/single-coupon.component';

const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'customer-sign-up', component: CustomerFormComponent},
  {path: 'company-sign-up', component: CompanyFormComponent},
  {path: "home", component: HomeComponent},
  {path: "about", component: AboutComponent},
  {path: "contact", component: ContactComponent},
  {path: "admin", component: AdminComponent},
  {path: "admin/add-company", component: CompanyFormComponent},
  {path: "admin/update-company", component: CompanyFormComponent},
  {path: "admin/add-customer", component: CustomerFormComponent},
  {path: "admin/update-customer", component: CustomerFormComponent},
  {path: "admin/restore-cc", component: RestoreComponent},
  {path: "company", component: CompanyComponent},
  {path: "company/add-coupon", component: CouponFormComponent},
  {path: "company/update-coupon", component: CouponFormComponent},
  {path: "company/restore-c", component: RestoreCouponsComponent},
  {path: "customer", component: CustomerComponent},
  {path: "coupon", component: SingleCouponComponent},
  {path: "cart", component: CartComponent},
  {path: "", redirectTo:"home", pathMatch: "full"},
  {path: "**", component: Page404Component},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
