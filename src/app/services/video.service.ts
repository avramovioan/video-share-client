import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {Video} from '../models/video'
import {environment} from '../env/env'


@Injectable({
  providedIn: 'root'
})
export class VideoService {

  private url: string = environment.API_URL+'/video';
  constructor(private http: HttpClient) { }

  getVideos(page: number, itemCount: number) : Observable<Video[]>{
    return this.http.get<Video[]>(this.url+'/all', {
      params: {
        page:page,
        itemCount: itemCount
      }
    }); 
  }
  getMyVideos(): Observable<Video[]>{
    return this.http.get<Video[]>(this.url+'/myVideos');
  }
  createVideo(video: Video): Observable<Video> {
    return this.http.post<Video>(this.url, video);
  }
  updateVideo(video: Video): Observable<Video>{
    return this.http.put<Video>(`${this.url}/${video.id}`, video);
  }
  deleteVideo(videoId: number): Observable<any>{
    return this.http.delete<any>(`${this.url}/${videoId}`);
  }
}
