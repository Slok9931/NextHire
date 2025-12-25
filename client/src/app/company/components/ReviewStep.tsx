"use client"
import React from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import {
    ArrowLeft,
    Loader2,
    MapPin,
    DollarSign,
    Users,
    Clock,
    Briefcase,
    CheckCircle,
    AlertCircle
} from 'lucide-react'
import { JobFormData } from '../types/jobForm'
import { Company } from '@/type'

interface ReviewStepProps {
    data: JobFormData
    company: Company | null
    onSubmit: () => Promise<void>
    onPrevious: () => void
    loading: boolean
}

const ReviewStep: React.FC<ReviewStepProps> = ({
    data,
    company,
    onSubmit,
    onPrevious,
    loading
}) => {
    const formatSalary = (salary: string) => {
        const numericSalary = parseFloat(salary)
        if (numericSalary >= 100000) {
            return `$${(numericSalary / 1000).toFixed(0)}k`
        }
        return `$${numericSalary.toLocaleString()}`
    }

    const getJobTypeColor = (jobType: string) => {
        const colors = {
            'full_time': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
            'part_time': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
            'contract': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
            'internship': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
        }
        return colors[jobType as keyof typeof colors] || 'bg-gray-100 text-gray-800'
    }

    const getWorkLocationColor = (workLocation: string) => {
        const colors = {
            'remote': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200',
            'onsite': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
            'hybrid': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
        }
        return colors[workLocation as keyof typeof colors] || 'bg-gray-100 text-gray-800'
    }

    const responsibilities = data.responsibilities
        ? data.responsibilities.split('\n').filter(r => r.trim().startsWith('•')).map(r => r.replace('• ', '').trim())
        : []

    const qualifications = data.qualifications
        ? data.qualifications.split('\n').filter(q => q.trim().startsWith('•')).map(q => q.replace('• ', '').trim())
        : []

    const completionItems = [
        { label: 'Job Title & Description', completed: !!(data.title && data.description && data.role) },
        { label: 'Salary & Location', completed: !!(data.salary && data.location && data.openings) },
        { label: 'Responsibilities', completed: responsibilities.length >= 3 },
        { label: 'Qualifications', completed: qualifications.length >= 3 },
    ]

    const allComplete = completionItems.every(item => item.completed)

    return (
        <div className="space-y-6">
            {/* Completion Status */}
            <Card className="border-[#d0d0ff] dark:border-[#0000c5]">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                        {allComplete ? (
                            <CheckCircle className="text-green-600" size={20} />
                        ) : (
                            <AlertCircle className="text-yellow-600" size={20} />
                        )}
                        Job Posting Completion
                    </CardTitle>
                    <CardDescription>
                        {allComplete
                            ? "Your job posting is complete and ready to publish!"
                            : "Please review the items below before publishing"
                        }
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 gap-3">
                        {completionItems.map((item, index) => (
                            <div key={index} className="flex items-center gap-2">
                                {item.completed ? (
                                    <CheckCircle className="text-green-600" size={16} />
                                ) : (
                                    <AlertCircle className="text-yellow-600" size={16} />
                                )}
                                <span className={`text-sm ${item.completed ? 'text-green-700 dark:text-green-300' : 'text-yellow-700 dark:text-yellow-300'}`}>
                                    {item.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Job Preview */}
            <Card className="border-[#d0d0ff] dark:border-[#0000c5]">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Briefcase className="text-[#494bd6]" size={20} />
                        Job Preview
                    </CardTitle>
                    <CardDescription>
                        This is how your job posting will appear to candidates
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {/* Company Header */}
                    {company && (
                        <div className="flex items-center gap-4 mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700 shrink-0">
                                <img
                                    src={company.logo}
                                    alt={`${company.name} logo`}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg">{data.title}</h3>
                                <p className="text-gray-600 dark:text-gray-400">{company.name}</p>
                            </div>
                        </div>
                    )}

                    {/* Job Details */}
                    <div className="space-y-6">
                        {/* Badges and Key Info */}
                        <div className="flex flex-wrap gap-2 mb-4">
                            <Badge className={getJobTypeColor(data.job_type)}>
                                {data.job_type.replace('_', ' ').toUpperCase()}
                            </Badge>
                            <Badge className={getWorkLocationColor(data.work_location)}>
                                {data.work_location.toUpperCase()}
                            </Badge>
                        </div>

                        {/* Key Details Grid */}
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="flex items-center gap-2">
                                <MapPin size={14} className="text-gray-500" />
                                <span>{data.location}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <DollarSign size={14} className="text-gray-500" />
                                <span>{formatSalary(data.salary)}/year</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Users size={14} className="text-gray-500" />
                                <span>{data.openings} opening{parseInt(data.openings) !== 1 ? 's' : ''}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock size={14} className="text-gray-500" />
                                <span>Posted today</span>
                            </div>
                        </div>

                        <Separator />

                        {/* Description */}
                        <div>
                            <h4 className="font-semibold mb-2">Job Description</h4>
                            <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                                {data.description}
                            </p>
                        </div>

                        <Separator />

                        {/* Responsibilities */}
                        <div>
                            <h4 className="font-semibold mb-3">Key Responsibilities</h4>
                            <ul className="space-y-2">
                                {responsibilities.map((responsibility, index) => (
                                    <li key={index} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                                        <span className="text-[#494bd6] mt-1 shrink-0">•</span>
                                        <span>{responsibility}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <Separator />

                        {/* Qualifications */}
                        <div>
                            <h4 className="font-semibold mb-3">Qualifications & Requirements</h4>
                            <ul className="space-y-2">
                                {qualifications.map((qualification, index) => (
                                    <li key={index} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                                        <span className="text-[#494bd6] mt-1 shrink-0">•</span>
                                        <span>{qualification}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Skills */}
                        {data.skills_required.length > 0 && (
                            <>
                                <Separator />
                                <div>
                                    <h4 className="font-semibold mb-3">Required Skills</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {data.skills_required.map((skill, index) => (
                                            <Badge
                                                key={index}
                                                variant="secondary"
                                                className="bg-[#ededff] dark:bg-[#00005f] text-[#2b2ed6]"
                                            >
                                                {skill}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
                <Button
                    variant="outline"
                    onClick={onPrevious}
                    disabled={loading}
                    className="gap-2 cursor-pointer"
                >
                    <ArrowLeft size={16} />
                    Previous
                </Button>
                <div className="flex items-center gap-4">
                    <div className="text-sm text-gray-500">
                        Step 5 of 5
                    </div>
                    <Button
                        onClick={onSubmit}
                        disabled={loading || !allComplete}
                        className="gap-2 cursor-pointer bg-[#494bd6] hover:bg-[#2b2ed6]"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Publishing...
                            </>
                        ) : (
                            <>
                                <CheckCircle size={16} />
                                Publish Job
                            </>
                        )}
                    </Button>
                </div>
            </div>

            {/* Final Warning */}
            {!allComplete && (
                <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-md">
                    <div className="flex items-start gap-3">
                        <AlertCircle className="text-yellow-600 mt-0.5" size={16} />
                        <div>
                            <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                                Complete all sections to publish
                            </p>
                            <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
                                Please go back and complete any missing information before publishing your job.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ReviewStep
