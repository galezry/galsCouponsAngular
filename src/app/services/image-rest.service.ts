import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ImageRestService {

  // private url: string = 'http://localhost:8080/image';
  private url: string = environment.baseUrl + 'image';


  constructor(private httpClient: HttpClient, private authService: AuthService) { }

  public addImage(imgData: FormData, couponId: number, companyId: number): Observable<any> {
    return this.httpClient.post<any>(this.url + "/addImage/"+ couponId + "/" + companyId,
    imgData, this.getOptions());
  }

  public updateImage(imgData: FormData, couponId: number, companyId: number): Observable<any> {
    return this.httpClient.put<any>(this.url + "/updateImage/"+ couponId + "/" + companyId,
    imgData, this.getOptions());
  }

  public getOneImage(couponId: number): Observable<any> {
    return this.httpClient.get<any>(this.url + "/getOneImage/"+ couponId, this.getOptions());
  }

  public deleteImage(couponId: number): Observable<any> {
    return this.httpClient.delete<any>(this.url + "/deleteImage/"+ couponId, this.getOptions());
  }

  public getCompanyImages(companyId: number): Observable<any[]> {
    return this.httpClient.get<any>(this.url + "/getCompanyImages/"+ companyId, this.getOptions());
  }


  public getOptions() {
    const token: string = this.authService.getToken();
    const headers = new HttpHeaders({Authorization: token});  // HttpHeaders({Authorization: this.token}, {another header},{another header etc.});
    return {headers:headers};
  }



}
