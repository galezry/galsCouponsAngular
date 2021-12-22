import { Component, Input, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AdminRestService } from 'src/app/services/admin-rest.service';
import { AuthService } from 'src/app/services/auth.service';
import { CompanyRestService } from 'src/app/services/company-rest.service';
import { CustomerRestService } from 'src/app/services/customer-rest.service';
import { FormService } from 'src/app/services/form.service';
import { WelcomeRestService } from 'src/app/services/welcome-rest.service';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit {



  @Input()
  public successfullySignedOutMessage: string = 'You have successfully signed out';
  // public itemLeftInCartMsg: string = 'There are items in your cart';
  // public doesUserChooseToEmptyCart: boolean = false;

  // no need for this - no website ask if we want to save cart they just save it

  constructor(private welcomeRestService: WelcomeRestService,
    private authService: AuthService, private formService: FormService) { }

  ngOnInit(): void {
  }

  public isSignedOutMsgShown(): boolean {
    let currentTime: number = new Date().getTime();
    if (currentTime >  this.welcomeRestService.currentTime + 10000) {
      this.welcomeRestService.isSignedOutMsgShown = false;
    }
    return this.welcomeRestService.isSignedOutMsgShown;
  }

  public hideSignOutMsg(): void {
    this.welcomeRestService.isSignedOutMsgShown = false;
  }

  public isWelcomeMsgShown(): boolean {
    let currentTime: number = new Date().getTime();
    if (currentTime >  this.authService.currentTime + 15000) {
      this.authService.isWelcomeMsgShown = false;
    }
    return this.authService.isWelcomeMsgShown;
  }

  public getWelcomeMsg(): string {
    let name: string = this.authService.getName();
    // let suff = ", hope you're doing well!";
    let suff = "!";
    let greeting: string = '';
    let currentHour: number = new Date().getHours();
    if (currentHour >= 3 && currentHour < 12) {
      greeting = 'Good Morning';
    } else if (currentHour >= 12 && currentHour < 17) {
      greeting = 'Good Afternoon';
    } else {
      greeting = 'Good Evening';
    }
    // if (this.authService.getUser() === 'company') {
    //   suff ='';
    // }
    return greeting + ' ' + name + suff;
  }

  public hideWelcomeMsg(): void {
    this.authService.isWelcomeMsgShown = false;
  }

  public isVPWidthSmall(): boolean {
    return this.formService.screenWidth < 1200;
  }

  public isMobile(): boolean {
    return this.formService.getScreenType() === 'mobile';
  }




  // public isCartNotEmptyMsgShown(): boolean {
  //   return this.authService.isCartNotEmptyMsgShown;
  // }

  // public cancelSignOut(): void {
  //   this.authService.isCartNotEmptyMsgShown = false;
  //   console.log(this.doesUserChooseToEmptyCart);
  // }

  // public signOutAnyway(): void {
  //   console.log(this.doesUserChooseToEmptyCart);
  //   this.authService.isCartNotEmptyMsgShown = false;
  //   if (this.title.getTitle() !== 'Login') {
  //     this.router.navigateByUrl('home');
  //   }
  //   this.adminRestService.companies.splice(0);
  //   this.adminRestService.customers.splice(0);
  //   this.companyRestService.imagesToDisplay = [];
  //   this.customerRestService.imagesToDisplay = [];
  //   this.welcomeRestService.userSignOut();
  //   this.authService.signOut();
  // }



}
