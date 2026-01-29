import { clsx } from 'clsx';

const Skeleton = ({ className, ...props }) => (
    <div
        className={clsx('skeleton', className)}
        {...props}
    />
);

const SkeletonText = ({ lines = 3, className }) => (
    <div className={clsx('space-y-2', className)}>
        {Array.from({ length: lines }).map((_, i) => (
            <Skeleton
                key={i}
                className={clsx(
                    'h-4',
                    i === lines - 1 ? 'w-3/4' : 'w-full'
                )}
            />
        ))}
    </div>
);

const SkeletonCard = ({ className }) => (
    <div className={clsx('glass p-6 rounded-[var(--radius-xl)]', className)}>
        <div className="flex items-center gap-4 mb-4">
            <Skeleton className="w-12 h-12 rounded-full" />
            <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-3 w-1/4" />
            </div>
        </div>
        <SkeletonText lines={3} />
    </div>
);

const SkeletonTable = ({ rows = 5, cols = 4, className }) => (
    <div className={clsx('space-y-3', className)}>
        {/* Header */}
        <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
            {Array.from({ length: cols }).map((_, i) => (
                <Skeleton key={i} className="h-6" />
            ))}
        </div>
        {/* Rows */}
        {Array.from({ length: rows }).map((_, rowIndex) => (
            <div
                key={rowIndex}
                className="grid gap-4"
                style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
            >
                {Array.from({ length: cols }).map((_, colIndex) => (
                    <Skeleton key={colIndex} className="h-8" />
                ))}
            </div>
        ))}
    </div>
);

Skeleton.Text = SkeletonText;
Skeleton.Card = SkeletonCard;
Skeleton.Table = SkeletonTable;

export default Skeleton;
