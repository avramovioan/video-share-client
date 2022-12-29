import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Comment } from '../models/comment';
import { CommentService } from '../services/comment.service';

@Component({
  selector: 'app-comment-modal',
  templateUrl: './comment-modal.component.html',
  styleUrls: ['./comment-modal.component.css']
})
export class CommentModalComponent {
  @Output() formSubmitionEvent: EventEmitter<Comment> = new EventEmitter<Comment>();
  submitted: boolean = false;
  isDataAvailable: boolean;
  comment: Comment;

  commentUpdateGroup: FormGroup;
  contentControl: FormControl;

  constructor(private formBuilder: FormBuilder,
              private commentService: CommentService){}

  get f(): any { return this.commentUpdateGroup.controls; }

  ngOnInit(): void {
    this.commentService.currentCommentObservable.subscribe({
      next: (comment) => {
        this.comment = comment;
        this.buildUpdateForm(comment);
      }
    })
    this.isDataAvailable = true;
  }

  buildUpdateForm(comment: Comment): void{
    this.commentUpdateGroup = this.formBuilder.group({
      content: [comment.content , Validators.required]
    });
    this.contentControl = this.f.content as FormControl;
  }

  onSubmit(): void{
    this.submitted = true;
    if(this.commentUpdateGroup.invalid){
      return;
    }
    const commentToUpdate: Comment = {
      content: this.contentControl.value,
      id: this.comment.id
    }

    this.commentService.updateComment(commentToUpdate).subscribe({
      next: (comm) => {
        this.comment = comm;
        this.formSubmitionEvent.emit(this.comment);
      },
      error: (err) => {
        alert(err.message);
      }
    });
  }
}
