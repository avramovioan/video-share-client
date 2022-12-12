import { Component } from '@angular/core';
import { User } from '../models/user';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  constructor(private userService: UserService)
  {}

  public OnClickRegister(): void{
    console.log("test");
    const user: User = {
      email: 'test@test.com',
      username: 'someusername',
      password: 'somepass',
      id: 0
    };
    this.userService.createUser(user).subscribe(user => {
      console.log(user.email);
      console.log(user.id);
    });
  }
}
