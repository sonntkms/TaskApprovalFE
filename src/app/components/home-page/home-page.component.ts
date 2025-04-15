import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApprovalService } from '../../services/approval.service';
import { ApprovalRequest } from '../../models/approval-request';
import { CommonModule } from '@angular/common';
import { MESSAGES } from '../../constants/messages.constants';
import { Subject } from 'rxjs';
import { takeUntil, finalize } from 'rxjs/operators';

export const STORAGE_KEY_CURRENT_INSTANCE_ID = 'currentInstanceId';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss'
})
export class HomePageComponent implements OnInit, OnDestroy {
  private destroyed$ = new Subject<void>();

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

  ngOnInit(): void {
    const savedInstanceId: string | null = localStorage.getItem(STORAGE_KEY_CURRENT_INSTANCE_ID);
    if (savedInstanceId) {
      this.currentInstanceId = savedInstanceId;
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const control = this.approvalForm.get(fieldName);
    return control ? control.invalid && (control.dirty || control.touched) : false;
  }

  startApproval(): void {
    if (this.approvalForm.valid) {
      this.isSubmitting = true;
      this.successMessage = null;
      this.errorMessage = null;

      const request: ApprovalRequest = this.approvalForm.value;

      this.approvalService.startApproval(request)
        .pipe(takeUntil(this.destroyed$))
        .subscribe({
          next: (response) => {
            this.isSubmitting = false;
            this.currentInstanceId = response.instanceId || null;
            if (this.currentInstanceId) {
              localStorage.setItem(STORAGE_KEY_CURRENT_INSTANCE_ID, this.currentInstanceId);
            }
            this.successMessage = MESSAGES.SUCCESS_START_APPROVAL;
          },
          error: (error) => {
            this.isSubmitting = false;
            this.errorMessage = `${MESSAGES.ERROR_START_APPROVAL} ${error.message}`;
          }
        });
    }
    else {
      this.markFormGroupTouched(this.approvalForm);
    }
  }

  approve(): void {
    if (this.currentInstanceId) {
      this.isSubmitting = true;
      this.successMessage = null;
      this.errorMessage = null;

      this.approvalService.approve(this.currentInstanceId)
        .pipe(
          takeUntil(this.destroyed$),
          finalize(() => {
            this.isSubmitting = false;
            localStorage.removeItem(STORAGE_KEY_CURRENT_INSTANCE_ID);
          }))
        .subscribe({
          next: () => {
            this.successMessage = MESSAGES.SUCCESS_APPROVE;
            this.currentInstanceId = null;
            localStorage.removeItem(STORAGE_KEY_CURRENT_INSTANCE_ID);
          },
          error: (error) => {
            this.errorMessage = `${MESSAGES.ERROR_APROVE} ${error.message}`;
          }
        });
    } else {
      this.errorMessage = MESSAGES.ERROR_NO_ACTIVE_APPROVE_PROCESS;
    }
  }

  reject(): void {
    if (this.currentInstanceId) {
      this.isSubmitting = true;
      this.successMessage = null;
      this.errorMessage = null;

      this.approvalService.reject(this.currentInstanceId)
        .pipe(
          takeUntil(this.destroyed$),
          finalize(() => {
            this.isSubmitting = false;
            localStorage.removeItem(STORAGE_KEY_CURRENT_INSTANCE_ID);
          })
        )
        .subscribe({
          next: () => {
            this.successMessage = MESSAGES.SUCCESS_REJECT;
            this.currentInstanceId = null;
          },
          error: (error) => {
            this.errorMessage = `${MESSAGES.ERROR_REJECT} ${error.message}`;
          }
        });
    }
    else {
      this.errorMessage = MESSAGES.ERROR_NO_ACTIVE_REJECT_PROCESS;
    }
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}

