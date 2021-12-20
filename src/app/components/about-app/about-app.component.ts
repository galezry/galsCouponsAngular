import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-about-app',
  templateUrl: './about-app.component.html',
  styleUrls: ['./about-app.component.css']
})
export class AboutAppComponent implements OnInit {

  constructor(private title: Title) { }

  ngOnInit(): void {
    this.title.setTitle("The App");

  }

}
