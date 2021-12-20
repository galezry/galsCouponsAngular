import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Coupon } from 'src/app/models/coupon.model';
import { UserType } from 'src/app/models/user-type.model';
import { AuthService } from 'src/app/services/auth.service';
import { CompanyRestService } from 'src/app/services/company-rest.service';
import { CustomerRestService } from 'src/app/services/customer-rest.service';
import { FormService } from 'src/app/services/form.service';
import { WelcomeRestService } from 'src/app/services/welcome-rest.service';

@Component({
  selector: 'app-single-coupon',
  templateUrl: './single-coupon.component.html',
  styleUrls: ['./single-coupon.component.css']
})
export class SingleCouponComponent implements OnInit {


  public couponImg = this.formService.singleCouponImg;
  public coupon: Coupon = Object.assign({}, this.formService.singleCoupon);
  // public companyName: string = this.formService.singleCouponCompanyName;
  // public singleCouponViewer: string = this.formService.singleCouponViewer;

  // public notAuthorizedErrMsg: string = this.authService.notAuthorizedErrMsg;
  public noCouponChosenMsg: string = 'Dear user, there is no coupon to view';
  public isAddedToCartMsgShown: boolean = false;

  constructor(private title: Title, private formService: FormService, private router: Router,
    private authService: AuthService, private companyRestService: CompanyRestService,
    private customerRestService: CustomerRestService,
    private welcomeRestService: WelcomeRestService) { }

  ngOnInit(): void {
    if(!this.isSingleCouponChosen()) {
      console.log('heyy');
      this.closePage();
      return;

    }
    this.title.setTitle(this.formService.singleCoupon.title);

  }

  public isSingleCouponChosen(): boolean {
    return this.formService.singleCoupon.id > 0;
  }

  public getTitle(): string {
    return this.coupon.title;
  }

  public getCoupon(): Coupon[] {
    let result: Coupon[] = [];
    result.push(this.coupon);
    return result;
  }

  public isStratDateShown(): boolean {
    if (this.getUser()==='admin' || (this.getUser() === 'company'
    && this.coupon.companyId === this.formService.currentLoggedInCompany.id))  {
      return true;
    }
    return !this.formService.isPastDate(this.coupon.startDate);
  }

  public isCategoryShown(): boolean {
    return this.isQuantityShown();
  }

  public isQuantityShown(): boolean {
    return this.getUser()==='admin' || (this.getUser() === 'company'
    && this.coupon.companyId === this.formService.currentLoggedInCompany.id);
  }

  public isQuantityMsgShown(): boolean {
    return (this.getUser()==='guest'
    || (this.getUser()==='customer' && !this.isCouponOwnedByCustomer()))
    && this.coupon.amount < 20;
  }
  //isCouponOwnedByCustomer()
  public getQuantityMsg(): string {
    let amount = this.coupon.amount;
    if (amount > 9) {
      return 'Not Many Coupons Left';
    }
    if (amount > 4 && amount < 10) {
      return 'Only a Few Coupons Left';
    }
    return "Coupon's Almost Gone";
  }

  public isPriceShown(): boolean {
    return this.getUser()==='admin' || this.getUser() === 'company';
  }

  public isPriceAndCartButtonShown(): boolean {
    return this.getUser() === 'guest'
    || (this.getUser() === 'customer' && !this.isCouponOwnedByCustomer());
  }

  public closePage(): void {
    if (this.formService.hasSingleCouponImgClickedFromHome) {
      this.router.navigateByUrl('home');
      return;
    }
    if (this.formService.hasSingleCouponImgClickedFromCart) {
      this.router.navigateByUrl('cart');
      return;
    }
    if (this.getUser() === 'company') {
      if (this.formService.hasSingleCouponImgClickedFromUpdate) {
        this.formService.coupon =  Object.assign({}, this.formService.singleCoupon);
        this.router.navigateByUrl('company/update-coupon');
      } else {
        this.router.navigateByUrl('company');
      }
      return;
    }
    if (this.getUser() === 'customer') {
      this.router.navigateByUrl('customer');
      return;
    }
    this.router.navigateByUrl('home');
  }

  public getUser(): string {
    return this.authService.getUser();
  }


  public getCompanyName(): string {
    if (this.formService.hasSingleCouponImgClickedFromHome) {
      return this.welcomeRestService.companyNames[this.coupon.companyId];
    }
    if (this.getUser() === 'company') {
      return this.formService.currentLoggedInCompany.name;
    }
    if (this.getUser() === 'customer') {
      return this.customerRestService.companiesNames[this.coupon.companyId];
    }
    return this.welcomeRestService.companyNames[this.coupon.companyId];
  }

  public isCouponOwnedByCustomer(): boolean {
    return this.customerRestService.getCustomerCouponsIdArr().includes(this.coupon.id);
  }

  public addToCart(): void {
    const couponToInsert: Coupon = Object.assign({}, this.coupon)
    this.customerRestService.cart.push(couponToInsert);
    console.log(this.customerRestService.cart);
    this.isAddedToCartMsgShown = true;
  }

  public isCouponInCart(): boolean {
    return this.customerRestService.isCouponInCart(this.coupon.id);
    // const couponsWithThisId: Coupon[] =
    // this.customerRestService.cart.filter(c => c.id === this.coupon.id);
    // return couponsWithThisId.length > 0;
  }

  public isAddToCartBtnShown(): boolean {
    return this.getUser() === 'customer' && !this.isCouponInCart()
    && !this.isCouponOwnedByCustomer();
  }

  public isSignInBtnShown(): boolean {
    return this.getUser() === 'guest';
  }













}


