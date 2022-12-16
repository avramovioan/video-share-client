import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {Comment} from '../models/comment'
import {environment} from '../env/env'


@Injectable({
  providedIn: 'root'
})
export class CommentService {

  private url: string = environment.API_URL+'/comment';
  constructor(private http: HttpClient) { }

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
  updateVideo(comment: Comment): Observable<Comment>{
    return this.http.put<Comment>(`${this.url}/${comment.id}`, comment);
  }
  deleteVideo(commentId: number): Observable<any>{
    return this.http.delete<any>(`${this.url}/${commentId}`);
  }
}
