import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { Video } from '../models/video';
import { CommentService } from '../services/comment.service';
import { VideoService } from '../services/video.service';
import { Comment } from '../models/comment';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { User } from '../models/user';

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.css']
})
export class VideoComponent  implements OnInit{

  video: Video;
  comments: Comment[];
  isDataLoaded: boolean;
  submitted: boolean;

  addCommentFormGroup: FormGroup;
  contentControl: FormControl;

  constructor(private router: Router,
              private videoService: VideoService,
              private commentService: CommentService,
              private route: ActivatedRoute,
              private formBuilder: FormBuilder,
              private authService: AuthService) {}

  ngOnInit(): void {
    this.video = this.videoService.currentVideoValue;
    if(this.video.id == null) {
      this.route.params.subscribe({
        next: (parameters) => {
          const videoId = parameters['videoId'];
          this.videoService.getVideoById(videoId).subscribe({
            next: (video) => {
              if(video == null) this.router.navigate(['videos']);
              this.video = video;
              this.commentService.getAllCommentsByVideoId(this.video.id!, 0, 10).subscribe({
                next: (comments) => {
                  this.comments = comments;
                  this.isDataLoaded = true;
                },
                error: (err) => {
                  alert(err.message);
                }
              })
            },
            error: (err) => {
              alert(err.message);
            }
          });
        },
        error: (err) => {
          alert(err.message);
        }
      });
    }else {
      this.commentService.getAllCommentsByVideoId(this.video.id!,0, 10).subscribe({
        next: (data) => {
          this.comments = data;
          this.isDataLoaded = true;
        }
      });
    }
    this.buildCommentAddForm();
  }
  get f(): any { return this.addCommentFormGroup.controls; }

  buildCommentAddForm(): void{
    this.addCommentFormGroup = this.formBuilder.group({
      content: ['', Validators.required],
    });
    this.contentControl = this.f.content as FormControl;
  }

  onSubmit(): void{
    this.submitted = true;
    if(this.addCommentFormGroup.invalid){
      return;
    }
    const comment: Comment = {
      content: this.contentControl.value,
    }
    this.commentService.createVideoComment(this.video.id!, comment).subscribe({
      next: (comm) =>{
        this.comments.push(comm);
        this.submitted = false;
        this.buildCommentAddForm();
      },
      error: (err) => {
        alert(err.message);
      }
    });
  }

  isOwner(comment:Comment): boolean{
    const user: User = this.authService.currentUserValue;
    return comment.owner?.id == user.id || this.video.ownerId == user.id;
  }

  onCommentDelete(comment: Comment): void{
    this.commentService.deleteComment(comment.id!).subscribe({
      next: () => {
        const index = this.comments.indexOf(comment, 0);
        if(index != -1){
          this.comments.splice(index, 1);
        }
      },
      error: (err) =>{
        alert(err.message);
      }
    });
  }
}
