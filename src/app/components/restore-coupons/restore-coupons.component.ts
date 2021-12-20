import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { UserType } from 'src/app/models/user-type.model';
import { AdminRestService } from 'src/app/services/admin-rest.service';
import { AuthService } from 'src/app/services/auth.service';
import { CompanyRestService } from 'src/app/services/company-rest.service';
import { FormService } from 'src/app/services/form.service';

@Component({
  selector: 'app-restore-coupons',
  templateUrl: './restore-coupons.component.html',
  styleUrls: ['./restore-coupons.component.css']
})
export class RestoreCouponsComponent implements OnInit {

  public isErrMsgShown: boolean = false;
  public errMsg: string = '';
  public isSuccessMsgShown: boolean = false;
  public successMsg: string = '';

  constructor(private authService: AuthService, private title: Title,
    private companyRestService: CompanyRestService, private formService: FormService) { }

  ngOnInit(): void {
    this.title.setTitle("Restore");
  }

  public IsUserTypeCompany(): boolean {
    return this.authService.getUser() === 'company';
  }

  public isLoggedIn(): boolean {
    return this.authService.isLoggedIn;
  }

  public restore(): void {
    this.companyRestService.restore('anything').subscribe(response => {
      console.log(response);
      this.authService.hasAlreadyRetrievedCouponsFromServer = false;
      this.isSuccessMsgShown = true;
      this.successMsg = 'The initial Coupons have been restored successfully';

    }, err => {
      console.log(err.error); // TODO delete this line
      this.showErrMsg(err);
    });
  }

  public showErrMsg(err: any) {
    this.isErrMsgShown = true;
    this.errMsg = this.authService.connectionToServerAndLoginCheck(err);
  }

}
