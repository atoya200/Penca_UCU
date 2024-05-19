import { LoginService } from './login.service';
import { HttpInterceptorFn } from '@angular/common/http';
import { CookieService } from "ngx-cookie-service";
import { token } from './login.service';



export class interceptor {

  constructor(private loginService: LoginService) { }

  token = this.loginService.getToken()

}

export const InterceptorInterceptor: HttpInterceptorFn = (req, next) => {

  const authToken = token;

  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${authToken}`
    }
  });

  return next(authReq);
};