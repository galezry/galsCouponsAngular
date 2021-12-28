import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Coupon } from '../models/coupon.model';
import { Login } from '../models/login.model';
import { UserType } from '../models/user-type.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class WelcomeRestService {

  // private url: string = 'http://localhost:8080/welcome';
  private url: string = environment.baseUrl + 'welcome';

  public isSignedOutMsgShown: boolean = false;
  public currentTime: number = new Date().getTime();

  public hasAlreadyRetrievedWelcomeCouponsFromServer: boolean = false;
  public welcomeCoupons: Coupon[] = [];
  public welcomeImages: any[] = [];
  public imagesToDisplay: any[] = [];
  public companyNames: string[] = [];
  public companyIdsArr: number[] = [];

  constructor(private httpClient: HttpClient, private authService: AuthService) {
  //  this.checkIfUserLoggedIn();
   }

  public login(login: Login):Observable<any> {
    return this.httpClient.post(this.url + "/login", login);
  }

  public logout():Observable<any> {
    return this.httpClient.delete(this.url + "/logout", this.getOptions());
  }

  public checkIfLoggedIn(type: string): Observable<any> {
    return this.httpClient.get<any>(this.url + "/checkIfLoggedIn/"+ type, this.getOptions());
  }

  public customerSignUp(customer: Object): Observable<any> {
    return this.httpClient.post<any>(this.url + "/customerSignUp", customer);
  }

  public companySignUp(company: Object): Observable<any> {
    return this.httpClient.post<any>(this.url + "/companySignUp", company);
  }

  public getWelcomeCoupons(): Observable<any> {
    return this.httpClient.get<any>(this.url + "/getWelcomeCoupons");
  }

  public getOneCompany(companyId: number): Observable<any> {
    return this.httpClient.get<any>(this.url + "/getOneCompany/"+ companyId);
  }


  public getOptions() {
    const token: string = this.authService.getToken();
    const headers = new HttpHeaders({Authorization: token});
    return {headers:headers};
  }

  public checkIfUserLoggedIn(): void {
    let type: string = '';
    const userType: UserType = this.authService.getUserType();
    switch (userType) {
      case UserType.ADMINISTRATOR:
        type = 'ADMINISTRATOR';
        break;
      case UserType.COMPANY:
        type = 'COMPANY';
        break;
      case UserType.CUSTOMER:
        type = 'CUSTOMER';
        break;
      default:
        return;
    }
    this.checkIfLoggedIn(type).subscribe(response => {
      // console.log(response);
    }, err => {
      // console.log(err.error); // TODO delete this line
      this.authService.signOut();
    });
  }

  public userSignOut(): void {
    this.logout().subscribe(response => {
      // console.log(response);
      this.isSignedOutMsgShown = true;
      this.currentTime = new Date().getTime();

    }, err => {
      // console.log(err.error);
    });
  }

  public addCompanyNameToArr(companyId: number): void {
    this.getOneCompany(companyId).subscribe(response => {
      // console.log(response); // TODO delete this line
      this.companyNames[response.id] = response.name;
    }, err => {
      // console.log(err.error); // TODO delete this line
    });
  }

  public fillCompanyNames(): void {
    for (let c of this.welcomeCoupons) {
      if (!this.companyIdsArr.includes(c.companyId)) {
        this.companyIdsArr.push(c.companyId);
        this.addCompanyNameToArr(c.companyId);
      }
    }

  }










  // public login(loginD: Login): Observable<any> {
  //   return this.httpClient.get('../../../assets/json/server-demo.json');
  // }




  // public callGreet(): Observable<any> {
  //   let url = "http://localhost:8080/greet";
  //   return this.httpClient.get(url, { responseType: 'text' });
  // }




}



