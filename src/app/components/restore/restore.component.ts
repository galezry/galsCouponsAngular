import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { UserType } from 'src/app/models/user-type.model';
import { AdminRestService } from 'src/app/services/admin-rest.service';
import { AuthService } from 'src/app/services/auth.service';
import { FormService } from 'src/app/services/form.service';

@Component({
  selector: 'app-restore',
  templateUrl: './restore.component.html',
  styleUrls: ['./restore.component.css']
})
export class RestoreComponent implements OnInit {

  public isErrMsgShown: boolean = false;
  public errMsg: string = '';
  public isSuccessMsgShown: boolean = false;
  public successMsg: string = '';

  constructor(private authService: AuthService, private title: Title,
    private adminRestService: AdminRestService, private formService: FormService) { }

  ngOnInit(): void {
    this.title.setTitle("Restore");
  }

  public IsUserTypeAdmin(): boolean {
    return this.authService.getUserType() === UserType.ADMINISTRATOR;
  }

  public isLoggedIn(): boolean {
    return this.authService.isLoggedIn;
  }

  public restore() {
    this.adminRestService.restore('anything').subscribe(response => {
      console.log(response);
      this.authService.hasAlreadyRetrievedCompaniesFromServer = false;
      this.authService.hasAlreadyRetrievedCustomersFromServer = false;
      this.isSuccessMsgShown = true;
      this.successMsg = 'Companies and customers have been restored successfully';
// Companies, customers and coupons have been restored successfully
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
