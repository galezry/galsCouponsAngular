import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Category } from 'src/app/models/category.model';
import { Company } from 'src/app/models/company.model';
import { Coupon } from 'src/app/models/coupon.model';
import { UserType } from 'src/app/models/user-type.model';
import { AuthService } from 'src/app/services/auth.service';
import { CustomerRestService } from 'src/app/services/customer-rest.service';
import { DevService } from 'src/app/services/dev.service';
import { FormService } from 'src/app/services/form.service';

@Component({
  selector: 'app-all-coupons',
  templateUrl: './all-coupons.component.html',
  styleUrls: ['./all-coupons.component.css']
})
export class AllCouponsComponent implements OnInit {

  public isErrMsgShown: boolean = false;
  public errMsg: string = '';

  public companySearched = '';
  public ctgrSearched: Category = Category.NONE;
  public titleSearched = '';
  public maxPriceSearched: number = 1000;

  public minPrice: number = this.formService.minCouponPrice;

  public couponsToShow: Coupon[] = [];

//  public company: Company = new Company(); // for getOneCompany method
  public companies: Company[] = [];
 // public hasResponseReceived: boolean = false;


  public ctgr = Category;
  public keysOfCtgr(): Array<string> {
    let keys = Object.keys(this.ctgr);
    return keys.slice(keys.length / 2).slice(2);
  }
  public keysOfCtgrForSearch(): Array<string> {
    let keys = Object.keys(this.ctgr);
    return keys.slice(keys.length / 2).slice(1);
  }

  // public imageHeight: string = this.formService.getImgHeight();
  // public imageStyle: string = this.formService.getImgStyle();

  public imagesToDisplay = this.customerRestService.imagesToDisplay;

  constructor(private customerRestService: CustomerRestService,
    private devService: DevService, private formService: FormService,
    private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    if (!this.authService.isLoggedIn) {
      this.authService.hasAlreadyRetrievedAllCouponsFromServer = false;
      this.authService.hasAlreadyRetrievedAllImagesFromServer = false;
      this.customerRestService.allCoupons = [];
      this.customerRestService.allOtherImages = [];
      this.customerRestService.imagesToDisplay = [];
    //  this.customerRestService.allImagesToDisplay = [];
      this.isErrMsgShown = true;
      this.errMsg = this.authService.notLoggedInErrMsg;
      return;
    }
    if (!this.isUserTypeCustomer()) {
      this.isErrMsgShown = true;
      this.errMsg = this.authService.notAuthorizedErrMsg;
      return;
    }
    if (!this.authService.hasAlreadyRetrievedCustomerCouponsFromServer) {
      this.authService.isCustomerCouponsSelected = true;
      this.router.navigateByUrl('customer');
      return;
    }

    // the getAllOtherImages() method was invoked in the customerRestService
    // by the customerCoupons componentso it doesn't have to be invoked here. even if was invoked
    // here it won't retrive the images again because they were already retrived
    // this.getAllOtherImages();

    // this.getAllCoupons();
    this.couponsToShow = [...this.customerRestService.allCoupons];
    this.sort();
  }

  // this method is not being used in this component
  // all images that are not customerImages
  // public getAllOtherImages(): void {
  //   if (!this.authService.hasAlreadyRetrievedAllImagesFromServer) {
  //     this.customerRestService.getAllOtherImages().subscribe(response => {
  //       console.log(response); // TODO delete this line
  //       this.authService.hasAlreadyRetrievedAllImagesFromServer = true;
  //       this.isErrMsgShown = false;
  //       this.customerRestService.allOtherImages = [...response];
  //       for (let i of this.customerRestService.allOtherImages) {
  //         this.customerRestService.imagesToDisplay[i.couponId] = 'data:image/jpeg;base64,' + i.picture;
  //       }
  //       // console.log(this.customerRestService.imagesToDisplay);
  //       // console.log(this.imagesToDisplay);

  //     }, err => {
  //       console.log(err.error); // TODO delete this line
  //       // this.authService.signOut();
  //       this.showErrMsg(err);
  //     });
  //   }
  // }

  // public getAllCoupons(): void {
  //   if (!this.authService.hasAlreadyRetrievedAllCouponsFromServer) {
  //     this.customerRestService.getAllCoupons().subscribe(response => {
  //       console.log(response); // TODO delete this line
  //       this.authService.hasAlreadyRetrievedAllCouponsFromServer = true;
  //       this.isErrMsgShown = false;
  //       this.customerRestService.allCoupons = [...response];
  //       this.customerRestService.allCoupons = this.customerRestService.allCoupons
  //       .filter(c => !this.customerRestService.getCustomerCouponsIdArr().includes(c.id))
  //       .filter(c => this.formService.isFutureDate(c.endDate))
  //       // .filter(c => this.formService.isPastDate(c.startDate))
  //       .filter(c => c.amount > 0);
  //       this.couponsToShow = [...this.customerRestService.allCoupons];
  //       this.sort();
  //       this.customerRestService.fillComapniesNames(true);

  //     }, err => {
  //       console.log(err.error); // TODO delete this line
  //       this.customerRestService.emptyCart();
  //       this.authService.signOut();
  //       this.isErrMsgShown = true;
  //       this.errMsg = this.authService.hasBeenSignedOutErrMsg;
  //     });
  //   } else {
  //     this.couponsToShow = [...this.customerRestService.allCoupons];
  //     this.sort();
  //   }
  // }

  public isVPWidthSmall(): boolean {
    return this.formService.screenWidth < 1200;
  }

  public isDescShown(): boolean {
    return this.formService.screenWidth > 999;
  }

  public toggleFilterSec(): void {
    this.formService.toggleAllCouponsFilterSec();
  }

  public isFilterSecShown(): boolean {
    return this.formService.isAllCouponsFilterSecShown;
  }

  public isFiltering(): boolean {
    return this.couponsToShow.length < this.customerRestService.allCoupons.length;
  }

  public getImgStyle(): string {
    return this.formService.getImgStyle();
  }

  public shortenDesc(desc: string): string {
    return this.formService.shortenDesc(desc);
  }

  public shortenTitle(title: string): string {
    return this.formService.shortenTitle(title);
  }

  public getCategory(cat: Category): string {
    return this.formService.getCategory(cat);
  }

  public isPastDate(date: Date): boolean {
    return this.formService.isPastDate(date);
  }

  public isCommentShown(): boolean {
    return this.couponsToShow.filter(c => !this.isPastDate(c.startDate)).length > 0;
  }

  // public getCustomerCouponsIdArr(): number[] {
  //  return this.customerRestService.customerCoupons.map(c => c.id);
  // }

  public getCompanyName(companyId: number): string {
    return this.customerRestService.companiesNames[companyId];
  }

  public sort() {
    if (this.formService.isAllCouponsSortedByCompany) {
      this.sortByCompany();
    } else if(this.formService.isAllCouponsSortedByCategoryId) {
      this.sortByCategoryId();
    } else if(this.formService.isAllCouponsSortedByTitle) {
      this.sortByTitle();
    } else if(this.formService.isAllCouponsSortedByEndDate) {
      this.sortByEndDate();
    } else {
      this.sortByPrice();
    }
  }

  public sortByCompany() {
    this.couponsToShow.sort((a,b) =>
    (this.getCompanyName(a.companyId).toLowerCase() > this.getCompanyName(b.companyId).toLowerCase())
    ? 1 :
    ((this.getCompanyName(b.companyId).toLowerCase() > this.getCompanyName(a.companyId).toLowerCase())
    ? -1 : 0));
  }

  public sortByCategoryId() {
    this.couponsToShow.sort((a,b) =>
      (a.categoryId > b.categoryId)
      ? 1 : ((b.categoryId > a.categoryId) ? -1 : 0));
  }

  public sortByTitle() {
    this.couponsToShow.sort((a,b) =>
      (a.title.toLocaleLowerCase() > b.title.toLocaleLowerCase())
      ? 1 : ((b.title.toLocaleLowerCase() > a.title.toLocaleLowerCase()) ? -1 : 0));
  }

  public sortByEndDate() {
    this.couponsToShow.sort((a,b) => (a.endDate > b.endDate)
       ? 1 : ((b.endDate > a.endDate) ? -1 : 0));
  }

  public sortByPrice() {
    this.couponsToShow.sort((a,b) => (a.price > b.price)
       ? 1 : ((b.price > a.price) ? -1 : 0));
  }

  public shouldSortBy(attr: string): void {
    switch (attr) {
      case 'categoryId':
        this.formService.isAllCouponsSortedByCompany = false;
        this.formService.isAllCouponsSortedByCategoryId = true;
        this.formService.isAllCouponsSortedByTitle = false;
        this.formService.isAllCouponsSortedByEndDate = false;
        this.formService.isAllCouponsSortedByPrice = false;
        break;

      case 'title':
        this.formService.isAllCouponsSortedByCompany = false;
        this.formService.isAllCouponsSortedByCategoryId = false;
        this.formService.isAllCouponsSortedByTitle = true;
        this.formService.isAllCouponsSortedByEndDate = false;
        this.formService.isAllCouponsSortedByPrice = false;
        break;

      case 'endDate':
        this.formService.isAllCouponsSortedByCompany = false;
        this.formService.isAllCouponsSortedByCategoryId = false;
        this.formService.isAllCouponsSortedByTitle = false;
        this.formService.isAllCouponsSortedByEndDate = true;
        this.formService.isAllCouponsSortedByPrice = false;
        break;

      case 'price':
        this.formService.isAllCouponsSortedByCompany = false;
        this.formService.isAllCouponsSortedByCategoryId = false;
        this.formService.isAllCouponsSortedByTitle = false;
        this.formService.isAllCouponsSortedByEndDate = false;
        this.formService.isAllCouponsSortedByPrice = true;
        break;

      case 'company':
        this.formService.isAllCouponsSortedByCompany = true;
        this.formService.isAllCouponsSortedByCategoryId = false;
        this.formService.isAllCouponsSortedByTitle = false;
        this.formService.isAllCouponsSortedByEndDate = false;
        this.formService.isAllCouponsSortedByPrice = false;
        break;

      default:
    }
    this.sort();
  }

  public getClass(attr: string): string {
    switch (attr) {
      case 'categoryId':
        return this.formService.isAllCouponsSortedByCategoryId ? 'active-sort' : 'not-sorted';
      case 'title':
        return this.formService.isAllCouponsSortedByTitle ? 'active-sort' : 'not-sorted';
      case 'endDate':
        return this.formService.isAllCouponsSortedByEndDate ? 'active-sort' : 'not-sorted';
      case 'price':
        return this.formService.isAllCouponsSortedByPrice ? 'active-sort' : 'not-sorted';
      default:
        return this.formService.isAllCouponsSortedByCompany ? 'active-sort' : 'not-sorted';
    }
  }

  public searchByCategoryId() {
    this.companySearched = '';
    this.titleSearched = '';
    this.maxPriceSearched = 1000;
    if (this.ctgrSearched.toString() === Category[Category.ALL]) {
      this.couponsToShow = [...this.customerRestService.allCoupons];
    } else {
      this.couponsToShow = this.customerRestService.allCoupons
    .filter(c => c.categoryId === this.ctgrSearched);
    }
    this.sort();
  }

  public searchByMaxPrice() {
    this.companySearched = '';
    this.ctgrSearched = Category.NONE;
    this.titleSearched = '';
    this.couponsToShow = this.customerRestService.allCoupons
    .filter(c => c.price <= this.maxPriceSearched);
    this.sort();
  }

  public companiesForSearch(): Array<string> {
    let companiesId: number[] = [];
    for (let c of this.customerRestService.allCoupons) {
      if (!companiesId.includes(c.companyId)) {
        companiesId.push(c.companyId);
      }
    }
    let companiesNames: string[] =
    companiesId.map(compId => this.customerRestService.companiesNames[compId]);
    companiesNames.sort((a,b) =>
    (a.toLowerCase() > b.toLowerCase()) ? 1 : ((b.toLowerCase() > a.toLowerCase()) ? -1 : 0));
    return companiesNames;
   }

  public findCompIdByName(name: string): number {
    for (let compId of this.customerRestService.companyIdArr) {
      if (this.customerRestService.companiesNames[compId] === name) {
        return compId;
      }
    }
    return 0; // shouldn't happen - should find the name and the matched number
  }

  public searchByCompany() {
    this.ctgrSearched = Category.NONE;
    this.maxPriceSearched = 1000;
    this.titleSearched = '';
    if (this.companySearched === 'All') {
      this.couponsToShow = [...this.customerRestService.allCoupons];
    } else {
      this.couponsToShow = this.customerRestService.allCoupons
      .filter(c => c.companyId === this.findCompIdByName(this.companySearched));
    }
    this.sort();
  }

  public searchByTitle() {
    this.companySearched = '';
    this.ctgrSearched = Category.NONE;
    this.maxPriceSearched = 1000;
    this.couponsToShow = this.customerRestService.allCoupons
    .filter(c => c.title.toLowerCase().startsWith(this.titleSearched.toLowerCase()));
    this.sort();
  }

  public addToCart(coupon: Coupon): void {
    this.customerRestService.addToCart(coupon);
  }

  public removeFromCart(couponId: number): void {
    this.customerRestService.removeFromCart(couponId);
  }

  public isCouponInCart(couponId: number): boolean {
    return this.customerRestService.isCouponInCart(couponId);
  }

  public isCouponsToShowEmpty(): boolean {
    return this.couponsToShow.length === 0;
  }

  public isCouponsArrEmpty(): boolean {
    return this.customerRestService.allCoupons.length === 0;
  }

  public goToMyCoupons() {
    this.authService.isCustomerCouponsSelected = true;
    this.authService.isCustomerProfileSelected = false;
  }

  // public showErrMsg(err: any) {
  //   this.isErrMsgShown = true;
  //   this.errMsg = this.authService.connectionToServerAndLoginCheck(err);
  // }

  // public getCustomerId(): number {
  //   return this.customerRestService.currentLoggedInCustomer.id;
  // }

  public isUserTypeCustomer(): boolean {
    return this.authService.getUserType() === UserType.CUSTOMER;
  }

  public isLoggedIn(): boolean {
    return this.authService.isLoggedIn;
  }

  // public showErrMsg(err: any) {
  //   this.isErrMsgShown = true;
  //   this.errMsg = this.authService.connectionToServerAndLoginCheck(err);
  // }

  public openSingleCoupon(coupon: Coupon): void {
    this.router.navigateByUrl('coupon');
    this.formService.singleCoupon = Object.assign({}, coupon);
    this.formService.singleCouponImg = this.imagesToDisplay[coupon.id];
    this.formService.hasSingleCouponImgClickedFromCart = false;
    this.formService.hasSingleCouponImgClickedFromHome = false;
    this.formService.hasSingleCouponImgClickedFromUpdate = false;
  }

  public isDevMode(): boolean {
    return this.devService.isDevMode;
  }


}
