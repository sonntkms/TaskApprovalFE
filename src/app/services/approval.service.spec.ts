import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { environment } from '../../environments/environment';

import { ApprovalService } from './approval.service';
import { ApprovalRequest } from '../models/approval-request';
import { ApprovalResponse } from '../models/approval-response';

describe('ApprovalService', () => {
  let service: ApprovalService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(ApprovalService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('startApproval', () => {
    it('should send a POST request to start approval and return the response', () => {
      const mockRequest: ApprovalRequest = { userEmail: 'test@example.com', taskName: 'Test Task' };
      const mockResponse: ApprovalResponse = { instanceId: '12345', message: 'Success' };

      service.startApproval(mockRequest).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpTestingController.expectOne(`${environment.apiUrl}/StartApproval`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({
        UserEmail: mockRequest.userEmail,
        TaskName: mockRequest.taskName
      });

      req.flush(mockResponse);
    });
  });

  describe('approve', () => {
    it('should send a POST request to approve and return the response', () => {
      const instanceId = '12345';
      const mockResponse = { success: true };

      service.approve(instanceId).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpTestingController.expectOne(`${environment.apiUrl}/Approve`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ InstanceId: instanceId });

      req.flush(mockResponse);
    });
  });

  describe('reject', () => {
    it('should send a POST request to reject and return the response', () => {
      const instanceId = '12345';
      const mockResponse = { success: true };

      service.reject(instanceId).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpTestingController.expectOne(`${environment.apiUrl}/Reject`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ InstanceId: instanceId });

      req.flush(mockResponse); 
    });
  });

});
