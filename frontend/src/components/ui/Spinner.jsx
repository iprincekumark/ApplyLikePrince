import { clsx } from 'clsx';

const Spinner = ({ size = 'md', className }) => {
    const sizes = {
        sm: 'w-4 h-4 border-2',
        md: 'w-8 h-8 border-3',
        lg: 'w-12 h-12 border-4',
        xl: 'w-16 h-16 border-4',
    };

    return (
        <div
            className={clsx(
                'rounded-full animate-spin',
                'border-[var(--color-bg-tertiary)]',
                'border-t-[var(--color-accent-mid)]',
                sizes[size],
                className
            )}
            role="status"
            aria-label="Loading"
        >
            <span className="sr-only">Loading...</span>
        </div>
    );
};

const SpinnerOverlay = ({ text = 'Loading...' }) => (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[var(--color-bg-primary)]/80 backdrop-blur-sm">
        <Spinner size="xl" />
        <p className="mt-4 text-lg text-[var(--color-text-secondary)]">{text}</p>
    </div>
);

Spinner.Overlay = SpinnerOverlay;

export default Spinner;
