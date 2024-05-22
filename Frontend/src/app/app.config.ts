import { ApplicationConfig } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { InterceptorProvider } from './interceptor.provider';
import { InterceptorInterceptor } from './interceptor.interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { withInterceptors } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideHttpClient(withInterceptors([InterceptorInterceptor]))]


};
