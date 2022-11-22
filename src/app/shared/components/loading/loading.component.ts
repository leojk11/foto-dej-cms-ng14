import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingService } from './service/loading.service';
import { SpinnerComponent } from './spinner/spinner.component';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [
    CommonModule,
    SpinnerComponent
  ],
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss']
})
export class LoadingComponent implements OnInit {

  display: boolean = false;

  constructor(
    public loadingService: LoadingService
  ) { }

  ngOnInit(): void {
    this.loadingService.loadingState$.subscribe({
      next: res => {
        this.display = res.display;
      }
    });
  }

}
