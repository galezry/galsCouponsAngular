import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Coupon } from 'src/app/models/coupon.model';
import { FormState } from 'src/app/models/form-state.model';
import { AuthService } from 'src/app/services/auth.service';
import { FormService } from 'src/app/services/form.service';
import { WelcomeRestService } from 'src/app/services/welcome-rest.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  public arr: string[] = [];

  public isErrMsgShown: boolean = false;
  public errMsg: string = '';

  constructor(private title: Title, private welcomeRestService: WelcomeRestService,
    private formService: FormService, private authService: AuthService,
    private router: Router) { }

  ngOnInit(): void {
    if (this.authService.isLoggedIn && this.authService.isUserTypeCustomer()
    && !this.authService.hasAlreadyRetrievedCustomerCouponsFromServer) {
      this.router.navigateByUrl('customer');
      return;
    }

    this.title.setTitle("Home");
    this.getWelcomeCouponsAndImages();
  }

  public getWelcomeCouponsAndImages(): void {
    // if user type customer or if already retrived from server - dont retrive from server.

    if (!this.welcomeRestService.hasAlreadyRetrievedWelcomeCouponsFromServer) {
      this.welcomeRestService.getWelcomeCoupons().subscribe(response => {
        console.log(response); // TODO delete this line
        this.isErrMsgShown = false;
        this.welcomeRestService.hasAlreadyRetrievedWelcomeCouponsFromServer = true;
        this.welcomeRestService.welcomeCoupons = [...response.coupons];
        this.welcomeRestService.welcomeCoupons = this.welcomeRestService.welcomeCoupons
        .filter(c => this.formService.isFutureDate(c.endDate))
        .filter(c => c.amount > 0); // no need - the backend function takes care of these 2 cases.
        this.welcomeRestService.welcomeImages = [...response.images];
        this.welcomeRestService.fillCompanyNames();
        for (let i of this.welcomeRestService.welcomeImages) {
          this.welcomeRestService.imagesToDisplay[i.couponId] = 'data:image/jpeg;base64,' + i.picture;
        }

      }, err => {
        console.log(err.error); // TODO delete this line
        this.showErrMsg(err);
      });
    } else {
     // this.customersToShow = [...this.adminRestService.customers];

    }
  }

  public signUpAsCustomer() {
    this.welcomeRestService.isSignedOutMsgShown = false;
    this.formService.customerForm = FormState.ADD;
    this.authService.isCustomerSignUp = true;
  }

  public areThereNoCoupon(): boolean {
    return this.welcomeRestService.welcomeCoupons.length === 0;
  }

  public getImagesToDisplay(): any[] {
    return this.welcomeRestService.imagesToDisplay;
  }

  public getWelcomeCoupons(): any[] {
    return this.welcomeRestService.welcomeCoupons;
  }

  public openSingleCoupon(coupon: Coupon): void {
    this.router.navigateByUrl('coupon');
    this.formService.singleCoupon = Object.assign({}, coupon);
    this.formService.singleCouponImg = this.welcomeRestService.imagesToDisplay[coupon.id];
    this.formService.hasSingleCouponImgClickedFromHome = true;
    this.formService.hasSingleCouponImgClickedFromCart = false;
    this.formService.hasSingleCouponImgClickedFromUpdate = false;
  }

  public isSignedIn(): boolean {
    return this.authService.isLoggedIn;
  }

  public isTopCouponsHeadlineShown(): boolean {
    return this.welcomeRestService.welcomeCoupons.length > 1;
  }

  public isAlternativeImageShown(): boolean {
    return (this.welcomeRestService.hasAlreadyRetrievedWelcomeCouponsFromServer
    && this.areThereNoCoupon()) || this.isErrMsgShown;
  }

  public isMobile(): boolean {
    return this.formService.getScreenType() === 'mobile';
  }

  public showErrMsg(err: any) {
    this.isErrMsgShown = true;
    this.errMsg = this.authService.connectionToServerAndLoginCheck(err);
  }









}
