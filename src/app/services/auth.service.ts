import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../models/user';
import { Router } from '@angular/router';
import { environment } from '../env/env';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loginUri = environment.API_URL+"user/login";
  private currentUserSubject: BehaviorSubject<User>;
  public isLoggedIn = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient, private router: Router) {                                               //{}
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(atob(localStorage.getItem('currentUser') || "e30=")));
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }
  
  recreateCurrentUser(user: User): void{
    var user_encode = btoa(JSON.stringify(user));
    localStorage.setItem('currentUser', user_encode);
    this.currentUserSubject.next(user);
  }

  login(email: string, password: string) {
    return this.http.post<User>(this.loginUri, null, {
      params: {
        email: email,
        password: password
      }
    }).pipe(map(user => {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        var credentialsEncoded = btoa(JSON.stringify(user.email+ ":" + user.password!));
        localStorage.setItem('currentUser', credentialsEncoded);
        this.currentUserSubject.next(user);
        this.isLoggedIn.next(true);
        return user;
    }));
  }
  logout() {
    // remove user from local storage and set current user to an empty one
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(new User);
    this.router.navigate(['login']);
  }

}