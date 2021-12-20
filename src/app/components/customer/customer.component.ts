import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { FormState } from 'src/app/models/form-state.model';
import { UserType } from 'src/app/models/user-type.model';
import { AuthService } from 'src/app/services/auth.service';
import { CustomerRestService } from 'src/app/services/customer-rest.service';
import { FormService } from 'src/app/services/form.service';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {

  constructor(private title: Title, private authService: AuthService,
    private formService: FormService, private customerRestService: CustomerRestService) { }

  ngOnInit(): void {
    this.title.setTitle("Customer");
  }

  public isProfileSelected(): boolean {
    return this.authService.isCustomerProfileSelected;
  }

  public isMyCouponsSelected(): boolean {
    return this.authService.isCustomerCouponsSelected;
  }

  public showMyCoupons(): void {
    this.authService.isCustomerCouponsSelected = true;
    this.authService.isCustomerProfileSelected = false;
    this.title.setTitle("Customer");
  }

  public showAllCoupons(): void {
    this.authService.isCustomerProfileSelected = false;
    this.authService.isCustomerCouponsSelected = false;
    this.title.setTitle("Customer");
  }

  public showProfile(): void {
    this.authService.isCustomerProfileSelected = true;
    this.authService.isCustomerCouponsSelected = false;
    this.formService.customerForm = FormState.UPDATE;
    this.formService.customer =
    Object.assign({}, this.formService.currentLoggedInCustomer);
  }

  public isUserTypeCustomer(): boolean {
    return this.authService.getUserType() === UserType.CUSTOMER;
  }

  public isLoggedIn(): boolean {
    return this.authService.isLoggedIn;
  }

}
