import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import {
    Search,
    Filter,
    Calendar,
    ExternalLink,
    ChevronDown,
    Briefcase,
    Clock,
    CheckCircle,
    XCircle,
    AlertCircle
} from 'lucide-react';
import { Card, Button, Badge, Input, Skeleton } from '@components/ui';
import applicationService from '@services/applicationService';

const ApplicationsPage = () => {
    const [applications, setApplications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        fetchApplications();
    }, [statusFilter]);

    const fetchApplications = async () => {
        setIsLoading(true);
        try {
            const params = statusFilter !== 'all' ? { status: statusFilter } : {};
            const data = await applicationService.getAll(params);
            setApplications(data.content || data || []);
        } catch (error) {
            console.error('Failed to fetch applications:', error);
            // Mock data
            setApplications([
                { id: 1, company: 'Google', jobTitle: 'Senior Frontend Developer', status: 'INTERVIEW', appliedAt: new Date().toISOString(), platformName: 'LinkedIn', location: 'Mountain View, CA', jobUrl: 'https://careers.google.com' },
                { id: 2, company: 'Meta', jobTitle: 'React Developer', status: 'SUBMITTED', appliedAt: new Date(Date.now() - 86400000).toISOString(), platformName: 'Hirect', location: 'Menlo Park, CA', jobUrl: 'https://careers.meta.com' },
                { id: 3, company: 'Amazon', jobTitle: 'Full Stack Engineer', status: 'PENDING', appliedAt: new Date(Date.now() - 172800000).toISOString(), platformName: 'Cutshort', location: 'Seattle, WA', jobUrl: 'https://amazon.jobs' },
                { id: 4, company: 'Microsoft', jobTitle: 'Software Engineer II', status: 'REJECTED', appliedAt: new Date(Date.now() - 259200000).toISOString(), platformName: 'LinkedIn', location: 'Redmond, WA', jobUrl: 'https://careers.microsoft.com' },
                { id: 5, company: 'Apple', jobTitle: 'iOS Developer', status: 'OFFER', appliedAt: new Date(Date.now() - 345600000).toISOString(), platformName: 'Direct', location: 'Cupertino, CA', jobUrl: 'https://apple.com/jobs' },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const statusConfig = {
        PENDING: { variant: 'warning', label: 'Pending', icon: Clock, color: 'text-yellow-500' },
        SUBMITTED: { variant: 'info', label: 'Submitted', icon: CheckCircle, color: 'text-blue-500' },
        VIEWED: { variant: 'info', label: 'Viewed', icon: AlertCircle, color: 'text-blue-500' },
        INTERVIEW: { variant: 'success', label: 'Interview', icon: Calendar, color: 'text-emerald-500' },
        OFFER: { variant: 'success', label: 'Offer', icon: CheckCircle, color: 'text-purple-500' },
        REJECTED: { variant: 'error', label: 'Rejected', icon: XCircle, color: 'text-red-500' },
    };

    const filteredApplications = applications.filter((app) =>
        app.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.jobTitle.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
                <div>
                    <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">
                        Applications
                    </h1>
                    <p className="text-[var(--color-text-secondary)] mt-1">
                        Track and manage all your job applications
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button
                        variant="secondary"
                        icon={<Filter size={18} />}
                        onClick={() => setShowFilters(!showFilters)}
                    >
                        Filters
                        <ChevronDown size={16} className={clsx(
                            'transition-transform duration-200',
                            showFilters && 'rotate-180'
                        )} />
                    </Button>
                </div>
            </motion.div>

            {/* Search & Filters */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="space-y-4"
            >
                <Input
                    placeholder="Search by company or job title..."
                    icon={<Search size={20} />}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />

                {showFilters && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex flex-wrap gap-2"
                    >
                        {['all', 'PENDING', 'SUBMITTED', 'INTERVIEW', 'OFFER', 'REJECTED'].map((status) => (
                            <Button
                                key={status}
                                variant={statusFilter === status ? 'primary' : 'outline'}
                                size="sm"
                                onClick={() => setStatusFilter(status)}
                            >
                                {status === 'all' ? 'All' : statusConfig[status]?.label || status}
                            </Button>
                        ))}
                    </motion.div>
                )}
            </motion.div>

            {/* Applications List */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <div className="flex items-center justify-between mb-4">
                    <p className="text-sm text-[var(--color-text-secondary)]">
                        Showing {filteredApplications.length} applications
                    </p>
                </div>

                {isLoading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <Skeleton.Card key={i} />
                        ))}
                    </div>
                ) : filteredApplications.length > 0 ? (
                    <div className="space-y-4">
                        {filteredApplications.map((app, index) => {
                            const config = statusConfig[app.status] || statusConfig.PENDING;
                            const StatusIcon = config.icon;

                            return (
                                <motion.div
                                    key={app.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <Card hover={false}>
                                        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                                            {/* Company Logo Placeholder */}
                                            <div className="w-14 h-14 rounded-[var(--radius-lg)] bg-gradient-to-br from-[var(--color-accent-start)] to-[var(--color-accent-mid)] flex items-center justify-center shrink-0">
                                                <span className="text-2xl font-bold text-white">
                                                    {app.company[0]}
                                                </span>
                                            </div>

                                            {/* Job Info */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex flex-wrap items-center gap-2 mb-1">
                                                    <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">
                                                        {app.jobTitle}
                                                    </h3>
                                                    <Badge variant={config.variant}>
                                                        <StatusIcon size={12} className="mr-1" />
                                                        {config.label}
                                                    </Badge>
                                                </div>
                                                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-[var(--color-text-secondary)]">
                                                    <span className="font-medium">{app.company}</span>
                                                    {app.location && (
                                                        <>
                                                            <span>•</span>
                                                            <span>{app.location}</span>
                                                        </>
                                                    )}
                                                    <span>•</span>
                                                    <span>via {app.platformName}</span>
                                                </div>
                                            </div>

                                            {/* Applied Date & Actions */}
                                            <div className="flex items-center gap-4 shrink-0">
                                                <div className="text-right hidden sm:block">
                                                    <p className="text-sm text-[var(--color-text-tertiary)]">Applied</p>
                                                    <p className="text-sm font-medium text-[var(--color-text-primary)]">
                                                        {formatDate(app.appliedAt)}
                                                    </p>
                                                </div>
                                                {app.jobUrl && (
                                                    <a
                                                        href={app.jobUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        <Button variant="ghost" size="sm" icon={<ExternalLink size={16} />}>
                                                            View Job
                                                        </Button>
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </Card>
                                </motion.div>
                            );
                        })}
                    </div>
                ) : (
                    <Card hover={false} className="text-center py-12">
                        <Briefcase size={48} className="mx-auto text-[var(--color-text-tertiary)] mb-4" />
                        <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-2">
                            No applications found
                        </h3>
                        <p className="text-[var(--color-text-secondary)]">
                            {searchQuery
                                ? 'Try adjusting your search terms'
                                : 'Start applying to jobs to see them here'}
                        </p>
                    </Card>
                )}
            </motion.div>
        </div>
    );
};

export default ApplicationsPage;
