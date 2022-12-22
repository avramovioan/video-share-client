import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';    
import { Observable } from "rxjs";
import { Injectable } from '@angular/core';
  
  @Injectable()  
  export class TokenInterceptor implements HttpInterceptor {

    constructor() { }
    
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add header with basic auth
        const token = localStorage.getItem('token');
        if(token != null){
            req = req.clone({
                setHeaders: { 
                    Authorization: `Basic ${token}`
                }
            });
        }
        return next.handle(req);
    }
}