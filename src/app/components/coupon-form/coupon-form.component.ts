
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
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


@Component({
  selector: 'app-coupon-form',
  templateUrl: './coupon-form.component.html',
  styleUrls: ['./coupon-form.component.css']
})
export class CouponFormComponent implements OnInit {

  public companyId = this.formService.currentLoggedInCompany.id;
  public coupon = new Coupon();

  public originalCategoryIdToUpdate: Category = Category.NONE;
  public originalTitleToUpdate: string ='';
  public originalDescriptionToUpdate: string ='';
  public originalStartDateToUpdate: Date = new Date();
  public originalEndDateToUpdate: Date = new Date();
  public originalAmountToUpdate: number = 0;
  public originalPriceToUpdate: number = 0;
  public originalImageToUpdate: string ='';

  public existedTitle: string = 'x';

  // Used for title, description and image
  public strPattern: RegExp = this.formService.couponStrPattern;
  public explainStr: string = this.formService.explainCouponStr;
  public strTitle: string = this.formService.couponStrTitle;

  public inValidDateMsg: string = this.formService.inValidDateMsg;
  public noPastEndDateMsg: string = this.formService.noPastEndDateMsg;
  public notPriorToStartDateMsg: string = this.formService.notPriorToStartDateMsg;
  public endDateTitle: string = this.formService.endDateTitle;

  public minPrice: number = this.formService.minCouponPrice;
  public explainPrice: string = this.formService.explainPrice;

  public formState: FormState = this.formService.couponForm;
  public formAction: string = FormState[this.formState];

  public msg: string ='';
  public msgClass: string ='';
  public isErrMsgShown: boolean = false;
  public errMsg: string = '';

  public ctgr = Category;
  public keysOfCtgr(): Array<string> {
    let keys = Object.keys(this.ctgr);
    return keys.slice(keys.length / 2).slice(2);
  }

  public cannotChangeIdMsg: string = this.formService.cannotChangeIdMsg;

  public imgFile: any = '';
  public chosenImg: any = '';
  public originalImgToDisplay: any = '';
  public isOriginalImgChanged: boolean = false;
  public isImgErrShown: boolean = false;
  public imgErrMsg: string = this.formService.imgTooBigErrMsg;


  // public hasOriginalImageBeenSet: boolean = false;

 // public waitMsg: string = 'Please wait while the coupon is uploading';
  // public isWaitMsgShown: boolean = false;

  constructor(private devService: DevService, private formService: FormService,
    private companyRestService: CompanyRestService, private router: Router, private title: Title,
    private authService: AuthService, private imageRestService: ImageRestService) { }

  ngOnInit(): void {
    if (this.formService.couponForm === FormState.NONE) {
      this.router.navigateByUrl('company');
    }

    this.formService.couponForm === FormState.ADD ? this.title.setTitle("Add Coupon")
      : this.title.setTitle("Update Coupon");

    if (this.formService.couponForm === FormState.UPDATE
      || this.formService.couponForm === FormState.UPDATE_MSG) {
      this.coupon = Object.assign({}, this.formService.coupon);

      this.originalCategoryIdToUpdate = this.coupon.categoryId;
      this.originalTitleToUpdate = this.coupon.title;
      this.originalDescriptionToUpdate = this.coupon.description;
      this.originalStartDateToUpdate = this.coupon.startDate;
      this.originalEndDateToUpdate = this.coupon.endDate;
      this.originalAmountToUpdate = this.coupon.amount;
      this.originalPriceToUpdate = this.coupon.price;
      this.originalImageToUpdate = this.coupon.image;

      this.originalImgToDisplay = this.companyRestService.imagesToDisplay[this.coupon.id]
    //  this.getOriginalImage(this.coupon.id);
    }
  }




  // public checkEnd() {
  //   console.log('original:' + this.originalEndDateToUpdate);
  //   console.log('ngmodel:' + this.coupon.endDate);
  //   let end = this.formService.convertDateToJsDateWithoutTime(this.coupon.endDate);
  //   console.log(end);
  //   console.log(end.getTime());
  //   let today = this.formService.todaysDateWithoutTime;
  //   console.log('end date is valid', this.isValidDate(this.coupon.endDate));
  //   console.log('end date is bigger than today: ' , end.valueOf() > today.valueOf());
  // }

  public capNames(): void {

    // this.coupon.title = this.coupon.title.trim(); // check if nesesarry here and in the other ts.
    // this.coupon.description = this.coupon.description.trim(); // because the regex doesnt let it have spaces.
    // this.coupon.image = this.coupon.image.trim(); // this one is nessesary - no regex.

    this.coupon.title = this.formService.capTitle(this.coupon.title);
    this.coupon.description = this.formService.capFirstLetter(this.coupon.description);
  }

  public isCategoryIdNone(): boolean {
    return this.formService.isCategoryIdNone(this.coupon.categoryId);
  }

  public isCategoryIdValid(): boolean {
    return !this.isCategoryIdNone();
  }

  public isDateValid(date: Date): boolean {
    return this.formService.isDateValid(date);
  }
// necessery?
  public isStartDateValid(): boolean {
    return this.isDateValid(this.coupon.startDate);
  }

  //necessery?
  public isEndDateLegal(): boolean {
    return this.isDateValid(this.coupon.endDate);
  }

  public isEndDateFutureDate(): boolean {
    return this.formService.isFutureDate(this.coupon.endDate);
  }

  public isEndDateSmaller(): boolean {
    return this.formService.isEndDateSmaller(this.coupon.startDate, this.coupon.endDate);
  }

  public isEndDateValid(): boolean {
    return this.isEndDateLegal() && !this.isEndDateSmaller() &&
    this.isEndDateFutureDate();
  }

  public isAmountValid(): boolean {
    return this.formService.isInt(this.coupon.amount) &&
    this.formService.isPositive(this.coupon.amount);
  }

  public doesTitleExist(): boolean {
    return this.companyRestService.doesCouponTitleExist(this.coupon.title);
  }

  public doesUpdatedTitleBelongToAnotherCoupon(): boolean {
    if (this.coupon.title.toLowerCase() !== this.originalTitleToUpdate.toLowerCase() &&
    this.doesTitleExist()) {
      this.isErrMsgShown = true;
      this.errMsg = this.formService.titleExistsErrMsg;
      this.existedTitle = this.coupon.title;
      return true;
    }
    return false;
  }

  public doesEnteredTitleEqualExistedTitle(): boolean {
    return this.coupon.title.toLowerCase() === this.existedTitle.toLowerCase();
  }

  // public isInt(amount: number): boolean {
  //   return this.formService.isInt(amount);
  // }

  public isUpdatePossible(): boolean {
    return this.isCategoryIdValid() && this.isStartDateValid() && this.isEndDateValid() &&
    this.isAmountValid() && !this.doesEnteredTitleEqualExistedTitle();
  }

  public isAddPossible(): boolean {
    return this.isUpdatePossible();
  }

  public hideErrMsg(): void {
    this.isErrMsgShown = false;
  }

  // public isAddCouponPossible(): boolean {
  //   return !this.isCategoryIdNone() && this.isFutureDate(this.coupon.startDate) &&
  //   this.isValidDate(this.coupon.startDate) && this.isValidDate(this.coupon.endDate) &&
  //   !this.isEndDateSmaller() && this.isInt(this.coupon.amount);
  // }

  public addCoupon() {
    if (this.doesUpdatedTitleBelongToAnotherCoupon()) {
      return;
    }
    this.capNames();
    this.existedTitle = 'x';
    let couponToSend: object = {
      companyId: this.companyId,
      categoryId: this.coupon.categoryId,
      title: this.coupon.title,
      description: this.coupon.description,
      startDate: this.coupon.startDate,
      endDate: this.coupon.endDate,
      amount: this.coupon.amount,
      price: this.coupon.price,
      image: this.coupon.image
    };

    this.companyRestService.addCoupon(couponToSend).subscribe(response => {
      // console.log(response);
      this.isErrMsgShown = false;
      const addedCoupon: Coupon = Object.assign({}, this.coupon);
      this.companyRestService.coupons.push(addedCoupon); // so it will recognize the title if add another coupon before going to show all coupons
      this.companyRestService.originalcouponsInDB.push(addedCoupon); // added dec/6/2021
      this.authService.hasAlreadyRetrievedCouponsFromServer = false;
      if (this.imgFile !== '') {
        const imgToUpload: FormData = new FormData();
        imgToUpload.append('couponImg', this.imgFile, this.imgFile.name);
        this.companyRestService.getCouponIdByTitle(this.coupon.title).subscribe(response => {
          // console.log(response); // TODO delete this line
          const couponId = response;
          if (couponId > 0) {
            this.imageRestService.addImage(imgToUpload, couponId, this.companyId).subscribe(
            response => {
              // console.log(response); // TODO delete this line
              this.companyRestService.imagesToDisplay[couponId] = this.chosenImg;
              this.showSuccessfullyAddedMsg();
            }, err => {
              // console.log(err.error); // TODO delete this line
              this.showErrMsg(err);
              this.showImgFailedToBeAddedMsg();
            });
          } else {
            console.log  // is not supposed to happen
            ('Problem: The title of the coupon that was just added was not found in the DB');
            this.showImgFailedToBeAddedMsg();
          }
        }, err => {
          // console.log(err.error); // TODO delete this line
          this.showErrMsg(err);
          this.showImgFailedToBeAddedMsg();
        });

      } else {
        this.showSuccessfullyAddedMsg();
      }

    }, err => {
      // console.log(err.error); // TODO delete this line
      this.showErrMsg(err);
    });
  }

  public showSuccessfullyAddedMsg(): void {
    this.msg =`Coupon ${this.coupon.title} Has Been Added Successfully!`;
    this.msgClass = 'alert alert-success';
    this.updateFormState(FormState.ADD_MSG);
  }

  public showImgFailedToBeAddedMsg(): void {
    this.msg =`Coupon Details (without the image) Have Been Added Successfully,
    Please try to add an image later`;
    this.msgClass = 'alert alert-success';
    this.updateFormState(FormState.ADD_MSG);
  }





  // does not check if image has changed
  public wereNoChangesMadeToCouponDetails(): boolean {
    return this.coupon.categoryId === this.originalCategoryIdToUpdate &&
    this.coupon.title.toLowerCase() === this.originalTitleToUpdate.toLowerCase() &&
    this.coupon.description.toLowerCase() === this.originalDescriptionToUpdate.toLowerCase() &&
    this.coupon.startDate === this.originalStartDateToUpdate &&
    this.coupon.endDate === this.originalEndDateToUpdate &&
    this.coupon.amount === this.originalAmountToUpdate &&
    this.coupon.price === this.originalPriceToUpdate &&
    this.coupon.image === this.originalImageToUpdate;
  }

  public wereNoChangesMade(): boolean {
    if (this.wereNoChangesMadeToCouponDetails() && this.getImgUpdateAction() === 'none') {
        this.isErrMsgShown = false;
        this.msg = `No changes have been detected for Coupon ${this.coupon.title}`;
        this.msgClass = 'alert alert-info';
        this.updateFormState(FormState.UPDATE_MSG);
        this.existedTitle = 'x';
        return true;
    }
    return false;
  }

  public updateCoupon() {
    // console.log(this.getImgUpdateAction());
    if (this.wereNoChangesMade()) {
      return;
    }
    if (this.doesUpdatedTitleBelongToAnotherCoupon()) {
      return;
    }
    this.existedTitle = 'x';
    this.isErrMsgShown = false;
    if (this.wereNoChangesMadeToCouponDetails()) {
      this.updateImage();
    } else {
      this.capNames();
      this.companyRestService.updateCoupon(this.coupon).subscribe(response => {
        // console.log(response);
        this.companyRestService.coupons = this.companyRestService.coupons.
          filter(c => c.id !== this.coupon.id);
        this.companyRestService.originalcouponsInDB = this.companyRestService.originalcouponsInDB.
          filter(c => c.id !== this.coupon.id); // added dec/6/2021
        const updatedCoupon: Coupon = Object.assign({}, this.coupon);
        this.companyRestService.coupons.push(updatedCoupon);
        this.companyRestService.originalcouponsInDB.push(updatedCoupon); // added dec/6/2021
        this.updateImage();

      }, err => {
        // console.log(err.error); // TODO delete this line
        this.showErrMsg(err);
      });
    }
  }

  public updateImage(): void {
    switch (this.getImgUpdateAction()) {
      case 'none':
        this.showSuccessfullyUpdatedMsg();
        break;

      case 'update':
        const imgToUpload: FormData = new FormData();
        imgToUpload.append('couponImg', this.imgFile, this.imgFile.name);
        this.imageRestService.updateImage(imgToUpload, this.coupon.id, this.companyId).subscribe(
        response => {
          this.showSuccessfullyUpdatedMsg();
          const tempImg = this.chosenImg; // need this intermediate variable to creat a shallow copy
          this.originalImgToDisplay = tempImg;
          this.isOriginalImgChanged = false;
          this.companyRestService.imagesToDisplay[this.coupon.id] = tempImg;

        }, err => {
          // console.log(err.error); // TODO delete this line
          this.showErrMsg(err);
          this.showImgFailedToBeUpdatedMsg();
        });
        break;

      case 'delete':
        this.imageRestService.deleteImage(this.coupon.id).subscribe(response => {
          // console.log(response); // TODO delete this line
          this.showSuccessfullyUpdatedMsg();
          this.originalImgToDisplay = '';
          this.companyRestService.imagesToDisplay[this.coupon.id] = '';
        }, err => {
          // console.log(err.error); // TODO delete this line
          this.showErrMsg(err);
          this.showImgFailedToBeUpdatedMsg();
        });
        break;

      default:
        console.log('something went wrong - the action needs to be either: none, delete, update');
        // does not supposed to happen
        break;
    }
  }

  public showSuccessfullyUpdatedMsg(): void {
    this.msg =`Coupon ${this.coupon.title} Has Been Updated Successfully!`;
    this.msgClass = 'alert alert-success';
    this.updateFormState(FormState.UPDATE_MSG);
  }

  public showImgFailedToBeUpdatedMsg(): void {
    this.msg =`Coupon Details (other than the image) Have Been Updated
    Successfully, Please try to update the image later`;
    this.msgClass = 'alert alert-success';
    this.updateFormState(FormState.UPDATE_MSG);
  }



  public cancelUpdate() {

    this.coupon.categoryId = this.originalCategoryIdToUpdate;
    this.coupon.title = this.originalTitleToUpdate;
    this.coupon.description = this.originalDescriptionToUpdate;
    this.coupon.startDate = this.originalStartDateToUpdate;
    this.coupon.endDate = this.originalEndDateToUpdate;
    this.coupon.amount = this.originalAmountToUpdate;
    this.coupon.price = this.originalPriceToUpdate;
    this.coupon.image = this.originalImageToUpdate;

    this.isOriginalImgChanged = false;
    this.chosenImg = '';
    this.imgFile = '';
    this.isImgErrShown = false;

    this.isErrMsgShown = false;
    this.existedTitle = 'x';
  }

  public continueUpdate() {
    this.originalCategoryIdToUpdate = this.coupon.categoryId;
    this.originalTitleToUpdate = this.coupon.title;
    this.originalDescriptionToUpdate = this.coupon.description;
    this.originalStartDateToUpdate = this.coupon.startDate;
    this.originalEndDateToUpdate = this.coupon.endDate;
    this.originalAmountToUpdate = this.coupon.amount;
    this.originalPriceToUpdate = this.coupon.price;
    this.originalImageToUpdate = this.coupon.image;

    this.isOriginalImgChanged = false;
    this.chosenImg = '';
    this.imgFile = '';

    this.isImgErrShown = false;
    this.updateFormState(FormState.UPDATE);
  }

  public addAnotherCoupon() {
    this.coupon = new Coupon();
    this.chosenImg = '';
    this.imgFile = '';
    this.isImgErrShown = false;
    this.updateFormState(FormState.ADD);
  }

  public updateFormState(updatedState: FormState): void {
    this.formService.couponForm = updatedState;
    this.formState = this.formService.couponForm;
    this.formAction = FormState[this.formState];
  }

  public showErrMsg(err: any) {
    this.isErrMsgShown = true;
    this.errMsg = this.authService.connectionToServerAndLoginCheck(err);
  }

  // public sleep(ms: number) {
  //   return new Promise(resolve => setTimeout(resolve, ms));
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

        if (this.originalImgToDisplay === this.chosenImg) {
          this.chosenImg = '';
          this.isOriginalImgChanged = false;
        }
      };

      // console.log(this.isOriginalImgChanged);
    } else {
      this.isImgErrShown = true;
    }
 }

//  public addImage(couponId: number) {

//   const uploadedImg: FormData = new FormData();
//   uploadedImg.append('couponImg', this.imgFile, this.imgFile.name);

//   this.imageRestService.addImage(uploadedImg, couponId).subscribe(response => {
//   console.log(response);

//   }, err => {
//     console.log(err.error); // TODO delete this line
//     this.showErrMsg(err);
//   });
// }

// public getOriginalImage(couponId: number): void {
//   this.imageRestService.getOneImage(couponId).subscribe(response => {
//     console.log(response);
//     if (response !== null) {
//       const receivedImageData = response;
//       const base64Data = receivedImageData.picture;
//       this.originalImgToDisplay = 'data:image/jpeg;base64,' + base64Data;
//     }

//   }, err => {
//     console.log(err.error); // TODO delete this line
//     this.showErrMsg(err);
//   });
// }

public getImageLabel(): string {
  return this.originalImgToDisplay === '' ? 'Add Image' : 'Update Image';
}

public getUploadBtnTitle(): string {
  return this.originalImgToDisplay === '' ? 'You Can Upload a Coupon Image Here'
  : 'You Can Update Your Coupon Image and Upload Another Image';
}

public deleteDisplayedImg(): void {
  this.imgFile = '';
  this.chosenImg = '';
  this.isOriginalImgChanged = true;
}

public getImgUpdateAction(): string {
  if (!this.isOriginalImgChanged || (this.originalImgToDisplay === '' && this.imgFile === '')
  || (this.originalImgToDisplay === this.chosenImg)) {
    return 'none';
  }
  if (this.imgFile === '') {
    return 'delete';
  }
  return 'update';
}

public openSingleCoupon(image: any): void {
  if (this.formAction !== 'UPDATE_MSG') {
    return;
  }
  this.router.navigateByUrl('coupon');
  this.formService.singleCoupon = Object.assign({}, this.coupon);
  this.formService.singleCouponImg = image;
  this.formService.hasSingleCouponImgClickedFromUpdate = true;
  this.formService.hasSingleCouponImgClickedFromCart = false;
  this.formService.hasSingleCouponImgClickedFromHome = false;
}

public isUserTypeCompany(): boolean {
  return this.authService.getUserType() === UserType.COMPANY;
}

public isLoggedIn(): boolean {
  return this.authService.isLoggedIn;
}

public isDevMode(): boolean {
  return this.devService.isDevMode;
}


}
