import { Component, OnInit, Input, Output, EventEmitter, OnChanges, ChangeDetectionStrategy } from '@angular/core';

import { environment } from 'src/environments/environment';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';
import { Image } from '../../models/image.model';

@Component({
    selector: 'app-single-image',
    imports: [
    CheckboxModule,
    FormsModule
],
    changeDetection: ChangeDetectionStrategy.Eager,
    templateUrl: './single-image.component.html'
})
export class SingleImageComponent implements OnInit, OnChanges {

  @Input() image?: Image;
  @Input() imageDisabled: boolean = false;
  @Input() selectedImages?: Image[] = [];
  @Input() selectedAdminImages: Image[] = [];
  @Input() albumId: string = '';
  @Input() isAdmin: boolean = true;

  @Output() onImageClick = new EventEmitter<any>();
  @Output() onDelete = new EventEmitter<any>();
  @Output() onSelect = new EventEmitter<any>();

  src: string = '';
  selected: boolean = false;

  constructor() { }

  ngOnInit(): void {
    this.src = `${ environment.apiUrl }/images/album_image/${ this.albumId }/${ this.image?.name }`;

    this.checkImage();
  }

  ngOnChanges(): void {
    this.checkImage();
  }

  checkImage(): void {
    if (this.isAdmin) {
      if (this.selectedAdminImages && this.image) {
        const selectedImage = this.selectedAdminImages.find(inImg => inImg.name === this.image?.name);
  
        if (!selectedImage) {
          this.selected = false;
        } else {
          this.selected = true;
        }
      }
    } else {
      if (this.selectedImages && this.image) {
        const selectedImage = this.selectedImages.find(inImg => inImg.name === this.image?.name);
  
        if (!selectedImage) {
          this.selected = false;
        } else {
          this.selected = true;
        }
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
        if (this.isAdmin) {
          this.selectedAdminImages.push(this.image);
        } else {
          this.selectedImages?.push(this.image);
        }
      }
    } else {
      if (this.isAdmin) {
        const imageIndex: number = this.selectedAdminImages?.findIndex(inImg => inImg.name === this.image?.name)!;
        if (imageIndex >= 0) {
          this.selectedAdminImages?.splice(imageIndex, 1);
        }
      } else {
        const imageIndex: number = this.selectedImages?.findIndex(inImg => inImg.name === this.image?.name)!;
        if (imageIndex >= 0) {
          this.selectedImages?.splice(imageIndex, 1);
        }
      }
    }

    if (this.isAdmin) {
      this.onSelect.emit(this.selectedAdminImages);
    } else {
      this.onSelect.emit(this.selectedImages);
    }
  }

}
