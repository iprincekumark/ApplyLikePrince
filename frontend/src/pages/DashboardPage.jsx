import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import {
    Briefcase,
    Clock,
    CheckCircle,
    XCircle,
    Calendar,
    TrendingUp,
    FileText,
    Zap,
    ArrowRight,
    Plus,
    ExternalLink
} from 'lucide-react';
import { Card, Button, Badge, Skeleton } from '@components/ui';
import useAuthStore from '@store/authStore';
import applicationService from '@services/applicationService';

const DashboardPage = () => {
    const { user } = useAuthStore();
    const [stats, setStats] = useState(null);
    const [recentApplications, setRecentApplications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        setIsLoading(true);
        try {
            const [statsData, applicationsData] = await Promise.all([
                applicationService.getStats(),
                applicationService.getAll({ limit: 5 }),
            ]);
            setStats(statsData);
            setRecentApplications(applicationsData.content || applicationsData || []);
        } catch (error) {
            console.error('Failed to fetch dashboard data:', error);
            // Set mock data for demo
            setStats({
                totalApplications: 127,
                pendingApplications: 45,
                submittedApplications: 68,
                interviewsScheduled: 12,
                offersReceived: 2,
                rejections: 15,
                thisWeekApplications: 23,
                thisMonthApplications: 89,
            });
            setRecentApplications([
                { id: 1, company: 'Google', jobTitle: 'Senior Frontend Developer', status: 'SUBMITTED', appliedAt: new Date().toISOString(), platformName: 'LinkedIn' },
                { id: 2, company: 'Meta', jobTitle: 'React Developer', status: 'INTERVIEW', appliedAt: new Date().toISOString(), platformName: 'Hirect' },
                { id: 3, company: 'Amazon', jobTitle: 'Full Stack Engineer', status: 'PENDING', appliedAt: new Date().toISOString(), platformName: 'Cutshort' },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const statCards = [
        {
            title: 'Total Applications',
            value: stats?.totalApplications || 0,
            icon: Briefcase,
            color: 'from-violet-500 to-purple-600',
            change: '+12%',
            changeType: 'positive',
        },
        {
            title: 'Interviews Scheduled',
            value: stats?.interviewsScheduled || 0,
            icon: Calendar,
            color: 'from-blue-500 to-cyan-500',
            change: '+5',
            changeType: 'positive',
        },
        {
            title: 'This Week',
            value: stats?.thisWeekApplications || 0,
            icon: TrendingUp,
            color: 'from-emerald-500 to-teal-500',
            change: '+28%',
            changeType: 'positive',
        },
        {
            title: 'Offers Received',
            value: stats?.offersReceived || 0,
            icon: CheckCircle,
            color: 'from-amber-500 to-orange-500',
            change: '+2',
            changeType: 'positive',
        },
    ];

    const getStatusBadge = (status) => {
        const statusConfig = {
            PENDING: { variant: 'warning', label: 'Pending' },
            SUBMITTED: { variant: 'info', label: 'Submitted' },
            VIEWED: { variant: 'info', label: 'Viewed' },
            INTERVIEW: { variant: 'success', label: 'Interview' },
            OFFER: { variant: 'success', label: 'Offer' },
            REJECTED: { variant: 'error', label: 'Rejected' },
        };
        const config = statusConfig[status] || { variant: 'default', label: status };
        return <Badge variant={config.variant}>{config.label}</Badge>;
    };

    const fadeInUp = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.4 },
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <motion.div {...fadeInUp}>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">
                            Welcome back, <span className="gradient-text">{user?.fullName?.split(' ')[0] || 'User'}</span>! 👋
                        </h1>
                        <p className="text-[var(--color-text-secondary)] mt-1">
                            Here's what's happening with your job applications today.
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Link to="/resumes">
                            <Button variant="secondary" icon={<FileText size={18} />}>
                                Manage Resumes
                            </Button>
                        </Link>
                        <Link to="/applications">
                            <Button icon={<Plus size={18} />}>
                                New Application
                            </Button>
                        </Link>
                    </div>
                </div>
            </motion.div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {isLoading
                    ? Array.from({ length: 4 }).map((_, i) => (
                        <Skeleton.Card key={i} />
                    ))
                    : statCards.map((stat, index) => (
                        <motion.div
                            key={stat.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1, duration: 0.4 }}
                        >
                            <Card hover={false} className="relative overflow-hidden">
                                {/* Background Gradient */}
                                <div className={clsx(
                                    'absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-20',
                                    `bg-gradient-to-br ${stat.color}`
                                )} />

                                <div className="relative">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className={clsx(
                                            'w-12 h-12 rounded-[var(--radius-lg)] flex items-center justify-center',
                                            `bg-gradient-to-br ${stat.color}`
                                        )}>
                                            <stat.icon size={24} className="text-white" />
                                        </div>
                                        <div className={clsx(
                                            'flex items-center gap-1 text-sm font-medium',
                                            stat.changeType === 'positive'
                                                ? 'text-[var(--color-success)]'
                                                : 'text-[var(--color-error)]'
                                        )}>
                                            {stat.change}
                                            <TrendingUp size={14} />
                                        </div>
                                    </div>

                                    <p className="text-4xl font-bold text-[var(--color-text-primary)] mb-1">
                                        {stat.value.toLocaleString()}
                                    </p>
                                    <p className="text-sm text-[var(--color-text-secondary)]">
                                        {stat.title}
                                    </p>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
            </div>

            {/* Quick Actions & Recent Applications */}
            <div className="grid lg:grid-cols-3 gap-8">
                {/* Quick Actions */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3, duration: 0.4 }}
                >
                    <Card>
                        <Card.Header>
                            <Card.Title>Quick Actions</Card.Title>
                            <Card.Description>Common tasks at your fingertips</Card.Description>
                        </Card.Header>
                        <Card.Content className="space-y-3">
                            <Link to="/resumes" className="block">
                                <div className="flex items-center gap-4 p-4 rounded-[var(--radius-lg)] bg-[var(--color-bg-tertiary)] hover:bg-[var(--color-glass)] transition-colors duration-200 group">
                                    <div className="w-10 h-10 rounded-[var(--radius-lg)] gradient-bg flex items-center justify-center shrink-0">
                                        <FileText size={20} className="text-white" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-[var(--color-text-primary)]">Upload Resume</p>
                                        <p className="text-sm text-[var(--color-text-secondary)]">Add a new resume to your profile</p>
                                    </div>
                                    <ArrowRight size={18} className="text-[var(--color-text-tertiary)] group-hover:text-[var(--color-accent-mid)] transition-colors" />
                                </div>
                            </Link>

                            <Link to="/platforms" className="block">
                                <div className="flex items-center gap-4 p-4 rounded-[var(--radius-lg)] bg-[var(--color-bg-tertiary)] hover:bg-[var(--color-glass)] transition-colors duration-200 group">
                                    <div className="w-10 h-10 rounded-[var(--radius-lg)] bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shrink-0">
                                        <Zap size={20} className="text-white" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-[var(--color-text-primary)]">Auto Apply</p>
                                        <p className="text-sm text-[var(--color-text-secondary)]">Apply to jobs on multiple platforms</p>
                                    </div>
                                    <ArrowRight size={18} className="text-[var(--color-text-tertiary)] group-hover:text-[var(--color-accent-mid)] transition-colors" />
                                </div>
                            </Link>

                            <Link to="/applications" className="block">
                                <div className="flex items-center gap-4 p-4 rounded-[var(--radius-lg)] bg-[var(--color-bg-tertiary)] hover:bg-[var(--color-glass)] transition-colors duration-200 group">
                                    <div className="w-10 h-10 rounded-[var(--radius-lg)] bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shrink-0">
                                        <Briefcase size={20} className="text-white" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-[var(--color-text-primary)]">View All Applications</p>
                                        <p className="text-sm text-[var(--color-text-secondary)]">Track and manage applications</p>
                                    </div>
                                    <ArrowRight size={18} className="text-[var(--color-text-tertiary)] group-hover:text-[var(--color-accent-mid)] transition-colors" />
                                </div>
                            </Link>
                        </Card.Content>
                    </Card>
                </motion.div>

                {/* Recent Applications */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4, duration: 0.4 }}
                    className="lg:col-span-2"
                >
                    <Card>
                        <Card.Header className="flex flex-row items-center justify-between">
                            <div>
                                <Card.Title>Recent Applications</Card.Title>
                                <Card.Description>Your latest job applications</Card.Description>
                            </div>
                            <Link to="/applications">
                                <Button variant="ghost" size="sm" icon={<ArrowRight size={16} />} iconPosition="right">
                                    View All
                                </Button>
                            </Link>
                        </Card.Header>
                        <Card.Content>
                            {isLoading ? (
                                <Skeleton.Table rows={3} cols={4} />
                            ) : recentApplications.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="text-left text-sm text-[var(--color-text-tertiary)]">
                                                <th className="pb-4 font-medium">Company</th>
                                                <th className="pb-4 font-medium">Position</th>
                                                <th className="pb-4 font-medium">Platform</th>
                                                <th className="pb-4 font-medium">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-[var(--color-glass-border)]">
                                            {recentApplications.map((app) => (
                                                <tr key={app.id} className="group">
                                                    <td className="py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-[var(--radius-lg)] bg-[var(--color-bg-tertiary)] flex items-center justify-center">
                                                                <span className="text-sm font-bold text-[var(--color-accent-mid)]">
                                                                    {app.company?.[0] || 'C'}
                                                                </span>
                                                            </div>
                                                            <span className="font-medium text-[var(--color-text-primary)]">
                                                                {app.company}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="py-4 text-[var(--color-text-secondary)]">
                                                        {app.jobTitle}
                                                    </td>
                                                    <td className="py-4 text-[var(--color-text-secondary)]">
                                                        {app.platformName}
                                                    </td>
                                                    <td className="py-4">
                                                        {getStatusBadge(app.status)}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <Briefcase size={48} className="mx-auto text-[var(--color-text-tertiary)] mb-4" />
                                    <p className="text-[var(--color-text-secondary)] mb-4">No applications yet</p>
                                    <Link to="/platforms">
                                        <Button icon={<Zap size={18} />}>Start Applying</Button>
                                    </Link>
                                </div>
                            )}
                        </Card.Content>
                    </Card>
                </motion.div>
            </div>

            {/* Application Status Distribution */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.4 }}
            >
                <Card>
                    <Card.Header>
                        <Card.Title>Application Status Overview</Card.Title>
                        <Card.Description>Distribution of your application statuses</Card.Description>
                    </Card.Header>
                    <Card.Content>
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                            {[
                                { label: 'Pending', value: stats?.pendingApplications || 0, color: 'bg-yellow-500', icon: Clock },
                                { label: 'Submitted', value: stats?.submittedApplications || 0, color: 'bg-blue-500', icon: CheckCircle },
                                { label: 'Interviews', value: stats?.interviewsScheduled || 0, color: 'bg-emerald-500', icon: Calendar },
                                { label: 'Offers', value: stats?.offersReceived || 0, color: 'bg-purple-500', icon: CheckCircle },
                                { label: 'Rejections', value: stats?.rejections || 0, color: 'bg-red-500', icon: XCircle },
                                { label: 'This Month', value: stats?.thisMonthApplications || 0, color: 'bg-cyan-500', icon: TrendingUp },
                            ].map((item, index) => (
                                <div
                                    key={item.label}
                                    className="p-4 rounded-[var(--radius-lg)] bg-[var(--color-bg-tertiary)] text-center"
                                >
                                    <div className={clsx(
                                        'w-10 h-10 rounded-full mx-auto mb-3 flex items-center justify-center',
                                        item.color
                                    )}>
                                        <item.icon size={20} className="text-white" />
                                    </div>
                                    <p className="text-2xl font-bold text-[var(--color-text-primary)]">
                                        {item.value}
                                    </p>
                                    <p className="text-sm text-[var(--color-text-secondary)]">
                                        {item.label}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </Card.Content>
                </Card>
            </motion.div>
        </div>
    );
};

export default DashboardPage;
