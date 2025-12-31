import React, { forwardRef, useState } from "react";
import { AlertCircle } from "lucide-react";

const Input = forwardRef(({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  className = "",
  error,
  prefix,
  suffix,
  helpText,
  required = false,
  disabled = false,
  onBlur,
  onFocus,
  formatNumber = false,
  ...props
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = (e) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  const handleChange = (e) => {
    if (formatNumber && type === "number") {
      // Remove non-numeric characters
      const numericValue = e.target.value.replace(/[^0-9]/g, "");
      e.target.value = numericValue;
    }
    onChange?.(e);
  };

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2.5">
          {label}
          {required && <span className="text-[var(--color-expense)] ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {prefix && (
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] font-medium pointer-events-none">
            {prefix}
          </span>
        )}
        
        <input
          ref={ref}
          type={type}
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={
            error ? `${props.id}-error` : 
            helpText ? `${props.id}-help` : 
            undefined
          }
          className={`
            w-full px-4 py-4 rounded-2xl text-base
            bg-[var(--color-bg-card)]/70 
            border-2 border-[var(--glass-border)]/70
            text-[var(--color-text-primary)] 
            placeholder-[var(--color-text-muted)]
            transition-all duration-200
            focus:outline-none 
            focus:bg-[var(--color-bg-elevated)]
            disabled:opacity-50 disabled:cursor-not-allowed
            ${prefix ? "pl-12" : ""}
            ${suffix ? "pr-12" : ""}
            ${error 
              ? "border-[var(--color-expense)] focus:border-[var(--color-expense)] focus:ring-4 focus:ring-[var(--color-expense)]/20" 
              : isFocused 
                ? "border-[var(--color-primary)] focus:ring-4 focus:ring-[var(--color-primary)]/30"
                : "hover:border-[var(--glass-border)]"
            }
            ${className}
          `}
          {...props}
        />
        
        {suffix && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] font-medium pointer-events-none">
            {suffix}
          </span>
        )}

        {error && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
            <AlertCircle className="w-5 h-5 text-[var(--color-expense)]" />
          </div>
        )}
      </div>
      
      {error && (
        <p 
          id={`${props.id}-error`}
          className="mt-2 text-sm text-[var(--color-expense)] flex items-center gap-1.5"
          role="alert"
        >
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </p>
      )}
      
      {helpText && !error && (
        <p 
          id={`${props.id}-help`}
          className="mt-2 text-sm text-[var(--color-text-muted)]"
        >
          {helpText}
        </p>
      )}
    </div>
  );
});

Input.displayName = "Input";

export default Input;
