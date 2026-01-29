import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import {
    ExternalLink,
    CheckCircle,
    Zap,
    Globe,
    Search
} from 'lucide-react';
import { Card, Button, Badge, Input, Skeleton } from '@components/ui';
import { useToast } from '@components/ui/Toast';
import platformService from '@services/platformService';

const PlatformsPage = () => {
    const toast = useToast();
    const [platforms, setPlatforms] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedPlatforms, setSelectedPlatforms] = useState([]);

    useEffect(() => {
        fetchPlatforms();
    }, []);

    const fetchPlatforms = async () => {
        setIsLoading(true);
        try {
            const data = await platformService.getAll();
            setPlatforms(data || []);
        } catch (error) {
            console.error('Failed to fetch platforms:', error);
            // Mock data
            setPlatforms([
                { id: 1, name: 'linkedin', displayName: 'LinkedIn', description: 'Professional networking and job search platform', logoUrl: '', baseUrl: 'https://linkedin.com', type: 'PROFESSIONAL', requiresLogin: true },
                { id: 2, name: 'hirect', displayName: 'Hirect', description: 'Chat-based direct hiring platform for startups', logoUrl: '', baseUrl: 'https://hirect.in', type: 'STARTUP', requiresLogin: true },
                { id: 3, name: 'cutshort', displayName: 'Cutshort', description: 'AI-powered job matching for tech professionals', logoUrl: '', baseUrl: 'https://cutshort.io', type: 'TECH', requiresLogin: true },
                { id: 4, name: 'instahyre', displayName: 'Instahyre', description: 'Verified jobs from top companies', logoUrl: '', baseUrl: 'https://instahyre.com', type: 'PROFESSIONAL', requiresLogin: true },
                { id: 5, name: 'naukri', displayName: 'Naukri', description: "India's largest job portal", logoUrl: '', baseUrl: 'https://naukri.com', type: 'GENERAL', requiresLogin: true },
                { id: 6, name: 'indeed', displayName: 'Indeed', description: 'Worldwide job search engine', logoUrl: '', baseUrl: 'https://indeed.com', type: 'GENERAL', requiresLogin: false },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const togglePlatform = (id) => {
        setSelectedPlatforms((prev) =>
            prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
        );
    };

    const handleBulkApply = () => {
        if (selectedPlatforms.length === 0) {
            toast.warning('Please select at least one platform', 'No Platforms Selected');
            return;
        }
        toast.info(`Starting auto-apply to ${selectedPlatforms.length} platforms...`, 'Auto Apply');
        // In real implementation, this would trigger bulk apply
    };

    const filteredPlatforms = platforms.filter((platform) =>
        platform.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        platform.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getPlatformColor = (type) => {
        const colors = {
            PROFESSIONAL: 'from-blue-500 to-indigo-600',
            STARTUP: 'from-emerald-500 to-teal-600',
            TECH: 'from-violet-500 to-purple-600',
            GENERAL: 'from-amber-500 to-orange-600',
        };
        return colors[type] || colors.GENERAL;
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
                        Job Platforms
                    </h1>
                    <p className="text-[var(--color-text-secondary)] mt-1">
                        Select platforms to auto-apply with your resume
                    </p>
                </div>
                <Button
                    icon={<Zap size={18} />}
                    onClick={handleBulkApply}
                    disabled={selectedPlatforms.length === 0}
                >
                    Auto Apply ({selectedPlatforms.length})
                </Button>
            </motion.div>

            {/* Search */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
            >
                <Input
                    placeholder="Search platforms..."
                    icon={<Search size={20} />}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </motion.div>

            {/* Platforms Grid */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                {isLoading ? (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <Skeleton.Card key={i} />
                        ))}
                    </div>
                ) : filteredPlatforms.length > 0 ? (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredPlatforms.map((platform, index) => {
                            const isSelected = selectedPlatforms.includes(platform.id);

                            return (
                                <motion.div
                                    key={platform.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <Card
                                        hover={false}
                                        className={clsx(
                                            'cursor-pointer transition-all duration-300 relative overflow-hidden',
                                            isSelected && 'ring-2 ring-[var(--color-accent-mid)]'
                                        )}
                                        onClick={() => togglePlatform(platform.id)}
                                    >
                                        {/* Selection Indicator */}
                                        {isSelected && (
                                            <div className="absolute top-4 right-4 w-6 h-6 rounded-full gradient-bg flex items-center justify-center">
                                                <CheckCircle size={14} className="text-white" />
                                            </div>
                                        )}

                                        {/* Platform Logo */}
                                        <div className={clsx(
                                            'w-14 h-14 rounded-[var(--radius-xl)] flex items-center justify-center mb-4',
                                            `bg-gradient-to-br ${getPlatformColor(platform.type)}`
                                        )}>
                                            <Globe size={28} className="text-white" />
                                        </div>

                                        {/* Platform Info */}
                                        <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-1">
                                            {platform.displayName}
                                        </h3>
                                        <p className="text-sm text-[var(--color-text-secondary)] mb-4 line-clamp-2">
                                            {platform.description}
                                        </p>

                                        {/* Tags */}
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            <Badge variant="outline" size="sm">
                                                {platform.type}
                                            </Badge>
                                            {platform.requiresLogin && (
                                                <Badge variant="warning" size="sm">
                                                    Login Required
                                                </Badge>
                                            )}
                                        </div>

                                        {/* Action */}
                                        <a
                                            href={platform.baseUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            onClick={(e) => e.stopPropagation()}
                                            className="inline-flex items-center gap-1 text-sm text-[var(--color-accent-mid)] hover:underline"
                                        >
                                            Visit Platform <ExternalLink size={14} />
                                        </a>
                                    </Card>
                                </motion.div>
                            );
                        })}
                    </div>
                ) : (
                    <Card hover={false} className="text-center py-12">
                        <Globe size={48} className="mx-auto text-[var(--color-text-tertiary)] mb-4" />
                        <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-2">
                            No platforms found
                        </h3>
                        <p className="text-[var(--color-text-secondary)]">
                            Try adjusting your search terms
                        </p>
                    </Card>
                )}
            </motion.div>
        </div>
    );
};

export default PlatformsPage;
