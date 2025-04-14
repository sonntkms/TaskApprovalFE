import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { SpinnerComponent } from './spinner.component';

describe('SpinnerComponent', () => {
  let component: SpinnerComponent;
  let fixture: ComponentFixture<SpinnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpinnerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpinnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show spinner when isLoading$ is true', () => {
    component.isLoading$ = of(true);
    fixture.detectChanges();
    const spinnerOverlay = fixture.nativeElement.querySelector('.spinner-overlay');
    expect(spinnerOverlay).toBeTruthy();
  });

  it('should hide spinner when isLoading$ is false', () => {
    component.isLoading$ = of(false);
    fixture.detectChanges();
    const spinnerOverlay = fixture.nativeElement.querySelector('.spinner-overlay');
    expect(spinnerOverlay).toBeFalsy();
  });
});
