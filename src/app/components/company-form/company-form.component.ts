import { Component, Input, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Company } from 'src/app/models/company.model';
import { FormState } from 'src/app/models/form-state.model';
import { UserType } from 'src/app/models/user-type.model';
import { AdminRestService } from 'src/app/services/admin-rest.service';
import { AuthService } from 'src/app/services/auth.service';
import { CompanyRestService } from 'src/app/services/company-rest.service';
import { DevService } from 'src/app/services/dev.service';
import { FormService } from 'src/app/services/form.service';
import { WelcomeRestService } from 'src/app/services/welcome-rest.service';

@Component({
  selector: 'app-company-form',
  templateUrl: './company-form.component.html',
  styleUrls: ['./company-form.component.css']
})
export class CompanyFormComponent implements OnInit {

  public company = new Company();

  public originalEmailToUpdate: string ='';
  public originalPasswordToUpdate: string ='';

  public coupons: number[] = [];

  public namePattern = this.formService.namePattern;
  public explainName = this.formService.explainName;
  public nameTitle: string = this.formService.nameTitle;

  public emailPattern = this.formService.emailPattern;
  public explainEmail = this.formService.explainEmail;
  public emailTitle = this.formService.emailTitle;

  public passwordType = 'password';
  // public passwordImgSrc = "../../../assets/images/password-is-hidden.jpeg";
  public isPasswordShown = false;

  // public conPasswordType = 'password';
  // public conPasswordImgSrc = "../../../assets/images/password-is-hidden.jpeg";
  // public isConPasswordShown = false;
  // public confirmPassword: string = '';

  public passwordPattern = this.formService.passwordPattern;
  public explainPassword = this.formService.explainPassword;
  public passwordTitle = this.formService.passwordTitle;

  // public passwordPattern = '^(?=.*[a-zA-Z])(?=.*\d)[A-Za-z\d!@#$%^&*.?~]{6,}$';
  // public explainPassword = "Password Must Be At Least 6 Characters Long With At Least One Letter and one number";

  public existedEmail: string = 'x';
  public existedName: string = 'x';

  public cannotChangeIdMsg = this.formService.cannotChangeIdMsg;
  public cannotAddCouponsMsg = this.formService.cannotAddCompanyCouponsMsg;
  public cannotChangeCouponsMsg = this.formService.cannotChangeCouponsMsg;


  // public formState: FormState = this.formService.companyForm? this.formService.companyForm: FormState.ADD;
  public formState: FormState = this.formService.companyForm as unknown as FormState;
  // public formAction: string = FormState[this.formService.companyForm as unknown as FormState];
  public formAction: string = FormState[this.formState];

  // public firstCompany: boolean = true;
  //public showMsg: boolean = false;
  public msg: string ='';
  public msgClass: string ='';
  public isErrMsgShown: boolean = false;
  public errMsg: string = '';

  public hasSignedUpSuccessfully: boolean = false;

  constructor(private devService: DevService, private formService: FormService,
    private adminRestService: AdminRestService, private router: Router, private title: Title,
    private authService: AuthService, private companyRestService: CompanyRestService,
    private welcomeRestService: WelcomeRestService) { }

  ngOnInit(): void {
    if (!this.isViewShown()) {
      this.router.navigateByUrl('home');
      this.title.setTitle("Home");
      return;
    }

    if (this.formService.companyForm === FormState.NONE) {
      this.authService.getUserType() === UserType.COMPANY
      ? this.router.navigateByUrl('company') : this.router.navigateByUrl('admin');
    }

    this.isCompanySignUp() ? this.title.setTitle("Sign Up")
    : this.formService.companyForm === FormState.ADD
    || this.formService.companyForm === FormState.ADD_MSG ? this.title.setTitle("Add Company")
    : this.isCurrentCompanyUpdate() ? this.title.setTitle("Profile")
    : this.formService.companyForm === FormState.UPDATE
    || this.formService.companyForm === FormState.UPDATE_MSG ? this.title.setTitle("Update Company")
    : this.title.setTitle("Home");

    if (this.formService.companyForm === FormState.UPDATE) {
      this.company = Object.assign({}, this.formService.company);

      this.coupons = this.formService.getFutureCoupons(this.company.coupons).map(c => c.id);

      this.nameTitle = 'Company name cannot be changed';
      this.originalEmailToUpdate = this.company.email;
      this.originalPasswordToUpdate = this.company.password;
    }

  }

  public isViewShown(): boolean {
    return this.authService.isLoggedIn || this.isCompanySignUp();
  }

  public isCompanySignUp(): boolean {
    return this.authService.isCompanySignUp || this.hasSignedUpSuccessfully;
  }

  public getHeadline(): string {
    return this.isCompanySignUp() ? 'Sign Up'
    : this.formService.companyForm === FormState.ADD
    || this.formService.companyForm === FormState.ADD_MSG ? 'Add New Company'
    : this.isCurrentCompanyUpdate() ? 'Profile' : 'Update Company';
  }


  public showPassword(): void {
    this.isPasswordShown = !this.isPasswordShown;
    if (this.isPasswordShown) {
      this.passwordType = 'text';
      // this.passwordImgSrc = "../../../assets/images/password-is-shown.jpeg";
    } else {
      // this.passwordImgSrc = "../../../assets/images/password-is-hidden.jpeg";
      this.passwordType = 'password';
    }
  }

  // public showConPassword(): void {
  //   this.isConPasswordShown = !this.isConPasswordShown;
  //   if (this.isConPasswordShown) {
  //     this.conPasswordType = 'text';
  //     this.conPasswordImgSrc = "../../../assets/images/password-is-shown.jpeg";
  //   } else {
  //     this.conPasswordImgSrc = "../../../assets/images/password-is-hidden.jpeg";
  //     this.conPasswordType = 'password';
  //   }
  // }


  // public trimDetails(): void {
  //   this.company.name = this.company.name.trim();
  //   this.company.email = this.company.email.trim();
  //   this.company.password = this.company.password.trim();
  // }

  public capName(): void {
    this.company.name = this.formService.capTitle(this.company.name);
  }

  public doesNameExist(): boolean {
    return this.adminRestService.doesNameExist(this.company.name);
  }

  public doesEmailExist(): boolean {
    return this.adminRestService.doesCompanyEmailExist(this.company.email);
  }

  public doesNameOrEmailExist(): boolean {
    if (this.doesNameExist() || this.doesEmailExist()) {
      this.isErrMsgShown = true;
      if (this.doesNameExist() && this.doesEmailExist()) {
        this.errMsg = this.formService.nameAndEmailExistErrMsg;
        this.existedName = this.company.name;
        this.existedEmail = this.company.email;
      } else if (this.doesNameExist()) {
        this.errMsg = this.formService.nameExistsErrMsg;
        this.existedName = this.company.name;
      } else {
        this.errMsg = this.formService.emailExistsErrMsg;
        this.existedEmail = this.company.email;
      }
    }
    return this.doesNameExist() || this.doesEmailExist();
  }

  public doesEnteredEmailEqualExistedEmail(): boolean {
    return this.company.email.toLowerCase() === this.existedEmail.toLowerCase();
  }

  public doesEnteredNameEqualExistedName(): boolean {
    return this.company.name.toLowerCase() === this.existedName.toLowerCase()
  }

  public isUpdatePossible(): boolean {
    return !this.doesEnteredEmailEqualExistedEmail();
  }

  public isAddPossible(): boolean {
    return !this.doesEnteredNameEqualExistedName() && !this.doesEnteredEmailEqualExistedEmail();
  }

  public hideErrMsg(): void {
    this.isErrMsgShown = false;
  }

  public addCompany() {
    if (this.doesNameOrEmailExist()) {
        return;
    }

    this.capName();
    this.existedEmail = 'x';
    this.existedName = 'x';
    let companyToSend: object = {
        name: this.company.name,
        email: this.company.email,
        password: this.company.password
    };

    if (this.isCompanySignUp()) {
      this.welcomeRestService.companySignUp(companyToSend).subscribe(response => {
        // console.log(response);
        this.isErrMsgShown = false;
        this.msg =`Congretulations, Company ${this.company.name} has successfully signed up!`;
        this.msgClass = 'alert alert-success';
        this.updateFormState(FormState.ADD_MSG);
        this.hasSignedUpSuccessfully = true;
        this.authService.isCompanySignUp = false;

      }, err => {
        // console.log(err.error); // TODO delete this line
        this.showErrMsg(err);
        if (err.error.value.toLowerCase().includes('name')) {
          this.existedName = this.company.name;
        }
        if (err.error.value.toLowerCase().includes('email')) {
          this.existedEmail = this.company.email;
        }
      });
    } else {
      this.adminRestService.addCompany(companyToSend).subscribe(response => {
        // console.log(response);
         // this.showMsg = true;
        this.isErrMsgShown = false;
        const addedComp: Company = Object.assign({}, this.company);
        this.adminRestService.companies.push(addedComp);
        this.authService.hasAlreadyRetrievedCompaniesFromServer = false;
        this.msg = `Company ${this.company.name} has been added successfully!`;
        this.msgClass = 'alert alert-success';
        this.updateFormState(FormState.ADD_MSG);

        }, err => {
          // console.log(err.error); // TODO delete this line
          this.showErrMsg(err);
          if (!this.authService.isLoggedIn) {
            this.authService.hasAlreadyRetrievedCompaniesFromServer = false;
          }
          // this.isErrMsgShown = true;
          // this.errMsg = err.error.value;
          // this.authService.loginCheck(this.errMsg);
        });
    }
  }

  public wereNoChangesMade(): boolean {
    if (this.company.email.toLowerCase() === this.originalEmailToUpdate.toLowerCase() &&
    this.company.password === this.originalPasswordToUpdate) {
      this.isErrMsgShown = false;
      this.msg = `No changes have been detected for Company ${this.company.name}`;
      this.msgClass = 'alert alert-info';
      this.updateFormState(FormState.UPDATE_MSG);
      this.existedEmail = 'x';
      return true;
    }
    return false;
  }

  public doesUpdatedEmailBelongToAnotherCompany(): boolean {
    if (this.company.email.toLowerCase() !== this.originalEmailToUpdate.toLowerCase()
    && this.doesEmailExist()) {
      this.isErrMsgShown = true;
      this.errMsg = this.formService.emailExistsErrMsg;
      this.existedEmail = this.company.email;
      return true;
    }
    return false;
  }


  public updateCompany() {
    // console.log(this.isCurrentCompanyUpdate());
    if (this.wereNoChangesMade()) {
      return;
    }
    if (!this.isCurrentCompanyUpdate()) {
      // console.log('admin');
      if (this.doesUpdatedEmailBelongToAnotherCompany()) {
        return;
      }
      this.existedEmail = 'x';
      this.adminRestService.updateCompany(this.company).subscribe(response => {
        // console.log(response);
        this.adminRestService.companies = this.adminRestService.companies.
        filter(c => c.id !== this.company.id);
        const updatedComp: Company = Object.assign({}, this.company);
        this.adminRestService.companies.push(updatedComp);
        this.isErrMsgShown = false;
        this.msg = `Company ${this.company.name} has been updated successfully!`;
        this.msgClass = 'alert alert-success';
        this.updateFormState(FormState.UPDATE_MSG);
        // console.log(this.formAction); // TODO can delete this line

      }, err => {
        // console.log(err.error); // TODO delete this line
        this.showErrMsg(err);

            // this.isErrMsgShown = true;
            // this.errMsg = err.error.value;
            // this.authService.loginCheck(this.errMsg);
      });

    } else {
      this.companyRestService.updateCompany(this.company).subscribe(response => {
        // console.log(response);
        this.existedEmail = 'x';
        this.isErrMsgShown = false;
        this.formService.currentLoggedInCompany = Object.assign({}, this.company);
        this.msg = `Company's profile has been updated successfully!`;
        this.msgClass = 'alert alert-success';
        this.updateFormState(FormState.UPDATE_MSG);
        // console.log(this.formAction); // TODO can delete this line

      }, err => {
        // console.log(err.error); // TODO delete this line
        this.showErrMsg(err);
        if (err.error.value.toLowerCase().includes('is taken')) {
          this.existedEmail = this.company.email;
        }

      });
    }


  }

  public cancelUpdate() {
    this.company.email = this.originalEmailToUpdate;
    this.company.password = this.originalPasswordToUpdate;
    this.isErrMsgShown = false;
    this.existedEmail = 'x';
  }

  public continueUpdate() {
    this.originalEmailToUpdate = this.company.email;
    this.originalPasswordToUpdate = this.company.password;
    this.updateFormState(FormState.UPDATE);
  }


  public addAnotherCompany() {
    // this.firstCompany = false;
    this.company = new Company();
    this.updateFormState(FormState.ADD);
  }

  public updateFormState(updatedState: FormState): void {
    this.formService.companyForm = updatedState;
    this.formState = this.formService.companyForm;
    this.formAction = FormState[this.formState];
  }

  public showErrMsg(err: any) {
    this.isErrMsgShown = true;
    this.errMsg = this.authService.connectionToServerAndLoginCheck(err);
  }

  public isCurrentCompanyUpdate(): boolean {
    return this.formService.currentLoggedInCompany.id !== 0;
  }

  // public isProfileSelected(): boolean {
  //   return this.authService.isCompanyProfileSelected;
  // }

  public goToManageCoupons(): void {
      this.authService.isCompanyProfileSelected = false;
  }

  public getCannotChangeCouponTitle(): string {
    return this.isCurrentCompanyUpdate() ? this.cannotChangeCouponsMsg : this.cannotAddCouponsMsg;
  }

  public getContinueUpdateText(): string {
    return this.isCurrentCompanyUpdate() ? 'Update Profile' : 'Keep Updating Company';
  }

  public getAddBtnName(): string {
    return this.isCompanySignUp() ? 'Sign Up' : 'Add Company';
  }

  public signInTheNewCompany() {
    let loginDetails: Object = {
      email: this.company.email,
      password: this.company.password,
      type: 'COMPANY'
    }
    this.welcomeRestService.login(loginDetails).subscribe(response => {
      // console.log(response); // TODO delete this line
      this.authService.setToken(response.token);
      this.authService.setUserType(UserType.COMPANY);
      this.companyRestService.getCurrentCompanyDetails();
      this.authService.isLoggedIn = true;
      this.router.navigateByUrl('company');
    }, err => {
      // console.log(err.error); // TODO delete this line
      this.showErrMsg(err);
    });
  }

  public signUpAsCustomer() {
    this.formService.customerForm = FormState.ADD;
    this.authService.isCustomerSignUp = true;
    // this.formService.companyForm = FormState.NONE;
    // this.authService.isCompanySignUp = false;
  }

  public isDevMode(): boolean {
    return this.devService.isDevMode;
  }


}
