"use client"
import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Loader2, Briefcase } from 'lucide-react'
import { Job } from '@/type'

interface JobFormProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSubmit: (jobData: any) => Promise<void>
    loading: boolean
    companyId: number
    job?: Job | null
    isEdit?: boolean
}

const JobForm: React.FC<JobFormProps> = ({
    open,
    onOpenChange,
    onSubmit,
    loading,
    companyId,
    job,
    isEdit = false
}) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        salary: '',
        location: '',
        role: '',
        responsibilities: '',
        qualifications: '',
        job_type: 'full_time',
        work_location: 'onsite',
        openings: '1',
        is_active: true
    })

    useEffect(() => {
        if (job && isEdit) {
            setFormData({
                title: job.title || '',
                description: job.description || '',
                salary: job.salary?.toString() || '',
                location: job.location || '',
                role: job.role || '',
                responsibilities: job.responsibilities || '',
                qualifications: job.qualifications || '',
                job_type: job.job_type || 'full_time',
                work_location: job.work_location || 'onsite',
                openings: job.openings?.toString() || '1',
                is_active: job.is_active ?? true
            })
        }
    }, [job, isEdit, open])

    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            salary: '',
            location: '',
            role: '',
            responsibilities: '',
            qualifications: '',
            job_type: 'full_time',
            work_location: 'onsite',
            openings: '1',
            is_active: true
        })
    }

    const handleInputChange = (field: string, value: string | boolean) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    const formatBulletPoints = (text: string) => {
        if (typeof text !== 'string') return text;
        
        const lines = text.split('\n').map(line => {
            const trimmedLine = line.trim();
            
            if (!trimmedLine) return '';
            
            if (!trimmedLine.startsWith('•') && !trimmedLine.startsWith('-') && !trimmedLine.startsWith('*')) {
                return `• ${trimmedLine}`;
            }
            
            if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('* ')) {
                return `• ${trimmedLine.substring(2)}`;
            }
            
            return trimmedLine;
        });
        
        return lines.join('\n');
    };

    const handleBulletPointChange = (field: string, value: string) => {
        const words = value.replace(/\n/g, ' ').split(' ').filter(word => word.length > 0);
        const longestLine = value.split('\n').reduce((longest, line) => 
            line.length > longest.length ? line : longest, ''
        );
        
        if (longestLine.length > 150) {
            return;
        }
        
        const formattedValue = formatBulletPoints(value);
        setFormData(prev => ({ ...prev, [field]: formattedValue }));
    };

    const handleSubmit = async () => {
        // Validation
        const requiredFields = ['title', 'description', 'salary', 'location', 'role', 'responsibilities', 'qualifications']
        const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData])
        
        if (missingFields.length > 0) {
            alert(`Please fill in all required fields: ${missingFields.join(', ')}`)
            return
        }

        const salary = parseFloat(formData.salary)
        const openings = parseInt(formData.openings)

        if (isNaN(salary) || salary <= 0) {
            alert('Please enter a valid salary')
            return
        }

        if (isNaN(openings) || openings <= 0) {
            alert('Please enter a valid number of openings')
            return
        }

        const jobData = {
            title: formData.title.trim(),
            description: formData.description.trim(),
            salary,
            location: formData.location.trim(),
            role: formData.role.trim(),
            responsibilities: formData.responsibilities.trim(),
            qualifications: formData.qualifications.trim(),
            job_type: formData.job_type,
            work_location: formData.work_location,
            openings,
            company_id: companyId,
            is_active: formData.is_active
        }

        try {
            await onSubmit(jobData)
        } catch (error) {
            console.error('Error submitting job:', error)
        }
    }

    const handleDialogOpenChange = (newOpen: boolean) => {
        if (!newOpen && !loading) {
            resetForm()
        }
        onOpenChange(newOpen)
    }

    return (
        <Dialog open={open} onOpenChange={handleDialogOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Briefcase className="text-[#494bd6]" size={20} />
                        {isEdit ? 'Edit Job' : 'Create New Job'}
                    </DialogTitle>
                    <DialogDescription>
                        {isEdit ? 'Update the job details below' : 'Fill in the details to create a new job posting'}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    {/* Basic Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Job Title *</Label>
                            <Input
                                id="title"
                                value={formData.title}
                                onChange={(e) => handleInputChange('title', e.target.value)}
                                placeholder="e.g., Senior Software Engineer"
                                className="border-[#d0d0ff] dark:border-[#0000c5] focus:border-[#494bd6]"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="role">Role *</Label>
                            <Input
                                id="role"
                                value={formData.role}
                                onChange={(e) => handleInputChange('role', e.target.value)}
                                placeholder="e.g., Software Engineer"
                                className="border-[#d0d0ff] dark:border-[#0000c5] focus:border-[#494bd6]"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Job Description *</Label>
                        <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => handleInputChange('description', e.target.value)}
                            placeholder="Brief description of the job..."
                            className="min-h-24 border-[#d0d0ff] dark:border-[#0000c5] focus:border-[#494bd6]"
                        />
                    </div>

                    {/* Job Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="salary">Annual Salary ($) *</Label>
                            <Input
                                id="salary"
                                type="number"
                                value={formData.salary}
                                onChange={(e) => handleInputChange('salary', e.target.value)}
                                placeholder="e.g., 120000"
                                className="border-[#d0d0ff] dark:border-[#0000c5] focus:border-[#494bd6]"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="location">Location *</Label>
                            <Input
                                id="location"
                                value={formData.location}
                                onChange={(e) => handleInputChange('location', e.target.value)}
                                placeholder="e.g., San Francisco, CA"
                                className="border-[#d0d0ff] dark:border-[#0000c5] focus:border-[#494bd6]"
                            />
                        </div>
                    </div>

                    {/* Job Type and Work Location */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="openings">No. of Openings *</Label>
                            <Input
                                id="openings"
                                type="number"
                                min="1"
                                value={formData.openings}
                                onChange={(e) => handleInputChange('openings', e.target.value)}
                                className="border-[#d0d0ff] dark:border-[#0000c5] focus:border-[#494bd6]"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="job_type">Job Type</Label>
                            <Select value={formData.job_type} onValueChange={(value) => handleInputChange('job_type', value)}>
                                <SelectTrigger className="border-[#d0d0ff] dark:border-[#0000c5] focus:border-[#494bd6] w-full">
                                    <SelectValue placeholder="Select job type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="full_time">Full Time</SelectItem>
                                    <SelectItem value="part_time">Part Time</SelectItem>
                                    <SelectItem value="contract">Contract</SelectItem>
                                    <SelectItem value="internship">Internship</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="work_location">Work Location</Label>
                            <Select value={formData.work_location} onValueChange={(value) => handleInputChange('work_location', value)}>
                                <SelectTrigger className="border-[#d0d0ff] dark:border-[#0000c5] focus:border-[#494bd6] w-full">
                                    <SelectValue placeholder="Select work location" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="onsite">Onsite</SelectItem>
                                    <SelectItem value="remote">Remote</SelectItem>
                                    <SelectItem value="hybrid">Hybrid</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Responsibilities */}
                    <div className="space-y-2">
                        <Label htmlFor="responsibilities">Responsibilities *</Label>
                        <div className="space-y-1">
                            <Textarea
                                id="responsibilities"
                                value={formData.responsibilities}
                                onChange={(e) => handleBulletPointChange('responsibilities', e.target.value)}
                                placeholder="• Develop and maintain applications&#10;• Collaborate with team members&#10;• Write clean, efficient code&#10;• Participate in code reviews"
                                className="min-h-24 border-[#d0d0ff] dark:border-[#0000c5] focus:border-[#494bd6]"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        const textarea = e.target as HTMLTextAreaElement;
                                        const cursorPosition = textarea.selectionStart;
                                        const textBefore = textarea.value.substring(0, cursorPosition);
                                        const textAfter = textarea.value.substring(cursorPosition);
                                        const newValue = textBefore + '\n• ' + textAfter;
                                        handleBulletPointChange('responsibilities', newValue);
                                        
                                        // Set cursor position after the bullet point
                                        setTimeout(() => {
                                            textarea.selectionStart = textarea.selectionEnd = cursorPosition + 3;
                                        }, 0);
                                    }
                                }}
                            />
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                Use bullet points only. Press Enter to create a new bullet point.
                            </p>
                        </div>
                    </div>

                    {/* Qualifications */}
                    <div className="space-y-2">
                        <Label htmlFor="qualifications">Qualifications *</Label>
                        <div className="space-y-1">
                            <Textarea
                                id="qualifications"
                                value={formData.qualifications}
                                onChange={(e) => handleBulletPointChange('qualifications', e.target.value)}
                                placeholder="• Bachelor's degree in Computer Science&#10;• 3+ years of experience&#10;• Proficiency in React, Node.js&#10;• Strong problem-solving skills"
                                className="min-h-24 border-[#d0d0ff] dark:border-[#0000c5] focus:border-[#494bd6]"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        const textarea = e.target as HTMLTextAreaElement;
                                        const cursorPosition = textarea.selectionStart;
                                        const textBefore = textarea.value.substring(0, cursorPosition);
                                        const textAfter = textarea.value.substring(cursorPosition);
                                        const newValue = textBefore + '\n• ' + textAfter;
                                        handleBulletPointChange('qualifications', newValue);
                                        
                                        // Set cursor position after the bullet point
                                        setTimeout(() => {
                                            textarea.selectionStart = textarea.selectionEnd = cursorPosition + 3;
                                        }, 0);
                                    }
                                }}
                            />
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                Use bullet points only. Press Enter to create a new bullet point.
                            </p>
                        </div>
                    </div>

                    {/* Active Status */}
                    {isEdit && (
                        <div className="flex items-center space-x-2">
                            <Switch
                                id="is_active"
                                checked={formData.is_active}
                                onCheckedChange={(checked) => handleInputChange('is_active', checked)}
                            />
                            <Label htmlFor="is_active">Job is active and accepting applications</Label>
                        </div>
                    )}
                </div>

                <DialogFooter className="gap-2">
                    <Button
                        variant="outline"
                        onClick={() => handleDialogOpenChange(false)}
                        disabled={loading}
                        className="cursor-pointer"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="cursor-pointer"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                {isEdit ? 'Updating...' : 'Creating...'}
                            </>
                        ) : (
                            isEdit ? 'Update Job' : 'Create Job'
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default JobForm