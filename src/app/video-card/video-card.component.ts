import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, TitleStrategy } from '@angular/router';
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
  video: Video;
  submitted: boolean = false;

  updateFormGroup: FormGroup;
  titleControl: FormControl;
  urlControl : FormControl;
  descriptionControl: FormControl;
  
  constructor(private router: Router,
              private videoService: VideoService,
              private formBuilder: FormBuilder){ }
  
  ngOnInit(): void {
    this.video = this.videoModel;
    this.buildUpdateForm();
  }

  get f(): any { return this.updateFormGroup.controls; }

  onDelete(): void{
    this.videoService.deleteVideo(this.video.id).subscribe({
      next: () => {
        this.deleteEvent.emit(this.video);
      }
    })
  }

  buildUpdateForm(): void{
    this.updateFormGroup = this.formBuilder.group({
      title: [this.video.title, Validators.required],
      url: [this.video.url, Validators.required],
      description: [this.video.description]
    });
    this.titleControl = this.f.title as FormControl;
    this.urlControl = this.f.url as FormControl;
    this.descriptionControl = this.f.description as FormControl;
  }

  onSubmit(): void{
    this.submitted = true;
    if(this.updateFormGroup.invalid){
      return;
    }
    const videoToUpdate: Video = {
      id: this.video.id,
      description: this.descriptionControl.value,
      url: this.urlControl.value,
      title: this.titleControl.value
    }
    this.videoService.updateVideo(videoToUpdate).subscribe({
      next: (video) => {
        this.video = video;
      },
      error: (err) => {
        alert(err.message);
      }
    })
  }

  
}
