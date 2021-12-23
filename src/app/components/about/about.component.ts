import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { FormService } from 'src/app/services/form.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  constructor(private title: Title, private authService: AuthService, private router: Router,
    private formService: FormService) { }

  ngOnInit(): void {
    if (this.authService.isLoggedIn && this.authService.isUserTypeCustomer()
    && !this.authService.hasAlreadyRetrievedCustomerCouponsFromServer) {
      this.router.navigateByUrl('customer');
      return;
    }
    this.title.setTitle("About Us");
    if (this.getSelection() !== 'stack' && this.getSelection() !== 'team') {
      this.showAboutApp();
    }
  }

  public getSelection(): string {
    return this.authService.getAboutSelection();
  }

  public showAboutApp(): void {
    this.authService.setAboutSelection('app');
  }

  public showAboutStack(): void {
    this.authService.setAboutSelection('stack');
  }

  public showAboutTeam(): void {
    this.authService.setAboutSelection('team');
  }


  public isMobile(): boolean {
    return this.formService.getScreenType() === 'mobile';
  }



}
