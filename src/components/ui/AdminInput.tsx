import React, { forwardRef } from 'react';

export interface AdminInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
  isMono?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightIconClick?: () => void;
  required?: boolean;
}

export const AdminInput = forwardRef<HTMLInputElement, AdminInputProps>(
  (
    {
      label,
      hint,
      error,
      isMono = false,
      leftIcon,
      rightIcon,
      onRightIconClick,
      required,
      id,
      className = '',
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className={`dz-form-group ${className}`}>
        {label && (
          <label htmlFor={inputId} className="dz-label">
            {label}
            {required && <span className="dz-label-required">*</span>}
          </label>
        )}
        <div className={`dz-input-wrapper ${error ? 'has-error' : ''}`}>
          {leftIcon && <div className="dz-input-icon-left">{leftIcon}</div>}
          <input
            ref={ref}
            id={inputId}
            className={`dz-input ${isMono ? 'dz-input--mono' : ''}`}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
            {...props}
          />
          {rightIcon && (
            <div
              className="dz-input-icon-right"
              onClick={onRightIconClick}
              role={onRightIconClick ? 'button' : undefined}
              tabIndex={onRightIconClick ? 0 : undefined}
            >
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <span id={`${inputId}-error`} className="dz-field-error">
            {error}
          </span>
        )}
        {!error && hint && (
          <span id={`${inputId}-hint`} className="dz-field-hint">
            {hint}
          </span>
        )}
      </div>
    );
  }
);

AdminInput.displayName = 'AdminInput';
