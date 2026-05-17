import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';
import { LoadingService } from './loading.service';

export const httpLoadingInterceptor: HttpInterceptorFn = (request, next) => {
  const loading = inject(LoadingService);
  loading.start();

  // Learning Lab: Interceptors + finalize()
  // finalize() runs for success and error responses, so the global loading count cannot stay stuck.
  return next(request).pipe(finalize(() => loading.stop()));
};
