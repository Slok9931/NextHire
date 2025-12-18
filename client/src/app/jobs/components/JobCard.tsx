"use client"
import React from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
    MapPin,
    DollarSign,
    Users,
    Clock,
    Building2,
    ExternalLink,
    Calendar,
    CheckCircle
} from 'lucide-react'
import { Job } from '@/type'

interface JobCardProps {
    job: Job
    hasApplied?: boolean
}

const JobCard: React.FC<JobCardProps> = ({ job, hasApplied = false }) => {
    const router = useRouter()

    const formatSalary = (salary: number) => {
        if (salary >= 100000) {
            return `$${(salary / 1000).toFixed(0)}k`
        }
        return `$${salary.toLocaleString()}`
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

    const handleViewJob = () => {
        router.push(`/jobs/${job.job_id}`)
    }

    const handleViewCompany = (e: React.MouseEvent) => {
        e.stopPropagation()
        router.push(`/company/${job.company_id}`)
    }

    return (
        <Card
            className={`border-[#d0d0ff] dark:border-[#0000c5] hover:shadow-lg transition-all duration-300 hover:border-[#494bd6] cursor-pointer group bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm relative ${hasApplied ? 'ring-2 ring-blue-200 dark:ring-blue-800' : ''
                }`}
            onClick={handleViewJob}
        >
            {hasApplied && (
                <div className="absolute top-2 right-2 z-10">
                    <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 shadow-md">
                        <CheckCircle size={12} className="mr-1" />
                        Applied
                    </Badge>
                </div>
            )}

            <CardContent className="p-6">
                <div className="space-y-4">
                    {/* Header with Company Info */}
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                            {job?.company?.logo && (
                                <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 shrink-0">
                                    <img
                                        src={job.company.logo}
                                        alt={job.company.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}
                            <div className="min-w-0 flex-1">
                                <h3 className="font-semibold text-lg mb-1 group-hover:text-[#494bd6] transition-colors line-clamp-1">
                                    {job.title}
                                </h3>
                                {job?.company?.name && (
                                    <button
                                        onClick={handleViewCompany}
                                        className="text-[#494bd6] hover:text-[#2b2ed6] font-medium text-sm flex items-center gap-1 hover:underline"
                                    >
                                        {job.company.name}
                                        <ExternalLink size={12} />
                                    </button>
                                )}
                            </div>
                        </div>
                        <div className="text-right shrink-0">
                            <div className="flex items-center gap-1 text-[#494bd6] font-semibold">
                                <DollarSign size={16} />
                                <span>{formatSalary(job.salary)}/year</span>
                            </div>
                        </div>
                    </div>

                    {/* Job Description */}
                    <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">
                        {job.description}
                    </p>

                    {/* Badges */}
                    <div className="flex flex-wrap gap-2">
                        <Badge className={getJobTypeColor(job.job_type)}>
                            {job.job_type.replace('_', ' ').toUpperCase()}
                        </Badge>
                        <Badge className={getWorkLocationColor(job.work_location)}>
                            {job.work_location.toUpperCase()}
                        </Badge>
                        <Badge variant="outline" className="border-[#494bd6] text-[#494bd6]">
                            {job.role}
                        </Badge>
                    </div>

                    {/* Job Details Grid */}
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                            <MapPin size={14} />
                            <span className="truncate">{job.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Users size={14} />
                            <span>{job.openings} opening{job.openings !== 1 ? 's' : ''}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock size={14} />
                            <span>{new Date(job.created_at).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Building2 size={14} />
                            <span className="truncate">{job?.company?.name || 'Company'}</span>
                        </div>
                    </div>

                    {/* Action Button */}
                    <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-700">
                        <div className="flex items-center gap-1 text-xs text-gray-400">
                            <Calendar size={12} />
                            <span>Posted {new Date(job.created_at).toLocaleDateString()}</span>
                        </div>
                        <Button
                            size="sm"
                            className="cursor-pointer"
                            onClick={(e) => {
                                e.stopPropagation()
                                handleViewJob()
                            }}
                            variant={hasApplied ? "outline" : "default"}
                        >
                            {hasApplied ? 'View Application' : 'View Details'}
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default JobCard