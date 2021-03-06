import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { FormState } from 'src/app/models/form-state.model';
import { Login } from 'src/app/models/login.model';
import { UserType } from 'src/app/models/user-type.model';
import { AuthService } from 'src/app/services/auth.service';
import { CompanyRestService } from 'src/app/services/company-rest.service';
import { CustomerRestService } from 'src/app/services/customer-rest.service';
import { DevService } from 'src/app/services/dev.service';
import { FormService } from 'src/app/services/form.service';
import { WelcomeRestService } from 'src/app/services/welcome-rest.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public isErrMsgShown: boolean = false;
  public errMsg: string = '';

  public loginDetails = new Login();

  //public emailPattern = '/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g';

  public emailPattern = this.formService.emailPattern;
  public explainEmail = this.formService.explainEmail;

  public passwordType = 'password';
  // public passwordImgSrc = "../../../assets/images/password-is-hidden.jpeg";
  public isPasswordShown = false;

  public passwordPattern = this.formService.passwordPattern;
  public explainPassword = this.formService.explainPassword;

  // public passwordPattern = '^(?=.*[a-zA-Z])(?=.*\d)[A-Za-z\d!@#$%^&*]{6,}$';
  // public explainPassword = "Password Must Be At Least 6 Characters Long With At Least One" +
  //  " Letter and one number";

  public isSigningIn: boolean = false;


  constructor(private title: Title, private devService: DevService, private router: Router,
        private welcomeRestService: WelcomeRestService, private authService: AuthService,
        private formService: FormService, private companyRestService: CompanyRestService,
        private customerRestService: CustomerRestService) { }

  ngOnInit(): void {
    this.title.setTitle("Login");
    this.welcomeRestService.checkIfUserLoggedIn();
  }

  public isLoggedIn(): boolean {
    return this.authService.isLoggedIn;
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

  public isDevMode(): boolean {
    return this.devService.isDevMode;
  }

  public login(): void {
    this.welcomeRestService.isSignedOutMsgShown = false;
    let password: any = this.loginDetails.password;
    if (!this.passwordPattern.test(password)) {
      this.isErrMsgShown = true;
      this.errMsg = 'The sign in information you entered does not match our records. ' +
       'Please re-enter your sign in information or create an account';
       return;
    }
    this.isSigningIn = true;
    this.welcomeRestService.login(this.loginDetails).subscribe(response => {
      this.saveToken(response);
      this.authService.isWelcomeMsgShown = true;
      this.authService.currentTime = new Date().getTime();
      this.navigateToView();
      this.authService.isLoggedIn = true;
      this.isSigningIn = false;
    }, err => {
      // console.log(err.error);
      this.showErrMsg(err);
      this.isSigningIn = false;
      // alert(err.error.value);
      // alert(err.message);
    });
  }

  // just a demo from another project:
  // public makeRequest() {
  //   this.resp = '';
  //   this.error = '';
  //   this.welcomeRestService.callGreet().subscribe(resp => {
  //     this.resp = resp;
  //     console.log(resp);
  //   }, err => {
  //     let errorObject = JSON.parse(err.error);  // from json to js object
  //     console.dir(errorObject);
  //     this.error = errorObject.error + ": " + errorObject.message;

  //   });
  // }


  public navigateToView(): void {
    switch (this.loginDetails.type) {

      //case UserType.ADMINISTRATOR.toString():
      case UserType[UserType.ADMINISTRATOR] as unknown as UserType:
        this.authService.setUserType(UserType.ADMINISTRATOR);
        this.router.navigateByUrl('admin');
        break;
      case UserType[UserType.COMPANY] as unknown as UserType:
        this.authService.setUserType(UserType.COMPANY)
        this.companyRestService.getCurrentCompanyDetails();
        this.router.navigateByUrl('company');
        break;
      case UserType[UserType.CUSTOMER] as unknown as UserType:
        this.authService.setUserType(UserType.CUSTOMER);
        this.customerRestService.getCurrentCustomerDetails();
        this.router.navigateByUrl('customer');
        break;
      default:
        break;
    }

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


  public saveToken(response:any): void {
    const token = response.token;
    // alert('token is: ' + token);
    this.authService.setToken(token);
    // JSON.stringify(response)
    const type: UserType = this.loginDetails.type as unknown as UserType;
    this.authService.setUserType(type as unknown as UserType);

  }

  public showErrMsg(err: any) {
    this.isErrMsgShown = true;
    this.errMsg = this.authService.connectionToServerAndLoginCheck(err);
  }

  public signUpAsCustomer() {
    this.formService.customerForm = FormState.ADD;
    this.authService.isCustomerSignUp = true;
  }

  public signUpAsCompany() {
    this.formService.companyForm = FormState.ADD;
    this.authService.isCompanySignUp = true;
  }

  public isMobile(): boolean {
    return this.formService.getScreenType() === 'mobile';
  }


// for dev mode:
  public asAdmin(): void {
    this.loginDetails = new Login('admin@admin.com', 'admin12#', UserType[UserType.ADMINISTRATOR] as unknown as UserType);
  }

  public asCompany(): void {
    this.loginDetails = new Login('cola@gmail.com', '1234ab!', UserType[UserType.COMPANY] as unknown as UserType);
  }

  public asCustomer(): void {
    this.loginDetails = new Login('dave@gmail.com', '1234ab@', UserType[UserType.CUSTOMER] as unknown as UserType);
  }



}
