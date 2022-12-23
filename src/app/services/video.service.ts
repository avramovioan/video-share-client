import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Video} from '../models/video'
import {environment} from '../env/env'
import { BehaviorSubject, Observable } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class VideoService {

  public currentVideo: BehaviorSubject<Video>;

  private url: string = environment.API_URL+'/video';
  constructor(private http: HttpClient) {
    this.currentVideo = new BehaviorSubject(new Video);
   }

  get currentVideoValue(): Observable<Video>{
    return this.currentVideo.asObservable();
  }

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
