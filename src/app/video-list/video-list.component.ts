import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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
  public searchForm: FormGroup;

  public videoTitleControl: FormControl;
  public usernameControl: FormControl;

  constructor(private videoService: VideoService,
              private router: Router,
              private formBuilder: FormBuilder) {}

  ngOnInit():void {
    this.buildForm();
    this.videoService.getVideos(0, 10).subscribe({
      next: (res) => {
        this.videos = res;
        this.videosLoaded = true;
      },
      error: (err) => alert(err.message) 
    });
  }

  get f(): any { return this.searchForm.controls; }

  ngOnDestroy(): void {
   this.videosLoaded = false;
  }

  buildForm(): void{
    this.searchForm = this.formBuilder.group({
      videoTitle: ['', Validators.required],
      username: ['', Validators.required]
  });
    this.videoTitleControl = this.f.videoTitle as FormControl;
    this.usernameControl = this.f.username as FormControl;
  }
  onSubmit(): void{
    this.videoService.searchVideos(this.f.videoTitle.value, this.f.username.value).subscribe({
      next: (data) => {
        this.videos = data;
      },
      error: (err) => {
        alert(err.message);
      }
    })
  }
}
