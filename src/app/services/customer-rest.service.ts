import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CompaniesNames } from '../interfaces/companies-names';
import { Coupon } from '../models/coupon.model';
import { Customer } from '../models/customer.model';
import { UserType } from '../models/user-type.model';
import { AuthService } from './auth.service';
import { FormService } from './form.service';

@Injectable({
  providedIn: 'root'
})
export class CustomerRestService {


  // public currentLoggedInCustomer: Customer = new Customer();

  public companiesNames: CompaniesNames = { };  // customer coupons
  public companyIdArr: number[] = [];

  public customerCoupons: Coupon[] = [];
  public allCoupons: Coupon[] = [];
  public cart: Coupon[] = [];
  public couponIdCart: number[] = [];

  public customerImages: any[] = [];
  public imagesToDisplay: any[] = [];
  public allOtherImages: any[] = [];
//  public allImagesToDisplay: any[] = [];
//will need it only if intend to loa all images from server and not just all other images.
//  as long as i load all other images - then imagesToDisplay will contain just
// one image per coupon id

  public customerCouponsCompanyIds: number[] = [];
  public customerCouponsCompanyNames: CompaniesNames = { };
  public customerCouponsCompanyNamesArr: string[] = [];

  // private url: string = 'http://localhost:8080/customer';
  private url: string = environment.baseUrl + 'customer';



  constructor(private httpClient: HttpClient, private authService: AuthService,
    private formService: FormService) {

      if (this.authService.isLoggedIn && this.authService.isUserTypeCustomer()) {
        this.getCurrentCustomerDetails();
       // this.getOtherImages();
        console.log('this is customerRestService CTOR');
        // this.retrieveCart();
      }
    }



  public getCustomerEmail(): string {
    return this.formService.currentLoggedInCustomer.email;
  }

  public retrieveCartFromLS(): void {
    let existedCart: any;
    // let doesCartExist: boolean = false;
    let elementInLocalStorage: any = localStorage.getItem(this.getCustomerEmail());
    if (elementInLocalStorage === null) {
      // creat new cart
      console.log('there is no cart');
      this.emptyCart();
      return;
    }
    console.log('not null');
    if (elementInLocalStorage === '') {
      // remove and creat or just creat
      console.log('empty');
      this.emptyCart();
      return;
    }
    try {
      existedCart = JSON.parse(localStorage[this.getCustomerEmail()]);
      console.log(existedCart);
    } catch (error) {
      console.log('error');
      // remove and creat or just creat
      this.emptyCart();
      return;
    }
    if (!Array.isArray(existedCart)) {
      console.log('not an array');
      this.emptyCart();
      return;
    }
    console.log('yes, an array');

    let existedIntCart: number[] = [];
    // doesCartExist = true;
    for (let e of existedCart) {
      let int = parseInt(e, 10);
      if (isNaN(int)) {
        // doesCartExist = false;
        this.emptyCart();
        return;
      }
      if (!existedIntCart.includes(int)) {
        existedIntCart.push(int);
      }
     }

    // console.log('doesCartExist: ', doesCartExist);
    console.log(existedIntCart);
    this.emptyCart();

    this.couponIdCart = [...existedIntCart];
    console.log(this.couponIdCart);
    let notExistedCouponIds: number[] = [];
    for (let couponId of this.couponIdCart) {
      let couponToAdd: Coupon[] = this.allCoupons.filter(c => c.id === couponId);
      if (couponToAdd.length > 0) {
        this.cart.push(couponToAdd[0]);
      } else {
        notExistedCouponIds.push(couponId);
      }
    }
    if (notExistedCouponIds.length > 0) {
      console.log('there are not existed coupons id in the LS');
      for(let couponId of notExistedCouponIds) {
        this.couponIdCart = this.couponIdCart.filter(id => id !== couponId)
      }
      console.log(notExistedCouponIds);
      notExistedCouponIds.splice(0);
      console.log(this.couponIdCart);
      console.log(notExistedCouponIds);
      this.updateCartInLS();
    }

   }

   public updateCartInLS() {
    localStorage[this.getCustomerEmail()] = JSON.stringify(this.couponIdCart);
   }

   public emptyCart() {
    this.couponIdCart.splice(0);
    this.cart.splice(0);
  }

   public addToCart(coupon: Coupon): void {
    const couponToInsert: Coupon = Object.assign({}, coupon);
    this.cart.push(couponToInsert);
    console.log(this.cart);
    this.couponIdCart.push(coupon.id);
    console.log(this.couponIdCart);
    this.updateCartInLS();
  }

  public removeFromCart(couponId: number): void {
    const couponsWithThisId: Coupon[] = this.cart.filter(c => c.id === couponId);
    if (couponsWithThisId.length === 0) {
      return;
    }
    const idx: number = this.cart.indexOf(couponsWithThisId[0]);
    if (idx > -1) {
      this.cart.splice(idx, 1);
    }
    console.log(this.cart);
    const idxInIdCart: number = this.couponIdCart.indexOf(couponId);
    if (idxInIdCart > -1) {
      this.couponIdCart.splice(idxInIdCart, 1);
    }
    console.log(this.couponIdCart);
    this.updateCartInLS();
  }

  public isCouponInCart(couponId: number): boolean {
    const couponsWithThisId: Coupon[] = this.cart.filter(c => c.id === couponId);
    return couponsWithThisId.length > 0;
  }



  //  public createCartInLocalStorage(): void {
  //   let cart: string[] = [];
  //   localStorage["cart"] = JSON.stringify(cart);
  //  }

  // public doesCouponAlreadyPurchased(id: number): boolean {
  //   // return this.coupons.filter(c => c.title.toLowerCase() === title.toLowerCase()).length > 0;
  //   return false;
  //  }

  public getCustomerCoupons(): Observable<Coupon[]> {
    return this.httpClient.get<any>(this.url + "/getCustomerCoupons", this.getOptions());
  }

  public purchaseCoupon(coupon: Coupon): Observable<any> {
    return this.httpClient.post<any>(this.url + "/purchaseCoupon", coupon, this.getOptions());
  }


  // sending an Object because Coupon includes id we don't send it
  // public addCoupon(coupon: Object): Observable<any> {
  //  return this.httpClient.post<any>(this.url + "/addCoupon", coupon, this.getOptions());
  // }

  public getCustomerDetails(): Observable<Customer> {
   return this.httpClient.get<any>(this.url + "/getCustomerDetails", this.getOptions());
  }

  public updateCustomer(customer: Customer): Observable<any> {
    return this.httpClient.put<any>(this.url + "/updateCustomer", customer, this.getOptions());
  }

  public getOneCompany(companyId: number): Observable<any> {
    return this.httpClient.get<any>(this.url + "/getOneCompany/"+ companyId, this.getOptions());
  }

  public getAllCoupons(): Observable<Coupon[]> {
    return this.httpClient.get<any>(this.url + "/getAllCoupons", this.getOptions());
  }

  public getCustomerImages(): Observable<any[]> {
    return this.httpClient.get<any>(this.url + "/getCustomerImages", this.getOptions());
  }

  public getAllImages(): Observable<any[]> {
    return this.httpClient.get<any>(this.url + "/getAllImages", this.getOptions());
  }

  // all images that are not customerImages
  public getAllOtherImages(): Observable<any[]> {
    return this.httpClient.get<any>(this.url + "/getAllOtherImages", this.getOptions());
  }


  public getOptions() {
   const token: string = this.authService.getToken();
   const headers = new HttpHeaders({Authorization: token});
   return {headers:headers};
  }


   public getCurrentCustomerDetails(): void {
    this.getCustomerDetails().subscribe(response => {
      this.formService.currentLoggedInCustomer = Object.assign({}, response);
      this.authService.setUserType(UserType.CUSTOMER);
      console.log(response); // TODO delete this line
    }, err => {
      console.log(err.error); // TODO delete this line
      this.authService.signOut();
    });
  }

  public addCompanyNameToNamesObj(companyId: number): void {
    this.getOneCompany(companyId).subscribe(response => {
      console.log(response); // TODO delete this line
      // const company: Company = Object.assign({}, response);
      this.companiesNames[response.id] = response.name;
    }, err => {
      console.log(err.error); // TODO delete this line
    });
  }

  public fillComapniesNames(all: boolean): void {
   const coupons: Coupon[] = all ? [...this.allCoupons] : [...this.customerCoupons];
    for (let coupon of coupons) {
      if (this.companyIdArr.indexOf(coupon.companyId) === -1) {
        this.companyIdArr.push(coupon.companyId);
        this.addCompanyNameToNamesObj(coupon.companyId);
      }
    }
  }

  // all images that are not customerImages
  public getOtherImages(): void {
    if (!this.authService.hasAlreadyRetrievedAllImagesFromServer) {
      this.getAllOtherImages().subscribe(response => {
        console.log(response); // TODO delete this line
        this.authService.hasAlreadyRetrievedAllImagesFromServer = true;
        this.allOtherImages = [...response];
        for (let i of this.allOtherImages) {
          this.imagesToDisplay[i.couponId] = 'data:image/jpeg;base64,' + i.picture;
        }
        // console.log(this.customerRestService.imagesToDisplay);
        // console.log(this.imagesToDisplay);

      }, err => {
        console.log(err.error); // TODO delete this line
        // this.authService.signOut();

      });
    }
  }


  public getCustomerCouponsIdArr(): number[] {
    return this.customerCoupons.map(c => c.id);
  }

















  // public getCurrentLoggedInCustomer(): Customer {
  //   return this.currentLoggedInCustomer;
  // }



}
