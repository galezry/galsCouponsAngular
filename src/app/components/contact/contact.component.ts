import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { FormService } from 'src/app/services/form.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {

  constructor(private title: Title, private authService: AuthService, private router: Router,
    private formService: FormService) { }

  ngOnInit(): void {
    if (this.authService.isLoggedIn && this.authService.isUserTypeCustomer()
    && !this.authService.hasAlreadyRetrievedCustomerCouponsFromServer) {
      this.router.navigateByUrl('customer');
      return;
    }
    this.title.setTitle("Contact Us");
  }

  public isOnVacation(): boolean {
    return this.formService.isOnVacation;
  }

}
