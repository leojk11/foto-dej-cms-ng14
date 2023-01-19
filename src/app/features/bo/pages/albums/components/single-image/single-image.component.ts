import { Component, OnInit, Input, Output, EventEmitter, DoCheck, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { environment } from 'src/environments/environment';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-single-image',
  standalone: true,
  imports: [
    CommonModule,
    CheckboxModule,
    FormsModule
  ],
  templateUrl: './single-image.component.html',
  styleUrls: ['./single-image.component.scss']
})
export class SingleImageComponent implements OnInit, OnChanges {

  @Input() image?: string;
  @Input() imageDisabled: boolean = false;
  @Input() selectedImages?: string[] = [];

  @Output() onImageClick = new EventEmitter<any>();
  @Output() onDelete = new EventEmitter<any>();
  @Output() onSelect = new EventEmitter<any>();

  src: string = '';
  selected: boolean = false;

  constructor() { }

  ngOnInit(): void {
    this.src = `${ environment.apiUrl }/images/${ this.image }`;
  }

  ngOnChanges(): void {
    if (this.selectedImages && this.image) {
      if (!this.selectedImages.includes(this.image)) {
        this.selected = false;
      }
    }
  }

  toggleError(): void {
    this.src = 'assets/img/404.png';
  }

  onDeleteClick(event: any): void {
    event.stopPropagation();

    this.onDelete.emit(this.image);
  }

  openPreview(): void {
    this.onImageClick.emit(this.src);
  }

  onCheckboxClick(event: any): void {
    event.stopPropagation();

    if (this.selected) {
      if (this.image) {
        this.selectedImages?.push(this.image);
      }
    } else {
      const imageIndex = this.selectedImages?.findIndex(inImg => inImg === this.image);
      if (imageIndex && imageIndex >= 0) {
        this.selectedImages?.splice(imageIndex, 1);
      }
    }

    this.onSelect.emit(this.selectedImages);
  }

}
