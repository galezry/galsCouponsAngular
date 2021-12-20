import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { FormState } from 'src/app/models/form-state.model';
import { UserType } from 'src/app/models/user-type.model';
import { AuthService } from 'src/app/services/auth.service';
import { CompanyRestService } from 'src/app/services/company-rest.service';
import { FormService } from 'src/app/services/form.service';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css']
})
export class CompanyComponent implements OnInit {

  constructor(private title: Title, private authService: AuthService,
    private formService: FormService, private companyRestService: CompanyRestService) { }

  ngOnInit(): void {
    this.title.setTitle("Company");
  }

  public isProfileSelected(): boolean {
    return this.authService.isCompanyProfileSelected;
  }

  public showCouponCrud(): void {
    this.authService.isCompanyProfileSelected = false;
    this.title.setTitle("Company");
  }

  public showCompanyProfile(): void {
    this.authService.isCompanyProfileSelected = true;
    this.formService.companyForm = FormState.UPDATE;
    this.formService.company =  Object.assign({}, this.formService.currentLoggedInCompany);
  }

  public isUserTypeCompany(): boolean {
    return this.authService.getUserType() === UserType.COMPANY;
  }

  public isLoggedIn(): boolean {
    return this.authService.isLoggedIn;
  }

}
