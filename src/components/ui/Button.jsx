import React from "react";

const Button = ({
  children,
  variant = "primary",
  size = "md",
  className = "",
  disabled = false,
  onClick,
  type = "button",
  ...props
}) => {
  const baseStyles = `
    inline-flex items-center justify-center font-medium
    transition-all duration-200 ease-out
    focus-ring disabled:opacity-50 disabled:cursor-not-allowed
    active:scale-95
  `;

  const variants = {
    primary:
      "gradient-primary text-white hover:opacity-90 shadow-lg shadow-[#00AED6]/25",
    secondary:
      "bg-[var(--color-bg-elevated)] text-[var(--color-text-primary)] hover:bg-[var(--color-bg-card)] border border-[var(--glass-border)]",
    ghost:
      "bg-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-elevated)]",
    danger:
      "bg-[var(--color-expense)] text-white hover:bg-[var(--color-expense-light)]",
    income: "gradient-income text-white hover:opacity-90",
    expense: "gradient-expense text-white hover:opacity-90",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm rounded-lg gap-1.5",
    md: "px-4 py-2.5 text-sm rounded-xl gap-2",
    lg: "px-6 py-3 text-base rounded-xl gap-2",
    icon: "p-2 rounded-lg",
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
