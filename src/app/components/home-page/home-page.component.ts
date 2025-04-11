import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApprovalService } from '../../services/approval.service';
import { ApprovalRequest } from '../../models/approval-request';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss'
})
export class HomePageComponent {
  approvalForm: FormGroup;
  isSubmitting = false;
  currentInstanceId: string | null = null;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private approvalService: ApprovalService
  ) {
    this.approvalForm = this.fb.group({
      userEmail: ['', [Validators.required, Validators.email]],
      taskName: ['', Validators.required]
    });
  }

  startApproval(): void {
    if (this.approvalForm.invalid) {
      this.markFormGroupTouched(this.approvalForm);
      return;
    }

    this.isSubmitting = true;
    this.successMessage = null;
    this.errorMessage = null;

    const request: ApprovalRequest = this.approvalForm.value;

    this.approvalService.startApproval(request).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        this.currentInstanceId = response.instanceId;
        this.successMessage = 'Approval process started successfully!';
      },
      error: (error) => {
        this.isSubmitting = false;
        this.errorMessage = 'Failed to start approval process. Please try again.';
      }
    });
  }

  approve(): void {
    if (!this.currentInstanceId) {
      this.errorMessage = 'No active approval process to approve.';
      return;
    }

    this.isSubmitting = true;
    this.successMessage = null;
    this.errorMessage = null;

    this.approvalService.approve(this.currentInstanceId).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.successMessage = 'Request approved successfully!';
        this.currentInstanceId = null;
      },
      error: (error) => {
        this.isSubmitting = false;
        this.errorMessage = 'Failed to approve request. Please try again.';
      }
    });
  }

  reject(): void {
    if (!this.currentInstanceId) {
      this.errorMessage = 'No active approval process to reject.';
      return;
    }

    this.isSubmitting = true;
    this.successMessage = null;
    this.errorMessage = null;

    this.approvalService.reject(this.currentInstanceId).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.successMessage = 'Request rejected successfully!';
        this.currentInstanceId = null;
      },
      error: (error) => {
        this.isSubmitting = false;
        this.errorMessage = 'Failed to reject request. Please try again.';
      }
    });
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}

