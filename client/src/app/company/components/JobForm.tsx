"use client"
import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Loader2, Briefcase, X, Search, Plus } from 'lucide-react'
import { Job } from '@/type'
import axios from 'axios'
import { user_service } from '@/context/AppContext'

interface Skill {
    skill_id: number
    name: string
}

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

    // Skills state
    const [selectedSkills, setSelectedSkills] = useState<string[]>([])
    const [skillInput, setSkillInput] = useState('')
    const [allSkills, setAllSkills] = useState<Skill[]>([])
    const [filteredSkills, setFilteredSkills] = useState<Skill[]>([])
    const [showDropdown, setShowDropdown] = useState(false)
    const [skillOperationLoading, setSkillOperationLoading] = useState(false)

    useEffect(() => {
        if (open) {
            fetchAllSkills()
        }
    }, [open])

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
            setSelectedSkills(job.skills_required || [])
        }
    }, [job, isEdit, open])

    const fetchAllSkills = async () => {
        try {
            const { data } = await axios.get(`${user_service}/api/user/skill/search`)
            setAllSkills(data.data || [])
            setFilteredSkills(data.data || [])
        } catch (error) {
            console.error('Error fetching skills:', error)
            setAllSkills([])
            setFilteredSkills([])
        }
    }

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
        setSelectedSkills([])
        setSkillInput('')
        setShowDropdown(false)
    }

    const handleSkillInputChange = (value: string) => {
        setSkillInput(value)
        if (value.trim()) {
            const filtered = allSkills.filter(skill =>
                skill.name.toLowerCase().includes(value.toLowerCase()) &&
                !selectedSkills.some(selected => selected.toLowerCase() === skill.name.toLowerCase())
            )
            setFilteredSkills(filtered)
        } else {
            setFilteredSkills(allSkills.filter(skill =>
                !selectedSkills.some(selected => selected.toLowerCase() === skill.name.toLowerCase())
            ))
        }
        setShowDropdown(true)
    }

    const handleSkillSelect = (skill: Skill) => {
        if (!selectedSkills.some(selected => selected.toLowerCase() === skill.name.toLowerCase())) {
            setSelectedSkills(prev => [...prev, skill.name])
            setSkillInput('')
            setShowDropdown(false)
        }
    }

    const handleAddCustomSkill = () => {
        if (skillInput.trim() && !selectedSkills.some(skill => skill.toLowerCase() === skillInput.trim().toLowerCase())) {
            setSelectedSkills(prev => [...prev, skillInput.trim()])
            setSkillInput('')
            setShowDropdown(false)
        }
    }

    const handleRemoveSkill = (skillToRemove: string) => {
        setSelectedSkills(prev => prev.filter(skill => skill !== skillToRemove))
    }

    const handleInputFocus = () => {
        setShowDropdown(true)
    }

    const handleInputBlur = () => {
        setTimeout(() => setShowDropdown(false), 200)
    }

    const handleInputChange = (field: string, value: string | boolean) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    const formatBulletPoints = (text: string) => {
        if (typeof text !== 'string') return text

        const lines = text.split('\n').map(line => {
            const trimmedLine = line.trim()

            if (!trimmedLine) return ''

            if (!trimmedLine.startsWith('•') && !trimmedLine.startsWith('-') && !trimmedLine.startsWith('*')) {
                return `• ${trimmedLine}`
            }

            if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('* ')) {
                return `• ${trimmedLine.substring(2)}`
            }

            return trimmedLine
        })

        return lines.join('\n')
    }

    const handleBulletPointChange = (field: string, value: string) => {
        const words = value.replace(/\n/g, ' ').split(' ').filter(word => word.length > 0)
        const longestLine = value.split('\n').reduce((longest, line) =>
            line.length > longest.length ? line : longest, ''
        )

        if (longestLine.length > 150) {
            return
        }

        const formattedValue = formatBulletPoints(value)
        setFormData(prev => ({ ...prev, [field]: formattedValue }))
    }

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
            is_active: formData.is_active,
            skills_required: selectedSkills.length > 0 ? selectedSkills.filter(skill => skill && skill.trim()) : []
        }

        console.log('JobData being sent:', JSON.stringify(jobData, null, 2))

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
                                        e.preventDefault()
                                        const textarea = e.target as HTMLTextAreaElement
                                        const cursorPosition = textarea.selectionStart
                                        const textBefore = textarea.value.substring(0, cursorPosition)
                                        const textAfter = textarea.value.substring(cursorPosition)
                                        const newValue = textBefore + '\n• ' + textAfter
                                        handleBulletPointChange('responsibilities', newValue)

                                        // Set cursor position after the bullet point
                                        setTimeout(() => {
                                            textarea.selectionStart = textarea.selectionEnd = cursorPosition + 3
                                        }, 0)
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
                                        e.preventDefault()
                                        const textarea = e.target as HTMLTextAreaElement
                                        const cursorPosition = textarea.selectionStart
                                        const textBefore = textarea.value.substring(0, cursorPosition)
                                        const textAfter = textarea.value.substring(cursorPosition)
                                        const newValue = textBefore + '\n• ' + textAfter
                                        handleBulletPointChange('qualifications', newValue)

                                        // Set cursor position after the bullet point
                                        setTimeout(() => {
                                            textarea.selectionStart = textarea.selectionEnd = cursorPosition + 3
                                        }, 0)
                                    }
                                }}
                            />
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                Use bullet points only. Press Enter to create a new bullet point.
                            </p>
                        </div>
                    </div>

                    {/* Skills Required */}
                    <div className="space-y-4">
                        <Label>Required Skills (Optional)</Label>
                        <div className="space-y-2">
                            {/* Display Selected Skills */}
                            {selectedSkills.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {selectedSkills.map((skill, index) => (
                                        <Badge
                                            key={index}
                                            variant="secondary"
                                            className="bg-[#ededff] dark:bg-[#00005f] text-[#2b2ed6] border border-[#b0b0ff] dark:border-[#0000c5] hover:bg-[#d0d0ff] px-3 py-1 gap-2"
                                        >
                                            {skill}
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveSkill(skill)}
                                                disabled={skillOperationLoading}
                                                className="text-red-500 hover:text-red-700 ml-1 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <X size={12} />
                                            </button>
                                        </Badge>
                                    ))}
                                </div>
                            )}

                            {/* Skills Input */}
                            <div className="relative">
                                <div className="flex gap-2">
                                    <div className="relative flex-1">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                                        <Input
                                            value={skillInput}
                                            onChange={(e) => handleSkillInputChange(e.target.value)}
                                            onFocus={handleInputFocus}
                                            onBlur={handleInputBlur}
                                            placeholder="Search or add skills (e.g., JavaScript, Python, React...)"
                                            className="pl-10 border-[#d0d0ff] dark:border-[#0000c5] focus:border-[#494bd6]"
                                        />
                                        {showDropdown && (
                                            <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg max-h-60 overflow-y-auto">
                                                {filteredSkills.length > 0 ? (
                                                    <>
                                                        <div className="px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wide border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
                                                            Available Skills ({filteredSkills.length})
                                                        </div>
                                                        {filteredSkills.slice(0, 8).map((skill) => (
                                                            <button
                                                                key={skill.skill_id}
                                                                type="button"
                                                                onClick={() => handleSkillSelect(skill)}
                                                                className="w-full text-left px-3 py-2 text-sm hover:bg-[#ededff] dark:hover:bg-gray-700 cursor-pointer transition-colors"
                                                            >
                                                                {skill.name}
                                                            </button>
                                                        ))}
                                                        {filteredSkills.length > 8 && (
                                                            <div className="px-3 py-2 text-xs text-gray-500 bg-gray-50 dark:bg-gray-700/30">
                                                                +{filteredSkills.length - 8} more skills...
                                                            </div>
                                                        )}
                                                    </>
                                                ) : skillInput.trim() ? (
                                                    <div className="px-3 py-2 text-sm text-gray-500">
                                                        No existing skills found matching "{skillInput}"
                                                    </div>
                                                ) : (
                                                    <div className="px-3 py-2 text-sm text-gray-500">
                                                        Start typing to search skills...
                                                    </div>
                                                )}

                                                {skillInput.trim() && !filteredSkills.some(skill => skill.name.toLowerCase() === skillInput.trim().toLowerCase()) && (
                                                    <>
                                                        <div className="px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wide border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
                                                            Add Custom Skill
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={handleAddCustomSkill}
                                                            className="w-full text-left px-3 py-2 text-sm hover:bg-[#ededff] dark:hover:bg-gray-700 cursor-pointer transition-colors flex items-center gap-2"
                                                        >
                                                            <Plus size={14} />
                                                            Add "{skillInput.trim()}"
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            Add skills that are required for this position. These will help match with qualified candidates.
                        </p>
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