import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { UserType } from 'src/app/models/user-type.model';

import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  constructor(private authService: AuthService, private title: Title) { }

  ngOnInit(): void {
    this.title.setTitle("Admin");
    if (this.getSelection() !== 'company' && this.getSelection() !== 'customer') {
      this.authService.setAdminSelection('company');
    }
  }

  public getSelection(): string {
    return this.authService.getAdminSelection();
  }

  public showCompanyCrud(): void {
    this.authService.setAdminSelection('company');
  }

  public showCustomerCrud(): void {
    this.authService.setAdminSelection('customer');
  }

  public IsUserTypeAdmin(): boolean {
    return this.authService.getUserType() === UserType.ADMINISTRATOR;
  }

  public isLoggedIn(): boolean {
    return this.authService.isLoggedIn;
  }


}
