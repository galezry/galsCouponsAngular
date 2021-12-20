import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Coupon } from 'src/app/models/coupon.model';
import { UserType } from 'src/app/models/user-type.model';
import { AuthService } from 'src/app/services/auth.service';
import { CustomerRestService } from 'src/app/services/customer-rest.service';
import { DevService } from 'src/app/services/dev.service';
import { FormService } from 'src/app/services/form.service';
import { WelcomeRestService } from 'src/app/services/welcome-rest.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  public isErrMsgShown: boolean = false;
  public errMsg: string = '';
  public successMsg: string =
  'The transaction went through successfully. Thank you for your order!';
  public isSuccessMsgShown: boolean = false;
  public rand: number = Math.floor(Math.random() * 11) + 1; // rand num btwn 1-11
  public isPaymentAlertShown: boolean = false;

  public isPurchaseActionOver: boolean = false;
  public purchasedSuccesfully: number[] = [];
  public waitMsg: string = 'The Trasaction is in Process... Please Wait';
  public isWaitMsgShown: boolean = false;

  public imageHeight: string = this.formService.getImgHeight();
  public imageStyle: string = this.formService.getImgStyle();

  public imagesToDisplay = this.customerRestService.imagesToDisplay;

  constructor(private customerRestService: CustomerRestService, private devService: DevService,
    private authService: AuthService, private title: Title, private router: Router,
    private formService: FormService, private welcomeRestService: WelcomeRestService) { }

  ngOnInit(): void {

    if (!this.authService.hasAlreadyRetrievedCustomerCouponsFromServer) {
      this.authService.isCustomerCouponsSelected = true;
      this.router.navigateByUrl('customer');
      return;
    }

    this.title.setTitle("Cart");
  //  this.getCouponsInCart();
    // console.log(!this.authService.isLoggedIn);
    // console.log(!this.isUserTypeCustomer());
  }

  public getImgStyle(): string {
    return this.formService.getImgStyle();
  }

  public shortenTitle(title: string): string {
    return this.formService.shortenTitle(title);
  }



  public getCompanyName(companyId: number): string {
    return this.customerRestService.companiesNames[companyId];
  }

  public getCouponsInCart(): Coupon[] {
    if (!this.authService.isLoggedIn) {
      this.isErrMsgShown = true;
      this.errMsg = this.authService.notLoggedInErrMsg;
      return [];
    }
    if (!this.isUserTypeCustomer()) {
      this.isErrMsgShown = true;
      this.errMsg = this.authService.notAuthorizedErrMsg;
      return [];
    }
    return this.customerRestService.cart;
  }

  public removeFromCart(couponId: number): void {
    this.customerRestService.removeFromCart(couponId);
  }

  // public isCouponInCart(couponId: number): boolean {
  //   const couponsWithThisId: Coupon[] =
  //   this.customerRestService.cart.filter(c => c.id === couponId);
  //   return couponsWithThisId.length > 0;
  // }

  public getTotalPrice(): number {
    let sum = 0;
    for (let c of this.customerRestService.cart) {
      sum += c.price;
    }
    return sum;
  }

  public purchaseCoupon(coupon: Coupon): void {
    if (!this.authService.isLoggedIn) {
      this.isErrMsgShown = true;
      this.errMsg = this.authService.notLoggedInErrMsg;
      return;
    }
    if (!this.isUserTypeCustomer()) {
      this.isErrMsgShown = true;
      this.errMsg = this.authService.notAuthorizedErrMsg;
      return;
    }
    this.isPurchaseActionOver = false;

    console.log(coupon.amount);
    this.customerRestService.purchaseCoupon(coupon).subscribe(response => {
      console.log(response); // TODO delete this line
      if (coupon.amount < 2) {
        this.welcomeRestService.hasAlreadyRetrievedWelcomeCouponsFromServer = false;
      }
      console.log(coupon.amount);
      const purchasedCoupon: Coupon = Object.assign({}, coupon);
      this.customerRestService.customerCoupons.push(purchasedCoupon);
      this.customerRestService.allCoupons = this.customerRestService.allCoupons
      .filter(c => c.id !== coupon.id);
      // this.customerRestService.cart = this.customerRestService.cart
      // .filter(c => c.id !== coupon.id);
      // this.authService.hasAlreadyRetrievedCustomerCouponsFromServer = false;
      // this.authService.hasAlreadyRetrievedAllCouponsFromServer = false;

      this.isErrMsgShown = false;
      this.isPurchaseActionOver = true;

      this.purchasedSuccesfully.push(coupon.id);

    }, err => {
      console.log(err.error); // TODO delete this line
      this.showErrMsg(err);
      this.isPurchaseActionOver = true;
    });
  }

  public sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  public async buyCoupons(): Promise<void> {
    const couponsToBuy: Coupon[] = [...this.customerRestService.cart];
    this.isWaitMsgShown = true;
    for (let coupon of couponsToBuy) {
      this.purchaseCoupon(coupon);
      while (!this.isPurchaseActionOver) {
        await this.sleep(100);
      }

      // let couponsWithThisId: Coupon[] =
      // this.customerRestService.customerCoupons.filter(c => c.id === coupon.id);
      // if (couponsWithThisId.length === 0) {
      //   this.purchaseCoupon(coupon);
      // } else {
      //   console.log("can't buy coupon more than once");
      // }
    }
    this.customerRestService.cart = this.customerRestService.cart
    .filter(c => !this.purchasedSuccesfully.includes(c.id));
    console.log(this.customerRestService.cart);

    this.customerRestService.couponIdCart = this.customerRestService.couponIdCart
    .filter(couponId => !this.purchasedSuccesfully.includes(couponId));
    console.log(this.customerRestService.couponIdCart);



    this.purchasedSuccesfully.splice(0);
    if (this.customerRestService.cart.length === 0) {
      this.isWaitMsgShown = false;
      this.isSuccessMsgShown = true;
      this.customerRestService.updateCartInLS();
    }
  }

  public shouldShowSuccessMsg(): boolean {
    return this.isSuccessMsgShown;
  }

  public goToMyCoupons() {
    this.authService.isCustomerCouponsSelected = true;
    this.authService.isCustomerProfileSelected = false;
    this.router.navigateByUrl('customer');
  }

  public goToAllCoupons() {
    this.authService.isCustomerCouponsSelected = false;
    this.authService.isCustomerProfileSelected = false;
    this.router.navigateByUrl('customer');
  }

  public isCustomerCouponsInitialized(): boolean {
    return this.authService.hasAlreadyRetrievedCustomerCouponsFromServer;
  }

  public isAllCouponsEmpty(): boolean {
    return this.authService.hasAlreadyRetrievedAllCouponsFromServer
    && this.customerRestService.allCoupons.length === 0;
  }

  public isCartEmpty(): boolean {
    return this.customerRestService.cart.length === 0;
  }

  public getEmpyCartImg(): string {
    const srcPre: string = '../../../assets/images/empty-cart/empty-cart';
    let srcSuff: string = this.rand > 8 ? '.png' : '.jpeg';
    let src = srcPre + this.rand + srcSuff;
    return src;
  }

  public getEmpyCartWidth(): string {
    const pre: string = 'width: ';
    let suff: string = '';
    switch (this.rand) {
      case 1:
      case 2:
      case 5:
      case 11:
        suff = '40%';
        break;
      case 3:
      case 6:
        suff = '35%';
        break;
      case 4:
      case 10:
        suff = '50%';
        break;
      case 7:
        suff = '41%';
        break;
      case 8:
        suff = '44%';
        break;
      case 9:
        suff = '48%';
        break;
      default:
        break;
    }
    return pre + suff;
  }

  public getVisaNum(): number {
    const first: string = this.formService.currentLoggedInCustomer.firstName;
    const last: string = this.formService.currentLoggedInCustomer.lastName;
    let numLeft: number = 4 - first.length;
    let firstLen: number = 4;
    if (numLeft > 0) {
      firstLen = first.length;
    }
    let result: number = 0;
    let idx: number = 0;
    for (let i = 0; i < firstLen; i++) {
      let deg = first.charCodeAt(i) % 10;
      result += deg * Math.pow(10, idx++);
    }
    if (numLeft > 0) {
      for (let i = 0; i < numLeft; i++) {
        let deg2 = last.charCodeAt(i) % 10;
        result += deg2 * Math.pow(10, idx++);
      }
    }
    return result;
  }

  public getCircles(): string {
    if (this.formService.screenWidth < 375) {
      return '●●●●';
    }
    if (this.formService.screenWidth < 480) {
      return '●●●●●●';
    }
    return '●●●●●●●●';
  }

  public togglePaymentAlert() {
    this.isPaymentAlertShown = !this.isPaymentAlertShown;
  }

  public openSingleCoupon(coupon: Coupon): void {
    this.router.navigateByUrl('coupon');
    this.formService.singleCoupon = Object.assign({}, coupon);
    this.formService.singleCouponImg = this.imagesToDisplay[coupon.id];
    this.formService.hasSingleCouponImgClickedFromCart = true;
    this.formService.hasSingleCouponImgClickedFromHome = false;
    this.formService.hasSingleCouponImgClickedFromUpdate = false;
  }



  public showErrMsg(err: any) {
    this.isErrMsgShown = true;
    this.errMsg = this.authService.connectionToServerAndLoginCheck(err);
  }

  public isUserTypeCustomer(): boolean {
    return this.authService.getUserType() === UserType.CUSTOMER;
  }

  public isLoggedIn(): boolean {
    return this.authService.isLoggedIn;
  }

  public isDevMode(): boolean {
    return this.devService.isDevMode;
  }

}
