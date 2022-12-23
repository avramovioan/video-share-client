import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Video } from '../models/video';
import { VideoService } from '../services/video.service';

@Component({
  selector: 'app-video-card',
  templateUrl: './video-card.component.html',
  styleUrls: ['./video-card.component.css']
})
export class VideoCardComponent implements OnInit {
  @Input() videoModel: Video;
  @Input() profileView: boolean = false;
  @Output() deleteEvent: EventEmitter<Video> = new EventEmitter<Video>();
  @Output() updateEvent: EventEmitter<Video> = new EventEmitter<Video>();
  @ViewChild('closebutton') closebutton: any;
 
  video: Video;
  isDataAvailable: boolean;
    
  constructor(private videoService: VideoService,
              private router: Router,
              private route: ActivatedRoute){ }
  
  ngOnInit(): void {
    this.video = this.videoModel;
    this.isDataAvailable = true;
  }

  onDelete(): void{
    this.videoService.deleteVideo(this.video.id!).subscribe({
      next: () => {
        this.deleteEvent.emit(this.video);
      }
    })
  }

  onUpdateClick(): void{
    this.videoService.currentVideo.next(this.video);
    this.updateEvent.emit(this.video);
  }

  onVideoOpen(): void{
    this.videoService.currentVideo.next(this.video);
    this.router.navigate([`videos/${this.video.id}`]);
  } 
}
