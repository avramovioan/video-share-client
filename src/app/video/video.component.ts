import { Component, OnInit, ViewChild } from '@angular/core';
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

  @ViewChild('updateCommentModal') closeUpdateModalbutton: any;

  video: Video;
  comments: Comment[];
  isDataLoaded: boolean;
  submitted: boolean;
  updateSubmitted: boolean;

  addCommentFormGroup: FormGroup;
  updateCommentFormGroup: FormGroup;
  contentControl: FormControl;


  constructor(private router: Router,
              private videoService: VideoService,
              private commentService: CommentService,
              private route: ActivatedRoute,
              private formBuilder: FormBuilder,
              private authService: AuthService) {}

  ngOnInit(): void {
      //this.video = this.videoService.currentVideoValue;
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
    this.buildCommentAddForm();
  }
  
  get _add_form(): any { return this.addCommentFormGroup.controls; }
  get _update_form(): any { return this.updateCommentFormGroup.controls; }

  buildCommentAddForm(): void{
    this.addCommentFormGroup = this.formBuilder.group({
      content: ['', Validators.required],
    });
    this.contentControl = this._add_form.content as FormControl;
  }

  buildCommentUpdateForm(comment: Comment): FormGroup{
    this.updateCommentFormGroup = this.formBuilder.group({
      content: [comment.content, Validators.required],
    });
    return this.updateCommentFormGroup;
  }

  onCommentUpdate(commentToUpdate: Comment): void{
    this.updateSubmitted = true;
    if(this.updateCommentFormGroup.invalid){
      return;
    }
    commentToUpdate.content = this._update_form.content.value;
    this.commentService.updateComment(commentToUpdate).subscribe({
      next: (comment) => {
        commentToUpdate = comment;
        this.updateSubmitted = false;
        const current = this.comments.find(c => c.id == commentToUpdate.id);
        if(current!= null) {
          const index = this.comments.indexOf(current, 0);
          if(index != -1){
            this.comments[index] = commentToUpdate;
          }
        }
      },
      error: (err) => {
        alert(err.message);
      }
    })
  }

  onAddSubmit(): void{
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

  canDelete(comment:Comment): boolean{
    const user: User = this.authService.currentUserValue;
    return comment.owner?.id == user.id || this.video.ownerId == user.id;
  }

  canUpdate(comment:Comment): boolean{
    const user: User = this.authService.currentUserValue;
    return comment.owner?.id == user.id;
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

  onFormUpdateSubmit(comment: Comment): void{
    const comm = this.comments.find(c => c.id == comment.id);
    if(comm != undefined){
      const index = this.comments.indexOf(comm); 
      if (index != -1){
        this.comments[index] = comment;
      }
    }
    this.closeUpdateModalbutton.nativeElement.click();
  }

  onUpdateCommentClick(comment: Comment): void {
    this.commentService.currentComment.next(comment);
  }
}
