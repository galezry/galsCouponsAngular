import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormService } from 'src/app/services/form.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  constructor(private router: Router, private formService: FormService) { }

  ngOnInit(): void {
  }

  public getScreenWidth(): number {
    return this.formService.screenWidth;
  }



  // public gotoContact(): void {
  //   this.router.navigateByUrl('contact');
  // }

}
