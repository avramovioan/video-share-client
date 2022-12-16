import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable} from 'rxjs';
import {User} from '../models/user'
import {environment} from '../env/env'


@Injectable({
  providedIn: 'root'
})
export class UserService {

  private url: string = environment.API_URL+'/user';
  constructor(private http: HttpClient) { }

  getUsers() : Observable<User[]>{
    return this.http.get<User[]>(this.url+'/all');
  }
  createUser(user: User): Observable<User> {
    return this.http.post<User>(this.url+'/register', null, {
      params: {
        email: user.email,
        username: user.username,
        password: user.password!
      }
    });
  }
  updateUser(user: any): Observable<User>{
    return this.http.put<User>(this.url, user);
  }
  deleteUser(user_id: number): Observable<boolean>{
    return this.http.delete<boolean>(`${this.url}/${user_id}`);
  }
}
