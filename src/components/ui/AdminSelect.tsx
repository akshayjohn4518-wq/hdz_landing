import React, { forwardRef } from 'react';

export interface SelectOption {
  value: string;
  label: string;
}

export interface AdminSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  hint?: string;
  error?: string;
  required?: boolean;
}

export const AdminSelect = forwardRef<HTMLSelectElement, AdminSelectProps>(
  ({ label, options, hint, error, required, id, className = '', ...props }, ref) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className={`dz-form-group ${className}`}>
        {label && (
          <label htmlFor={selectId} className="dz-label">
            {label}
            {required && <span className="dz-label-required">*</span>}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          className="dz-select"
          aria-invalid={!!error}
          aria-describedby={error ? `${selectId}-error` : hint ? `${selectId}-hint` : undefined}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && (
          <span id={`${selectId}-error`} className="dz-field-error">
            {error}
          </span>
        )}
        {!error && hint && (
          <span id={`${selectId}-hint`} className="dz-field-hint">
            {hint}
          </span>
        )}
      </div>
    );
  }
);

AdminSelect.displayName = 'AdminSelect';
