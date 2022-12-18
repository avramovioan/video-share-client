import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { Video } from '../models/video';

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.css']
})
export class VideoComponent  implements OnInit{

  private video: Video;
  constructor(private router: Router,
              private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.video = JSON.parse(this.route.snapshot.paramMap.get('video')!);
    console.log(this.video.title);
  }
}
