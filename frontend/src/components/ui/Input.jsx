import { forwardRef, useState } from 'react';
import { clsx } from 'clsx';
import { Eye, EyeOff } from 'lucide-react';

const Input = forwardRef(({
    label,
    error,
    helperText,
    icon,
    type = 'text',
    className,
    containerClassName,
    disabled = false,
    required = false,
    ...props
}, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    const isPassword = type === 'password';
    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

    return (
        <div className={clsx('w-full', containerClassName)}>
            {/* Label */}
            {label && (
                <label className={clsx(
                    'block mb-2 text-sm font-medium transition-colors duration-200',
                    error ? 'text-[var(--color-error)]' : 'text-[var(--color-text-secondary)]',
                    isFocused && !error && 'text-[var(--color-accent-mid)]'
                )}>
                    {label}
                    {required && <span className="ml-1 text-[var(--color-error)]">*</span>}
                </label>
            )}

            {/* Input Container */}
            <div className="relative">
                {/* Left Icon */}
                {icon && (
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-tertiary)]">
                        {icon}
                    </div>
                )}

                {/* Input Field */}
                <input
                    ref={ref}
                    type={inputType}
                    disabled={disabled}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    className={clsx(
                        // Base styles
                        'w-full px-4 py-3 rounded-[var(--radius-lg)]',
                        'bg-[var(--color-bg-tertiary)] text-[var(--color-text-primary)]',
                        'placeholder:text-[var(--color-text-tertiary)]',
                        'border transition-all duration-300',
                        // Focus styles
                        'focus:outline-none focus:ring-2 focus:ring-offset-0',
                        // Border & ring colors
                        error
                            ? 'border-[var(--color-error)] focus:ring-[var(--color-error)]/30'
                            : 'border-[var(--color-glass-border)] focus:border-[var(--color-accent-mid)] focus:ring-[var(--color-accent-mid)]/30',
                        // Disabled styles
                        disabled && 'opacity-50 cursor-not-allowed',
                        // Padding adjustments for icons
                        icon && 'pl-12',
                        isPassword && 'pr-12',
                        className
                    )}
                    {...props}
                />

                {/* Password Toggle */}
                {isPassword && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className={clsx(
                            'absolute right-4 top-1/2 -translate-y-1/2',
                            'text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)]',
                            'transition-colors duration-200 focus:outline-none'
                        )}
                        tabIndex={-1}
                    >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                )}
            </div>

            {/* Error or Helper Text */}
            {(error || helperText) && (
                <p className={clsx(
                    'mt-2 text-sm',
                    error ? 'text-[var(--color-error)]' : 'text-[var(--color-text-tertiary)]'
                )}>
                    {error || helperText}
                </p>
            )}
        </div>
    );
});

Input.displayName = 'Input';

export default Input;
