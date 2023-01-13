import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-front-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './front-footer.component.html',
  styleUrls: ['./front-footer.component.scss']
})
export class FrontFooterComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
