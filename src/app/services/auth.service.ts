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
  private loginUri = environment.API_URL+"/user/login";
  private currentUserSubject: BehaviorSubject<User>;
  private isLogged = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient, private router: Router) {
    const user = localStorage.getItem('currentUser');
    this.currentUserSubject = new BehaviorSubject<User>(
      user === null ?
      null :
      JSON.parse(user!)
    )
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  public get isLoggedIn(): boolean{
    const token = localStorage.getItem('token');
    this.isLogged.next(!(token === null));
    return this.isLogged.value;
  }
  
  recreateCurrentUser(user: User): void{
    var user_encode = JSON.stringify(user);
    localStorage.setItem('currentUser', user_encode);
    this.currentUserSubject.next(user);
  }

  login(email: string, password: string): Observable<User> {
    return this.http.post<User>(this.loginUri, null, {
      params: {
        email: email,
        password: password
      }
    }).pipe(map(user => {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        var credentialsEncoded = btoa(JSON.stringify(`${user.email}:${password!}`));
        const _user = JSON.stringify(user);
        localStorage.setItem('token', credentialsEncoded);
        localStorage.setItem('currentUser', _user)
        this.currentUserSubject.next(user);
        this.isLogged.next(true);
        return user;
    }));
  }
  logout() {
    // remove user from local storage and set current user to an empty one
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    this.currentUserSubject.next(new User);
    this.router.navigate(['login']);
  }

}