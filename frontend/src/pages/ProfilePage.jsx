import { useState } from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import {
    User,
    Mail,
    Phone,
    Linkedin,
    Github,
    Globe,
    Save,
    Camera
} from 'lucide-react';
import { Card, Button, Input } from '@components/ui';
import { useToast } from '@components/ui/Toast';
import useAuthStore from '@store/authStore';
import authService from '@services/authService';

const ProfilePage = () => {
    const toast = useToast();
    const { user, updateUser } = useAuthStore();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        fullName: user?.fullName || '',
        email: user?.email || '',
        phone: user?.phone || '',
        skills: user?.skills || '',
        experience: user?.experience || '',
        linkedinUrl: user?.linkedinUrl || '',
        githubUrl: user?.githubUrl || '',
        portfolioUrl: user?.portfolioUrl || '',
        additionalInfo: user?.additionalInfo || '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const updatedUser = await authService.updateProfile(formData);
            updateUser(updatedUser);
            toast.success('Profile updated successfully!', 'Success');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update profile', 'Error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">
                    Profile Settings
                </h1>
                <p className="text-[var(--color-text-secondary)] mt-1">
                    Manage your personal information and preferences
                </p>
            </motion.div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Avatar Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <Card>
                        <div className="flex flex-col sm:flex-row items-center gap-6">
                            <div className="relative">
                                <div className="w-24 h-24 rounded-full gradient-bg flex items-center justify-center text-4xl font-bold text-white">
                                    {user?.fullName?.[0] || 'U'}
                                </div>
                                <button
                                    type="button"
                                    className={clsx(
                                        'absolute bottom-0 right-0 w-8 h-8 rounded-full',
                                        'bg-[var(--color-bg-secondary)] border border-[var(--color-glass-border)]',
                                        'flex items-center justify-center',
                                        'hover:bg-[var(--color-bg-tertiary)] transition-colors'
                                    )}
                                >
                                    <Camera size={14} />
                                </button>
                            </div>
                            <div className="text-center sm:text-left">
                                <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">
                                    {user?.fullName || 'User'}
                                </h2>
                                <p className="text-[var(--color-text-secondary)]">{user?.email}</p>
                                <p className="text-sm text-[var(--color-text-tertiary)] mt-1">
                                    Member since {new Date(user?.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                </p>
                            </div>
                        </div>
                    </Card>
                </motion.div>

                {/* Personal Information */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <Card>
                        <Card.Header>
                            <Card.Title>Personal Information</Card.Title>
                            <Card.Description>Your basic profile information</Card.Description>
                        </Card.Header>
                        <Card.Content className="space-y-5">
                            <div className="grid sm:grid-cols-2 gap-5">
                                <Input
                                    label="Full Name"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    icon={<User size={20} />}
                                    required
                                />
                                <Input
                                    label="Email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    icon={<Mail size={20} />}
                                    disabled
                                    helperText="Email cannot be changed"
                                />
                            </div>
                            <Input
                                label="Phone Number"
                                name="phone"
                                type="tel"
                                value={formData.phone}
                                onChange={handleChange}
                                icon={<Phone size={20} />}
                            />
                        </Card.Content>
                    </Card>
                </motion.div>

                {/* Professional Information */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <Card>
                        <Card.Header>
                            <Card.Title>Professional Information</Card.Title>
                            <Card.Description>Your skills and experience</Card.Description>
                        </Card.Header>
                        <Card.Content className="space-y-5">
                            <Input
                                label="Skills"
                                name="skills"
                                value={formData.skills}
                                onChange={handleChange}
                                placeholder="React, Node.js, TypeScript, AWS..."
                                helperText="Comma-separated list of your key skills"
                            />
                            <div>
                                <label className="block mb-2 text-sm font-medium text-[var(--color-text-secondary)]">
                                    Experience Summary
                                </label>
                                <textarea
                                    name="experience"
                                    value={formData.experience}
                                    onChange={handleChange}
                                    rows={4}
                                    placeholder="Brief summary of your professional experience..."
                                    className={clsx(
                                        'w-full px-4 py-3 rounded-[var(--radius-lg)]',
                                        'bg-[var(--color-bg-tertiary)] text-[var(--color-text-primary)]',
                                        'placeholder:text-[var(--color-text-tertiary)]',
                                        'border border-[var(--color-glass-border)]',
                                        'focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-mid)]/30 focus:border-[var(--color-accent-mid)]',
                                        'transition-all duration-300 resize-none'
                                    )}
                                />
                            </div>
                        </Card.Content>
                    </Card>
                </motion.div>

                {/* Social Links */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <Card>
                        <Card.Header>
                            <Card.Title>Social Links</Card.Title>
                            <Card.Description>Connect your professional profiles</Card.Description>
                        </Card.Header>
                        <Card.Content className="space-y-5">
                            <Input
                                label="LinkedIn URL"
                                name="linkedinUrl"
                                value={formData.linkedinUrl}
                                onChange={handleChange}
                                icon={<Linkedin size={20} />}
                                placeholder="https://linkedin.com/in/yourprofile"
                            />
                            <Input
                                label="GitHub URL"
                                name="githubUrl"
                                value={formData.githubUrl}
                                onChange={handleChange}
                                icon={<Github size={20} />}
                                placeholder="https://github.com/yourusername"
                            />
                            <Input
                                label="Portfolio URL"
                                name="portfolioUrl"
                                value={formData.portfolioUrl}
                                onChange={handleChange}
                                icon={<Globe size={20} />}
                                placeholder="https://yourportfolio.com"
                            />
                        </Card.Content>
                    </Card>
                </motion.div>

                {/* Additional Info */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    <Card>
                        <Card.Header>
                            <Card.Title>Additional Information</Card.Title>
                            <Card.Description>Any other details you'd like to include</Card.Description>
                        </Card.Header>
                        <Card.Content>
                            <textarea
                                name="additionalInfo"
                                value={formData.additionalInfo}
                                onChange={handleChange}
                                rows={4}
                                placeholder="Certifications, achievements, preferences..."
                                className={clsx(
                                    'w-full px-4 py-3 rounded-[var(--radius-lg)]',
                                    'bg-[var(--color-bg-tertiary)] text-[var(--color-text-primary)]',
                                    'placeholder:text-[var(--color-text-tertiary)]',
                                    'border border-[var(--color-glass-border)]',
                                    'focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-mid)]/30 focus:border-[var(--color-accent-mid)]',
                                    'transition-all duration-300 resize-none'
                                )}
                            />
                        </Card.Content>
                    </Card>
                </motion.div>

                {/* Submit Button */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="flex justify-end"
                >
                    <Button
                        type="submit"
                        loading={isLoading}
                        icon={<Save size={18} />}
                    >
                        Save Changes
                    </Button>
                </motion.div>
            </form>
        </div>
    );
};

export default ProfilePage;
