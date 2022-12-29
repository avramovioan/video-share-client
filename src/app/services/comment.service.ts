import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import {Comment} from '../models/comment'
import {environment} from '../env/env'


@Injectable({
  providedIn: 'root'
})
export class CommentService {

  public currentComment: BehaviorSubject<Comment>;
  private url: string = environment.API_URL+'/comment';
  constructor(private http: HttpClient) {
    this.currentComment = new BehaviorSubject(new Comment);
  }

  get currentCommentObservable(): Observable<Comment>{
    return this.currentComment.asObservable();
  }

  get currentCommentValue(): Comment{
    return this.currentComment.value;
  }

  getAllCommentsByVideoId(videoId: number, page: number, itemCount: number) : Observable<Comment[]>{
    return this.http.get<Comment[]>(`${this.url}/${videoId}`, {
      params: {
        page:page,
        itemCount: itemCount
      }
    }); 
  }
  createVideoComment(videoId: number, comment: Comment): Observable<Comment> {
    return this.http.post<Comment>(`${this.url}/${videoId}`, comment);
  }
  updateComment(comment: Comment): Observable<Comment>{
    return this.http.put<Comment>(`${this.url}/${comment.id}`, comment);
  }
  deleteComment(commentId: number): Observable<any>{
    return this.http.delete<any>(`${this.url}/${commentId}`);
  }
}
