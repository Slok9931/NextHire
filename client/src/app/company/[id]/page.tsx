"use client"
import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { 
    Building2, 
    Globe, 
    Calendar, 
    MapPin, 
    DollarSign, 
    Users, 
    Briefcase, 
    Clock, 
    ExternalLink,
    ArrowLeft,
    Plus,
    Edit,
    Eye,
    EyeOff
} from 'lucide-react'
import { useAppData } from '@/context/AppContext'
import { Company, Job } from '@/type'
import Loading from '@/components/loading'

const CompanyPage = () => {
    const { id } = useParams()
    const router = useRouter()
    const { 
        user, 
        getCompanyDetails, 
        updateJob, 
        toggleJobStatus, 
        btnLoading 
    } = useAppData()
    
    const [company, setCompany] = useState<Company | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [editingJob, setEditingJob] = useState<Job | null>(null)
    const [togglingJobId, setTogglingJobId] = useState<number | null>(null)

    useEffect(() => {
        if (id) {
            fetchCompanyData()
        }
    }, [id])

    const fetchCompanyData = async () => {
        try {
            setLoading(true)
            setError('')
            const companyData = await getCompanyDetails(Number(id))
            
            if (!companyData) {
                setError('Company not found')
                return
            }
            
            setCompany(companyData)
        } catch (error) {
            console.error('Error fetching company data:', error)
            setError('Failed to load company details')
        } finally {
            setLoading(false)
        }
    }

    const handleUpdateJob = async (jobData: any) => {
        if (!editingJob) return
        
        try {
            await updateJob(editingJob.job_id, jobData)
            setEditingJob(null)
            fetchCompanyData() // Refresh data
        } catch (error) {
            console.error('Error updating job:', error)
        }
    }

    const handleToggleJobStatus = async (jobId: number, currentStatus: boolean) => {
        try {
            setTogglingJobId(jobId)
            await toggleJobStatus(jobId, !currentStatus)
            fetchCompanyData() // Refresh data
        } catch (error) {
            console.error('Error toggling job status:', error)
        } finally {
            setTogglingJobId(null)
        }
    }

    const handleEditJob = (job: Job) => {
        router.push(`/company/${id}/edit-job/${job.job_id}`)
    }

    const handleAddJob = () => {
        router.push(`/company/${id}/create-job`)
    }

    const handleJobCardClick = (job: Job) => {
        router.push(`/jobs/${job.job_id}`)
    }

    const isOwner = user && company && Number(user.user_id) === company.recruiter_id

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

    if (loading) return <Loading />

    if (error) {
        return (
            <div className="min-h-screen py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center py-12">
                        <Building2 className="mx-auto text-gray-400 mb-4" size={64} />
                        <h2 className="text-2xl font-semibold mb-2">{error}</h2>
                        <p className="text-gray-500 mb-6">
                            The company you're looking for might have been removed or doesn't exist.
                        </p>
                        <Button onClick={() => router.push('/jobs')} className="gap-2 cursor-pointer">
                            <ArrowLeft size={16} />
                            Back to Jobs
                        </Button>
                    </div>
                </div>
            </div>
        )
    }

    if (!company) return <Loading />

    const jobs = company.jobs || []
    const activeJobs = jobs.filter((job: Job) => job.is_active)

    return (
        <>
            <div className="min-h-screen py-8 bg-linear-to-br from-[#ededff] via-white to-[#f0f8ff] dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Back Button */}
                    <div className="mb-6">
                        <Button 
                            variant="ghost" 
                            onClick={() => router.back()}
                            className="gap-2 text-[#494bd6] hover:text-[#2b2ed6] cursor-pointer"
                        >
                            <ArrowLeft size={16} />
                            Back
                        </Button>
                    </div>

                    {/* Company Header */}
                    <Card className="shadow-xl border-[#b0b0ff] dark:border-[#0000c5] bg-white/90 dark:bg-gray-900/90 backdrop-blur-md mb-8">
                        <CardContent className="p-8">
                            <div className="flex flex-col md:flex-row gap-6">
                                <div className="w-32 h-32 rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-700 shrink-0 mx-auto md:mx-0">
                                    <img 
                                        src={company.logo} 
                                        alt={`${company.name} logo`}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="flex-1 text-center md:text-left">
                                    <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                                        {company.name}
                                    </h1>
                                    <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                                        {company.description}
                                    </p>
                                    <div className="flex flex-wrap gap-4 justify-center md:justify-start text-sm text-gray-500">
                                        <div className="flex items-center gap-2">
                                            <Calendar size={16} />
                                            <span>Created {new Date(company.created_at).getFullYear()}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Globe size={16} />
                                            <a 
                                                href={company.website}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-[#494bd6] hover:text-[#2b2ed6] flex items-center gap-1"
                                            >
                                                {company.website.replace(/^https?:\/\//, '')}
                                                <ExternalLink size={12} />
                                            </a>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Briefcase size={16} />
                                            <span>{activeJobs.length} open job{activeJobs.length !== 1 ? 's' : ''}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Jobs Section */}
                    <Card className="shadow-xl border-[#b0b0ff] dark:border-[#0000c5] bg-white/90 dark:bg-gray-900/90 backdrop-blur-md">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="flex items-center gap-2 text-2xl">
                                        <Briefcase className="text-[#494bd6]" size={24} />
                                        {isOwner ? 'Job Positions' : 'Open Positions'}
                                    </CardTitle>
                                    <CardDescription>
                                        {isOwner 
                                            ? 'Manage your job postings and applications' 
                                            : `Discover career opportunities at ${company.name}`
                                        }
                                    </CardDescription>
                                </div>
                                {isOwner && (
                                    <Button onClick={handleAddJob} className="gap-2 cursor-pointer">
                                        <Plus size={16} />
                                        Add Job
                                    </Button>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent>
                            {jobs.length === 0 ? (
                                <div className="text-center py-12">
                                    <Briefcase className="mx-auto text-gray-400 mb-4" size={48} />
                                    <h3 className="text-lg font-semibold mb-2">
                                        {isOwner ? 'No jobs posted yet' : 'No open positions'}
                                    </h3>
                                    <p className="text-gray-500 mb-4">
                                        {isOwner 
                                            ? 'Start by creating your first job posting'
                                            : `${company.name} doesn't have any job openings at the moment. Check back later!`
                                        }
                                    </p>
                                    {isOwner && (
                                        <Button onClick={handleAddJob} className="gap-2 cursor-pointer">
                                            <Plus size={16} />
                                            Create First Job
                                        </Button>
                                    )}
                                </div>
                            ) : (
                                <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
                                    {(isOwner ? jobs : activeJobs).map((job: Job) => (
                                        <Card 
                                            key={job.job_id}
                                            className="border-[#d0d0ff] dark:border-[#0000c5] hover:shadow-lg transition-all duration-300 hover:border-[#494bd6] group cursor-pointer"
                                            onClick={() => handleJobCardClick(job)}
                                        >
                                            <CardContent className="p-6">
                                                <div className="space-y-4">
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex-1">
                                                            <h3 className="font-semibold text-lg mb-2 group-hover:text-[#494bd6] transition-colors">
                                                                {job.title}
                                                            </h3>
                                                            <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3">
                                                                {job.description}
                                                            </p>
                                                        </div>
                                                        {isOwner && (
                                                            <div className="flex items-center gap-2 ml-4">
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation()
                                                                        handleEditJob(job)
                                                                    }}
                                                                    className="text-[#494bd6] hover:text-[#2b2ed6] hover:bg-[#ededff] cursor-pointer"
                                                                >
                                                                    <Edit size={16} />
                                                                </Button>
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="flex flex-wrap gap-2">
                                                        <Badge className={getJobTypeColor(job.job_type)}>
                                                            {job.job_type.replace('_', ' ').toUpperCase()}
                                                        </Badge>
                                                        <Badge className={getWorkLocationColor(job.work_location)}>
                                                            {job.work_location.toUpperCase()}
                                                        </Badge>
                                                        {isOwner && (
                                                            <Badge variant={job.is_active ? "default" : "secondary"}>
                                                                {job.is_active ? 'ACTIVE' : 'INACTIVE'}
                                                            </Badge>
                                                        )}
                                                        {!isOwner && !job.is_active && (
                                                            <Badge variant="secondary" className="bg-gray-100 text-gray-600">
                                                                CLOSED
                                                            </Badge>
                                                        )}
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-500">
                                                        <div className="flex items-center gap-2">
                                                            <MapPin size={14} />
                                                            <span className="truncate">{job.location}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <DollarSign size={14} />
                                                            <span>{formatSalary(job.salary)}/year</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Users size={14} />
                                                            <span>{job.openings} opening{job.openings !== 1 ? 's' : ''}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Clock size={14} />
                                                            <span>{new Date(job.created_at).toLocaleDateString()}</span>
                                                        </div>
                                                    </div>

                                                    <Separator />

                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm font-medium text-[#494bd6]">
                                                            {job.role}
                                                        </span>
                                                        {isOwner && (
                                                            <div className="flex items-center gap-3">
                                                                <div className="flex items-center gap-2">
                                                                    {job.is_active ? (
                                                                        <Eye className="text-green-600" size={16} />
                                                                    ) : (
                                                                        <EyeOff className="text-gray-400" size={16} />
                                                                    )}
                                                                    <Switch
                                                                        checked={job.is_active}
                                                                        onCheckedChange={(checked) => {
                                                                            // Prevent event bubbling to card click
                                                                            event?.stopPropagation()
                                                                            handleToggleJobStatus(job.job_id, job.is_active)
                                                                        }}
                                                                        disabled={togglingJobId === job.job_id}
                                                                        className="data-[state=checked]:bg-[#494bd6] cursor-pointer"
                                                                        onClick={(e) => e.stopPropagation()}
                                                                    />
                                                                    <span className="text-xs text-gray-500">
                                                                        {job.is_active ? 'Active' : 'Inactive'}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    )
}

export default CompanyPage
