import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-page404',
  templateUrl: './page404.component.html',
  styleUrls: ['./page404.component.css']
})
export class Page404Component implements OnInit {

  public rand: number = Math.floor(Math.random() * 3) + 1; // rand num btwn 1-3

  public mixedCouponsMsg: string = 'Oops... Looks like our coupons have been mixed up';
  public nowhereLandMsg: string = "Oops... Looks like we've touched down in Nowhere Land";
  public desertIslandMsg: string = "Oops... Looks like we've touched down in a desert island";

  constructor(private title: Title, private router: Router,
    private authService: AuthService) { }

  ngOnInit(): void {
    this.title.setTitle("Oops");
  }

  public getUser(): string {
    return this.authService.getUser();
  }

  public getBgImgClass(): string {
    switch (this.rand) {
      case 1:
        return 'entire-page bg-img1';
      case 2:
        return 'entire-page bg-img2';
      default:
        return 'entire-page bg-img3';
    }
  }

  public getMsg(): string {
    switch (this.rand) {
      case 1:
        return this.mixedCouponsMsg;
      case 2:
        return this.nowhereLandMsg;
      default:
        return this.desertIslandMsg;
    }
  }

  public getMsgColor(): string {
    switch (this.rand) {
      case 2:
        return 'color: rgb(58, 91, 25);';
      default:
        return 'color: green';
    }
  }

  public gotoHome(): void {
    this.router.navigateByUrl('home');
  }

  public getSecondOption(): string {
    switch (this.getUser()) {
      case 'admin':
        return 'Admin Page';
      case 'company':
        return "Company Page";
      case 'customer':
        return "Customer Page";
      default:
        return "Sign In";
    }
  }

  public goToUserPage(): void {
    switch (this.getUser()) {
      case 'admin':
        this.router.navigateByUrl('admin');
        break;

      case 'company':
        this.router.navigateByUrl('company');
        break;

      case 'customer':
        this.router.navigateByUrl('customer');
        break;

      default:
        this.router.navigateByUrl('login');
    }
  }

  public getCurrentUrl(): string {
    const prefix = 'https://gal-coupons.herokuapp.com';
    return prefix + this.router.url;
  }

  public getHref(): string {
    return "mailto:galezry@gmail.com?subject=About a URL I've tried&body=Hi, About this URL:  "
    + this.getCurrentUrl();
  }






 // public getImg(): string {
  //   const srcPre: string = '../../../assets/images/img404/';
  //   let srcSuff: string = '';
  //   switch (this.rand) {
  //     case 1:
  //       srcSuff = 'mixed-coupons.jpeg';
  //       break;
  //     case 2:
  //       srcSuff = 'desert-island2.jpeg';
  //       break;
  //     default:
  //       srcSuff = 'help-island.jpeg';
  //       break;
  //   }
  //   let src = srcPre + srcSuff;
  //   return src;
  // }



  // public getImgWidth(): string {
  //   const pre: string = 'width: ';
  //   let suff: string = '';
  //   switch (this.rand) {
  //     case 1:
  //       suff = '40%';
  //       break;
  //     case 2:
  //       suff = '35%';
  //       break;
  //     default:
  //       suff = '50%';
  //       break;
  //   }
  //   return pre + suff;
  // }


}
