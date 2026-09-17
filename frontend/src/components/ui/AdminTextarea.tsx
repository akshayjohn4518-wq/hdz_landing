import React, { forwardRef } from 'react';

export interface AdminTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  hint?: string;
  error?: string;
  required?: boolean;
}

export const AdminTextarea = forwardRef<HTMLTextAreaElement, AdminTextareaProps>(
  ({ label, hint, error, required, id, className = '', ...props }, ref) => {
    const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className={`dz-form-group ${className}`}>
        {label && (
          <label htmlFor={textareaId} className="dz-label">
            {label}
            {required && <span className="dz-label-required">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className="dz-textarea"
          aria-invalid={!!error}
          aria-describedby={error ? `${textareaId}-error` : hint ? `${textareaId}-hint` : undefined}
          {...props}
        />
        {error && (
          <span id={`${textareaId}-error`} className="dz-field-error">
            {error}
          </span>
        )}
        {!error && hint && (
          <span id={`${textareaId}-hint`} className="dz-field-hint">
            {hint}
          </span>
        )}
      </div>
    );
  }
);

AdminTextarea.displayName = 'AdminTextarea';
