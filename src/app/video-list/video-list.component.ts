import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Video } from '../models/video';
import { VideoService } from '../services/video.service';

@Component({
  selector: 'app-video-list',
  templateUrl: './video-list.component.html',
  styleUrls: ['./video-list.component.css']
})
export class VideoListComponent implements OnInit, OnDestroy{


  public videos: Video[];
  public videosLoaded: boolean;

  constructor(private videoService: VideoService,
              private router: Router) {}

  ngOnInit():void {
    this.videoService.getVideos(0, 10).subscribe({
      next: (res) => {
        this.videos = res;
        this.videosLoaded = true;
      },
      error: (err) => alert(err.message) 
    });
  }
  ngOnDestroy(): void {
   this.videosLoaded = false;
  }
}
