import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Company } from '../models/company.model';
import { Customer } from '../models/customer.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminRestService {

  public companies: Company[] = [];
  public customers: Customer[] = [];



  // private url: string = 'http://localhost:8080/admin';
  private url: string = environment.baseUrl + 'admin';


  constructor(private httpClient: HttpClient, private authService: AuthService) { }


  public doesCompanyEmailExist(email: string): boolean {
    return this.companies.filter(c => c.email.toLowerCase() === email.toLowerCase()).length > 0;
  }

  public doesNameExist(name: string): boolean {
    return this.companies.filter(c => c.name.toLowerCase() === name.toLowerCase()).length > 0;
  }

  public doesCustomerEmailExist(email: string): boolean {
    return this.customers.filter(c => c.email.toLowerCase() === email.toLowerCase()).length > 0;
  }




  public getAllCompanies(): Observable<Company[]> {
    // const headers = new HttpHeaders({Authorization: this.token});  // HttpHeaders({Authorization: this.token}, {another header},{another header etc.});
    // const options = {headers:headers};
    return this.httpClient.get<any>(this.url + "/getAllCompanies", this.getOptions()); // try without the <any> and it should work also
  }

  public updateCompany(company: Company): Observable<any> {
    return this.httpClient.put<any>(this.url + "/updateCompany", company, this.getOptions());
  }

  public deleteCompany(companyId: number): Observable<any> {
    return this.httpClient.delete<any>(this.url + "/deleteCompany/"+ companyId, this.getOptions());
  }
  // sending an Object because Company includes id and coupons and we don't send these two
  public addCompany(company: Object): Observable<any> {
    return this.httpClient.post<any>(this.url + "/addCompany", company, this.getOptions());
  }


  public getAllCustomers(): Observable<Customer[]> {
    // const headers = new HttpHeaders({Authorization: this.token});  // HttpHeaders({Authorization: this.token}, {another header},{another header etc.});
    // const options = {headers:headers};
    return this.httpClient.get<any>(this.url + "/getAllCustomers", this.getOptions()); // try without the <any> and it should work also
  }

  public updateCustomer(customer: Customer): Observable<any> {
    return this.httpClient.put<any>(this.url + "/updateCustomer", customer, this.getOptions());
  }

  public deleteCustomer(customerId: number): Observable<any> {
    return this.httpClient.delete<any>(this.url + "/deleteCustomer/"+ customerId, this.getOptions());
  }
  // sending an Object because Customer includes id and coupons and we don't send these two
  public addCustomer(customer: Object): Observable<any> {
    return this.httpClient.post<any>(this.url + "/addCustomer", customer, this.getOptions());
  }

  public restore(str: string): Observable<any> {
    return this.httpClient.post<any>(this.url + "/restore", str, this.getOptions());
  }


  public getOptions() {
    const token: string = this.authService.getToken();
    const headers = new HttpHeaders({Authorization: token});  // HttpHeaders({Authorization: this.token}, {another header},{another header etc.});
    return {headers:headers};
  }











}
