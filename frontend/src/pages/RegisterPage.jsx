import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Phone, ArrowRight, CheckCircle } from 'lucide-react';
import { Button, Input, Card } from '@components/ui';
import { useToast } from '@components/ui/Toast';
import useAuthStore from '@store/authStore';
import { clsx } from 'clsx';

const RegisterPage = () => {
    const navigate = useNavigate();
    const toast = useToast();
    const { register, isLoading } = useAuthStore();

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
    });
    const [errors, setErrors] = useState({});
    const [agreeToTerms, setAgreeToTerms] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.fullName.trim()) {
            newErrors.fullName = 'Full name is required';
        }

        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Invalid email format';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        if (!agreeToTerms) {
            newErrors.terms = 'You must agree to the terms';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        const result = await register({
            fullName: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            password: formData.password,
        });

        if (result.success) {
            toast.success('Your account has been created!', 'Welcome!');
            navigate('/dashboard');
        } else {
            toast.error(result.error || 'Registration failed', 'Error');
        }
    };

    // Password strength indicator
    const getPasswordStrength = () => {
        const password = formData.password;
        if (!password) return { strength: 0, label: '' };

        let strength = 0;
        if (password.length >= 6) strength++;
        if (password.length >= 8) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;

        const labels = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
        const colors = ['', 'bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500', 'bg-emerald-500'];

        return { strength, label: labels[strength], color: colors[strength] };
    };

    const passwordStrength = getPasswordStrength();

    return (
        <div className="w-full">
            <Card className="p-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <Link to="/" className="inline-flex items-center gap-2 mb-6">
                        <div className="w-12 h-12 rounded-[var(--radius-xl)] gradient-bg flex items-center justify-center">
                            <span className="text-white font-bold text-xl">A</span>
                        </div>
                    </Link>
                    <h1 className="text-2xl font-bold text-[var(--color-text-primary)] mb-2">
                        Create Your Account
                    </h1>
                    <p className="text-[var(--color-text-secondary)]">
                        Start automating your job applications today
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    <Input
                        label="Full Name"
                        name="fullName"
                        type="text"
                        placeholder="John Doe"
                        icon={<User size={20} />}
                        value={formData.fullName}
                        onChange={handleChange}
                        error={errors.fullName}
                        required
                    />

                    <Input
                        label="Email"
                        name="email"
                        type="email"
                        placeholder="you@example.com"
                        icon={<Mail size={20} />}
                        value={formData.email}
                        onChange={handleChange}
                        error={errors.email}
                        required
                    />

                    <Input
                        label="Phone (Optional)"
                        name="phone"
                        type="tel"
                        placeholder="+1 (555) 000-0000"
                        icon={<Phone size={20} />}
                        value={formData.phone}
                        onChange={handleChange}
                    />

                    <div>
                        <Input
                            label="Password"
                            name="password"
                            type="password"
                            placeholder="••••••••"
                            icon={<Lock size={20} />}
                            value={formData.password}
                            onChange={handleChange}
                            error={errors.password}
                            required
                        />
                        {formData.password && (
                            <div className="mt-2">
                                <div className="flex gap-1 mb-1">
                                    {[1, 2, 3, 4, 5].map((level) => (
                                        <div
                                            key={level}
                                            className={clsx(
                                                'h-1 flex-1 rounded-full transition-colors',
                                                level <= passwordStrength.strength
                                                    ? passwordStrength.color
                                                    : 'bg-[var(--color-bg-tertiary)]'
                                            )}
                                        />
                                    ))}
                                </div>
                                <p className="text-xs text-[var(--color-text-tertiary)]">
                                    Password strength: {passwordStrength.label}
                                </p>
                            </div>
                        )}
                    </div>

                    <Input
                        label="Confirm Password"
                        name="confirmPassword"
                        type="password"
                        placeholder="••••••••"
                        icon={<Lock size={20} />}
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        error={errors.confirmPassword}
                        required
                    />

                    {/* Terms Checkbox */}
                    <label className={clsx(
                        'flex items-start gap-3 cursor-pointer p-4 rounded-[var(--radius-lg)]',
                        'border transition-colors duration-200',
                        agreeToTerms
                            ? 'border-[var(--color-accent-mid)] bg-[var(--color-accent-mid)]/5'
                            : 'border-[var(--color-glass-border)]',
                        errors.terms && 'border-[var(--color-error)]'
                    )}>
                        <div className={clsx(
                            'w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 mt-0.5',
                            'transition-colors duration-200',
                            agreeToTerms
                                ? 'bg-[var(--color-accent-mid)] border-[var(--color-accent-mid)]'
                                : 'border-[var(--color-glass-border)]'
                        )}>
                            {agreeToTerms && <CheckCircle size={14} className="text-white" />}
                        </div>
                        <input
                            type="checkbox"
                            className="sr-only"
                            checked={agreeToTerms}
                            onChange={(e) => setAgreeToTerms(e.target.checked)}
                        />
                        <span className="text-sm text-[var(--color-text-secondary)]">
                            I agree to the{' '}
                            <Link to="/terms" className="text-[var(--color-accent-mid)] hover:underline">
                                Terms of Service
                            </Link>{' '}
                            and{' '}
                            <Link to="/privacy" className="text-[var(--color-accent-mid)] hover:underline">
                                Privacy Policy
                            </Link>
                        </span>
                    </label>
                    {errors.terms && (
                        <p className="text-sm text-[var(--color-error)] -mt-3">{errors.terms}</p>
                    )}

                    <Button
                        type="submit"
                        fullWidth
                        loading={isLoading}
                        icon={<ArrowRight size={18} />}
                        iconPosition="right"
                    >
                        Create Account
                    </Button>
                </form>

                {/* Login Link */}
                <p className="text-center mt-8 text-[var(--color-text-secondary)]">
                    Already have an account?{' '}
                    <Link
                        to="/login"
                        className="text-[var(--color-accent-mid)] font-medium hover:underline"
                    >
                        Sign in
                    </Link>
                </p>
            </Card>
        </div>
    );
};

export default RegisterPage;
