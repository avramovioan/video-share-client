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
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;
  private loginUri = environment.API_URL+"/login";
  private _isLoggedIn = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient, private router: Router) {                                               //{}
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(atob(localStorage.getItem('currentUser') || "e30=")));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  public get isLoggedIn(): Observable<boolean>{
    return this._isLoggedIn;
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
    let body = {
      "Email": email,
      "Password": password
    };
    return this.http.post<User>(this.loginUri, body, this.httpOptions)
        .pipe(map(user => {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            var user_encode = btoa(JSON.stringify(user));
            localStorage.setItem('currentUser', user_encode);
            this.currentUserSubject.next(user);
            this._isLoggedIn.next(true);
            return user;
        }));
  }
  logout() {
    // remove user from local storage and set current user to an empty one
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(new User);
    this._isLoggedIn.next(false);
    this.router.navigate(['login']);
  }

}