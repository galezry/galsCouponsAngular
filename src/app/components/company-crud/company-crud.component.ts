import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CompanyIdVsPw } from 'src/app/interfaces/company-id-vs-pw';
import { Company } from 'src/app/models/company.model';
import { Coupon } from 'src/app/models/coupon.model';
import { FormState } from 'src/app/models/form-state.model';
import { UserType } from 'src/app/models/user-type.model';
import { AdminRestService } from 'src/app/services/admin-rest.service';
import { AuthService } from 'src/app/services/auth.service';
import { DevService } from 'src/app/services/dev.service';
import { FormService } from 'src/app/services/form.service';
import { WelcomeRestService } from 'src/app/services/welcome-rest.service';


@Component({
  selector: 'app-company-crud',
  templateUrl: './company-crud.component.html',
  styleUrls: ['./company-crud.component.css']
})
export class CompanyCrudComponent implements OnInit {

  // public companies: Company[] = [];
  public isErrMsgShown: boolean = false;
  public errMsg: string = '';
  // public isCompaniesArrEmpty: boolean = false;

  public idSearched = '';
  public nameSearched = '';
  public emailSearched = '';

  public companiesToShow: Company[] = [];

  public isEditModePossible: boolean = this.formService.getIsEditModePossible() === 'yes';

  public isUpdateMode: boolean = false;
  public companyIdToUpdate: number = -1;

 // public isEditModeMsgShown: boolean = false;
  public companyMsg: Company = new Company();
  public isCompanyMsgShown: boolean = false;  // check if nessesary
  public companyMsgClass: string = '';

  public companyAdded: Company = new Company();

  public updatedEmail: string = '';
  public updatedPassword: string = '';
  public newName: string = '';

  public existedEmail: string = 'x';
  public existedName: string = 'x';

  public namePattern = this.formService.namePattern;
  public explainName = this.formService.explainName;
  public nameTitle = this.formService.nameTitle;

  public emailPattern = this.formService.emailPattern;
  public explainEmail = this.formService.explainEmail;
  public emailTitle = this.formService.emailTitle;

  public passwordPattern = this.formService.passwordPattern;
  public explainPassword = this.formService.explainPassword;
  public passwordTitle = this.formService.passwordTitle;
  public areAllPasswordsShown: boolean = false;
  public companyIdVsPw: CompanyIdVsPw = {};

  public idAutoIncMsg = this.formService.idAutoIncMsg;
  public cannotChangeIdMsg = this.formService.cannotChangeIdMsg;
  public cannotAddCouponsMsg = this.formService.cannotAddCompanyCouponsMsg;

  public saveBtnTitle: string = '';


//   public companies: Company[] = [
//     new Company(111, 'aaa', 'aaa@gmail.com', '1234', []),
//     new Company(222, 'bbb', 'bbb@gmail.com', '1235', []),
//     new Company(333, 'ccc', 'bbb@gmail.com', '1236', []),
//     new Company(333, 'ccc', 'bbb@gmail.com', '1236', []),
// ];

  constructor(private adminRestService: AdminRestService, private router: Router,
    private devService: DevService, private formService: FormService,
    private authService: AuthService, private welcomeRestService: WelcomeRestService) { }

  ngOnInit(): void {
      // if (!this.adminRestService.isAlreadyRetrievedFromServer) {
      //   this.getAllCompanies();
      // }

      if (this.isVPWidthSmall()) {
        this.isEditModePossible = false;
        this.formService.setIsEditModePossible('no');
      }

      if (!this.authService.isLoggedIn) {
        this.authService.hasAlreadyRetrievedCompaniesFromServer = false;
        this.adminRestService.companies = [];
        // this.adminRestService.nextCompanyId = 0; dont need this line
      }
      this.getAllCompanies();
  }

  public isVPWidthSmall(): boolean {
    return this.formService.screenWidth < 1000;
  }

  public toggleFilterSec(): void {
    this.deleteCompanyMsg();
    this.formService.toggleCompanyCrudFilterSec();
  }

  public isFilterSecShown(): boolean {
    return this.formService.isCompanyCrudFilterSecShown;
  }

  public isFiltering(): boolean {
    return this.companiesToShow.length < this.adminRestService.companies.length;
  }

  public getAllCompanies(): void {
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

    if (!this.authService.hasAlreadyRetrievedCompaniesFromServer) {
      this.adminRestService.getAllCompanies().subscribe(response => {
        console.log(response); // TODO delete this line
        this.authService.hasAlreadyRetrievedCompaniesFromServer = true;
        this.isErrMsgShown = false;
        this.adminRestService.companies = [...response];
        this.companiesToShow = [...this.adminRestService.companies];
        this.sort();
        if (this.formService.isSuccessMsgShown) {
          const newComp: Company[] =
          this.companiesToShow.filter(c => c.email === this.formService.emailOfAddedElement);
          const compIdx: number = this.companiesToShow.indexOf(newComp[0]);
          this.companiesToShow.splice(compIdx + 1, 0, this.companyMsg);
          this.companyMsg.id = 0;
          this.companyMsg.name = `Company ${this.newName} Has Been Added Successfully!`;
          this.companyMsgClass = 'table-success';
          this.formService.isSuccessMsgShown = false;
        }

        // this.isCompaniesArrEmpty = response.length === 0;

        // this.adminRestService.isAlreadyRetrievedFromServer = true;
        // console.log(JSON.stringify(response));
      }, err => {
        console.log(err.error); // TODO delete this line
        // alert(err.error.value);
        this.authService.signOut();
        this.isErrMsgShown = true;
        this.errMsg = this.authService.hasBeenSignedOutErrMsg;


        // let errStr = JSON.stringify(err.message);
        // console.log(errStr);
        // if(errStr.toLowerCase().includes("unknown")) {
        //   this.errMsg = this.authService.errorMsg500;
        // } else {
        //   this.errMsg = err.error.value;
        //   this.authService.loginCheck(this.errMsg);
        // };

        // let errorObject = JSON.parse(err.error);  // from json to js object
        // console.dir(errorObject);
      });
    } else {
      this.companiesToShow = [...this.adminRestService.companies]; // correct this and then correct all the rest
      this.sort();
    }
  }

  public getFutureCoupons(coupons: Coupon[]): Coupon[] {
    return this.formService.getFutureCoupons(coupons);
  }

  public sort() {
    if (this.formService.isCompanySortedById) {
      this.sortById();
    } else if(this.formService.isCompanySortedByName) {
      this.sortByName();
    } else {
      this.sortByEmail();
    }
  }

  public sortById() {
    // this.adminRestService.companies.sort((a,b) => (a.id > b.id) ? 1 : ((b.id > a.id) ? -1 : 0));
    this.companiesToShow.sort((a,b) => (a.id > b.id) ? 1 : ((b.id > a.id) ? -1 : 0));
  }

  public sortByName() {
    // this.adminRestService.companies.sort((a,b) => (a.name.toLocaleLowerCase() > b.name.toLocaleLowerCase())
    //    ? 1 : ((b.name.toLocaleLowerCase() > a.name.toLocaleLowerCase()) ? -1 : 0));
    this.companiesToShow.sort((a,b) => (a.name.toLocaleLowerCase() > b.name.toLocaleLowerCase())
       ? 1 : ((b.name.toLocaleLowerCase() > a.name.toLocaleLowerCase()) ? -1 : 0));
  }

  public sortByEmail() {
    // this.adminRestService.companies.sort((a,b) => (a.email.toLocaleLowerCase() > b.email.toLocaleLowerCase())
    //    ? 1 : ((b.email.toLocaleLowerCase() > a.email.toLocaleLowerCase()) ? -1 : 0));
    this.companiesToShow.sort((a,b) => (a.email.toLocaleLowerCase() > b.email.toLocaleLowerCase())
       ? 1 : ((b.email.toLocaleLowerCase() > a.email.toLocaleLowerCase()) ? -1 : 0));
  }

  public shouldSortBy(attr: string): void {
    if (!this.isUpdateMode) {
      this.deleteCompanyMsg();
      switch (attr) {
        case 'name':
          this.formService.isCompanySortedByName = true;
          this.formService.isCompanySortedById = false;
          this.formService.isCompanySortedByEmail = false;
          break;
        case 'email':
          this.formService.isCompanySortedByEmail = true;
          this.formService.isCompanySortedById = false;
          this.formService.isCompanySortedByName = false;
          break;
        default:
          this.formService.isCompanySortedById = true;
          this.formService.isCompanySortedByName = false;
          this.formService.isCompanySortedByEmail = false;
      }
      this.sort();
    }
  }

  public getClass(attr: string): string {
    switch (attr) {
      case 'name':
        return this.formService.isCompanySortedByName ? 'active-sort' :
        !this.isUpdateMode ? 'not-sorted' : '';
      case 'email':
        return this.formService.isCompanySortedByEmail ? 'active-sort' :
        !this.isUpdateMode ? 'not-sorted' : '';
      default:
        return this.formService.isCompanySortedById ? 'active-sort' :
        !this.isUpdateMode ? 'not-sorted' : '';
    }
  }

  public delete(comp: Company): void {
    this.deleteCompanyMsg();
    this.isUpdateMode = true;
    let compIdx: number = this.companiesToShow.indexOf(comp);
    this.companiesToShow.splice(compIdx + 1, 0, this.companyMsg);
    this.companyMsg.id = 0;
    this.companyMsg.name = `Are you sure you want to delete company ${comp.name}?`;
    this.companyMsg.email = 'delete';
    this.companyMsgClass = 'table-danger';

  }

  public cancelDelete(): void{
    this.companiesToShow = this.companiesToShow.filter(c => c.id > 0);
    this.companyMsg.email = '';
    this.isUpdateMode = false;
  }


  public deleteCompany(): void {
    //this.companiesToShow = this.companiesToShow.filter(c => c.id !== 0);
    let compIdx: number = this.companiesToShow.indexOf(this.companyMsg);
    const companyToDelete = this.companiesToShow[compIdx - 1];

    this.adminRestService.deleteCompany(companyToDelete.id).subscribe(response => {
        // this.getAllCompanies();
      this.companyMsg.name = `Company ${companyToDelete.name} Has Been Deleted Successfully!`;
      this.companyMsg.email = '';
      this.companyMsgClass = 'table-success';
      this.isUpdateMode = false;
      this.adminRestService.companies = this.adminRestService.companies
      .filter(c => c.id !== companyToDelete.id);
      this.companiesToShow = this.companiesToShow.filter(c => c.id !== companyToDelete.id);
        // if (this.adminRestService.companies.length === 0) {
        //   this.isCompaniesArrEmpty = true;
        // }
      console.log(response);
      console.log(this.companiesToShow);
      console.log(this.adminRestService.companies);
      this.welcomeRestService.hasAlreadyRetrievedWelcomeCouponsFromServer = false;

      }, err => {
        this.showErrMsg(err);

        console.log(err.error); // TODO delete this line
      });


  }

  public searchById(event: any) {
    // this.companiesToShow = this.adminRestService.companies.filter(c => c.id.toString()
    //  .startsWith(this.idSearched));
    // this.nameSearched = '';
    // this.emailSearched = '';
    // this.sort();

    this.deleteCompanyMsg();
    if (event.key === 'Backspace' || event.key === 'Delete') {
      this.companiesToShow = this.adminRestService.companies;

      if (this.nameSearched !== '') {
        this.searchByName('k');  // the parameter is any key other than Backspace or Delete
      }
      if (this.emailSearched !== '') {
        this.searchByEmail('f');
      }
    }

    if (this.nameSearched !== '' || this.emailSearched !== '') {
      this.companiesToShow = this.companiesToShow.filter(c => c.id.toString()
       .startsWith(this.idSearched));
    } else {
      this.companiesToShow = this.adminRestService.companies.filter(c => c.id.toString()
     .startsWith(this.idSearched));
    }
    this.sort();
}

  public searchByName(event: any) {
      // this.companiesToShow = this.adminRestService.companies.filter(c => c.name.toLowerCase()
      //  .startsWith(this.nameSearched.toLowerCase()));
      // this.idSearched = '';
      // this.emailSearched = '';
      // this.sort();

      this.deleteCompanyMsg();
      if (event.key === 'Backspace' || event.key === 'Delete') {
        this.companiesToShow = this.adminRestService.companies;
        if (this.idSearched !== '') {
          this.searchById('k');
        }
        if (this.emailSearched !== '') {
          this.searchByEmail('f');
        }
      }

      if (this.idSearched !== '' || this.emailSearched !== '') {
        this.companiesToShow = this.companiesToShow.filter(c => c.name.toLowerCase()
         .startsWith(this.nameSearched.toLowerCase()));
      } else {
        this.companiesToShow = this.adminRestService.companies.filter(c => c.name.toLowerCase()
       .startsWith(this.nameSearched.toLowerCase()));
      }
      this.sort();

  }

  public searchByEmail(event: any) {
    // this.companiesToShow = this.adminRestService.companies.filter(c => c.email.toLowerCase()
    //  .startsWith(this.emailSearched.toLowerCase()));
    // this.idSearched = '';
    // this.nameSearched = '';
    // this.sort();

    this.companiesToShow = this.companiesToShow.filter(c => c.id !== 0);
    if (event.key === 'Backspace' || event.key === 'Delete') {
      this.companiesToShow = this.adminRestService.companies;
      if (this.idSearched !== '') {
        this.searchById('k');
      }
      if (this.nameSearched !== '') {
        this.searchByName('k');
      }
    }

    if (this.idSearched !== '' || this.nameSearched !== '') {
      this.companiesToShow = this.companiesToShow.filter(c => c.email.toLowerCase()
       .startsWith(this.emailSearched.toLowerCase()));
    } else {
      this.companiesToShow = this.adminRestService.companies.filter(c => c.email.toLowerCase()
     .startsWith(this.emailSearched.toLowerCase()));
    }
    this.sort();
  }

  public isCompaniesToShowEmpty(): boolean {
    return this.companiesToShow.length === 0;
  }

  public isCompaniesArrEmpty(): boolean {
    return this.adminRestService.companies.length === 0;
  }


  public update(comp: Company): void {
    this.deleteCompanyMsg();
    if (!this.isEditModePossible || this.isVPWidthSmall()) {
      this.formService.companyForm = FormState.UPDATE;
      this.formService.company =  Object.assign({}, comp);

    } else {
      this.isUpdateMode = true;
      this.saveBtnTitle = 'Save Changes';
      this.companyIdToUpdate = comp.id;
      this.updatedEmail = comp.email;
      this.updatedPassword = comp.password;
    }
  }

  public cancelUpdate(): void{
    this.companiesToShow = this.companiesToShow.filter(c => c.id > 0);
    this.companyIdToUpdate = -1;
    this.isUpdateMode = false;
    this.existedEmail = 'x';
    this.existedName = 'x';
  }

  public doesUpdatedEmailEqualExistedEmail(): boolean {
    return this.updatedEmail.toLowerCase() === this.existedEmail.toLowerCase();
  }

  public isEmailValid(): boolean {
    return this.formService.isEmailValid(this.updatedEmail)
    && !this.doesUpdatedEmailEqualExistedEmail();
  }

  public isPasswordValid(): boolean {
    return this.formService.isPasswordValid(this.updatedPassword);
  }

  public isUpdatePossible(): boolean {
    return this.isEmailValid() && this.isPasswordValid();
  }

  // public checkEmail(event: any) {
  //   console.log(event.key);
  //   if (event.key === ' ' || this.updatedEmail.includes(' ')) {
  //     this.explainEmail = "Email Cannot Include White Space";
  //   } else {
  //     this.explainEmail = this.formService.explainEmail;
  //   }
  // }

  public doesUpdatedEmailBelongToAnotherCompany(compEmail: string): boolean {
    if (this.updatedEmail.toLowerCase() !== compEmail.toLowerCase() && this.doesEmailExist()) {
      this.companyMsg.name = this.formService.emailExistsErrMsg;
      this.companyMsgClass = 'table-warning';
      this.existedEmail = this.updatedEmail;
      return true;
    }
    return false;
  }

  public deleteCompanyMsg(): void {
    this.companiesToShow = this.companiesToShow.filter(c => c.id !== 0);
  }

  public wereNoChangesMade(comp: Company): boolean {
    if (comp.email.toLowerCase() === this.updatedEmail.toLowerCase() &&
    comp.password === this.updatedPassword) {
      //  this.isCompanyMsgShown = true;
       // this.isEditModeMsgShown = true;
      this.companyMsg.name = `No changes have been detected for Company ${comp.name}`;
      this.companyMsgClass = 'table-info';
      this.existedEmail = 'x';
      this.companyIdToUpdate = -1;
      this.isUpdateMode = false;
      console.log(this.companiesToShow); //TODO delete this line
      return true;
    }
    return false;
  }

  public updateCompany(comp: Company): void {
    this.deleteCompanyMsg();
    let compIdx: number = this.companiesToShow.indexOf(comp);
    this.companiesToShow.splice(compIdx + 1, 0, this.companyMsg);

    if (this.wereNoChangesMade(comp)) {
      return;
    }
    if (this.doesUpdatedEmailBelongToAnotherCompany(comp.email)) {
      return;
    }
    this.capName();
    this.existedEmail = 'x';
    this.companyIdToUpdate = -1;
    this.isUpdateMode = false;
    comp.email = this.updatedEmail;
    comp.password = this.updatedPassword;

    this.adminRestService.updateCompany(comp).subscribe(response => {
      console.log(response);
      this.companyMsg.name = `Company ${comp.name} Has Been Updated Successfully!`;
      this.companyMsgClass = 'table-success';
      this.adminRestService.companies = this.adminRestService.companies
      .filter(c => c.id !== comp.id);
      this.adminRestService.companies.push(comp);

      }, err => {
        console.log(err.error); // TODO delete this line
        this.isUpdateMode = false;
        this.showErrMsg(err);
      });
      // this.isUpdateMode = false;
  }

  public add(): void {
    this.deleteCompanyMsg();
    if (!this.isEditModePossible || this.adminRestService.companies.length === 0
      || this.isVPWidthSmall()) {
      this.formService.companyForm = FormState.ADD;
    } else {
      this.isUpdateMode = true;
      this.saveBtnTitle = 'Add Company';
      this.companiesToShow.splice(this.companiesToShow.length, 0, this.companyAdded);
      this.companyAdded.id = -5;
      this.newName = '';
      this.updatedEmail = '';
      this.updatedPassword = '';
    }
  }

  public doesNewNameEqualExistedName(): boolean {
    return this.newName.toLowerCase() === this.existedName.toLowerCase()
  }

  public isNameValid(): boolean {
    return this.formService.isNameValid(this.newName) && !this.doesNewNameEqualExistedName();
  }

  public isAddCompanyPossible(): boolean {
    return this.isNameValid() && this.isEmailValid() && this.isPasswordValid();
  }

  //no need to trim - regex doesnt let it begin or end with white space
  public capName(): void {
    // this.newName = this.newName.trim();
    // this.updatedEmail = this.updatedEmail.trim();
    // this.updatedPassword = this.updatedPassword.trim();
    this.newName = this.formService.capTitle(this.newName);
  }

  public doesNameExist(): boolean {
    return this.adminRestService.doesNameExist(this.newName);
  }

  public doesEmailExist(): boolean {
    return this.adminRestService.doesCompanyEmailExist(this.updatedEmail);
  }

  public doesNameOrEmailExist(): boolean {
    if (this.doesNameExist() || this.doesEmailExist()) {
      this.companyMsgClass = 'table-warning';
      if (this.doesNameExist() && this.doesEmailExist()) {
        this.companyMsg.name = this.formService.nameAndEmailExistErrMsg;
        this.existedName = this.newName;
        this.existedEmail = this.updatedEmail;
      } else if (this.doesNameExist()) {
        this.companyMsg.name = this.formService.nameExistsErrMsg;
        this.existedName = this.newName;
      } else {
        this.companyMsg.name = this.formService.emailExistsErrMsg;
        this.existedEmail = this.updatedEmail;
      }
    }
    return this.doesNameExist() || this.doesEmailExist();
  }

  public addCompany() {
    this.deleteCompanyMsg();
    this.companiesToShow.splice(this.companiesToShow.length, 0, this.companyMsg);
    this.companyMsg.id = 0;

    if (this.doesNameOrEmailExist()) {
      return;
    }
    this.capName();
    this.existedEmail = 'x';
    this.existedName = 'x';
    let companyToSend: object = {
      name: this.newName,
      email: this.updatedEmail,
      password: this.updatedPassword
    };

    this.adminRestService.addCompany(companyToSend).subscribe(response => {
      console.log(response);
      // this.companiesToShow = this.companiesToShow.filter(c => c.id !== -5);
      this.authService.hasAlreadyRetrievedCompaniesFromServer = false;
      this.formService.isSuccessMsgShown = true;
      this.formService.emailOfAddedElement = this.updatedEmail;
      this.isUpdateMode = false;

      this.getAllCompanies();

      }, err => {
        console.log(err.error); // TODO delete this line
        this.isUpdateMode = false;
        this.showErrMsg(err);
      });
  }

  public hideAllPasswords(): void {
    // this.deleteCompanyMsg();
    this.areAllPasswordsShown = false;
    for (let c of this.companiesToShow) {
      this.companyIdVsPw[c.id] = false;
    }
  }

  public showAllPasswords(): void {
    // this.deleteCompanyMsg();
    this.areAllPasswordsShown = true;
    for (let c of this.companiesToShow) {
      this.companyIdVsPw[c.id] = true;
    }
  }

  public toggleOwnPassword(id: number): void {
    // this.deleteCompanyMsg();
    this.companyIdVsPw[id] = !this.companyIdVsPw[id];
  }

  public getHiddenPassword(password: string): string {
    let result ='';
    for (let i = 0; i < password.length; i++) {
      result += '●';
    }
    return result;
  }

  public getPasswordType(id: number): string {
    return this.companyIdVsPw[id] ? 'text' : 'password';
  }

  public getEyeClass(id: number): string {
    return this.companyIdVsPw[id] ? 'fas fa-eye eye' : 'fas fa-eye-slash eye';
  }

  // public isEditModePossibleCheck() {
  //   return this.isEditModePossible;
  // }

  public showErrMsg(err: any) {
    this.isErrMsgShown = true;
    this.errMsg = this.authService.connectionToServerAndLoginCheck(err);
  }

  public editModeCheckBox() {
    this.companiesToShow = this.companiesToShow.filter(c => c.id > 0);
    this.existedEmail = 'x';
    this.existedName = 'x';
    this.companyIdToUpdate = -1;
    this.isUpdateMode = false;
    if (this.formService.getIsEditModePossible() === 'yes') {
      this.formService.setIsEditModePossible('no');
    } else {
      this.formService.setIsEditModePossible('yes');
    }
  }

  public isLoggedIn(): boolean {
    return this.authService.isLoggedIn;
  }

  public isUserTypeAdmin(): boolean {
    return this.authService.getUserType() === UserType.ADMINISTRATOR;
  }

  public isDevMode(): boolean {
    return this.devService.isDevMode;
  }


}




