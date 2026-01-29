import { clsx } from 'clsx';

const Card = ({
    children,
    className,
    variant = 'glass',
    hover = true,
    padding = 'md',
    ...props
}) => {
    const variants = {
        glass: 'glass',
        solid: 'bg-[var(--color-bg-secondary)]',
        gradient: 'gradient-border',
        outline: 'bg-transparent border border-[var(--color-glass-border)]',
    };

    const paddings = {
        none: '',
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
    };

    return (
        <div
            className={clsx(
                'rounded-[var(--radius-xl)]',
                variants[variant],
                paddings[padding],
                hover && 'hover-lift cursor-pointer',
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
};

const CardHeader = ({ children, className, ...props }) => (
    <div
        className={clsx(
            'mb-4 pb-4 border-b border-[var(--color-glass-border)]',
            className
        )}
        {...props}
    >
        {children}
    </div>
);

const CardTitle = ({ children, className, ...props }) => (
    <h3
        className={clsx(
            'text-xl font-bold text-[var(--color-text-primary)]',
            className
        )}
        {...props}
    >
        {children}
    </h3>
);

const CardDescription = ({ children, className, ...props }) => (
    <p
        className={clsx(
            'mt-1 text-sm text-[var(--color-text-secondary)]',
            className
        )}
        {...props}
    >
        {children}
    </p>
);

const CardContent = ({ children, className, ...props }) => (
    <div className={clsx(className)} {...props}>
        {children}
    </div>
);

const CardFooter = ({ children, className, ...props }) => (
    <div
        className={clsx(
            'mt-4 pt-4 border-t border-[var(--color-glass-border)] flex items-center gap-3',
            className
        )}
        {...props}
    >
        {children}
    </div>
);

Card.Header = CardHeader;
Card.Title = CardTitle;
Card.Description = CardDescription;
Card.Content = CardContent;
Card.Footer = CardFooter;

export default Card;
