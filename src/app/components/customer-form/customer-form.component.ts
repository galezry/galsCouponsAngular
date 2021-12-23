import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Customer } from 'src/app/models/customer.model';
import { FormState } from 'src/app/models/form-state.model';
import { UserType } from 'src/app/models/user-type.model';
import { AdminRestService } from 'src/app/services/admin-rest.service';
import { AuthService } from 'src/app/services/auth.service';
import { CustomerRestService } from 'src/app/services/customer-rest.service';
import { DevService } from 'src/app/services/dev.service';
import { FormService } from 'src/app/services/form.service';
import { WelcomeRestService } from 'src/app/services/welcome-rest.service';

@Component({
  selector: 'app-customer-form',
  templateUrl: './customer-form.component.html',
  styleUrls: ['./customer-form.component.css']
})
export class CustomerFormComponent implements OnInit {

  public customer = new Customer();

  public originalFirstNameToUpdate: string ='';
  public originalLastNameToUpdate: string ='';
  public originalEmailToUpdate: string ='';
  public originalPasswordToUpdate: string ='';

  public coupons: number[] = [];

  public firstNamePattern = this.formService.firstNamePattern;
  public firstNameTitle: string = this.formService.firstNameTitle;
  public lastNamePattern = this.formService.lastNamePattern;
  public lastNameTitle: string = this.formService.lastNameTitle;
  public explainPersonName = this.formService.explainPersonName;

  public emailPattern = this.formService.emailPattern;
  public explainEmail = this.formService.explainEmail;
  public emailTitle = this.formService.emailTitle;

  public passwordType = 'password';
  // public passwordImgSrc = "../../../assets/images/password-is-hidden.jpeg";
  public isPasswordShown = false;

  public passwordPattern = this.formService.passwordPattern;
  public explainPassword = this.formService.explainPassword;
  public passwordTitle = this.formService.passwordTitle;

  public existedEmail: string = 'x';

  public cannotChangeIdMsg = this.formService.cannotChangeIdMsg;
  public cannotAddCouponsMsg = this.formService.cannotAddCustomerCouponsMsg;
  public cannotPurchaseCouponsMsg = this.formService.cannotPurchaseCouponsMsg;


  public formState: FormState = this.formService.customerForm;
  public formAction: string = FormState[this.formState];

  public msg: string ='';
  public msgClass: string ='';
  public isErrMsgShown: boolean = false;
  public errMsg: string = '';

  public hasSignedUpSuccessfully: boolean = false;

  constructor(private devService: DevService, private formService: FormService,
    private adminRestService: AdminRestService, private router: Router, private title: Title,
    private authService: AuthService, private customerRestService: CustomerRestService,
    private welcomeRestService: WelcomeRestService) { }

  ngOnInit(): void {
    if (!this.isViewShown()) {
      this.router.navigateByUrl('home');
      this.title.setTitle("Home");
      return;
    }

    if (this.formService.customerForm === FormState.NONE) {
      this.authService.getUserType() === UserType.CUSTOMER
      ? this.router.navigateByUrl('customer') : this.router.navigateByUrl('admin');
    }

    this.isCustomerSignUp() ? this.title.setTitle("Sign Up")
    : this.formService.customerForm === FormState.ADD
    || this.formService.customerForm === FormState.ADD_MSG ? this.title.setTitle("Add Customer")
    : this.isCurrentCustomerUpdate() ? this.title.setTitle("Profile")
    : this.formService.customerForm === FormState.UPDATE
    || this.formService.customerForm === FormState.UPDATE_MSG ? this.title.setTitle("Update Customer")
    : this.title.setTitle("Home");

    if (this.formService.customerForm === FormState.UPDATE) {
      this.customer = Object.assign({}, this.formService.customer);

      this.coupons = this.formService.getFutureCoupons(this.customer.coupons).map(c => c.id);

      this.originalFirstNameToUpdate = this.customer.firstName;
      this.originalLastNameToUpdate = this.customer.lastName;
      this.originalEmailToUpdate = this.customer.email;
      this.originalPasswordToUpdate = this.customer.password;
    }

  }

  public isViewShown(): boolean {
    return this.authService.isLoggedIn || this.isCustomerSignUp();
  }

  public isCustomerSignUp(): boolean {
    return this.authService.isCustomerSignUp || this.hasSignedUpSuccessfully;
  }

  public getHeadline(): string {
    return this.isCustomerSignUp() ? 'Sign Up'
    : this.formService.customerForm === FormState.ADD
    || this.formService.customerForm === FormState.ADD_MSG ? 'Add New Customer'
    : this.isCurrentCustomerUpdate() ? 'Profile' : 'Update Customer';
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

  public capNames(): void {
    // this.customer.firstName = this.customer.firstName.trim();
    // this.customer.lastName = this.customer.lastName.trim();
    // this.customer.email = this.customer.email.trim();
    // this.customer.password = this.customer.password.trim();

    this.customer.firstName = this.formService.capName(this.customer.firstName);
    this.customer.lastName = this.formService.capName(this.customer.lastName);
  }

  public doesEmailExist(): boolean {
    return this.adminRestService.doesCustomerEmailExist(this.customer.email);
  }

  public doesUpdatedEmailBelongToAnotherCustomer(): boolean {
    if (this.customer.email.toLowerCase() !== this.originalEmailToUpdate.toLowerCase()
    && this.doesEmailExist()) {
      this.isErrMsgShown = true;
      this.errMsg = this.formService.emailExistsErrMsg;
      this.existedEmail = this.customer.email;
      return true;
    }
    return false;
  }

  public doesEnteredEmailEqualExistedEmail(): boolean {
    return this.customer.email.toLowerCase() === this.existedEmail.toLowerCase();
  }

  public isUpdatePossible(): boolean {
    return !this.doesEnteredEmailEqualExistedEmail();
  }

  public isAddPossible(): boolean {
    return this.isUpdatePossible();
  }

  public hideErrMsg(): void {
    this.isErrMsgShown = false;
  }

  public addCustomer() {
    if (this.doesUpdatedEmailBelongToAnotherCustomer()) {
      return;
    }
    this.capNames();
    this.existedEmail = 'x';
    let customerToSend: object = {
      firstName: this.customer.firstName,
      lastName: this.customer.lastName,
      email: this.customer.email,
      password: this.customer.password
    };

    if (this.isCustomerSignUp()) {
      this.welcomeRestService.customerSignUp(customerToSend).subscribe(response => {
        console.log(response);
        this.isErrMsgShown = false;
        this.msg =`Congretulations ${this.customer.firstName}, You have successfully signed up!`;
        this.msgClass = 'alert alert-success';
        this.updateFormState(FormState.ADD_MSG);
        this.hasSignedUpSuccessfully = true;
        this.authService.isCustomerSignUp = false;
      }, err => {
        console.log(err.error); // TODO delete this line
        this.showErrMsg(err);
        if (err.error.value.toLowerCase().includes('is taken')) {
          this.existedEmail = this.customer.email;
        }
      });
    } else {
      this.adminRestService.addCustomer(customerToSend).subscribe(response => {
        console.log(response);
        this.isErrMsgShown = false;
        const addedCustomer: Customer = Object.assign({}, this.customer);
        this.adminRestService.customers.push(addedCustomer);
        this.authService.hasAlreadyRetrievedCustomersFromServer = false;
        this.msg =`Customer ${this.customer.firstName} ${this.customer.lastName}`
        + ` Has Been Added Successfully!`;
        this.msgClass = 'alert alert-success';
        this.updateFormState(FormState.ADD_MSG);

      }, err => {
        console.log(err.error); // TODO delete this line
        this.showErrMsg(err);
        // if (!this.authService.isLoggedIn) {
        //   this.authService.hasAlreadyRetrievedCustomersFromServer = false;
        // }
      });
    }
  }

  public wereNoChangesMade(): boolean {
    if (this.customer.firstName.toLowerCase() === this.originalFirstNameToUpdate.toLowerCase() &&
    this.customer.lastName.toLowerCase() === this.originalLastNameToUpdate.toLowerCase() &&
    this.customer.email.toLowerCase() === this.originalEmailToUpdate.toLowerCase() &&
    this.customer.password === this.originalPasswordToUpdate) {
      this.isErrMsgShown = false;
      this.msg = `No changes have been detected for Customer ${this.customer.firstName}`
      + ` ${this.customer.lastName}`;
      this.msgClass = 'alert alert-info';
      this.updateFormState(FormState.UPDATE_MSG);
      this.existedEmail = 'x';
      return true;
    }
    return false;
  }

  public updateCustomer() {
    if (this.wereNoChangesMade()) {
      return;
    }
    this.capNames();
    if (!this.isCurrentCustomerUpdate()) {
      if (this.doesUpdatedEmailBelongToAnotherCustomer()) {
        return;
      }
      this.existedEmail = 'x';
      this.adminRestService.updateCustomer(this.customer).subscribe(response => {
        console.log(response);
        this.adminRestService.customers = this.adminRestService.customers.
          filter(c => c.id !== this.customer.id);
        const updatedCustomer: Customer = Object.assign({}, this.customer);
        this.adminRestService.customers.push(updatedCustomer);
        this.isErrMsgShown = false;
        this.msg =`Customer ${this.customer.firstName} ${this.customer.lastName}`
        + ` Has Been Updated Successfully!`;
        this.msgClass = 'alert alert-success';
        this.updateFormState(FormState.UPDATE_MSG);
        console.log(this.formAction); // TODO can delete this line

      }, err => {
        console.log(err.error); // TODO delete this line
        this.showErrMsg(err);
      });
    } else {
      this.customerRestService.updateCustomer(this.customer).subscribe(response => {
        console.log(response);
        this.existedEmail = 'x';
        this.isErrMsgShown = false;
        this.formService.currentLoggedInCustomer = Object.assign({}, this.customer);
        this.msg = `Your Profile has been updated successfully!`;
        this.msgClass = 'alert alert-success';
        this.updateFormState(FormState.UPDATE_MSG);
        console.log(this.formAction); // TODO can delete this line

      }, err => {
        console.log(err.error); // TODO delete this line
        this.showErrMsg(err);
        if (err.error.value.toLowerCase().includes('is taken')) {
          this.existedEmail = this.customer.email;
        }

      });
    }

  }

  public cancelUpdate() {
    this.customer.firstName = this.originalFirstNameToUpdate;
    this.customer.lastName = this.originalLastNameToUpdate;
    this.customer.email = this.originalEmailToUpdate;
    this.customer.password = this.originalPasswordToUpdate;
    this.isErrMsgShown = false;
    this.existedEmail = 'x';
  }

  public continueUpdate() {
    this.originalFirstNameToUpdate = this.customer.firstName;
    this.originalLastNameToUpdate = this.customer.lastName;
    this.originalEmailToUpdate = this.customer.email;
    this.originalPasswordToUpdate = this.customer.password;
    this.updateFormState(FormState.UPDATE);
  }

  public addAnotherCustomer() {
    this.customer = new Customer();
    this.updateFormState(FormState.ADD);
  }

  public updateFormState(updatedState: FormState): void {
    this.formService.customerForm = updatedState;
    this.formState = this.formService.customerForm;
    this.formAction = FormState[this.formState];
  }

  public showErrMsg(err: any) {
    this.isErrMsgShown = true;
    this.errMsg = this.authService.connectionToServerAndLoginCheck(err);
    // if (this.errMsg.toLowerCase().includes('please sign in') ||
    // this.errMsg === this.authService.errorMsg500) {
    //   this.customerRestService.emptyCart();
    // }
  }

  public isCurrentCustomerUpdate(): boolean {
    return this.formService.currentLoggedInCustomer.id !== 0;
  }

  // public isProfileSelected(): boolean {
  //   return this.authService.isCustomerProfileSelected;
  // }

  public goToCustomerCoupons(): void {
    this.authService.isCustomerCouponsSelected = true;
    this.authService.isCustomerProfileSelected = false;
  }

  public getCannotChangeCouponTitle(): string {
    if (this.formAction === 'UPDATE_MSG') {
      return '';
    }
    return this.isCurrentCustomerUpdate() ?
    this.cannotPurchaseCouponsMsg : this.cannotAddCouponsMsg;
  }

  public getContinueUpdateText(): string {
    return this.isCurrentCustomerUpdate() ? 'Update Profile' : 'Keep Updating Customer';
  }

  public getAddBtnName(): string {
    return this.isCustomerSignUp() ? 'Sign Up' : 'Add Customer';
  }

  public signInTheNewCustomer() {
    // this.authService.signedUpCustomerEmail = this.customer.email;
    // this.authService.signedUpCustomerPassword = this.customer.password;
    let loginDetails: Object = {
      email: this.customer.email,
      password: this.customer.password,
      type: 'CUSTOMER'
    }
    // console.log(loginDetails);
    this.welcomeRestService.login(loginDetails).subscribe(response => {
      console.log(response); // TODO delete this line
      this.authService.setToken(response.token);
      this.authService.setUserType(UserType.CUSTOMER);
      this.customerRestService.getCurrentCustomerDetails();
      this.authService.isLoggedIn = true;
      this.router.navigateByUrl('customer');
    }, err => {
      console.log(err.error); // TODO delete this line
      this.showErrMsg(err);
    });
  }

  // public isGotoSignInShown() {
  //   return this.isCustomerSignUp
  // }

  public signUpAsCompany() {
    this.formService.companyForm = FormState.ADD;
    this.authService.isCompanySignUp = true;
    //  this.formService.customerForm = FormState.NONE;
    //  this.authService.isCustomerSignUp = false;
  }





  public isDevMode(): boolean {
    return this.devService.isDevMode;
  }


}
