import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApprovalRequest } from '../models/approval-request';
import { ApprovalResponse } from '../models/approval-response';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApprovalService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  startApproval(request: ApprovalRequest): Observable<ApprovalResponse> {
    return this.http.post<ApprovalResponse>(`${this.apiUrl}/StartApproval`, {
      UserEmail: request.userEmail,
      TaskName: request.taskName
    });
  }

  approve(instanceId: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/Approve`, { InstanceId: instanceId });
  }

  reject(instanceId: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/Reject`, { InstanceId: instanceId });
  }
}