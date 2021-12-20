import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CompaniesNames } from 'src/app/interfaces/companies-names';
import { Category } from 'src/app/models/category.model';
import { Company } from 'src/app/models/company.model';
import { Coupon } from 'src/app/models/coupon.model';
import { UserType } from 'src/app/models/user-type.model';
import { AuthService } from 'src/app/services/auth.service';
import { CustomerRestService } from 'src/app/services/customer-rest.service';
import { DevService } from 'src/app/services/dev.service';
import { FormService } from 'src/app/services/form.service';

@Component({
  selector: 'app-customer-coupons',
  templateUrl: './customer-coupons.component.html',
  styleUrls: ['./customer-coupons.component.css']
})
export class CustomerCouponsComponent implements OnInit {

  public isErrMsgShown: boolean = false;
  public errMsg: string = '';

  public companySearched = '  ';
  public ctgrSearched: Category = Category.NONE;
  public titleSearched = '';
  public maxPriceSearched: number = 1000;

  public minPrice: number = this.formService.minCouponPrice;

  public couponsToShow: Coupon[] = [];

  public company: Company = new Company(); // for getOneCompany method
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

  public companiesNames: CompaniesNames = {};
  public companiesNamesArr: string[] = [];
  // public singleCouponCompanyName: string = this.formService.singleCouponCompanyName;
  public imagesToDisplay = this.customerRestService.imagesToDisplay;

  // public imageHeight: string = this.formService.getImgHeight();
  // public imageStyle: string = this.formService.imageStyle;

  constructor(private customerRestService: CustomerRestService,
    private devService: DevService, private formService: FormService,
    private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    if (!this.authService.isLoggedIn) {
      this.authService.hasAlreadyRetrievedCustomerCouponsFromServer = false;
      this.authService.hasAlreadyRetrievedCustomerImagesFromServer = false;
      this.customerRestService.customerCoupons = [];
      this.customerRestService.allCoupons = [];
      this.customerRestService.customerImages = [];
      this.customerRestService.allOtherImages = [];
      this.customerRestService.imagesToDisplay = [];
      this.isErrMsgShown = true;
      this.errMsg = this.authService.notLoggedInErrMsg;
      return;
    }
    if (!this.isUserTypeCustomer()) {
      this.isErrMsgShown = true;
      this.errMsg = this.authService.notAuthorizedErrMsg;
      return;
    }

    this.getCustomerImages();
    this.customerRestService.getOtherImages();
    this.getCustomerCoupons();



    //  while (!this.hasResponseReceived) {
    //    if (this.hasResponseReceivedCheck()) {
    //      break;
    //    }
    //  }
   // setTimeout(function(){ console.log("Hello"); }, 500);

  //  this.demo();


  }

  // public sleep(ms: number) {
  //   return new Promise(resolve => setTimeout(resolve, ms));
  // }

  //  public async demo(): Promise<void> {
  //  // console.log('Taking a break...');
  //  // await this.sleep(500);
  //   while (!this.hasResponseReceived) {
  //     await this.sleep(100);
  //     console.log('0.1 sec');
  //   }
  //   if(this.hasResponseReceived) {
  //     this.fillComapniesNames();
  //     console.log(this.customerRestService.companiesNames);
  //   };
  // }

  public isVPWidthSmall(): boolean {
    return this.formService.screenWidth < 1200;
  }

  public isDescAndPriceShown(): boolean {
    return this.formService.screenWidth > 999;
  }

  public toggleFilterSec(): void {
    this.formService.toggleCustomerCouponsFilterSec();
  }

  public isFilterSecShown(): boolean {
    return this.formService.isCustomerCouponsFilterSecShown;
  }

  public isFiltering(): boolean {
    return this.couponsToShow.length < this.customerRestService.customerCoupons.length;
  }

  // public getImgHeight(): string {
  //   console.log('img height is: ', this.formService.getImgHeight());
  //   return this.formService.getImgHeight();
  // }

  public getImgStyle(): string {
    return this.formService.getImgStyleWithPad();
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

  public getCustomerImages(): void {
    if (!this.authService.hasAlreadyRetrievedCustomerImagesFromServer) {
      this.customerRestService.getCustomerImages().subscribe(response => {
        console.log(response); // TODO delete this line
        this.authService.hasAlreadyRetrievedCustomerImagesFromServer = true;
        this.isErrMsgShown = false;
        this.customerRestService.customerImages = [...response];
        for (let i of this.customerRestService.customerImages) {
          this.customerRestService.imagesToDisplay[i.couponId] = 'data:image/jpeg;base64,' + i.picture;
        }
        // console.log(this.customerRestService.imagesToDisplay);
        // console.log(this.imagesToDisplay);

      }, err => {
        console.log(err.error); // TODO delete this line
        // this.authService.signOut();
        this.showErrMsg(err);
      });
    }
  }



  public getCustomerCoupons(): void {
    if (!this.authService.hasAlreadyRetrievedCustomerCouponsFromServer) {
      this.customerRestService.getCustomerCoupons().subscribe(response => {
        console.log(response); // TODO delete this line
        this.authService.hasAlreadyRetrievedCustomerCouponsFromServer = true;
        this.isErrMsgShown = false;
        this.customerRestService.customerCoupons = [...response];
        this.customerRestService.customerCoupons = this.customerRestService.customerCoupons
        .filter(c => this.formService.isFutureDate(c.endDate));
        this.couponsToShow = [...this.customerRestService.customerCoupons];
        this.sort();
        this.customerRestService.fillComapniesNames(false);
        this.getAllCoupons();
      }, err => {
        console.log(err.error); // TODO delete this line
        // this.customerRestService.emptyCart();
        this.authService.signOut();
        this.isErrMsgShown = true;
        this.errMsg = this.authService.hasBeenSignedOutErrMsg;
      });
    } else {
      this.couponsToShow = [...this.customerRestService.customerCoupons];
      this.sort();
    }
  }

  public getAllCoupons(): void {
    if (this.authService.hasAlreadyRetrievedAllCouponsFromServer) {
      return;
    }
    this.customerRestService.getAllCoupons().subscribe(response => {
      console.log(response); // TODO delete this line
      this.authService.hasAlreadyRetrievedAllCouponsFromServer = true;
      // this.isErrMsgShown = false;
      this.customerRestService.allCoupons = [...response];
      this.customerRestService.allCoupons = this.customerRestService.allCoupons
      .filter(c => !this.customerRestService.getCustomerCouponsIdArr().includes(c.id))
      .filter(c => this.formService.isFutureDate(c.endDate))
      // .filter(c => this.formService.isPastDate(c.startDate))
      .filter(c => c.amount > 0);
      this.customerRestService.fillComapniesNames(true);
      this.customerRestService.retrieveCartFromLS();

    }, err => {
      console.log(err.error); // TODO delete this line
      // this.customerRestService.emptyCart();
      this.authService.signOut();
      this.isErrMsgShown = true;
      this.errMsg = this.authService.hasBeenSignedOutErrMsg;
    });
  }

  public isPastDate(date: Date): boolean {
    return this.formService.isPastDate(date);
  }

  public isCommentShown(): boolean {
    return this.couponsToShow.filter(c => !this.isPastDate(c.startDate)).length > 0;
  }

  // public getComment(): string {
  //   return "✳️ Future Coupon - Valid from a future date. "
  //   + "Click on the coupon's image/icon to see its validation period."
  // }

  // if desc and price are not shown then the comment:
  //Click the coupon's image/icon to see its details

  public getCompanyName(companyId: number): string {
    return this.customerRestService.companiesNames[companyId];
  }

  public sort() {
    if (this.formService.isCustomerCouponsSortedByCompany) {
      this.sortByCompany();
    } else if(this.formService.isCustomerCouponsSortedByCategoryId) {
      this.sortByCategoryId();
    } else if(this.formService.isCustomerCouponsSortedByTitle) {
      this.sortByTitle();
    } else if(this.formService.isCustomerCouponsSortedByEndDate) {
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
        this.formService.isCustomerCouponsSortedByCompany = false;
        this.formService.isCustomerCouponsSortedByCategoryId = true;
        this.formService.isCustomerCouponsSortedByTitle = false;
        this.formService.isCustomerCouponsSortedByEndDate = false;
        this.formService.isCustomerCouponsSortedByPrice = false;
        break;

      case 'title':
        this.formService.isCustomerCouponsSortedByCompany = false;
        this.formService.isCustomerCouponsSortedByCategoryId = false;
        this.formService.isCustomerCouponsSortedByTitle = true;
        this.formService.isCustomerCouponsSortedByEndDate = false;
        this.formService.isCustomerCouponsSortedByPrice = false;
        break;

      case 'endDate':
        this.formService.isCustomerCouponsSortedByCompany = false;
        this.formService.isCustomerCouponsSortedByCategoryId = false;
        this.formService.isCustomerCouponsSortedByTitle = false;
        this.formService.isCustomerCouponsSortedByEndDate = true;
        this.formService.isCustomerCouponsSortedByPrice = false;
        break;

      case 'price':
        this.formService.isCustomerCouponsSortedByCompany = false;
        this.formService.isCustomerCouponsSortedByCategoryId = false;
        this.formService.isCustomerCouponsSortedByTitle = false;
        this.formService.isCustomerCouponsSortedByEndDate = false;
        this.formService.isCustomerCouponsSortedByPrice = true;
        break;

      case 'company':
        this.formService.isCustomerCouponsSortedByCompany = true;
        this.formService.isCustomerCouponsSortedByCategoryId = false;
        this.formService.isCustomerCouponsSortedByTitle = false;
        this.formService.isCustomerCouponsSortedByEndDate = false;
        this.formService.isCustomerCouponsSortedByPrice = false;
        break;

      default:
    }
    this.sort();
  }

  public getClass(attr: string): string {
    switch (attr) {
      case 'categoryId':
        return this.formService.isCustomerCouponsSortedByCategoryId ? 'active-sort' : 'not-sorted';
      case 'title':
        return this.formService.isCustomerCouponsSortedByTitle ? 'active-sort' : 'not-sorted';
      case 'endDate':
        return this.formService.isCustomerCouponsSortedByEndDate ? 'active-sort' : 'not-sorted';
      case 'price':
        return this.formService.isCustomerCouponsSortedByPrice ? 'active-sort' : 'not-sorted';
      default:
        return this.formService.isCustomerCouponsSortedByCompany ? 'active-sort' : 'not-sorted';
    }
  }

  public searchByCategoryId() {
    this.companySearched = '';
    this.titleSearched = '';
    this.maxPriceSearched = 1000;
    if (this.ctgrSearched.toString() === Category[Category.ALL]) {
      this.couponsToShow = [...this.customerRestService.customerCoupons];
    } else {
      this.couponsToShow = this.customerRestService.customerCoupons
    .filter(c => c.categoryId === this.ctgrSearched);
    }
    this.sort();
  }

  public searchByMaxPrice() {
    this.companySearched = '';
    this.ctgrSearched = Category.NONE;
    this.titleSearched = '';
    this.couponsToShow = this.customerRestService.customerCoupons
    .filter(c => c.price <= this.maxPriceSearched);
    this.sort();
  }

  public companiesForSearch(): string[] {
    let companiesId: number[] = [];
    for (let c of this.customerRestService.customerCoupons) {
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
      this.couponsToShow = [...this.customerRestService.customerCoupons];
    } else {
      this.couponsToShow = this.customerRestService.customerCoupons
      .filter(c => c.companyId === this.findCompIdByName(this.companySearched));
    }
    this.sort();
  }

  public searchByTitle() {
    this.companySearched = '';
    this.ctgrSearched = Category.NONE;
    this.maxPriceSearched = 1000;
    this.couponsToShow = this.customerRestService.customerCoupons
    .filter(c => c.title.toLowerCase().startsWith(this.titleSearched.toLowerCase()));
    this.sort();
  }

  public isCouponsToShowEmpty(): boolean {
    return this.couponsToShow.length === 0;
  }

  public isCouponsArrEmpty(): boolean {
    return this.customerRestService.customerCoupons.length === 0;
  }

  public goToAllCoupons() {
    this.authService.isCustomerCouponsSelected = false;
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

  public showErrMsg(err: any) {
    this.isErrMsgShown = true;
    this.errMsg = this.authService.connectionToServerAndLoginCheck(err);
  }

  public openSingleCoupon(coupon: Coupon): void {
    this.router.navigateByUrl('coupon');
    this.formService.singleCoupon = Object.assign({}, coupon);
    this.formService.singleCouponImg = this.imagesToDisplay[coupon.id];
    this.formService.hasSingleCouponImgClickedFromCart = false;
    this.formService.hasSingleCouponImgClickedFromHome = false;
    this.formService.hasSingleCouponImgClickedFromUpdate = false;
  //  this.formService.singleCouponCompanyName = this.getCompanyName(coupon.companyId);

  }

  public isDevMode(): boolean {
    return this.devService.isDevMode;
  }


}
