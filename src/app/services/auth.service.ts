import { Injectable } from '@angular/core';
import { Company } from '../models/company.model';
import { Coupon } from '../models/coupon.model';
import { Customer } from '../models/customer.model';
import { FormState } from '../models/form-state.model';
import { UserType } from '../models/user-type.model';
import { FormService } from './form.service';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  //public currentLoggedInCompany: Company = new Company();
  //public currentLoggedInCustomer: Customer = new Customer();

  // public isCartNotEmptyMsgShown: boolean = false;

  public isCompanySignUp: boolean = false;
  public isCustomerSignUp: boolean = false;

  // public signedUpCustomerEmail: string = '';
  // public signedUpCustomerPassword: string = '';
  // public signedUpCompanyEmail: string = '';
  // public signedUpCompanyPassword: string = '';



  public isCompanyProfileSelected: boolean = false;
  public isCustomerProfileSelected: boolean = false;
  public isCustomerCouponsSelected: boolean = true;

 // public currentUserType: UserType = this.getUserType();


  public hasAlreadyRetrievedCompaniesFromServer: boolean = false;
  public hasAlreadyRetrievedCustomersFromServer: boolean = false;

  public hasAlreadyRetrievedCouponsFromServer: boolean = false;
  public hasAlreadyRetrievedCompanyImagesFromServer: boolean = false;

  public hasAlreadyRetrievedCustomerCouponsFromServer: boolean = false;
  public hasAlreadyRetrievedCustomerImagesFromServer: boolean = false;

  public hasAlreadyRetrievedAllCouponsFromServer: boolean = false;
  public hasAlreadyRetrievedAllImagesFromServer: boolean = false;

  public isLoggedIn: boolean = localStorage.getItem('token') !== null;

  public isWelcomeMsgShown: boolean = false;
  public currentTime: number = new Date().getTime();



  public errorMsg500: string =
    'Unfortunately there has been an unexpected error. Please try again later';
  public notLoggedInErrMsg = 'Dear client, You are not Signed in, Please sign in';
  public notAuthorizedErrMsg =
    'Dear client, based on your sign in information, you are not authorized to view this page';
  public hasBeenSignedOutErrMsg: string =
    'Dear client, You have been Signed Out, Please sign in';

  constructor(private formService: FormService) {
   }

  getToken(): string {
    if (localStorage.getItem('token') === null) {
      return "no token";
    }
    return localStorage.getItem('token') as unknown as string;
  }

  setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  public removeToken(): void {
    localStorage.removeItem('token');
  }

  // public getUserType(): UserType {
  //   return this.currentUserType;
  // }

  public getUserType(): UserType {
    switch (localStorage.getItem('userType')) {
      case 'ADMINISTRATOR':
        return UserType.ADMINISTRATOR;
      case 'COMPANY':
        return UserType.COMPANY;
      case "CUSTOMER":
        return UserType.CUSTOMER;
      default:
        this.signOut();
        return UserType.NONE;
    }
  }

  public setUserType(userType: UserType): void {
  //  this.currentUserType = userType;
    localStorage.setItem('userType', UserType[userType]);
  }

  public removeUserType(): void {
    localStorage.removeItem('userType');
  }

  public getAdminSelection(): any {
    return localStorage.getItem('admin-select-company-customer');
  }

  public setAdminSelection(selection: string): void {
    localStorage.setItem('admin-select-company-customer', selection);
  }

  public getAboutSelection(): any {
    return localStorage.getItem('about');
  }

  public setAboutSelection(selection: string): void {
    localStorage.setItem('about', selection);
  }



  public getUser(): string {
    if (!this.isLoggedIn) {
      return 'guest';
    }
    if (this.formService.currentLoggedInCompany.id > 0) {
      return 'company';
    }
    if (this.formService.currentLoggedInCustomer.id > 0) {
      return 'customer';
    }
    if (this.getUserType() === UserType.ADMINISTRATOR) {
      return 'admin';
    }
    return 'other';
  }

  public getName(): string {
    switch (this.getUser()) {
      case  'admin':
        return 'Admin';
      case 'company':
        return this.formService.currentLoggedInCompany.name;
      case 'customer':
        return this.formService.currentLoggedInCustomer.firstName;
      default:
        return '';
    }
  }









  // public getCompanySelection(): any {
  //   return localStorage.getItem('company-select-coupons-profile');
  // }

  // public setCompanySelection(selection: string): void {
  //   localStorage.setItem('company-select-coupons-profile', selection);
  // }

  // public getCompanyName(): any {
  //   return localStorage.getItem('comapny-name');
  // }

  // public setCompanyName(): void {
  //   localStorage.setItem('comapny-name', this.currentLoggedInCompany.name);
  // }





  // public loginCheck(errMsg: string): void {
  //   if (errMsg.toLowerCase().includes('please sign in')) {
  //     this.isLoggedIn = false;
  //   }
  // }


  public connectionToServerAndLoginCheck(err: any): string {
    let errStr = JSON.stringify(err.message);
      console.log(errStr); //TODO delete this line
      if(errStr.toLowerCase().includes("unknown")) {
        this.signOut();
        return this.errorMsg500;
      }
      if (err.error.value !== undefined) {
        if (err.error.value.toLowerCase().includes('please sign in')) {
          this.signOut();
        } else {
          return err.error.value;
        }
      }

      // this.loginCheck(err.error.value);
      return this.errorMsg500;
  }

  public signOut() {
    this.isLoggedIn = false;
    this.removeToken();
    this.removeUserType();
    this.hasAlreadyRetrievedCompaniesFromServer = false;
    this.hasAlreadyRetrievedCustomersFromServer = false;
    this.hasAlreadyRetrievedCouponsFromServer = false;
    this.hasAlreadyRetrievedCompanyImagesFromServer = false;
    this.hasAlreadyRetrievedCustomerCouponsFromServer = false;
    this.hasAlreadyRetrievedCustomerImagesFromServer = false;
    this.hasAlreadyRetrievedAllCouponsFromServer = false;
    this.hasAlreadyRetrievedAllImagesFromServer = false;
    this.isCompanyProfileSelected = false;
    this.isCustomerProfileSelected = false;
    this.isCustomerCouponsSelected = true;

    this.formService.currentLoggedInCompany = new Company();
    this.formService.currentLoggedInCustomer = new Customer();

    this.formService.companyForm = FormState.NONE;
    this.formService.customerForm = FormState.NONE;
    this.formService.couponForm = FormState.NONE;
    this.formService.company = new Company();
    this.formService.customer = new Customer();
    // this.currentLoggedInCompany = new Company();
    this.formService.coupon = new Coupon();

    this.isCompanySignUp = false;
    this.isCustomerSignUp = false;
    // this.signedUpCompanyEmail = '';
    // this.signedUpCompanyPassword = '';
    // this.signedUpCustomerEmail = '';
    // this.signedUpCustomerPassword = '';

    this.formService.singleCoupon = new Coupon();
    this.formService.singleCouponImg = '';
    this.formService.hasSingleCouponImgClickedFromCart = false;
    this.formService.hasSingleCouponImgClickedFromHome = false;
    this.formService.hasSingleCouponImgClickedFromUpdate = false;

  }

  public isUserTypeCustomer(): boolean {
    return this.getUserType() === UserType.CUSTOMER;
  }








  // public update(): void {
  //   this.isLoggedIn = !this.isLoggedIn;
  // }

}
