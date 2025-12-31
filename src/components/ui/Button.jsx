import React, { forwardRef } from "react";
import { Loader2 } from "lucide-react";

const Button = forwardRef(({
  children,
  variant = "primary",
  size = "md",
  className = "",
  disabled = false,
  loading = false,
  onClick,
  type = "button",
  leftIcon = null,
  rightIcon = null,
  ...props
}, ref) => {
  const baseStyles = `
    inline-flex items-center justify-center font-medium
    transition-all duration-200 ease-out
    focus-ring disabled:opacity-50 disabled:cursor-not-allowed
    active:scale-95 disabled:active:scale-100
    relative overflow-hidden
  `;

  const variants = {
    primary:
      "gradient-primary text-white hover:opacity-90 shadow-lg shadow-[#00AED6]/25 hover:shadow-[#00AED6]/40",
    secondary:
      "bg-[var(--color-bg-elevated)] text-[var(--color-text-primary)] hover:bg-[var(--color-bg-hover)] border border-[var(--glass-border)] hover:border-[var(--color-primary)]/30",
    ghost:
      "bg-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-elevated)]",
    danger:
      "bg-[var(--color-expense)] text-white hover:bg-[var(--color-expense-light)] shadow-lg shadow-[var(--color-expense)]/25",
    income: "gradient-income text-white hover:opacity-90 shadow-lg shadow-green-500/25",
    expense: "gradient-expense text-white hover:opacity-90 shadow-lg shadow-red-500/25",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm rounded-lg gap-1.5 min-h-[32px]",
    md: "px-4 py-2.5 text-sm rounded-xl gap-2 min-h-[40px]",
    lg: "px-6 py-3 text-base rounded-xl gap-2 min-h-[48px]",
    icon: "p-2 rounded-lg min-h-[40px] min-w-[40px]",
  };

  const isDisabled = disabled || loading;

  return (
    <button
      ref={ref}
      type={type}
      disabled={isDisabled}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      aria-busy={loading}
      {...props}
    >
      {loading && (
        <Loader2 className="w-4 h-4 animate-spin absolute" aria-hidden="true" />
      )}
      
      <span className={`inline-flex items-center gap-2 ${loading ? 'opacity-0' : 'opacity-100'}`}>
        {leftIcon && <span className="inline-flex">{leftIcon}</span>}
        {children}
        {rightIcon && <span className="inline-flex">{rightIcon}</span>}
      </span>
    </button>
  );
});

Button.displayName = "Button";

export default Button;
