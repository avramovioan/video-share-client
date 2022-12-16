import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';  
import { AuthService } from '../services/auth.service';  
import { Observable } from "rxjs";
import { Injectable } from '@angular/core';
  
  @Injectable()  
  export class TokenInterceptor implements HttpInterceptor {

    constructor(private authService: AuthService) { }
    
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add header with basic auth
        const token = localStorage.getItem('currentUesr');
        if(token != null){
            req = req.clone({
                setHeaders: { 
                    Authorization: `Basic ${localStorage.getItem('currentUser')}`
                }
            });
        }
        return next.handle(req);
    }
}