import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { HomeComponent } from './components/home/home.component';
import { MenuComponent } from './components/menu/menu.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { LoginComponent } from './components/login/login.component';
import { LayoutComponent } from './components/layout/layout.component';
import { Page404Component } from './components/page404/page404.component';
import { FormsModule } from '@angular/forms';
import { AboutComponent } from './components/about/about.component';
import { HttpClientModule } from '@angular/common/http';
import { AdminComponent } from './components/admin/admin.component';
import { CustomerComponent } from './components/customer/customer.component';
import { CompanyComponent } from './components/company/company.component';
import { CompanyCrudComponent } from './components/company-crud/company-crud.component';
import { CustomerCrudComponent } from './components/customer-crud/customer-crud.component';
import { EmptyViewComponent } from './components/empty-view/empty-view.component';
import { CompanyFormComponent } from './components/company-form/company-form.component';
import { MessageComponent } from './components/message/message.component';
import { CustomerFormComponent } from './components/customer-form/customer-form.component';
import { CouponCrudComponent } from './components/coupon-crud/coupon-crud.component';
import { CouponFormComponent } from './components/coupon-form/coupon-form.component';
import { CustomerCouponsComponent } from './components/customer-coupons/customer-coupons.component';
import { AllCouponsComponent } from './components/all-coupons/all-coupons.component';
import { CartComponent } from './components/cart/cart.component';
import { SingleCouponComponent } from './components/single-coupon/single-coupon.component';
import { ContactComponent } from './components/contact/contact.component';
import { AboutAppComponent } from './components/about-app/about-app.component';
import { AboutStackComponent } from './components/about-stack/about-stack.component';
import { AboutTeamComponent } from './components/about-team/about-team.component';
import { RestoreComponent } from './components/restore/restore.component';
import { RestoreCouponsComponent } from './components/restore-coupons/restore-coupons.component';


@NgModule({
  declarations: [
    HomeComponent,
    MenuComponent,
    HeaderComponent,
    FooterComponent,
    LoginComponent,
    LayoutComponent,
    Page404Component,
    AboutComponent,
    AdminComponent,
    CustomerComponent,
    CompanyComponent,
    CompanyCrudComponent,
    CustomerCrudComponent,
    EmptyViewComponent,
    CompanyFormComponent,
    MessageComponent,
    CustomerFormComponent,
    CouponCrudComponent,
    CouponFormComponent,
    CustomerCouponsComponent,
    AllCouponsComponent,
    CartComponent,
    SingleCouponComponent,
    ContactComponent,
    AboutAppComponent,
    AboutStackComponent,
    AboutTeamComponent,
    RestoreComponent,
    RestoreCouponsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [LayoutComponent]
})
export class AppModule { }
