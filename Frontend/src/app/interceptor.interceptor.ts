import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest
} from '@angular/common/http';
import { HttpInterceptorFn } from '@angular/common/http';

import { Observable } from 'rxjs';
import { LoginService } from './login.service';
/** Pass untouched request through to the next request handler. */
@Injectable()
export class InterceptorInterceptor implements HttpInterceptor {
  constructor(private loginService: LoginService) { }
  /*
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const reqCopy = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${"TOKENNNNNNNNNNNNN"}`),
    })
    console.log("Request:" + reqCopy)
    return next.handle(reqCopy);

  }*/
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    // Get the auth token from the service.
    const authToken = "TOKENNNN";
    debugger
    // Clone the request and replace the original headers with
    // cloned headers, updated with the authorization.
    const authReq = req.clone({
      headers: req.headers.set('Authorization', authToken)
    });

    // send cloned request with header to the next handler.
    return next.handle(authReq);
  }
}

/*import { HttpInterceptorFn } from '@angular/common/http';

export const interceptorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req);
};*/


/*
import { Injectable } from '@angular/core';

import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginService } from './login.service';

@Injectable()
export class InterceptorInterceptor implements HttpInterceptor {

  constructor(private loginService: LoginService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    debugger
    if (this.loginService.isLoggedIn()) {
      const reqCopy = request.clone({
        setHeaders: {
          'authorization': 'Bearer ' + this.loginService.getToken(),
        },
      })
      console.log(reqCopy)
      return next.handle(reqCopy);

    } else {
      return next.handle(request);
    }

  }
}
*/