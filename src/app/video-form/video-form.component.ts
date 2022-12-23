import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Video } from '../models/video';
import { VideoService } from '../services/video.service';

@Component({
  selector: 'app-video-form',
  templateUrl: './video-form.component.html',
  styleUrls: ['./video-form.component.css']
})
export class VideoFormComponent implements OnInit {

  @Output() formSubmitionEvent: EventEmitter<Video> = new EventEmitter<Video>();
  submitted: boolean = false;
  isDataAvailable: boolean;
  video: Video;

  videoFormGroup: FormGroup;
  titleControl: FormControl;
  urlControl : FormControl;
  descriptionControl: FormControl;

  constructor(private formBuilder: FormBuilder,
              private videoService: VideoService){}

  get f(): any { return this.videoFormGroup.controls; }

  ngOnInit(): void {
    this.videoService.currentVideoObservable.subscribe({
      next: (video) => {
        this.video = video;
        this.buildUpdateForm(video);
      }
    })
    this.isDataAvailable = true;
  }

  buildUpdateForm(video: Video): void{
    this.videoFormGroup = this.formBuilder.group({
      title: [video == null ? '' : video.title , Validators.required],
      url: [video == null ? '' : video.url, Validators.required],
      description: [video == null ? '' : video.description]
    });
    this.titleControl = this.f.title as FormControl;
    this.urlControl = this.f.url as FormControl;
    this.descriptionControl = this.f.description as FormControl;
  }

  onSubmit(): void{
    this.submitted = true;
    if(this.videoFormGroup.invalid){
      return;
    }
    const videoToProcess: Video = {
      description: this.descriptionControl.value,
      url: this.urlControl.value,
      title: this.titleControl.value
    }
    if(this.video.id == undefined) {
      this.videoService.createVideo(videoToProcess).subscribe({
        next: (video) => {
          this.video = video;
          this.formSubmitionEvent.emit(this.video);
          return;
        },
        error: (err) => {
          alert(err.message);
        }
      });
    } else {
      videoToProcess.id = this.video.id;
      this.videoService.updateVideo(videoToProcess).subscribe({
        next: (video) => {
          this.video = video;
          this.formSubmitionEvent.emit(this.video);
          return;
        },
        error: (err) => {
          alert(err.message);
        }
      });
    }
  }

}
