import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-single-image',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './single-image.component.html',
  styleUrls: ['./single-image.component.scss']
})
export class SingleImageComponent implements OnInit {

  @Input() image?: string;

  @Output() onDelete = new EventEmitter<any>();

  src: string = '';

  constructor() { }

  ngOnInit(): void {
    console.log(this.image);
    this.src = `${ environment.apiUrl }/images/${ this.image }`;
  }

  toggleError(): void {
    this.src = 'assets/img/404.png';
  }

  onDeleteClick(event: any): void {
    event.stopPropagation();

    this.onDelete.emit(this.image);
  }

  openPreview(): void {
    console.log('preview');
  }

}
