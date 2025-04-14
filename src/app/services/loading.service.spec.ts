import { TestBed } from '@angular/core/testing';
import { LoadingService } from './loading.service';

describe('LoadingService', () => {
  let service: LoadingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoadingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have an initial loading state of false', (done: DoneFn) => {
    service.loading$.subscribe((loading) => {
      expect(loading).toBeFalse();
      done();
    });
  });

  it('should set loading state to true when show() is called', (done: DoneFn) => {
    service.show();
    service.loading$.subscribe((loading) => {
      expect(loading).toBeTrue();
      done();
    });
  });
});
