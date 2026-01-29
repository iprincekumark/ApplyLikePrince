import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import {
    Upload,
    FileText,
    Trash2,
    Download,
    Star,
    StarOff,
    CheckCircle,
    X,
    AlertCircle,
    Eye
} from 'lucide-react';
import { Card, Button, Badge, Modal, Spinner } from '@components/ui';
import { useToast } from '@components/ui/Toast';
import resumeService from '@services/resumeService';

const ResumesPage = () => {
    const toast = useToast();
    const [resumes, setResumes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const [selectedResume, setSelectedResume] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    useEffect(() => {
        fetchResumes();
    }, []);

    const fetchResumes = async () => {
        setIsLoading(true);
        try {
            const data = await resumeService.getAll();
            setResumes(data || []);
        } catch (error) {
            console.error('Failed to fetch resumes:', error);
            // Mock data for demo
            setResumes([
                {
                    id: 1,
                    originalFileName: 'Prince_Resume_2024.pdf',
                    fileType: 'application/pdf',
                    fileSize: 245760,
                    extractedName: 'Prince Kumar',
                    extractedEmail: 'prince@example.com',
                    extractedSkills: 'React, Node.js, TypeScript, AWS',
                    isPrimary: true,
                    createdAt: new Date().toISOString(),
                },
                {
                    id: 2,
                    originalFileName: 'Resume_Backend.docx',
                    fileType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                    fileSize: 189440,
                    extractedName: 'Prince Kumar',
                    extractedEmail: 'prince@example.com',
                    extractedSkills: 'Java, Spring Boot, PostgreSQL, Docker',
                    isPrimary: false,
                    createdAt: new Date().toISOString(),
                },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDrag = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    }, []);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        const files = e.dataTransfer?.files;
        if (files && files[0]) {
            handleFileUpload(files[0]);
        }
    }, []);

    const handleFileUpload = async (file) => {
        const validTypes = [
            'application/pdf',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ];

        if (!validTypes.includes(file.type)) {
            toast.error('Please upload a PDF or DOCX file', 'Invalid File Type');
            return;
        }

        if (file.size > 10 * 1024 * 1024) {
            toast.error('File size must be less than 10MB', 'File Too Large');
            return;
        }

        setIsUploading(true);
        try {
            await resumeService.upload(file);
            toast.success('Resume uploaded successfully!', 'Upload Complete');
            fetchResumes();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Upload failed', 'Error');
        } finally {
            setIsUploading(false);
        }
    };

    const handleSetPrimary = async (id) => {
        try {
            await resumeService.setPrimary(id);
            toast.success('Primary resume updated', 'Success');
            setResumes((prev) =>
                prev.map((r) => ({ ...r, isPrimary: r.id === id }))
            );
        } catch (error) {
            toast.error('Failed to update primary resume', 'Error');
        }
    };

    const handleDelete = async () => {
        if (!selectedResume) return;

        try {
            await resumeService.delete(selectedResume.id);
            toast.success('Resume deleted', 'Success');
            setResumes((prev) => prev.filter((r) => r.id !== selectedResume.id));
            setShowDeleteModal(false);
            setSelectedResume(null);
        } catch (error) {
            toast.error('Failed to delete resume', 'Error');
        }
    };

    const formatFileSize = (bytes) => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">
                    My Resumes
                </h1>
                <p className="text-[var(--color-text-secondary)] mt-1">
                    Upload and manage your resumes for auto-apply
                </p>
            </motion.div>

            {/* Upload Zone */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
            >
                <Card
                    hover={false}
                    className={clsx(
                        'border-2 border-dashed transition-all duration-300',
                        dragActive
                            ? 'border-[var(--color-accent-mid)] bg-[var(--color-accent-mid)]/5'
                            : 'border-[var(--color-glass-border)]'
                    )}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                >
                    <div className="text-center py-8">
                        {isUploading ? (
                            <div className="flex flex-col items-center">
                                <Spinner size="lg" />
                                <p className="mt-4 text-[var(--color-text-secondary)]">
                                    Uploading and parsing your resume...
                                </p>
                            </div>
                        ) : (
                            <>
                                <div className="w-16 h-16 rounded-full gradient-bg mx-auto mb-4 flex items-center justify-center">
                                    <Upload size={32} className="text-white" />
                                </div>
                                <h3 className="text-xl font-semibold text-[var(--color-text-primary)] mb-2">
                                    Drag & Drop your resume
                                </h3>
                                <p className="text-[var(--color-text-secondary)] mb-4">
                                    or click to browse • PDF, DOCX up to 10MB
                                </p>
                                <label className="cursor-pointer">
                                    <Button variant="secondary" icon={<Upload size={18} />}>
                                        Choose File
                                    </Button>
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept=".pdf,.docx"
                                        onChange={(e) => {
                                            if (e.target.files?.[0]) {
                                                handleFileUpload(e.target.files[0]);
                                            }
                                        }}
                                    />
                                </label>
                            </>
                        )}
                    </div>
                </Card>
            </motion.div>

            {/* Resumes List */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-4">
                    Uploaded Resumes ({resumes.length})
                </h2>

                {isLoading ? (
                    <div className="grid gap-4">
                        {[1, 2].map((i) => (
                            <Card key={i} className="animate-pulse">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-[var(--radius-lg)] bg-[var(--color-bg-tertiary)]" />
                                    <div className="flex-1 space-y-2">
                                        <div className="h-4 bg-[var(--color-bg-tertiary)] rounded w-1/3" />
                                        <div className="h-3 bg-[var(--color-bg-tertiary)] rounded w-1/2" />
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                ) : resumes.length > 0 ? (
                    <div className="grid gap-4">
                        {resumes.map((resume) => (
                            <Card key={resume.id} hover={false}>
                                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                    {/* File Icon */}
                                    <div className={clsx(
                                        'w-12 h-12 rounded-[var(--radius-lg)] flex items-center justify-center shrink-0',
                                        resume.fileType.includes('pdf')
                                            ? 'bg-red-500/20 text-red-500'
                                            : 'bg-blue-500/20 text-blue-500'
                                    )}>
                                        <FileText size={24} />
                                    </div>

                                    {/* File Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="font-semibold text-[var(--color-text-primary)] truncate">
                                                {resume.originalFileName}
                                            </h3>
                                            {resume.isPrimary && (
                                                <Badge variant="success" size="sm">Primary</Badge>
                                            )}
                                        </div>
                                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-[var(--color-text-secondary)]">
                                            <span>{formatFileSize(resume.fileSize)}</span>
                                            <span>•</span>
                                            <span>Uploaded {formatDate(resume.createdAt)}</span>
                                        </div>
                                        {resume.extractedSkills && (
                                            <p className="mt-2 text-sm text-[var(--color-text-tertiary)] truncate">
                                                Skills: {resume.extractedSkills}
                                            </p>
                                        )}
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-2 shrink-0">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleSetPrimary(resume.id)}
                                            title={resume.isPrimary ? 'Primary resume' : 'Set as primary'}
                                            disabled={resume.isPrimary}
                                        >
                                            {resume.isPrimary ? (
                                                <Star size={18} className="text-yellow-500 fill-yellow-500" />
                                            ) : (
                                                <StarOff size={18} />
                                            )}
                                        </Button>
                                        <Button variant="ghost" size="sm" title="Download">
                                            <Download size={18} />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => {
                                                setSelectedResume(resume);
                                                setShowDeleteModal(true);
                                            }}
                                            title="Delete"
                                            className="text-[var(--color-error)] hover:bg-[var(--color-error-light)]"
                                        >
                                            <Trash2 size={18} />
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <Card hover={false} className="text-center py-12">
                        <FileText size={48} className="mx-auto text-[var(--color-text-tertiary)] mb-4" />
                        <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-2">
                            No resumes uploaded yet
                        </h3>
                        <p className="text-[var(--color-text-secondary)]">
                            Upload your first resume to start auto-applying to jobs
                        </p>
                    </Card>
                )}
            </motion.div>

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={showDeleteModal}
                onClose={() => {
                    setShowDeleteModal(false);
                    setSelectedResume(null);
                }}
                title="Delete Resume"
                size="sm"
            >
                <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-[var(--color-error-light)] mx-auto mb-4 flex items-center justify-center">
                        <AlertCircle size={32} className="text-[var(--color-error)]" />
                    </div>
                    <p className="text-[var(--color-text-secondary)] mb-6">
                        Are you sure you want to delete "{selectedResume?.originalFileName}"? This action cannot be undone.
                    </p>
                    <div className="flex gap-3 justify-center">
                        <Button
                            variant="secondary"
                            onClick={() => {
                                setShowDeleteModal(false);
                                setSelectedResume(null);
                            }}
                        >
                            Cancel
                        </Button>
                        <Button variant="danger" onClick={handleDelete}>
                            Delete Resume
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default ResumesPage;
