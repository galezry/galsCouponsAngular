import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-about-team',
  templateUrl: './about-team.component.html',
  styleUrls: ['./about-team.component.css']
})
export class AboutTeamComponent implements OnInit {

  constructor(private title: Title) { }

  ngOnInit(): void {
    this.title.setTitle("Our Team");
  }

}
