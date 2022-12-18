import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Video } from '../models/video';

@Component({
  selector: 'app-video-card',
  templateUrl: './video-card.component.html',
  styleUrls: ['./video-card.component.css']
})
export class VideoCardComponent  {
  
  constructor(private router: Router){ }
  @Input() videoModel: Video;
  @Input() profileView: boolean;
  video: Video;
  
  ngOnInit(): void {
    this.video = this.videoModel;
  }
  
  onClick(): void{
    this.router.navigate([`/${this.video.id}`, {video: this.video}]);
  }
  
}
