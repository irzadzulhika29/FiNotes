import React from "react";

const Input = ({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  className = "",
  error,
  prefix,
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {prefix && (
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] font-medium">
            {prefix}
          </span>
        )}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`
            w-full px-4 py-3 rounded-xl
            bg-[var(--color-bg-elevated)]/50 
            border border-[var(--glass-border)]
            text-[var(--color-text-primary)] 
            placeholder-[var(--color-text-muted)]
            transition-all duration-200
            focus:outline-none focus:border-[var(--color-primary)]
            focus:bg-[var(--color-bg-elevated)]
            focus:ring-2 focus:ring-[var(--color-primary)]/20
            ${prefix ? "pl-12" : ""}
            ${
              error
                ? "border-[var(--color-expense)] focus:border-[var(--color-expense)] focus:ring-[var(--color-expense)]/20"
                : ""
            }
            ${className}
          `}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1.5 text-sm text-[var(--color-expense)]">{error}</p>
      )}
    </div>
  );
};

export default Input;
