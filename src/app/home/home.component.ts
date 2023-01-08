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
    const user: User = {
      email: 'test@test.com',
      username: 'someusername',
      password: 'somepass',
      id: 0
    };
    this.userService.createUser(user).subscribe(user => {});
  }
}
