import { Component, OnInit, Input, Output, EventEmitter, DoCheck, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { environment } from 'src/environments/environment';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';
import { Image } from '../../models/image.model';

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

  @Input() image?: Image;
  @Input() imageDisabled: boolean = false;
  @Input() selectedImages?: Image[] = [];

  @Output() onImageClick = new EventEmitter<any>();
  @Output() onDelete = new EventEmitter<any>();
  @Output() onSelect = new EventEmitter<any>();

  src: string = '';
  selected: boolean = false;

  constructor() { }

  ngOnInit(): void {
    this.src = `${ environment.apiUrl }/images/${ this.image?.name }`;

    this.checkImage();
  }

  ngOnChanges(): void {
    this.checkImage();
  }

  checkImage(): void {
    console.log('selected images on check', this.selectedImages);
    
    if (this.selectedImages && this.image) {
      const selectedImage = this.selectedImages.find(inImg => inImg.name === this.image?.name);
      
      if (!selectedImage) {
        this.selected = false;
      } else {
        this.selected = true;
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
      const imageIndex: number = this.selectedImages?.findIndex(inImg => inImg.name === this.image?.name)!;
      if (imageIndex >= 0) {
        this.selectedImages?.splice(imageIndex, 1);
      }
    }

    this.onSelect.emit(this.selectedImages);
  }

}
