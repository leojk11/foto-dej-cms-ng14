import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-album-upload',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './album-upload.component.html',
  styleUrls: ['./album-upload.component.scss']
})
export class AlbumUploadComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
