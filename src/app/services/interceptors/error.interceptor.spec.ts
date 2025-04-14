import { TestBed } from '@angular/core/testing';
import { HttpInterceptorFn } from '@angular/common/http';
import { errorInterceptor } from './error.interceptor';
import { of } from 'rxjs';
import { LoadingService } from '../loading.service';

describe('errorInterceptor', () => {
  const interceptor: HttpInterceptorFn = (req, next) =>
    TestBed.runInInjectionContext(() => errorInterceptor(req, next));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });

  it('should call next with the request', () => {
    const req = {} as any;
    const next = jasmine.createSpy('next').and.returnValue(of({}));
    interceptor(req, next);
    expect(next).toHaveBeenCalledWith(req);
  });

  it('should handle errors', () => {
    const req = {} as any;
    const next = jasmine.createSpy('next').and.returnValue(of({}));
    interceptor(req, next).subscribe({
      error: (error) => {
        expect(error).toBeTruthy();
      }
    });
  });

  it('should finalize the request', () => {
    const req = {} as any;
    const next = jasmine.createSpy('next').and.returnValue(of({}));
    interceptor(req, next).subscribe({
      complete: () => {
        expect(next).toHaveBeenCalled();
      }
    });
  });

  it('should show and hide loading', () => {
    const req = {} as any;
    const next = jasmine.createSpy('next').and.returnValue(of({}));
    const loadingService = jasmine.createSpyObj('LoadingService', ['show', 'hide']);
    TestBed.overrideProvider(LoadingService, { useValue: loadingService });

    interceptor(req, next).subscribe();

    expect(loadingService.show).toHaveBeenCalled();
    expect(loadingService.hide).toHaveBeenCalled();
  });
});
