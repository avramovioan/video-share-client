import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../models/user';
import { Video } from '../models/video';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { VideoService } from '../services/video.service';
import { MustMatch } from '../shared/form.validator';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  @ViewChild('closeCreateModalbutton') closeCreateModalbutton: any;
  @ViewChild('closeUpdateModalbutton') closeUpdateModalbutton: any;
  @ViewChild('openModal') openModal: any;

  updateAccountForm: FormGroup;
  emailControl: FormControl;
  usernameControl: FormControl;
  newPasswordControl:FormControl;
  newPassword_confirmControl: FormControl;
  oldPassword_Control: FormControl;
  videos: Video[] = [];

  currentUser: User;

  isDataAvailable: boolean;

  constructor(private formBuilder: FormBuilder,
              private authService: AuthService,
              private userService: UserService,
              private videoService: VideoService,
              private router: Router
              ) { }

  ngOnInit(): void {
    this.currentUser = this.authService.currentUserValue;
    this.buildForm();
    this.loadVideos();
    this.isDataAvailable = true;
  }

  buildForm(): void {
    this.updateAccountForm = this.formBuilder.group({
      email: [this.currentUser.email, Validators.required],
      username: [this.currentUser.username, Validators.required],
      new_password: [''],
      confirm_new_password: [''],
      current_password: ['', Validators.required]

  },{
    validator: MustMatch('new_password', 'confirm_new_password')
  });
    this.emailControl = this.updateAccountForm.controls['email'] as FormControl;
    this.usernameControl = this.updateAccountForm.controls['username'] as FormControl;
    this.newPasswordControl = this.updateAccountForm.controls['new_password'] as FormControl;
    this.newPassword_confirmControl = this.updateAccountForm.controls['confirm_new_password'] as FormControl;
    this.oldPassword_Control = this.updateAccountForm.controls['current_password'] as FormControl;
  }

  loadVideos(): void{
    this.videoService.getMyVideos().subscribe(
      {
        next: (videos) => {
          this.videos = videos;
        },
        error: (error) => {
          alert(error.message);
        }
      }
    )
  }
  
  onSubmit(): void{
    //check if new password is provided
    if(this.newPasswordControl.value.lenght != 0){
      this.newPassword_confirmControl.markAsTouched();
    }
    const userToUpdate: User = {
      email: this.emailControl.value,
      username: this.usernameControl.value,
      password: this.newPasswordControl.value.lenght != 0 ? this.newPasswordControl.value : ''
    }
    this.userService.updateUser(userToUpdate).subscribe({
      next: (updatedUser) => {
        if(updatedUser){
          this.currentUser.email = updatedUser.email;
          this.currentUser.username = updatedUser.username;
          this.authService.recreateCurrentUser(updatedUser);
          this.reloadPage();
        }
      },
      error: (message) => {
        alert(message);
      }
    });
  }

  onDelete(): void{
    this.userService.deleteUser().subscribe({
      next: () => {
        this.authService.logout();
      },
      error: (err) => {
        alert(err.message);
        return;
      }
    })
  }

  onLogout(): void{
    this.authService.logout();
  }

  reloadPage() {
    const currentUrl = this.router.url;
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
        this.router.navigate([currentUrl]);
    });
  }

  removeItem(videoToDelete: Video): void{
    const videoIndex = this.videos.indexOf(videoToDelete);
    if(videoIndex != -1){
      this.videos.splice(videoIndex,1);
    }
  }

  updateItem(videoToUpdate:Video): void{
    this.openModal.nativeElement.click();
  }

  onFormSubmit(video: Video){
    this.videos.push(video);
    this.closeCreateModalbutton.nativeElement.click();
  }

  onFormUpdateSubmit(video: Video): void{
    const vid = this.videos.find(v => v.id == video.id);
    if(vid != undefined){
      const index = this.videos.indexOf(vid); 
      if (index != -1){
        this.videos[index] = video;
      }
    }
    this.closeUpdateModalbutton.nativeElement.click();
  }

  onAddVideoClick(): void{
    this.videoService.currentVideo.next(new Video);
  }
}