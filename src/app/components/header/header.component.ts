import { Component, HostListener, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Coupon } from 'src/app/models/coupon.model';
import { FormState } from 'src/app/models/form-state.model';
import { UserType } from 'src/app/models/user-type.model';
import { AdminRestService } from 'src/app/services/admin-rest.service';
import { AuthService } from 'src/app/services/auth.service';
import { CompanyRestService } from 'src/app/services/company-rest.service';
import { CustomerRestService } from 'src/app/services/customer-rest.service';
import { FormService } from 'src/app/services/form.service';
import { WelcomeRestService } from 'src/app/services/welcome-rest.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  // public logoutMessage: string = 'You Have Successfully Signed Out!';
  // public showLoMsg: boolean = true;

  constructor(private authService: AuthService, private router: Router, private title: Title,
    private formService: FormService, private companyRestService: CompanyRestService,
    private customerRestService: CustomerRestService, private adminRestService: AdminRestService,
    private welcomeRestService: WelcomeRestService) { }

  ngOnInit(): void {
    this.welcomeRestService.checkIfUserLoggedIn();
    this.formService.screenWidth = window.innerWidth;
    this.formService.screenHeight = window.innerHeight;
    // console.log('width:', this.formService.screenWidth);
    // console.log('height:', this.formService.screenHeight);
    this.formService.getScreenType();
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.formService.screenWidth = window.innerWidth;
    // console.log('width:', this.formService.screenWidth);
    // console.log('height:', this.formService.screenHeight);
    this.formService.screenHeight = window.innerHeight;
    this.formService.getScreenType();
    // this.formService.getImgHeight();
  }


  public isBarsMenuShown(): boolean {
    return this.formService.screenWidth < 600;
  }

  public isMobile(): boolean {
    return this.formService.getScreenType() === 'mobile';
  }

  public getName(): string {
    switch (this.getUserType()) {
      case  UserType.ADMINISTRATOR:
        return "Admin";
      case UserType.COMPANY:
        if (this.isMobile() && this.formService.currentLoggedInCompany.name.length > 10) {
          return '';
        }
        return this.formService.currentLoggedInCompany.name;
      case UserType.CUSTOMER:
        if (this.isMobile() && this.formService.currentLoggedInCustomer.firstName.length > 10) {
          return '';
        }
        return this.formService.currentLoggedInCustomer.firstName;
      default:
        return "";
    }
  }

  public getIcon(): string {
    switch (this.getUserType()) {
      case  UserType.ADMINISTRATOR:
        return 'fas fa-male larger-font'; //   fas fa-user-secret
      case UserType.COMPANY:
        return 'far fa-building';
      case UserType.CUSTOMER:
        return 'fas fa-user';
      default:
        return "";
    }
  }


  // public isUserTypeExist(): boolean {
  //   const item = localStorage.getItem('userType');
  //   if (item) {
  //     return true;
  //   }
  //   return false;
  // }

  public getUserType(): UserType {
    return this.authService.getUserType();
  }

  // public getUser(): string {
  //   return this.authService.getUser();
  // }

  public isCompany(): boolean {
    return this.authService.getUser() === 'company';
  }



  public getUserTypeRouterLink(): string {
    switch (this.getUserType()) {
      case  UserType.ADMINISTRATOR:
        return "admin";
      case UserType.COMPANY:
        return "company";
      case UserType.CUSTOMER:
        return "customer";
      default:
        return "";
    }
  }

  public getUserTypeClass(): string {
    if (
      (this.title.getTitle() === 'Admin' && this.getUserType() === UserType.ADMINISTRATOR) ||
      ((this.title.getTitle() === 'Company' || this.title.getTitle() === 'Profile')
      && this.getUserType() === UserType.COMPANY) ||
      ((this.title.getTitle() === 'Customer' || this.title.getTitle() === 'Profile')
      && this.getUserType() === UserType.CUSTOMER)
      ) {
        return 'user-type-link-active';
      }
    return 'user-type-link';
  }

  public isLoggedIn(): boolean {
    return this.authService.isLoggedIn;
  }

  public logout(): void {
    // this.welcomeRestService.login(this.loginDetails).subscribe(response => {
      // this.saveToken(response);
      // const res = confirm("Are you sure you want to logout?");

      // if (this.isLoggedIn() && this.authService.getUser() === 'customer'
      // && this.customerRestService.couponIdCart.length > 0) {
      //   this.authService.isCartNotEmptyMsgShown = true;
      // } else {
      //   this.signOutAnyway();
      // }

      if (true) {  // TODO change this when project finished  instead of 'true' put 'res'
        if (this.title.getTitle() !== 'Login') {
          this.router.navigateByUrl('home');
        }
        // this.customerRestService.emptyCart();
        // this.formService.currentLoggedInCompany.id = 0;
        // this.formService.currentLoggedInCustomer.id = 0;

        this.adminRestService.companies.splice(0);
        this.adminRestService.customers.splice(0);

        this.companyRestService.imagesToDisplay = [];
        this.customerRestService.imagesToDisplay = [];
    //    this.customerRestService.allImagesToDisplay = [];
        this.authService.isWelcomeMsgShown = false;
        this.welcomeRestService.userSignOut();
        this.authService.signOut();

        // this.showLoMsg = true;
      }
    // }, err => {
      // alert(err.message);
    // });
  }

  public isLoginViewed(): boolean {
    return this.title.getTitle() === 'Login';
  }

  // public isHomeViewed(): boolean {
  //   return this.title.getTitle() === 'home';
  // }

  public isCartShown(): boolean {
    return this.isLoggedIn() && this.getUserType() === UserType.CUSTOMER;
  }

  public getNumOfItmensInCart(): number {
    return this.customerRestService.cart.length;
  }

  public getBadgeClass(): string {
    if (this.getNumOfItmensInCart() > 0) {
      return 'badge';
    }
    return 'empty-badge';

  }


  // dropDown menu options:
  public firstOption() {
    const type = this.getUserType();
    switch (type) {
      case UserType.ADMINISTRATOR:
        this.authService.setAdminSelection('company');
        this.router.navigateByUrl('admin');
        break;
      case UserType.COMPANY:
        this.authService.isCompanyProfileSelected = false;
        this.router.navigateByUrl('company');
        break;
      case UserType.CUSTOMER:
        this.authService.isCustomerCouponsSelected = true;
        this.authService.isCustomerProfileSelected = false;
        this.router.navigateByUrl('customer');
        break;

      default:
        break;
    }

  }

  public secondOption() {
    const type = this.getUserType();
    switch (type) {
      case UserType.ADMINISTRATOR:
        this.authService.setAdminSelection('customer');
        this.router.navigateByUrl('admin');
        break;
      case UserType.COMPANY:
        this.authService.isCompanyProfileSelected = true;
        this.formService.companyForm = FormState.UPDATE;
        this.formService.company =
        Object.assign({}, this.formService.currentLoggedInCompany);
        this.router.navigateByUrl('company');
        break;
      case UserType.CUSTOMER:
        this.authService.isCustomerCouponsSelected =
        !this.authService.hasAlreadyRetrievedCustomerCouponsFromServer;
        this.authService.isCustomerProfileSelected = false;
        this.router.navigateByUrl('customer');
        break;
      default:
        break;
    }
  }

  public thirdOption() {
    const type = this.getUserType();
    switch (type) {
      case UserType.ADMINISTRATOR:
      // no third choice for admin
        break;
      case UserType.COMPANY:
      // no third choice for company
        break;
      case UserType.CUSTOMER:
        this.authService.isCustomerCouponsSelected = false;
        this.authService.isCustomerProfileSelected = true;
        this.formService.customerForm = FormState.UPDATE;
        this.formService.customer =
        Object.assign({}, this.formService.currentLoggedInCustomer);
        this.router.navigateByUrl('customer');
        break;
      default:
        break;
    }
  }



  public getFirstOption(): string {
    const type = this.getUserType();
    switch (type) {
      case UserType.ADMINISTRATOR:
        return 'Manage Companies';
      case UserType.COMPANY:
        return 'Manage Coupons';
      case UserType.CUSTOMER:
        return 'My Coupons';

      default:
        return '';
    }

  }

  public getSecondOption(): string {
    const type = this.getUserType();
    switch (type) {
      case UserType.ADMINISTRATOR:
        return 'Manage Customers';
      case UserType.COMPANY:
        return 'Profile';
      case UserType.CUSTOMER:
        return 'Buy Coupon';

      default:
        return '';
    }

  }

  public getThirdOption(): string {
    const type = this.getUserType();
    switch (type) {
      case UserType.ADMINISTRATOR:
        return '';
      case UserType.COMPANY:
        return '';
      case UserType.CUSTOMER:
        return 'Profile';

      default:
        return '';
    }
  }

  public signUpAsCustomer() {
    this.welcomeRestService.isSignedOutMsgShown = false;
    this.formService.customerForm = FormState.ADD;
    this.authService.isCustomerSignUp = true;
  }

  public signUpAsCompany() {
    this.welcomeRestService.isSignedOutMsgShown = false;
    this.formService.companyForm = FormState.ADD;
    this.authService.isCompanySignUp = true;
  }

}


