import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-file-to-upload',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './file-to-upload.component.html'
})
export class FileToUploadComponent implements OnInit {

  @Input() file?: { name: string, size: string };

  @Output() onRemove = new EventEmitter<any>();

  constructor() { }

  ngOnInit(): void {
  }

}
