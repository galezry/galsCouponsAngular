import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CompanyIdVsPw } from 'src/app/interfaces/company-id-vs-pw';
import { Coupon } from 'src/app/models/coupon.model';
import { Customer } from 'src/app/models/customer.model';
import { FormState } from 'src/app/models/form-state.model';
import { UserType } from 'src/app/models/user-type.model';
import { AdminRestService } from 'src/app/services/admin-rest.service';
import { AuthService } from 'src/app/services/auth.service';
import { DevService } from 'src/app/services/dev.service';
import { FormService } from 'src/app/services/form.service';

@Component({
  selector: 'app-customer-crud',
  templateUrl: './customer-crud.component.html',
  styleUrls: ['./customer-crud.component.css']
})
export class CustomerCrudComponent implements OnInit {


  public isErrMsgShown: boolean = false;
  public errMsg: string = '';
  // public isCompaniesArrEmpty: boolean = false;

  public idSearched = '';
  public firstNameSearched = '';
  public lastNameSearched = '';
  public emailSearched = '';

  public customersToShow: Customer[] = [];

  public isEditModePossible: boolean = this.formService.getIsEditModePossible() === 'yes';

  public isUpdateMode: boolean = false;
  public customerIdToUpdate: number = -1;

 // public isEditModeMsgShown: boolean = false;
  public customerMsg: Customer = new Customer();
  public isCustomerMsgShown: boolean = false;  // check if nessesary
  public customerMsgClass: string = '';

  public customerAdded: Customer = new Customer();


  public updatedFirstName: string = '';
  public updatedLastName: string = '';
  public updatedEmail: string = '';
  public updatedPassword: string = '';

  public existedEmail: string = 'x';

  public firstNamePattern = this.formService.firstNamePattern;
  public lastNamePattern = this.formService.lastNamePattern;
  public explainName = this.formService.explainPersonName;
  public firstNameTitle: string = this.formService.firstNameTitle;
  public lastNameTitle: string = this.formService.lastNameTitle;

  public emailPattern = this.formService.emailPattern;
  public explainEmail = this.formService.explainEmail;
  public emailTitle = this.formService.emailTitle;

  public passwordPattern = this.formService.passwordPattern;
  public explainPassword = this.formService.explainPassword;
  public passwordTitle = this.formService.passwordTitle;
  public areAllPasswordsShown: boolean = false;
  public customerIdVsPw: CompanyIdVsPw = {};

  public idAutoIncMsg = this.formService.idAutoIncMsg;
  public cannotChangeIdMsg = this.formService.cannotChangeIdMsg;
  public cannotAddCouponsMsg = this.formService.cannotAddCustomerCouponsMsg;

  public saveBtnTitle: string = '';

//   public customers: Customer[] = [
//     new Customer(111, 'aaa', 'cohen', 'aaa@gmail.com', '1234',[]),
//     new Customer(222, 'bbb', 'cohen','bbb@gmail.com', '1235',[]),
//     new Customer(333, 'ccc', 'cohen','bbb@gmail.com', '1236',[]),
// ];

  constructor(private adminRestService: AdminRestService, private devService: DevService,
    private formService: FormService, private authService: AuthService) { }

  ngOnInit(): void {

    if (this.isVPWidthSmall()) {
      this.isEditModePossible = false;
      this.formService.setIsEditModePossible('no');
    }

    if (!this.authService.isLoggedIn) {
      this.authService.hasAlreadyRetrievedCustomersFromServer = false;
      this.adminRestService.customers = [];
    }
    this.getAllCustomers();
  }

  public isVPWidthSmall(): boolean {
    return this.formService.screenWidth < 1000;
  }

  public toggleFilterSec(): void {
    this.deleteCustomerMsg();
    this.formService.toggleCustomerCrudFilterSec();
  }

  public isFilterSecShown(): boolean {
    return this.formService.isCustomerCrudFilterSecShown;
  }

  public isFiltering(): boolean {
    return this.customersToShow.length < this.adminRestService.customers.length;
  }

  public getAllCustomers(): void {
    if (!this.authService.isLoggedIn) {
      this.isErrMsgShown = true;
      this.errMsg = this.authService.notLoggedInErrMsg;
      return;
    }
    if (!this.isUserTypeAdmin()) {
      this.isErrMsgShown = true;
      this.errMsg = this.authService.notAuthorizedErrMsg;
      return;
    }

    if (!this.authService.hasAlreadyRetrievedCustomersFromServer) {
      this.adminRestService.getAllCustomers().subscribe(response => {
        // console.log(response); // TODO delete this line
        this.authService.hasAlreadyRetrievedCustomersFromServer = true;
        this.isErrMsgShown = false;
        this.adminRestService.customers = [...response];
        this.customersToShow = [...this.adminRestService.customers];
        this.sort();
        if (this.formService.isSuccessMsgShown) {
          const newCustomer: Customer[] =
          this.customersToShow.filter(c => c.email === this.formService.emailOfAddedElement);
          const customerIdx: number = this.customersToShow.indexOf(newCustomer[0]);
          this.customersToShow.splice(customerIdx + 1, 0, this.customerMsg);
          this.customerMsg.id = 0;
          this.customerMsg.firstName = `Customer ${this.updatedFirstName} ${this.updatedLastName}` +
          ` Has Been Added Successfully!`;
          this.customerMsgClass = 'table-success';
          this.formService.isSuccessMsgShown = false;
          // check if it's ok to write here the this.formService.emailOfAddedElement='';
        }

        // this.isCompaniesArrEmpty = response.length === 0;

        // this.adminRestService.isAlreadyRetrievedFromServer = true;
        // console.log(JSON.stringify(response));
      }, err => {
        // console.log(err.error); // TODO delete this line
        this.authService.signOut();
        this.isErrMsgShown = true;
        this.errMsg = this.authService.hasBeenSignedOutErrMsg;
      });
    } else {
      this.customersToShow = [...this.adminRestService.customers];
      this.sort();
    }
  }

  public getFutureCoupons(coupons: Coupon[]): Coupon[] {
    return this.formService.getFutureCoupons(coupons);
  }

  public sort() {
    if (this.formService.isCustomerSortedById) {
      this.sortById();
    } else if(this.formService.isCustomerSortedByFirstName) {
      this.sortByFirstName();
    } else if(this.formService.isCustomerSortedByLastName) {
      this.sortByLastName();
    } else {
      this.sortByEmail();
    }
  }

  public sortById() {
    this.customersToShow.sort((a,b) => (a.id > b.id) ? 1 : ((b.id > a.id) ? -1 : 0));
  }

  public sortByFirstName() {
    this.customersToShow.sort((a,b) =>
      (a.firstName.toLocaleLowerCase() > b.firstName.toLocaleLowerCase())
      ? 1 : ((b.firstName.toLocaleLowerCase() > a.firstName.toLocaleLowerCase()) ? -1 : 0));
  }

  public sortByLastName() {
    this.customersToShow.sort((a,b) =>
      (a.lastName.toLocaleLowerCase() > b.lastName.toLocaleLowerCase())
      ? 1 : ((b.lastName.toLocaleLowerCase() > a.lastName.toLocaleLowerCase()) ? -1 : 0));
  }

  public sortByEmail() {
    this.customersToShow.sort((a,b) => (a.email.toLocaleLowerCase() > b.email.toLocaleLowerCase())
       ? 1 : ((b.email.toLocaleLowerCase() > a.email.toLocaleLowerCase()) ? -1 : 0));
  }

  public shouldSortBy(attr: string): void {
    if (!this.isUpdateMode) {  // make sure the if is nessasery
      this.customersToShow = this.customersToShow.filter(c => c.id !== 0);
      switch (attr) {
        case 'firstName':
          this.formService.isCustomerSortedByFirstName = true;
          this.formService.isCustomerSortedByLastName = false;
          this.formService.isCustomerSortedById = false;
          this.formService.isCustomerSortedByEmail = false;
          break;

        case 'lastName':
          this.formService.isCustomerSortedByLastName = true;
          this.formService.isCustomerSortedByFirstName = false;
          this.formService.isCustomerSortedById = false;
          this.formService.isCustomerSortedByEmail = false;
          break;

        case 'email':
          this.formService.isCustomerSortedByEmail = true;
          this.formService.isCustomerSortedById = false;
          this.formService.isCustomerSortedByFirstName = false;
          this.formService.isCustomerSortedByLastName = false;

          break;
        default:
          this.formService.isCustomerSortedById = true;
          this.formService.isCustomerSortedByFirstName = false;
          this.formService.isCustomerSortedByLastName = false;
          this.formService.isCustomerSortedByEmail = false;
      }
      this.sort();
    }
  }

  public getClass(attr: string): string {
    switch (attr) {
      case 'firstName':
        return this.formService.isCustomerSortedByFirstName ? 'active-sort' :
        !this.isUpdateMode ? 'not-sorted' : '';
      case 'lastName':
          return this.formService.isCustomerSortedByLastName ? 'active-sort' :
          !this.isUpdateMode ? 'not-sorted' : '';
      case 'email':
        return this.formService.isCustomerSortedByEmail ? 'active-sort' :
        !this.isUpdateMode ? 'not-sorted' : '';
      default:
        return this.formService.isCustomerSortedById ? 'active-sort' :
        !this.isUpdateMode ? 'not-sorted' : '';
    }
  }

  public delete(customer: Customer): void {
    this.customersToShow = this.customersToShow.filter(c => c.id !== 0);
    this.isUpdateMode = true;
    const customerIdx: number = this.customersToShow.indexOf(customer);
    this.customersToShow.splice(customerIdx + 1, 0, this.customerMsg);
    this.customerMsg.id = 0;
    this.customerMsg.firstName =
    `Are you sure you want to delete customer ${customer.firstName} ${customer.lastName}?`;
    this.customerMsg.email = 'delete';
    this.customerMsgClass = 'table-danger';
  }

  public cancelDelete(): void{
    this.customersToShow = this.customersToShow.filter(c => c.id > 0);
    this.customerMsg.email = '';
    this.isUpdateMode = false;
  }


  public deleteCustomer(): void {
    let compIdx: number = this.customersToShow.indexOf(this.customerMsg);
    const customerToDelete = this.customersToShow[compIdx - 1];

    this.adminRestService.deleteCustomer(customerToDelete.id).subscribe(response => {
      this.customerMsg.firstName = `Customer ${customerToDelete.firstName}` +
      ` ${customerToDelete.lastName} Has Been Deleted Successfully!`;
      this.customerMsg.email = '';
      this.customerMsgClass = 'table-success';
      this.isUpdateMode = false;
      this.adminRestService.customers = this.adminRestService.customers
      .filter(c => c.id !== customerToDelete.id);
      this.customersToShow = this.customersToShow.filter(c => c.id !== customerToDelete.id);

      // console.log(response);
      // console.log(this.customersToShow);
      // console.log(this.adminRestService.customers);

      }, err => {
        this.showErrMsg(err);

        // console.log(err.error); // TODO delete this line
      });


  }

  public searchById(event: any) {

    this.customersToShow = this.customersToShow.filter(c => c.id !== 0);
    if (event.key === 'Backspace' || event.key === 'Delete') {
      this.customersToShow = [...this.adminRestService.customers];

      if (this.firstNameSearched !== '') {
        this.searchByFirstName('k');  // the argument can be any key other than Backspace or Delete
      }
      if (this.lastNameSearched !== '') {
        this.searchByLastName('k');
      }
      if (this.emailSearched !== '') {
        this.searchByEmail('f');
      }
    }

    if (this.firstNameSearched !== '' || this.lastNameSearched !== '' || this.emailSearched !== '') {
      this.customersToShow = this.customersToShow.filter(c => c.id.toString()
       .startsWith(this.idSearched));
    } else {
      this.customersToShow = this.adminRestService.customers.filter(c => c.id.toString()
     .startsWith(this.idSearched));
    }
    this.sort();
}

  public searchByFirstName(event: any) {
      this.customersToShow = this.customersToShow.filter(c => c.id !== 0);
      if (event.key === 'Backspace' || event.key === 'Delete') {
        this.customersToShow = [...this.adminRestService.customers];
        if (this.idSearched !== '') {
          this.searchById('k');
        }
        if (this.emailSearched !== '') {
          this.searchByEmail('f');
        }
        if (this.lastNameSearched !== '') {
          this.searchByLastName('f');
        }
      }

      if (this.idSearched !== '' || this.emailSearched !== '' || this.lastNameSearched !== '') {
        this.customersToShow = this.customersToShow.filter(c => c.firstName.toLowerCase()
         .startsWith(this.firstNameSearched.toLowerCase()));
      } else {
        this.customersToShow = this.adminRestService.customers.filter(c => c.firstName.toLowerCase()
       .startsWith(this.firstNameSearched.toLowerCase()));
      }
      this.sort();

  }

  public searchByLastName(event: any) {
    this.customersToShow = this.customersToShow.filter(c => c.id !== 0);
    if (event.key === 'Backspace' || event.key === 'Delete') {
      this.customersToShow = [...this.adminRestService.customers];
      if (this.idSearched !== '') {
        this.searchById('k');
      }
      if (this.emailSearched !== '') {
        this.searchByEmail('f');
      }
      if (this.firstNameSearched !== '') {
        this.searchByFirstName('f');
      }
    }

    if (this.idSearched !== '' || this.emailSearched !== '' || this.firstNameSearched !== '') {
      this.customersToShow = this.customersToShow.filter(c => c.lastName.toLowerCase()
       .startsWith(this.lastNameSearched.toLowerCase()));
    } else {
      this.customersToShow = this.adminRestService.customers.filter(c => c.lastName.toLowerCase()
     .startsWith(this.lastNameSearched.toLowerCase()));
    }
    this.sort();
}

  public searchByEmail(event: any) {
    this.customersToShow = this.customersToShow.filter(c => c.id !== 0);
    if (event.key === 'Backspace' || event.key === 'Delete') {
      this.customersToShow = [...this.adminRestService.customers];
      if (this.idSearched !== '') {
        this.searchById('k');
      }
      if (this.firstNameSearched !== '') {
        this.searchByFirstName('k');
      }
      if (this.lastNameSearched !== '') {
        this.searchByLastName('k');
      }
    }

    if (this.idSearched !== '' || this.firstNameSearched !== '' || this.lastNameSearched !== '') {
      this.customersToShow = this.customersToShow.filter(c => c.email.toLowerCase()
       .startsWith(this.emailSearched.toLowerCase()));
    } else {
      this.customersToShow = this.adminRestService.customers.filter(c => c.email.toLowerCase()
     .startsWith(this.emailSearched.toLowerCase()));
    }
    this.sort();
  }

  public isCustomersToShowEmpty(): boolean {
    return this.customersToShow.length === 0;
  }

  public isCustomersArrEmpty(): boolean {
    return this.adminRestService.customers.length === 0;
  }

  public deleteCustomerMsg(): void {
    this.customersToShow = this.customersToShow.filter(c => c.id !== 0);
  }

  public capNames(): void {
    // this.updatedFirstName = this.updatedFirstName.trim();
    // this.updatedLastName = this.updatedLastName.trim();
    // this.updatedEmail = this.updatedEmail.trim();
    // this.updatedPassword = this.updatedPassword.trim();

    this.updatedFirstName = this.formService.capName(this.updatedFirstName);
    this.updatedLastName = this.formService.capName(this.updatedLastName);
  }

  public update(customer: Customer): void {
    this.deleteCustomerMsg();
    if (!this.isEditModePossible || this.isVPWidthSmall()) {
      this.formService.customerForm = FormState.UPDATE;
      this.formService.customer =  Object.assign({}, customer);

    } else {
      this.isUpdateMode = true;
      this.saveBtnTitle = 'Save Changes';
      this.customerIdToUpdate = customer.id;
      this.updatedFirstName = customer.firstName;
      this.updatedLastName = customer.lastName;
      this.updatedEmail = customer.email;
      this.updatedPassword = customer.password;
    }
  }

  public cancelUpdate(): void{
    this.customersToShow = this.customersToShow.filter(c => c.id > 0);
    this.customerIdToUpdate = -1;
    this.isUpdateMode = false;
    this.existedEmail = 'x';
  }

  public doesUpdatedEmailEqualsExistedEmail(): boolean {
    return this.updatedEmail.toLowerCase() === this.existedEmail.toLowerCase();
  }

  public isEmailValid(): boolean {
    return this.formService.isEmailValid(this.updatedEmail)
    && !this.doesUpdatedEmailEqualsExistedEmail();
  }

  public isPasswordValid(): boolean {
    return this.formService.isPasswordValid(this.updatedPassword);
  }

  public isFirstNameValid(): boolean {
    return this.formService.isFirstNameValid(this.updatedFirstName);
  }

  public isLastNameValid(): boolean {
    return this.formService.isLastNameValid(this.updatedLastName);
  }

  public isUpdatePossible(): boolean {
    return this.isEmailValid() && this.isPasswordValid() && this.isFirstNameValid()
    && this.isLastNameValid();
  }

  public wereNoChangesMade(customer: Customer): boolean {
    if (customer.firstName.toLowerCase() === this.updatedFirstName.toLowerCase() &&
    customer.lastName.toLowerCase() === this.updatedLastName.toLowerCase() &&
    customer.email.toLowerCase() === this.updatedEmail.toLowerCase() &&
    customer.password === this.updatedPassword) {
      this.customerMsg.firstName = `No changes have been detected for Customer ` +
        `${customer.firstName} ${customer.lastName}`;
      this.customerMsgClass = 'table-info';
      this.existedEmail = 'x';
      this.customerIdToUpdate = -1;
      this.isUpdateMode = false;
      // console.log(this.customersToShow); //TODO delete this line
      return true;
    }
    return false;
  }

  public doesEmailExist(): boolean {
    return this.adminRestService.doesCustomerEmailExist(this.updatedEmail);
  }

  public doesUpdatedEmailBelongToAnotherCustomer(customerEmail: string): boolean {
    if (this.updatedEmail.toLowerCase() !== customerEmail.toLowerCase() && this.doesEmailExist()) {
      this.customerMsg.firstName = this.formService.emailExistsErrMsg;
      this.customerMsgClass = 'table-warning';
      this.existedEmail = this.updatedEmail;
      return true;
    }
    return false;
  }

  public updateCustomer(customer: Customer): void{
    this.deleteCustomerMsg;
    let compIdx: number = this.customersToShow.indexOf(customer);
    this.customersToShow.splice(compIdx + 1, 0, this.customerMsg);

    if (this.wereNoChangesMade(customer)) {
      return;
    }
    if (this.doesUpdatedEmailBelongToAnotherCustomer(customer.email)) {
      return;
    }
    this.capNames();
    this.existedEmail = 'x';
    this.customerIdToUpdate = -1;
    this.isUpdateMode = false;
    customer.email = this.updatedEmail;
    customer.password = this.updatedPassword;
    customer.firstName = this.updatedFirstName;
    customer.lastName = this.updatedLastName;

    this.adminRestService.updateCustomer(customer).subscribe(response => {
      // console.log(response);
      this.customerMsg.firstName = `Customer ${customer.firstName} ${customer.lastName} ` +
      `Has Been Updated Successfully!`;
      this.customerMsgClass = 'table-success';
      this.adminRestService.customers = this.adminRestService.customers
      .filter(c => c.id !== customer.id);
      this.adminRestService.customers.push(customer);

      }, err => {
        // console.log(err.error); // TODO delete this line
        this.isUpdateMode = false;
        this.showErrMsg(err);
      });
  }

  public add(): void {
    this.deleteCustomerMsg();
    if (!this.isEditModePossible || this.adminRestService.customers.length === 0
      || this.isVPWidthSmall()) {
      this.formService.customerForm = FormState.ADD;
    } else {
      this.isUpdateMode = true;
      this.saveBtnTitle = 'Add Customer';
      this.customersToShow.splice(this.customersToShow.length, 0, this.customerAdded);
      this.customerAdded.id = -5;
      this.updatedFirstName = '';
      this.updatedLastName = '';
      this.updatedEmail = '';
      this.updatedPassword = '';
    }
  }

  public isAddCustomerPossible(): boolean {
    return this.isUpdatePossible();
  }

  // public capName(name: string): string {
  //   let wordsArr = [];
  //   if (name.includes(' ')) {
  //     wordsArr = name.toLowerCase().split(' ');
  //     for (let i = 0; i < wordsArr.length; i++) {
  //       wordsArr[i] = wordsArr[i].charAt(0).toUpperCase() + wordsArr[i].substring(1);
  //     }
  //     return wordsArr.join(' ');
  //   }

  //   if (name.includes('.')) {
  //     wordsArr = name.toLowerCase().split('.');
  //     for (let i = 0; i < wordsArr.length; i++) {
  //       wordsArr[i] = wordsArr[i].charAt(0).toUpperCase() + wordsArr[i].substring(1);
  //     }
  //     return wordsArr.join(' ');
  //   }

  //   return name;
  // }

  // adding a message line to the show all customers table
  public addMsgLine(): void {
    this.customersToShow.splice(this.customersToShow.length, 0, this.customerMsg);
    this.customerMsg.id = 0;
  }


  public addCustomer() {
    this.deleteCustomerMsg();
    this.addMsgLine();

    if (this.doesUpdatedEmailBelongToAnotherCustomer('a')) {
      return;
    }
    this.capNames();
    this.existedEmail = 'x';

    let customerToSend: object = {
      firstName: this.updatedFirstName,
      lastName: this.updatedLastName,
      email: this.updatedEmail,
      password: this.updatedPassword
    };
    this.adminRestService.addCustomer(customerToSend).subscribe(response => {
      // console.log(response);
      this.authService.hasAlreadyRetrievedCustomersFromServer = false;
      this.formService.isSuccessMsgShown = true;
      this.formService.emailOfAddedElement = this.updatedEmail;
      this.isUpdateMode = false;
      this.getAllCustomers();

    }, err => {
      // console.log(err.error); // TODO delete this line
      this.isUpdateMode = false;
      this.showErrMsg(err);
    });
  }

  public hideAllPasswords(): void {
    // this.deleteCustomerMsg();
    this.areAllPasswordsShown = false;
    for (let c of this.customersToShow) {
      this.customerIdVsPw[c.id] = false;
    }
  }

  public showAllPasswords(): void {
    // this.deleteCustomerMsg();
    this.areAllPasswordsShown = true;
    for (let c of this.customersToShow) {
      this.customerIdVsPw[c.id] = true;
    }
  }

  public toggleOwnPassword(id: number): void {
    // this.deleteCustomerMsg();
    this.customerIdVsPw[id] = !this.customerIdVsPw[id];
  }

  public getHiddenPassword(password: string): string {
    let result ='';
    for (let i = 0; i < password.length; i++) {
      result += '●';
    }
    return result;
  }

  public getPasswordType(id: number): string {
    return this.customerIdVsPw[id] ? 'text' : 'password';
  }

  public getEyeClass(id: number): string {
    return this.customerIdVsPw[id] ? 'fas fa-eye eye' : 'fas fa-eye-slash eye';
  }

  public showErrMsg(err: any) {
    this.isErrMsgShown = true;
    this.errMsg = this.authService.connectionToServerAndLoginCheck(err);
  }

  public editModeCheckBox() {
    this.customersToShow = this.customersToShow.filter(c => c.id > 0);
    this.existedEmail = 'x';
    this.customerIdToUpdate = -1;
    this.isUpdateMode = false;
    if (this.formService.getIsEditModePossible() === 'yes') {
      this.formService.setIsEditModePossible('no');
    } else {
      this.formService.setIsEditModePossible('yes');
    }
  }

  public isUserTypeAdmin(): boolean {
    return this.authService.getUserType() === UserType.ADMINISTRATOR;
  }

  public isLoggedIn(): boolean {
    return this.authService.isLoggedIn;
  }

  public isEmptyViewShown(): boolean {
    return this.authService.hasAlreadyRetrievedCustomersFromServer
    && this.isCustomersArrEmpty();
  }

  public isDevMode(): boolean {
    return this.devService.isDevMode;
  }


}
