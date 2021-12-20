import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { FormService } from 'src/app/services/form.service';

@Component({
  selector: 'app-about-stack',
  templateUrl: './about-stack.component.html',
  styleUrls: ['./about-stack.component.css']
})
export class AboutStackComponent implements OnInit {

  constructor(private title: Title, private formService: FormService) { }

  ngOnInit(): void {
    this.title.setTitle("The Stack");
  }

  public isMobile(): boolean {
    return this.formService.screenWidth < 601;
  }

}
