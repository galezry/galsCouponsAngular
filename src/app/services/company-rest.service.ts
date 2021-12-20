import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Company } from '../models/company.model';
import { Coupon } from '../models/coupon.model';
import { UserType } from '../models/user-type.model';
import { AuthService } from './auth.service';
import { FormService } from './form.service';

@Injectable({
  providedIn: 'root'
})
export class CompanyRestService {

  public originalcouponsInDB: Coupon[] = [];
  public coupons: Coupon[] = [];
  public companyImages: any[] = [];
  public imagesToDisplay: any[] = [];

  // public currentLoggedInCompany: Company = new Company();

  // private url: string = 'http://localhost:8080/company';
  private url: string = environment.baseUrl + 'company';




  constructor(private httpClient: HttpClient, private authService: AuthService,
    private formService: FormService) {
    console.log('hi. this in the companyRestService CTOR');
    if (this.authService.isLoggedIn && this.authService.getUserType() === UserType.COMPANY) {
      console.log('its a company');
      this.getCurrentCompanyDetails();
    }

  }

  public doesCouponTitleExist(title: string): boolean {
    return this.originalcouponsInDB.filter(c => c.title.toLowerCase() === title.toLowerCase()).length > 0;
  }

  public getCompanyCoupons(): Observable<Coupon[]> {
    return this.httpClient.get<any>(this.url + "/getCompanyCoupons", this.getOptions());
  }

  public updateCoupon(coupon: Coupon): Observable<any> {
    return this.httpClient.put<any>(this.url + "/updateCoupon", coupon, this.getOptions());
  }

  public deleteCoupon(couponId: number): Observable<any> {
    return this.httpClient.delete<any>(this.url + "/deleteCoupon/"+ couponId, this.getOptions());
  }
  // sending an Object because Coupon includes id we don't send it
  public addCoupon(coupon: Object): Observable<any> {
   return this.httpClient.post<any>(this.url + "/addCoupon", coupon, this.getOptions());
  }

  public getCompanyDetails(): Observable<Company> {
   return this.httpClient.get<any>(this.url + "/getCompanyDetails", this.getOptions());
  }

  public updateCompany(company: Company): Observable<any> {
    return this.httpClient.put<any>(this.url + "/updateCompany", company, this.getOptions());
  }

  public getCouponIdByTitle(title: string): Observable<any> {
    return this.httpClient.get<any>(this.url + "/getCouponIdByTitle", this.getOptions2(title));
  }

  public getCompanyImages(): Observable<any[]> {
    return this.httpClient.get<any>(this.url + "/getCompanyImages", this.getOptions());
  }

  public restore(str: string): Observable<any> {
    return this.httpClient.post<any>(this.url + "/restore", str, this.getOptions());
  }




  public getOptions() {
   const token: string = this.authService.getToken();
   const headers = new HttpHeaders({Authorization: token});
   return {headers:headers};
  }

  public getOptions2(title: string) {
    const token: string = this.authService.getToken();
    const headers = new HttpHeaders({Authorization: token, CouponTitle: title});
    return {headers:headers};
   }

  public getCurrentCompanyDetails(): void {
    this.getCompanyDetails().subscribe(response => {
      this.formService.currentLoggedInCompany = Object.assign({}, response);
      this.authService.setUserType(UserType.COMPANY);
    //  this.authService.setCompanyName();
      console.log(response); // TODO delete this line
    }, err => {
      console.log(err.error); // TODO delete this line
      this.authService.signOut();

    });
  }

  // public getCurrentLoggedInCompany(): Company {
  //   return this.currentLoggedInCompany;
  // }




}


