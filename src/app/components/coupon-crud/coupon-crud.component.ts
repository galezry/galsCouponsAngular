import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Category } from 'src/app/models/category.model';
import { Coupon } from 'src/app/models/coupon.model';
import { FormState } from 'src/app/models/form-state.model';
import { UserType } from 'src/app/models/user-type.model';
import { AuthService } from 'src/app/services/auth.service';
import { CompanyRestService } from 'src/app/services/company-rest.service';
import { DevService } from 'src/app/services/dev.service';
import { FormService } from 'src/app/services/form.service';
import { ImageRestService } from 'src/app/services/image-rest.service';
import { WelcomeRestService } from 'src/app/services/welcome-rest.service';


@Component({
  selector: 'app-coupon-crud',
  templateUrl: './coupon-crud.component.html',
  styleUrls: ['./coupon-crud.component.css'],

})
export class CouponCrudComponent implements OnInit {

  public isErrMsgShown: boolean = false;
  public errMsg: string = '';

  public idSearched = '';
  public ctgrSearched: Category = Category.NONE;
  public titleSearched = '';
  public maxPriceSearched: number = 1000;

  public couponsToShow: Coupon[] = [];

  public isEditModePossible: boolean = this.formService.getIsEditModePossible() === 'yes';

  public isUpdateMode: boolean = false;
  public couponIdToUpdate: number = -1;

  public couponMsg: Coupon = new Coupon();
  public isCouponMsgShown: boolean = false;  // check if nessesary
  public couponMsgClass: string = '';

  public couponAdded: Coupon = new Coupon();

  public updatedCategoryId: Category = Category.NONE;
  public updatedTitle: string = '';
  public updatedDescription: string = '';
  public updatedStartDate: Date = new Date();
  public updatedEndDate: Date = new Date();
  public updatedAmount: number = 0;
  public updatedPrice: number = 0;
  public updatedImage: string = '';

  public existedTitle: string = 'x';

  // Used for title, description
  public strPattern: RegExp = this.formService.couponStrPattern;
  public explainStr: string = this.formService.explainCouponStr;
  public strTitle: string = this.formService.couponStrTitle;

  public minPrice: number = this.formService.minCouponPrice;
  public explainPrice: string = this.formService.explainPrice;

  public inValidDateMsg: string = this.formService.inValidDateMsg;
  public noPastEndDateMsg: string = this.formService.noPastEndDateMsg;
  public notPriorToStartDateMsg: string = this.formService.notPriorToStartDateMsg;
  public endDateTitle: string = this.formService.endDateTitle;

  public idAutoIncMsg: string = this.formService.idAutoIncMsg;
  public compIdAutoIncMsg: string = this.formService.compIdAutoIncMsg;

  public saveBtnTitle: string = '';

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
  public imagesToDisplay = this.companyRestService.imagesToDisplay;
  public imgFile: any = '';
  public chosenImg: any = '';
  // public originalImgToDisplay: any = '';
  public isOriginalImgChanged: boolean = false;
  public isImgErrShown: boolean = false;
  public imgErrMsg: string = this.formService.imgTooBigShortErrMsg;
  public hasImgFailedToBeAddedToDB: boolean = false;



  constructor(private companyRestService: CompanyRestService, private router: Router,
    private devService: DevService, private formService: FormService,
    private authService: AuthService, private imageRestService: ImageRestService,
    private welcomeRestService: WelcomeRestService) { }

  ngOnInit(): void {

    if (this.isVPWidthSmall()) {
      this.isEditModePossible = false;
      this.formService.setIsEditModePossible('no');
    }

    if (!this.authService.isLoggedIn) {
      this.authService.hasAlreadyRetrievedCouponsFromServer = false;
      this.authService.hasAlreadyRetrievedCompanyImagesFromServer = false;
      this.companyRestService.coupons = [];
      this.companyRestService.companyImages = [];
      this.companyRestService.imagesToDisplay = [];
      this.isErrMsgShown = true;
      this.errMsg = this.authService.notLoggedInErrMsg;
      return;
    }
    if (!this.isUserTypeCompany()) {
      this.isErrMsgShown = true;
      this.errMsg = this.authService.notAuthorizedErrMsg;
      return;
    }

    this.getCompanyImages();
    this.getCompanyCoupons();
  }

  public isVPWidthSmall(): boolean {
    return this.formService.screenWidth < 1400;
  }

  public toggleFilterSec(): void {
    this.deleteCouponMsg();
    this.formService.toggleCouponCrudFilterSec();
  }

  public isFilterSecShown(): boolean {
    return this.formService.isCouponCrudFilterSecShown;
  }

  public isFiltering(): boolean {
    return this.couponsToShow.length < this.companyRestService.coupons.length;
  }

  public isCompIdShown(): boolean {
    return this.formService.screenWidth < 1400;
  }

  // public getImgHeight(): string {
  //   // console.log('img height is: ', this.formService.getImgHeight());
  //   return this.formService.getImgHeight();
  // }

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

  // public areDelBtnBr(): boolean {

  //   return false;
  // }

  // public sleep(ms: number) {
  //   return new Promise(resolve => setTimeout(resolve, ms));
  // }

  // public async getComapnyId(): Promise<void> {
  //   while(this.companyRestService.currentLoggedInCompany.id === 0) {
  //     await this.sleep(100);
  //   }
  //   const companyId: number = this.companyRestService.currentLoggedInCompany.id;
  //   this.getCompanyImages(companyId);
  // }

  public getCompanyImages(): void {
    if (!this.authService.hasAlreadyRetrievedCompanyImagesFromServer) {
      this.companyRestService.getCompanyImages().subscribe(response => {
        // console.log(response); // TODO delete this line
        this.authService.hasAlreadyRetrievedCompanyImagesFromServer = true;
        this.isErrMsgShown = false;
        this.companyRestService.companyImages = [...response];
        for (let i of this.companyRestService.companyImages) {
          this.companyRestService.imagesToDisplay[i.couponId] = 'data:image/jpeg;base64,' + i.picture;
        }
        // console.log(this.companyRestService.imagesToDisplay);
        // console.log(this.imagesToDisplay);

      }, err => {
        // console.log(err.error); // TODO delete this line
        // this.authService.signOut();
        this.showErrMsg(err);
      });
    }
  }

  public getCompanyCoupons(): void {
    if (!this.authService.hasAlreadyRetrievedCouponsFromServer) {
      this.companyRestService.getCompanyCoupons().subscribe(response => {
        // console.log(response); // TODO delete this line
        this.authService.hasAlreadyRetrievedCouponsFromServer = true;
        this.isErrMsgShown = false;
        this.companyRestService.originalcouponsInDB = [...response];
        this.companyRestService.coupons = this.companyRestService.originalcouponsInDB
        .filter(c => this.formService.isFutureDate(c.endDate));
        this.couponsToShow = [...this.companyRestService.coupons];
        this.sort();
        if (this.formService.isSuccessMsgShown) {
          const newCoupon: Coupon[] =
          this.couponsToShow.filter(c => c.title === this.formService.titleOfAddedCoupon);
          const couponIdx: number = this.couponsToShow.indexOf(newCoupon[0]);
          this.couponsToShow.splice(couponIdx + 1, 0, this.couponMsg);
          this.couponMsg.id = 0;
          if (this.hasImgFailedToBeAddedToDB) {
            this.couponMsg.description = `Coupon Details (other than the image) Have Been Added
            Successfully, Please try to add an image later`;
            this.hasImgFailedToBeAddedToDB = false;
          } else {
            this.couponMsg.description = `Coupon ${this.updatedTitle} Has Been Added Successfully!`;
          }
          this.couponMsgClass = 'table-success';
          this.formService.isSuccessMsgShown = false;
          // check if it's ok to write here the this.formService.titleOfAddedCoupon='';
        }

      }, err => {
        // console.log(err.error); // TODO delete this line
        this.authService.signOut();
        this.isErrMsgShown = true;
        this.errMsg = this.authService.hasBeenSignedOutErrMsg;
      });
    } else {
      this.couponsToShow = [...this.companyRestService.coupons];
      this.sort();
    }
  }


  public sort() {
    if (this.formService.isCouponSortedById) {
      this.sortById();
    } else if(this.formService.isCouponSortedByCategoryId) {
      this.sortByCategoryId();
    } else if(this.formService.isCouponSortedByTitle) {
      this.sortByTitle();
    } else if(this.formService.isCouponSortedByStartDate) {
      this.sortByStartDate();
    } else if(this.formService.isCouponSortedByEndDate) {
      this.sortByEndDate();
    } else if(this.formService.isCouponSortedByAmount) {
      this.sortByAmount();
    } else {
      this.sortByPrice();
    }
  }

  public sortById() {
    this.couponsToShow.sort((a,b) => (a.id > b.id) ? 1 : ((b.id > a.id) ? -1 : 0));
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

  public sortByStartDate() {
    this.couponsToShow.sort((a,b) => (a.startDate > b.startDate)
       ? 1 : ((b.startDate > a.startDate) ? -1 : 0));
  }

  public sortByEndDate() {
    this.couponsToShow.sort((a,b) => (a.endDate > b.endDate)
       ? 1 : ((b.endDate > a.endDate) ? -1 : 0));
  }

  public sortByAmount() {
    this.couponsToShow.sort((a,b) => (a.amount > b.amount)
       ? 1 : ((b.amount > a.amount) ? -1 : 0));
  }

  public sortByPrice() {
    this.couponsToShow.sort((a,b) => (a.price > b.price)
       ? 1 : ((b.price > a.price) ? -1 : 0));
  }

  public shouldSortBy(attr: string): void {
    if (!this.isUpdateMode) {  // make sure the if is nessasery
      this.deleteCouponMsg();
      switch (attr) {
        case 'categoryId':
          this.formService.isCouponSortedById = false;
          this.formService.isCouponSortedByCategoryId = true;
          this.formService.isCouponSortedByTitle = false;
          this.formService.isCouponSortedByStartDate = false;
          this.formService.isCouponSortedByEndDate = false;
          this.formService.isCouponSortedByAmount = false;
          this.formService.isCouponSortedByPrice = false;
          break;

        case 'title':
          this.formService.isCouponSortedById = false;
          this.formService.isCouponSortedByCategoryId = false;
          this.formService.isCouponSortedByTitle = true;
          this.formService.isCouponSortedByStartDate = false;
          this.formService.isCouponSortedByEndDate = false;
          this.formService.isCouponSortedByAmount = false;
          this.formService.isCouponSortedByPrice = false;
          break;

        case 'startDate':
          this.formService.isCouponSortedById = false;
          this.formService.isCouponSortedByCategoryId = false;
          this.formService.isCouponSortedByTitle = false;
          this.formService.isCouponSortedByStartDate = true;
          this.formService.isCouponSortedByEndDate = false;
          this.formService.isCouponSortedByAmount = false;
          this.formService.isCouponSortedByPrice = false;
          break;

          case 'endDate':
            this.formService.isCouponSortedById = false;
            this.formService.isCouponSortedByCategoryId = false;
            this.formService.isCouponSortedByTitle = false;
            this.formService.isCouponSortedByStartDate = false;
            this.formService.isCouponSortedByEndDate = true;
            this.formService.isCouponSortedByAmount = false;
            this.formService.isCouponSortedByPrice = false;
            break;

          case 'amount':
            this.formService.isCouponSortedById = false;
            this.formService.isCouponSortedByCategoryId = false;
            this.formService.isCouponSortedByTitle = false;
            this.formService.isCouponSortedByStartDate = false;
            this.formService.isCouponSortedByEndDate = false;
            this.formService.isCouponSortedByAmount = true;
            this.formService.isCouponSortedByPrice = false;
            break;

          case 'price':
            this.formService.isCouponSortedById = false;
            this.formService.isCouponSortedByCategoryId = false;
            this.formService.isCouponSortedByTitle = false;
            this.formService.isCouponSortedByStartDate = false;
            this.formService.isCouponSortedByEndDate = false;
            this.formService.isCouponSortedByAmount = false;
            this.formService.isCouponSortedByPrice = true;
            break;

          default:
            this.formService.isCouponSortedById = true;
            this.formService.isCouponSortedByCategoryId = false;
            this.formService.isCouponSortedByTitle = false;
            this.formService.isCouponSortedByStartDate = false;
            this.formService.isCouponSortedByEndDate = false;
            this.formService.isCouponSortedByAmount = false;
            this.formService.isCouponSortedByPrice = false;
      }
      this.sort();
    }
  }

  public getClass(attr: string): string {
    switch (attr) {
      case 'categoryId':
        return this.formService.isCouponSortedByCategoryId ? 'active-sort' :
        !this.isUpdateMode ? 'not-sorted' : '';
      case 'title':
        return this.formService.isCouponSortedByTitle ? 'active-sort' :
        !this.isUpdateMode ? 'not-sorted' : '';
      case 'startDate':
        return this.formService.isCouponSortedByStartDate ? 'active-sort' :
        !this.isUpdateMode ? 'not-sorted' : '';
      case 'endDate':
        return this.formService.isCouponSortedByEndDate ? 'active-sort' :
        !this.isUpdateMode ? 'not-sorted' : '';
      case 'amount':
        return this.formService.isCouponSortedByAmount ? 'active-sort' :
        !this.isUpdateMode ? 'not-sorted' : '';
      case 'price':
        return this.formService.isCouponSortedByPrice ? 'active-sort' :
        !this.isUpdateMode ? 'not-sorted' : '';
      default:
        return this.formService.isCouponSortedById ? 'active-sort' :
        !this.isUpdateMode ? 'not-sorted' : '';
    }
  }

  public delete(coupon: Coupon): void {
    this.deleteCouponMsg();
    this.isUpdateMode = true;
    const couponIdx: number = this.couponsToShow.indexOf(coupon);
    this.couponsToShow.splice(couponIdx + 1, 0, this.couponMsg);
    this.couponMsg.id = 0;
    this.couponMsg.description =
    `Are you sure you want to delete coupon ${coupon.title}?`;
    this.couponMsg.title = 'delete';
    this.couponMsgClass = 'table-danger';
  }

  public cancelDelete(): void{
    this.couponsToShow = this.couponsToShow.filter(c => c.id > 0);
    this.couponMsg.title = '';
    this.isUpdateMode = false;
  }


  public deleteCoupon(): void {
    let couponIdx: number = this.couponsToShow.indexOf(this.couponMsg);
    const couponToDelete = this.couponsToShow[couponIdx - 1];

    this.companyRestService.deleteCoupon(couponToDelete.id).subscribe(response => {
      // console.log(response);
      this.isUpdateMode = false;
      this.companyRestService.coupons = this.companyRestService.coupons
      .filter(c => c.id !== couponToDelete.id);
      this.couponsToShow = this.couponsToShow.filter(c => c.id !== couponToDelete.id);
      this.couponMsg.description = `Coupon ${couponToDelete.title} Has Been Deleted Successfully!`;
      this.couponMsg.title = '';
      this.couponMsgClass = 'table-success';

      if (this.companyRestService.imagesToDisplay[couponToDelete.id] !== undefined
        && this.companyRestService.imagesToDisplay[couponToDelete.id] !== '') {
          this.welcomeRestService.hasAlreadyRetrievedWelcomeCouponsFromServer = false;
          this.deleteImage(couponToDelete.id);
        } else {
          console.log('there is no img in the deleted coupon');
         // console.log(this.companyRestService.imagesToDisplay[couponToDelete.id]);
        }

      }, err => {
        this.showErrMsg(err);
        // console.log(err.error); // TODO delete this line
      });
  }

  public deleteImage(couponId: number): void {
  //  console.log(couponId);
  //  console.log(this.companyRestService.imagesToDisplay[couponId].charAt(0));
  //  console.log(this.companyRestService.imagesToDisplay);
    this.imageRestService.deleteImage(couponId).subscribe(response => {
      // console.log(response); // TODO delete this line
      this.companyRestService.imagesToDisplay[couponId] = '';
    //  console.log(this.companyRestService.imagesToDisplay);

    }, err => {
      // console.log('error occured while deleting the image from the DB');
      // console.log(err.error); // TODO delete this line
      this.showErrMsg(err);
    });
  }

  public searchByCategoryId() {
    this.deleteCouponMsg();
    this.idSearched = '';
    this.titleSearched = '';
    this.maxPriceSearched = 1000;
    if (this.ctgrSearched.toString() === Category[Category.ALL]) {
      this.couponsToShow = [...this.companyRestService.coupons];
    } else {
      this.couponsToShow = this.companyRestService.coupons
    .filter(c => c.categoryId === this.ctgrSearched);
    }
    this.sort();
  }

  public searchByMaxPrice() {
    this.deleteCouponMsg();
    this.idSearched = '';
    this.ctgrSearched = Category.NONE;
    this.titleSearched = '';
    this.couponsToShow = this.companyRestService.coupons
    .filter(c => c.price <= this.maxPriceSearched);
    this.sort();
  }

  public searchById(event: any) {
    this.deleteCouponMsg(); // change all the rest to: > 0
    this.ctgrSearched = Category.NONE;
    this.maxPriceSearched = 1000;
    if (event.key === 'Backspace' || event.key === 'Delete') {
      this.couponsToShow = [...this.companyRestService.coupons];

      if (this.titleSearched !== '') {
        this.searchByTitle('k');  // the argument can be any key other than Backspace or Delete
      }
    }

    if (this.titleSearched !== '') {
      this.couponsToShow = this.couponsToShow.filter(c => c.id.toString()
       .startsWith(this.idSearched));
    } else {
      this.couponsToShow = this.companyRestService.coupons.filter(c => c.id.toString()
     .startsWith(this.idSearched));
    }
    this.sort();
}

  public searchByTitle(event: any) {
    this.deleteCouponMsg();
    this.ctgrSearched = Category.NONE;
    this.maxPriceSearched = 1000;
    if (event.key === 'Backspace' || event.key === 'Delete') {
      this.couponsToShow = [...this.companyRestService.coupons];

      if (this.idSearched !== '') {
        this.searchById('k');
      }
    }

      if (this.idSearched !== '') {
        this.couponsToShow = this.couponsToShow.filter(c => c.title.toLowerCase()
         .startsWith(this.titleSearched.toLowerCase()));
      } else {
        this.couponsToShow = this.companyRestService.coupons.filter(c => c.title.toLowerCase()
       .startsWith(this.titleSearched.toLowerCase()));
      }
      this.sort();
  }

  public isCouponsToShowEmpty(): boolean {
    return this.couponsToShow.length === 0;
  }

  public isCouponsArrEmpty(): boolean {
    return this.companyRestService.coupons.length === 0;
  }

  public deleteCouponMsg(): void {
    this.couponsToShow = this.couponsToShow.filter(c => c.id !== 0);
  }

  public capNames(): void {
    // this.updatedTitle = this.updatedTitle.trim(); // check if nesesarry here and in the other ts.
    // this.updatedDescription = this.updatedDescription.trim(); // because the regex doesnt let it have spaces.
    // this.updatedImage = this.updatedImage.trim(); // this one is nessesary - no regex.

    this.updatedTitle = this.formService.capTitle(this.updatedTitle);
    this.updatedDescription = this.formService.capFirstLetter(this.updatedDescription);
  }

  public update(coupon: Coupon): void {

    if (!this.isEditModePossible || this.isVPWidthSmall()) {
      this.formService.couponForm = FormState.UPDATE;
      this.formService.coupon =  Object.assign({}, coupon);

    } else {
      this.couponsToShow = [...this.companyRestService.coupons];
      this.sort();
      this.idSearched = '';
      this.titleSearched = '';
      this.ctgrSearched = Category.NONE;
      this.maxPriceSearched = 1000;

      this.isUpdateMode = true;
      this.saveBtnTitle = 'Save Changes';
      this.couponIdToUpdate = coupon.id;
      this.updatedCategoryId = coupon.categoryId;
      this.updatedTitle = coupon.title;
      this.updatedDescription = coupon.description;
      this.updatedStartDate = coupon.startDate;
      this.updatedEndDate = coupon.endDate;
      this.updatedAmount = coupon.amount;
      this.updatedPrice = coupon.price;
      this.updatedImage = coupon.image;

     // this.originalImgToDisplay = this.imagesToDisplay[coupon.id]
    }
  }

  public cancelUpdate(): void{
    this.couponsToShow = this.couponsToShow.filter(c => c.id > 0);
    this.couponIdToUpdate = -1;
    this.isUpdateMode = false;
    this.existedTitle = 'x';
    this.couponAdded.id = 0;

    this.resetImgVariables();
  }

  public doesUpdatedTitleEqualsExistedTitle(): boolean {
    return this.updatedTitle.toLowerCase() === this.existedTitle.toLowerCase();
  }

  public doesTitleExist(): boolean {
    return this.companyRestService.doesCouponTitleExist(this.updatedTitle);
  }

  public doesUpdatedTitleBelongToAnotherCoupon(couponTitle: string): boolean {
    if (this.updatedTitle.toLowerCase() !== couponTitle.toLowerCase() && this.doesTitleExist()) {
      this.couponMsg.description = this.formService.titleExistsErrMsg;
      this.couponMsgClass = 'table-warning';
      this.existedTitle = this.updatedTitle;
      return true;
    }
    return false;
  }

  public isCategoryIdNone(): boolean {
    return this.formService.isCategoryIdNone(this.updatedCategoryId);
  }

  public isCategoryIdValid(): boolean {
    return !this.isCategoryIdNone();
  }

  public isTitleValid(): boolean {
    return this.formService.isCouponTitleValid(this.updatedTitle) &&
    !this.doesUpdatedTitleEqualsExistedTitle();
  }

  public isDescriptionValid(): boolean {
    return this.formService.isCouponDescriptionValid(this.updatedDescription);
  }

  public isDateValid(date: Date): boolean {
    return this.formService.isDateValid(date);
  }

  public isStartDateValid(): boolean {
    return this.isDateValid(this.updatedStartDate);
  }

  public isEndDateLegal(): boolean {
    return this.isDateValid(this.updatedEndDate);
  }

  public isEndDateFutureDate(): boolean {
    return this.formService.isFutureDate(this.updatedEndDate);
  }

  public isEndDateSmaller(): boolean {
    return this.formService.isEndDateSmaller(this.updatedStartDate, this.updatedEndDate);
  }

  public isEndDateValid(): boolean {
    return this.isEndDateLegal() && !this.isEndDateSmaller() &&
    this.isEndDateFutureDate();
  }

  public isAmountValid(): boolean {
    return this.formService.isInt(this.updatedAmount) &&
    this.formService.isPositive(this.updatedAmount);
  }

  public isPriceValid(): boolean {
    return this.updatedPrice >= this.minPrice;
  }

  public isUpdatePossible(): boolean {
    return this.isCategoryIdValid() && this.isTitleValid() && this.isDescriptionValid() &&
    this.isStartDateValid() && this.isEndDateValid() && this.isAmountValid() &&
    this.isPriceValid();
  }

  public wereNoChangesMadeToCouponDetails(coupon: Coupon): boolean {
    return coupon.categoryId === this.updatedCategoryId &&
    coupon.title.toLowerCase() === this.updatedTitle.toLowerCase() &&
    coupon.description.toLowerCase() === this.updatedDescription.toLowerCase() &&
    coupon.startDate === this.updatedStartDate && coupon.endDate === this.updatedEndDate &&
    coupon.amount === this.updatedAmount && coupon.price === this.updatedPrice;
  }

  public wereNoChangesMade(coupon: Coupon): boolean {
    if (this.wereNoChangesMadeToCouponDetails(coupon)
    && this.getImgUpdateAction(coupon.id) === 'none') {
      this.couponMsg.description = `No changes have been detected for Coupon ${coupon.title}`;
      this.couponMsgClass = 'table-info';
      this.existedTitle = 'x';
      this.couponIdToUpdate = -1;
      this.isUpdateMode = false;
      return true;
    }
      return false;
  }

  public updateCoupon(coupon: Coupon): void {
    // console.log(this.getImgUpdateAction(coupon.id));
    this.deleteCouponMsg();
    this.isErrMsgShown = false;
    let couponIdx: number = this.couponsToShow.indexOf(coupon);
    this.couponsToShow.splice(couponIdx + 1, 0, this.couponMsg);

    if (this.wereNoChangesMade(coupon)) {
      return;
    }
    if (this.doesUpdatedTitleBelongToAnotherCoupon(coupon.title)) {
      return;
    }
    this.existedTitle = 'x';
    this.couponIdToUpdate = -1;
    this.isUpdateMode = false;

    if (this.wereNoChangesMadeToCouponDetails(coupon)) {
      this.updateImage(coupon.id);
      return;
    }

    this.capNames();

    coupon.categoryId = this.updatedCategoryId;
    coupon.title = this.updatedTitle;
    coupon.description = this.updatedDescription;
    coupon.startDate = this.updatedStartDate;
    coupon.endDate = this.updatedEndDate;
    coupon.amount = this.updatedAmount;
    coupon.price = this.updatedPrice;
    coupon.image = this.updatedImage;
    this.companyRestService.updateCoupon(coupon).subscribe(response => {
      // console.log(response);
      this.companyRestService.coupons = this.companyRestService.coupons
      .filter(c => c.id !== coupon.id);
      const updatedCoupon: Coupon = Object.assign({}, coupon);
      this.companyRestService.coupons.push(updatedCoupon);
      this.updateImage(coupon.id);

    }, err => {
      // console.log(err.error); // TODO delete this line
      this.isUpdateMode = false;
      this.showErrMsg(err);
    });
  }

  public add(): void {
   //this.deleteCouponMsg(); // dont need this line
    if (!this.isEditModePossible || this.companyRestService.coupons.length === 0
      || this.isVPWidthSmall()) {
      this.formService.couponForm = FormState.ADD;
    } else {
      this.couponsToShow = [...this.companyRestService.coupons];
      this.sort();
      this.idSearched = '';
      this.titleSearched = '';
      this.ctgrSearched = Category.NONE;
      this.maxPriceSearched = 1000;

      this.isUpdateMode = true;
      this.saveBtnTitle = 'Add Coupon';
      this.couponsToShow.splice(this.couponsToShow.length, 0, this.couponAdded);
      this.couponAdded.id = -5;
      this.updatedCategoryId = Category.NONE;
      this.updatedTitle = '';
      this.updatedDescription = '';
      this.updatedStartDate = new Date();;
      this.updatedEndDate = new Date();
      this.updatedAmount = 0;
      this.updatedPrice = 0;
      this.updatedImage = '';
    }
  }

  public isAddCouponPossible(): boolean {
    return this.isUpdatePossible();
  }

  public addMsgRow(): void {
    this.couponsToShow.splice(this.couponsToShow.length, 0, this.couponMsg);
    this.couponMsg.id = 0;
  }

  public addCoupon() {
    this.deleteCouponMsg();
    this.addMsgRow();
    this.isErrMsgShown = false;
    if (this.doesUpdatedTitleBelongToAnotherCoupon('a')) {
      return;
    }
    this.capNames();
    this.existedTitle = 'x';
    this.couponAdded.id = 0;

    let couponToSend: object = {
      companyId: this.getCompanyId(),
      categoryId: this.updatedCategoryId,
      title: this.updatedTitle,
      description: this.updatedDescription,
      startDate: this.updatedStartDate,
      endDate: this.updatedEndDate,
      amount: this.updatedAmount,
      price: this.updatedPrice,
      image: this.updatedImage
    };
    this.companyRestService.addCoupon(couponToSend).subscribe(response => {
      // console.log(response);
      this.addImageToNewCoupon();

    }, err => {
      // console.log(err.error); // TODO delete this line
      this.isUpdateMode = false;
      this.showErrMsg(err);
    });
  }

  public actionsAfterCouponSuceessfullyAdded(): void {
    this.resetImgVariables();
    this.authService.hasAlreadyRetrievedCouponsFromServer = false;
    this.formService.isSuccessMsgShown = true;
    this.formService.titleOfAddedCoupon = this.updatedTitle;
    this.isUpdateMode = false;
    this.getCompanyCoupons();
  }


  public showErrMsg(err: any) {
    this.isErrMsgShown = true;
    this.errMsg = this.authService.connectionToServerAndLoginCheck(err);
  }

  public editModeCheckBox() {
    this.couponsToShow = this.couponsToShow.filter(c => c.id > 0);
    this.existedTitle = 'x';
    this.couponIdToUpdate = -1;
    this.isUpdateMode = false;
    this.resetImgVariables();
    if (this.formService.getIsEditModePossible() === 'yes') {
      this.formService.setIsEditModePossible('no');
    } else {
      this.formService.setIsEditModePossible('yes');
    }
  }

  public getCompanyId(): number {
    return this.formService.currentLoggedInCompany.id;
  }

  public isUserTypeCompany(): boolean {
    return this.authService.getUserType() === UserType.COMPANY;
  }

  public isLoggedIn(): boolean {
    return this.authService.isLoggedIn;
  }

  // public getCompanyDetails(): void {
  //   this.companyRestService.getCompanyDetails().subscribe(response => {
  //     this.authService.currentLoggedInCompany = Object.assign({}, response);
  //     this.authService.setCompanyName();
  //     console.log(response); // TODO delete this line
  //   }, err => {
  //     console.log(err.error); // TODO delete this line
  //     this.showErrMsg(err);
  //   });
  // }

  public createImg(event: any): void {
    this.isImgErrShown = false;
    const maxSize: number = this.formService.maxAllowedPhotoSize;
  //  this.chosenImg = '';
  //  this.imgFile = '';
    const chosenFile = event.target.files[0];
    if (chosenFile === undefined) {
      return;
    }
    if (chosenFile.size <= maxSize) {
      this.imgFile = chosenFile;
      this.isOriginalImgChanged = true;
      // Below part is used to display the selected image
      let reader: FileReader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = () => {
        this.chosenImg = reader.result;
      };
    } else {
      this.isImgErrShown = true;
    }
  }

  public addImageToNewCoupon(): void {
    if (this.imgFile === '') {
      this.actionsAfterCouponSuceessfullyAdded();
      // console.log('no img');
      return;
    }

    const imgToUpload: FormData = new FormData();
    imgToUpload.append('couponImg', this.imgFile, this.imgFile.name);
    this.companyRestService.getCouponIdByTitle(this.updatedTitle).subscribe(
    response => {
      // console.log(response); // TODO delete this line
      const couponId = response;
      if (couponId > 0) {
        this.imageRestService.addImage(imgToUpload, couponId, this.getCompanyId()).subscribe(
        response => {
          // console.log(response); // TODO delete this line
          this.companyRestService.imagesToDisplay[couponId] = this.chosenImg;
          this.actionsAfterCouponSuceessfullyAdded();
        }, err => {
          // console.log(err.error); // TODO delete this line
          this.showErrMsg(err);
          this.hasImgFailedToBeAddedToDB = true;
          this.actionsAfterCouponSuceessfullyAdded();
        });
      } else {
        console.log  // is not supposed to happen
        ('Problem: The title of the coupon that was just added was not found in the DB');
        this.hasImgFailedToBeAddedToDB = true;
        this.actionsAfterCouponSuceessfullyAdded();
      }
    }, err => {
      // console.log(err.error); // TODO delete this line
      this.showErrMsg(err);
      this.hasImgFailedToBeAddedToDB = true;
      this.actionsAfterCouponSuceessfullyAdded();
    });
  }

  public getImgUpdateAction(couponId: number): string {
    if (!this.isOriginalImgChanged
    || (this.companyRestService.imagesToDisplay[couponId] === undefined && this.imgFile === '')
    || (this.companyRestService.imagesToDisplay[couponId] === this.chosenImg)) {
      return 'none';
    }
    if (this.imgFile === '') {
      return 'delete';
    }
    return 'update';
  }

  public updateImage(couponId: number): void {
    switch (this.getImgUpdateAction(couponId)) {
      case 'none':
        this.showSuccessfullyUpdatedMsg();
        break;

      case 'update':
        const imgToUpload: FormData = new FormData();
        imgToUpload.append('couponImg', this.imgFile, this.imgFile.name);
        this.imageRestService.updateImage(imgToUpload, couponId, this.getCompanyId()).subscribe(
        response => {
          // console.log(response); // TODO delete this line
          const tempImg = this.chosenImg; // need this intermediate variable to creat a shallow copy
          this.companyRestService.imagesToDisplay[couponId] = tempImg;
          this.showSuccessfullyUpdatedMsg();
          // this.imgFile = '';
        }, err => {
          this.showFailedImgUpdatedMsg();
          // console.log(err.error); // TODO delete this line
          this.showErrMsg(err);
        });
        break;

      case 'delete':
        this.imageRestService.deleteImage(couponId).subscribe(response => {
          // console.log(response); // TODO delete this line
          this.companyRestService.imagesToDisplay[couponId] = '';
          this.showSuccessfullyUpdatedMsg();
        }, err => {
          this.showFailedImgUpdatedMsg();
          // console.log(err.error); // TODO delete this line
          this.showErrMsg(err);
        });
        break;

      default:
        console.log('something went wrong - the action needs to be either: none, delete, update');
        // does not supposed to happen
        break;
    }
  }

  public showFailedImgUpdatedMsg(): void {
    this.resetImgVariables();
    this.couponMsg.description = `Coupon Details (other than the image) Have Been Updated
    Successfully, Please try to update the image later`;
    this.couponMsgClass = 'table-success';
  }

  public showSuccessfullyUpdatedMsg(): void {
    this.resetImgVariables();
    this.couponMsg.description = `Coupon ${this.updatedTitle} Has Been Updated Successfully!`;
        this.couponMsgClass = 'table-success';
  }

  public resetImgVariables(): void {
    this.isOriginalImgChanged = false;
    this.chosenImg = '';
    this.imgFile = '';
    this.isImgErrShown = false;
   // this.originalImgToDisplay = '';
  }

  public deleteDisplayedImg(): void {
    this.imgFile = '';
    this.chosenImg = '';
    this.isOriginalImgChanged = true;
  }

  public getImgIconClass(couponId: number): string {
    return (this.companyRestService.imagesToDisplay[couponId] && !this.isOriginalImgChanged)
    || this.chosenImg ? 'img-Icon' : '';
  }

  public openSingleCoupon(coupon: Coupon): void {
    if (this.isUpdateMode) {
      return;
    }
    this.router.navigateByUrl('coupon');
    this.formService.singleCoupon = Object.assign({}, coupon);
    this.formService.singleCouponImg = this.imagesToDisplay[coupon.id];
    this.formService.hasSingleCouponImgClickedFromCart = false;
    this.formService.hasSingleCouponImgClickedFromHome = false;
    this.formService.hasSingleCouponImgClickedFromUpdate = false;
    // this.formService.singleCouponCompanyName = this.companyRestService.currentLoggedInCompany.name;
    // this.formService.singleCouponViewer = 'company';

  }

  public getImageTableTitle(): string {
    if (this.isUpdateMode && this.couponAdded.id === -5) {
      return this.chosenImg ? 'Update Image' : 'Add Image';
    }
    if (this.isUpdateMode && this.couponMsg.id === 0 && this.couponMsg.title === 'delete') {
      return 'Image / Details';
    }
    if (this.isUpdateMode && this.couponAdded.id === 0) {
      return (this.imagesToDisplay[this.couponIdToUpdate] && !this.isOriginalImgChanged)
      || this.chosenImg ? 'Update Image' : 'Add Image';
    }
    return 'Image / Details';
  }

  public isEmptyViewShown(): boolean {
    return this.authService.hasAlreadyRetrievedCouponsFromServer
    && this.isCouponsArrEmpty();
  }


  public isDevMode(): boolean {
    return this.devService.isDevMode;
  }





}
