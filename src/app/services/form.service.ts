import { Injectable } from '@angular/core';
import { Category } from '../models/category.model';
import { Company } from '../models/company.model';
import { Coupon } from '../models/coupon.model';
import { Customer } from '../models/customer.model';
import { FormState } from '../models/form-state.model';


@Injectable({
  providedIn: 'root'
})
export class FormService {

  public isOnVacation: boolean = false;

  public screenWidth: number = 0;
  public screenHeight: number = 0;

  public todaysDate: Date = new Date();
  public todaysDateWithoutTime = this.getDateWithoutTime(this.todaysDate);

  public currentLoggedInCompany: Company = new Company();
  public currentLoggedInCustomer: Customer = new Customer();


  // company name:
  public namePattern: RegExp = /^[A-Za-z0-9]{3,}.*[^\s]{1,}$|^[A-Za-z0-9]{3,}$/;
  public explainName: string = 'Must Begin with Three Alphanumeric Characters';
  public nameTitle: string =
  'Company Name Must Begin with Three Alphanumeric Characters and Cannot End with a Space';

  public firstNamePattern: RegExp = /^[A-Za-z]{1,}([.]|[\s])?[A-Za-z]{1,}$/;
  public explainPersonName: string = 'Name Contains Letters Only with At Least Two Characters';
  public firstNameTitle: string = "You can use one space or one dot only (not both), between" +
    " first and middle name or between initials";

  public lastNamePattern: RegExp =
  /^([A-Za-z]{2,}[\s]?[A-Za-z]{2,}[\s]?[A-Za-z]{2,})$|^([A-Za-z]{2,}[\s]?[A-Za-z]{2,})$|(^[A-Za-z]{2,}$)/;
  public lastNameTitle: string = "You can use a space in case of two last names or between" +
    " the last name and a suffix like 'Junior' (but do not use dot)";

  // Pattern for coupon's title, description
  public couponStrPattern: RegExp = /^[^\s].*[^\s]$/;
  public explainCouponStr: string = 'At least two characters. Cannot begin or end with a space';
  public couponStrTitle: string =
  'Must Contains at least Two Characters and Cannot begin or end with a Space';

  public emailPattern: RegExp = /^([\w\-]+\.*[\w\-]+)+@([\w]+\.)+[A-Za-z]{2,4}$/;
  // public emailPattern = '^[A-Za-z0-9.]+@([A-Za-z0-9]+.)+[A-Za-z0-9]{2,4}$';
  public explainEmail: string = 'Please Enter a Valid Email Address';
  // public explainEmail: string = 'Email Must Be Formatted As you@domain.com';
  public emailTitle: string = "We Never Share Your Information With Anyone." +
  " Please Provide Your Email Address, Formatted As you@domain.com, With No Spaces";

  // public passwordPattern = '^(?=.*[a-zA-Z])(?=.*\d)[A-Za-z\d!@#$%^&*.?~]{6,}$';
  // public explainPassword =
  //"Password Must Be At Least 6 Characters Long With At Least One Letter and one number";
  public passwordPattern: RegExp = /^[^\s].{2,}[^\s]$/;
  public explainPassword: string = "Password Must Be At Least 4 Characters Long";
  public passwordTitle: string =
  'Password Must contain At Least Four Characters and cannot begin or end with a space';

  public minCouponPrice: number = 0.1;
  public explainPrice: string = 'Price must be at least $0.10';

  public inValidDateMsg: string = "Please Enter a Valid Date";
  public noPastEndDateMsg: string = "Exp. Date cannot be in the past";
  public notPriorToStartDateMsg: string = "Exp. Date cannot be prior to Start Date";
  public endDateTitle: string = "Expiration Date cannot be in the past or prior to Start Date";

  public emailExistsErrMsg: string = "We're sorry. Our records show this email address"
  + " is taken already. Please Enter a different email";
  public nameExistsErrMsg: string = "We're sorry. An account already exists with this name."
  + " Please Enter a different name";
  public nameAndEmailExistErrMsg = "We're sorry. Both name and email already exist in our records."
  + " Please Enter a different name and email";
  public titleExistsErrMsg = "We're sorry, but this title is already in use for another coupon."
  + " Please Enter a different title";

  public idAutoIncMsg: string = 'The ID Is Generated Automatically';
  public cannotChangeIdMsg: string = 'The ID is Unique and Cannot Be Changed';
  public compIdAutoIncMsg: string = 'Company ID Is Inserted Automatically';
  public cannotAddCompanyCouponsMsg: string = 'Each Company can Add & Delete its own Coupons';
  public cannotChangeCouponsMsg: string = "Go to 'Manage Coupons' in order to Add or Delete Coupons";
  public cannotAddCustomerCouponsMsg: string = "Each Customer can Purchase Coupons which " +
  "would be added to his/her Coupon's list";
  public cannotPurchaseCouponsMsg: string = "Shop for Coupons in the 'Buy Coupons' page "

  public isSuccessMsgShown: boolean = false;
  public emailOfAddedElement: string = '';
  public titleOfAddedCoupon: string = '';


  // public passwordPattern = '^(?=.*[a-zA-Z])(?=.*\d)[A-Za-z\d!@#$%^&*]{6,}$';
  // public explainPassword = "Password Must Be At Least 6 Characters Long With At Least One Letter and one number";


  // company-crud component variables:
  public isCompanySortedById: boolean = true;
  public isCompanySortedByName: boolean = false;
  public isCompanySortedByEmail: boolean = false;

  public isCustomerSortedById: boolean = true;
  public isCustomerSortedByFirstName: boolean = false;
  public isCustomerSortedByLastName: boolean = false;
  public isCustomerSortedByEmail: boolean = false;

  public isCouponSortedById: boolean = true;
  public isCouponSortedByCategoryId: boolean = false;
  public isCouponSortedByTitle: boolean = false;
  public isCouponSortedByStartDate: boolean = false;
  public isCouponSortedByEndDate: boolean = false;
  public isCouponSortedByAmount: boolean = false;
  public isCouponSortedByPrice: boolean = false;

  public isCustomerCouponsSortedByCompany: boolean = false;
  public isCustomerCouponsSortedByCategoryId: boolean = false;
  public isCustomerCouponsSortedByTitle: boolean = false;
  public isCustomerCouponsSortedByEndDate: boolean = true;
  public isCustomerCouponsSortedByPrice: boolean = false;

  public isAllCouponsSortedByCompany: boolean = false;
  public isAllCouponsSortedByCategoryId: boolean = false;
  public isAllCouponsSortedByTitle: boolean = false;
  public isAllCouponsSortedByEndDate: boolean = true;
  public isAllCouponsSortedByPrice: boolean = false;

  public companyForm: FormState = FormState.NONE;
  public customerForm: FormState = FormState.NONE;
  public couponForm: FormState = FormState.NONE;

  public maxAllowedPhotoSize = 200000;  // 200KB
  public imgTooBigErrMsg: string = "Sorry, the uploaded image file needs to be up to 200KB";
  public imgTooBigShortErrMsg: string = "Image Size up to 200KB";


  public company: Company = new Company();
  public customer: Customer = new Customer();


  public coupon: Coupon = new Coupon();

  public singleCoupon: Coupon = new Coupon();

  public singleCouponImg: any = '';
  public hasSingleCouponImgClickedFromUpdate: boolean = false;
  public hasSingleCouponImgClickedFromCart: boolean = false;
  public hasSingleCouponImgClickedFromHome: boolean = false;

  public isCompanyCrudFilterSecShown: boolean = false;
  public isCustomerCrudFilterSecShown: boolean = false;
  public isCouponCrudFilterSecShown: boolean = false;
  public isCustomerCouponsFilterSecShown: boolean = false;
  public isAllCouponsFilterSecShown: boolean = false;

  constructor() {}

  public getScreenType(): string {
    if (this.screenWidth < 481) {
      return 'mobile';
    }
    if (this.screenWidth < 769) {
      return 'tablet';
    }
    if (this.screenWidth < 1025) {
      return 'big-tablet';
    }
    if (this.screenWidth < 1201) {
      return 'laptop';
    }
    return 'desktop';
  }

  public getImgHeight(): string {
    if (this.screenWidth < 481) {
      return '75';
    }
    if (this.screenHeight < 481) {
      return '65';
    }
    return '100';
  }

  public getImgStyle(): string {
    if (this.screenWidth < 360) {
      return 'max-width: 90px; height: 50px; ';
    }
    if (this.screenWidth < 375) {
      return 'max-width: 130px; height: 65px; ';
    }
    if (this.screenWidth < 390) {
      return 'max-width: 140px; height: 70px;';
    }
    if (this.screenWidth < 481) {
      return 'max-width: 160px; height: 70px;';
    }
    if (this.screenHeight < 481) {
      return 'max-width: 149px; height: 65px;';
    }
    return 'max-width: 230px; height: 100px;';
  }

  public getImgStyleWithPad(): string {
    if (this.screenWidth < 481) {
      return 'max-width: 162px; height: 75px; padding-right: 8px;';
    }
    if (this.screenHeight < 481) {
      return 'max-width: 149px; height: 65px; padding-right: 7px;';
    }
    return 'max-width: 230px; height: 100px; padding-right: 10px;';
  }








  public getFutureCoupons(coupons: Coupon[]): Coupon[] {
    return coupons.filter(c => this.isFutureDate(c.endDate))
    .sort((a,b) => (a.id > b.id) ? 1 : ((b.id > a.id) ? -1 : 0));;
  }

  public getIsEditModePossible(): any {
    return localStorage.getItem('isEditModePossible');
  }

  public setIsEditModePossible(selection: string): void {
    localStorage.setItem('isEditModePossible', selection);
  }

  public isNameValid(name: string): boolean {
    return this.namePattern.test(name);
  }

  public isEmailValid(email: string): boolean {
    return this.emailPattern.test(email);
  }

  public isPasswordValid(password: string): boolean {
    return this.passwordPattern.test(password);
  }

  public isFirstNameValid(name: string): boolean {
    return this.firstNamePattern.test(name);
  }

  public isLastNameValid(name: string): boolean {
    return this.lastNamePattern.test(name);
  }

  public isCouponTitleValid(title: string): boolean {
    return this.couponStrPattern.test(title);
  }

  // pattern same as title
  public isCouponDescriptionValid(descr: string): boolean {
    return this.couponStrPattern.test(descr);
  }

  public convertDateToJsDateWithoutTime(date: Date): Date {
    let year: number = Number(date.toString().substring(0,4));
    let month: number = Number(date.toString().substring(5,7));
    let dayOfMonth: number = Number(date.toString().substring(8,10));
    return new Date(year, month - 1, dayOfMonth);
  }

  public getDateWithoutTime(date: Date): Date {
    let year = date.getFullYear();
    let month = date.getMonth();
    let dayOfMonth = date.getDate();
    return new Date(year, month, dayOfMonth);
  }

  public isFutureDate(date: Date): boolean {
    return this.convertDateToJsDateWithoutTime(date).valueOf() >=
          this.todaysDateWithoutTime.valueOf();
  }

  public isPastDate(date: Date): boolean {
    return this.convertDateToJsDateWithoutTime(date).valueOf() <=
          this.todaysDateWithoutTime.valueOf();
  }

  public isEndDateSmaller(startDate: Date, endDate: Date): boolean {
    return this.convertDateToJsDateWithoutTime(endDate).valueOf() <
    this.convertDateToJsDateWithoutTime(startDate).valueOf();
  }

  // public isValidJsDate(date: Date): boolean {
  //   return date.getTime() > 0 && date.getTime() !== NaN;
  // }

  public isDateValid(date: Date): boolean {
    let isYear4Char: boolean = date.toString().substring(4,5) === '-';
    date = this.convertDateToJsDateWithoutTime(date);
    return date.getTime() > 0 && date.getTime() !== NaN && isYear4Char;
  }

  public isInt(amount: number): boolean {
    return Number.isInteger(amount);
  }

  public isPositive(num: number): boolean {
    return num > 0;
  }

  public isCategoryIdNone(categoryId: Category): boolean {
    return categoryId === Category.NONE;
  }

  // use for cap person first and last name
  public capName(name: string): string {
    let wordsArr: string[] = [];
    let seperatingChar: string = '..'; // there will never be .. in the name b/c of the regex
    if (name.includes(' ')) {
      seperatingChar = ' ';
    }
    if (name.includes('.')) {
      seperatingChar = '.';
    }

    wordsArr = name.toLowerCase().split(seperatingChar);
    for (let i = 0; i < wordsArr.length; i++) {
        wordsArr[i] = wordsArr[i].charAt(0).toUpperCase() + wordsArr[i].substring(1);
    }
    return wordsArr.join(seperatingChar);
  }

  public capTitle(name: string): string {
    let wordsArr: string[] = [];

    wordsArr = name.split(' ');
    for (let i = 0; i < wordsArr.length; i++) {
        wordsArr[i] = wordsArr[i].charAt(0).toUpperCase() + wordsArr[i].substring(1);
    }
    return wordsArr.join(' ');
  }

  public capFirstLetter(name: string): string {
    let prefix = '';
    let wordsArr: string[] = [];
    wordsArr = name.split('.');
    for (let i = 0; i < wordsArr.length; i++) {
      if (i === 1) {
        prefix = ' ';
      }
      for(let j = 0; j < wordsArr[i].length; j++ ) {
        if (wordsArr[i][j] !== ' ') {
          if (isNaN(Number(wordsArr[i][j]))) {
            wordsArr[i] = prefix + wordsArr[i].charAt(j).toUpperCase()
            + wordsArr[i].substring(j + 1);
          }
          break;
        }
      }

    }
    return wordsArr.join('.');
  }

  public getCategory(cat: Category): string {
    let result: string = cat.toString();
    let maxLetters: number = 6;
    if (this.screenWidth < 650 &&  result.length > maxLetters) {
      result = result.slice(0, maxLetters) + '.';
    }
    return result;
  }


  public shortenExp(exp: string, max: number): string {
    let wordsArr: string[] = [];
    let maxWords = max;
    let suff = '';
    wordsArr = exp.split(' ');
    if (wordsArr.length > maxWords) {
      let lastWord = wordsArr[maxWords-1];
      let lastChar = lastWord.charAt(lastWord.length-1);
      lastChar === '.' ? suff = '..' : suff = '...';
      wordsArr.splice(maxWords);
    }
    return wordsArr.join(' ') + suff;
  }

  public shortenDesc(desc: string): string {
    return this.shortenExp(desc, 12);
  }

  public shortenTitle(title: string): string {
    if (this.getScreenType() === 'mobile') {
      return this.shortenExp(title, 4);
    }
    return title;
  }

  public toggleCompanyCrudFilterSec(): void {
    this.isCompanyCrudFilterSecShown = !this.isCompanyCrudFilterSecShown;
  }

  public toggleCustomerCrudFilterSec(): void {
    this.isCustomerCrudFilterSecShown = !this.isCustomerCrudFilterSecShown;
  }

  public toggleCouponCrudFilterSec(): void {
    this.isCouponCrudFilterSecShown = !this.isCouponCrudFilterSecShown;
  }

  public toggleCustomerCouponsFilterSec(): void {
    this.isCustomerCouponsFilterSecShown = !this.isCustomerCouponsFilterSecShown;
  }

  public toggleAllCouponsFilterSec(): void {
    this.isAllCouponsFilterSecShown = !this.isAllCouponsFilterSecShown;
  }













  // public getCompanyDetails(): void {

  //   if (!this.authService.hasAlreadyRetrievedCouponsFromServer) {
  //     this.companyRestService.getCompanyDetails().subscribe(response => {
  //       console.log(response); // TODO delete this line


  //       this.currentCompany = [...response];
  //       this.couponsToShow = [...this.companyRestService.coupons];
  //       this.sort();
  //       if (this.formService.isSuccessMsgShown) {
  //         const newCoupon: Coupon[] =
  //         this.couponsToShow.filter(c => c.title === this.formService.titleOfAddedCoupon);
  //         const couponIdx: number = this.couponsToShow.indexOf(newCoupon[0]);
  //         this.couponsToShow.splice(couponIdx + 1, 0, this.couponMsg);
  //         this.couponMsg.id = 0;
  //         this.couponMsg.description = `Coupon ${this.updatedTitle} Has Been Added Successfully!`;
  //         this.couponMsgClass = 'table-success';
  //         this.formService.isSuccessMsgShown = false;
  //         // check if it's ok to write here the this.formService.titleOfAddedCoupon='';
  //       }

  //     }, err => {
  //       console.log(err.error); // TODO delete this line
  //       this.showErrMsg(err);
  //     });
  //   } else {
  //     this.couponsToShow = [...this.companyRestService.coupons];
  //     this.sort();
  //   }
  // }








}
