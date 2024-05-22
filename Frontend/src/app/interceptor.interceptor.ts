import { LoginService } from './login.service';
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';



export class interceptor {

  constructor(private loginService: LoginService) { }

}

export let InterceptorInterceptor: HttpInterceptorFn = (req, next) => {
  const loginservice = inject(LoginService);

  const authToken = loginservice.getToken();
  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${authToken}`
    }
  });

  return next(authReq);
};