import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError, finalize } from 'rxjs';
import { LoadingService } from '../loading.service';
import { inject } from '@angular/core';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingService);
  loadingService.show();
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const errorMessage = error.error?.message || 'Server error occurred';
      console.error(errorMessage);
      return throwError(() => new Error(errorMessage));
    }),
    finalize(() => {
      loadingService.hide();
    })
  );
};
