import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-empty-view',
  templateUrl: './empty-view.component.html',
  styleUrls: ['./empty-view.component.css']
})
export class EmptyViewComponent implements OnInit {


  @Input()
  public message?: string;

  @Input()
  public imageSrc: string = "../../../assets/images/empty-box.jpeg";

  @Input()
  public imageAlt: string = "empty box";

  @Input()
  public imgWidth: string = 'width: 22%;';

  constructor() { }

  ngOnInit(): void {
  }



}
