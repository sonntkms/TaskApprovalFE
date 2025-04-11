import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { HomePageComponent } from './home-page.component';
import { ApprovalService } from '../../services/approval.service';
import { ApprovalResponse } from '../../models/approval-response';

describe('HomePageComponent', () => {
  let component: HomePageComponent;
  let fixture: ComponentFixture<HomePageComponent>;
  let mockApprovalService: jasmine.SpyObj<ApprovalService>;

  beforeEach(async () => {
    mockApprovalService = jasmine.createSpyObj('ApprovalService', ['startApproval', 'approve', 'reject']);
    await TestBed.configureTestingModule({
      imports: [HomePageComponent, ReactiveFormsModule],
      providers: [
        { provide: ApprovalService, useValue: mockApprovalService }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(HomePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('Form Validation', () => {
    it('should invalidate the form if fields are empty', () => {
      component.approvalForm.setValue({ userEmail: '', taskName: '' });
      expect(component.approvalForm.invalid).toBeTrue();
    });

    it('should validate the email field correctly', () => {
      const emailControl = component.approvalForm.get('userEmail');
      emailControl?.setValue('invalid-email');
      expect(emailControl?.invalid).toBeTrue();

      emailControl?.setValue('valid@example.com');
      expect(emailControl?.valid).toBeTrue();
    });

    it('should validate the task name field correctly', () => {
      const taskNameControl = component.approvalForm.get('taskName');
      taskNameControl?.setValue('');
      expect(taskNameControl?.invalid).toBeTrue();

      taskNameControl?.setValue('Task 1');
      expect(taskNameControl?.valid).toBeTrue();
    });
  });

  describe('startApproval()', () => {
    it('should not call the service if the form is invalid', () => {
      component.approvalForm.setValue({ userEmail: '', taskName: '' });
      component.startApproval();
      expect(mockApprovalService.startApproval).not.toHaveBeenCalled();
    });

    it('should call the service and handle success response', () => {
      const mockResponse: ApprovalResponse = { instanceId: '12345', message: 'Success' };
      mockApprovalService.startApproval.and.returnValue(of(mockResponse));

      component.approvalForm.setValue({ userEmail: 'test@example.com', taskName: 'Task 1' });
      component.startApproval();

      expect(mockApprovalService.startApproval).toHaveBeenCalledWith({
        userEmail: 'test@example.com',
        taskName: 'Task 1'
      });
      expect(component.isSubmitting).toBeFalse();
      expect(component.currentInstanceId).toBe('12345');
      expect(component.successMessage).toBe('Approval process started successfully!');
    });

    it('should handle error response from the service', () => {
      mockApprovalService.startApproval.and.returnValue(throwError(() => new Error('Error')));

      component.approvalForm.setValue({ userEmail: 'test@example.com', taskName: 'Task 1' });
      component.startApproval();

      expect(component.isSubmitting).toBeFalse();
      expect(component.errorMessage).toBe('Failed to start approval process. Please try again.');
    });
  });

  describe('approve()', () => {
    it('should not call the service if there is no active instance', () => {
      component.currentInstanceId = null;
      component.approve();
      expect(mockApprovalService.approve).not.toHaveBeenCalled();
      expect(component.errorMessage).toBe('No active approval process to approve.');
    });

    it('should call the service and handle success response', () => {
      component.currentInstanceId = '12345';
      mockApprovalService.approve.and.returnValue(of({}));

      component.approve();

      expect(mockApprovalService.approve).toHaveBeenCalledWith('12345');
      expect(component.isSubmitting).toBeFalse();
      expect(component.successMessage).toBe('Request approved successfully!');
      expect(component.currentInstanceId).toBeNull();
    });

    it('should handle error response from the service', () => {
      component.currentInstanceId = '12345';
      mockApprovalService.approve.and.returnValue(throwError(() => new Error('Error')));

      component.approve();

      expect(component.isSubmitting).toBeFalse();
      expect(component.errorMessage).toBe('Failed to approve request. Please try again.');
    });

    describe('reject()', () => {
      it('should not call the service if there is no active instance', () => {
        component.currentInstanceId = null;
        component.reject();
        expect(mockApprovalService.reject).not.toHaveBeenCalled();
        expect(component.errorMessage).toBe('No active approval process to reject.');
      });

      it('should call the service and handle success response', () => {
        component.currentInstanceId = '12345';
        mockApprovalService.reject.and.returnValue(of({}));

        component.reject();

        expect(mockApprovalService.reject).toHaveBeenCalledWith('12345');
        expect(component.isSubmitting).toBeFalse();
        expect(component.successMessage).toBe('Request rejected successfully!');
        expect(component.currentInstanceId).toBeNull();
      });

      it('should handle error response from the service', () => {
        component.currentInstanceId = '12345';
        mockApprovalService.reject.and.returnValue(throwError(() => new Error('Error')));

        component.reject();

        expect(component.isSubmitting).toBeFalse();
        expect(component.errorMessage).toBe('Failed to reject request. Please try again.');
      });
    });
  });

});
