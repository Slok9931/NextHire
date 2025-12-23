"use client"
import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
    ArrowLeft,
    MapPin,
    DollarSign,
    Users,
    Clock,
    Building2,
    ExternalLink,
    Calendar,
    Briefcase,
    CheckCircle,
    Star,
    Globe,
    Send,
    Eye,
    AlertTriangle,
    UserCheck,
    XCircle
} from 'lucide-react'
import { useAppData } from '@/context/AppContext'
import { Job } from '@/type'
import Loading from '@/components/loading'
import toast from 'react-hot-toast'
import ApplicationsTab from './components/ApplicationsTab'

const JobPage = () => {
    const { id } = useParams()
    const router = useRouter()
    const { user, getJobDetails, isAuth, applyForJob, btnLoading, checkJobApplication } = useAppData()

    const [job, setJob] = useState<Job | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [applicationStatus, setApplicationStatus] = useState('')
    const [checkingApplication, setCheckingApplication] = useState(false)
    const [activeTab, setActiveTab] = useState('details')

    useEffect(() => {
        if (id) {
            fetchJobData()
        }
    }, [id])

    useEffect(() => {
        if (job && isAuth && user?.role === 'jobseeker') {
            checkApplicationStatus()
        }
    }, [job, isAuth, user])

    const fetchJobData = async () => {
        try {
            setLoading(true)
            setError('')
            const jobData = await getJobDetails(Number(id))

            if (!jobData) {
                setError('Job not found')
                return
            }

            setJob(jobData)
        } catch (error) {
            console.error('Error fetching job data:', error)
            setError('Failed to load job details')
        } finally {
            setLoading(false)
        }
    }

    const checkApplicationStatus = async () => {
        if (!job || !isAuth || user?.role !== 'jobseeker') return

        try {
            setCheckingApplication(true)
            const status = await checkJobApplication(job.job_id)
            setApplicationStatus(status)
        } catch (error) {
            console.error('Error checking application status:', error)
        } finally {
            setCheckingApplication(false)
        }
    }

    const handleApplyNow = async () => {
        if (!isAuth) {
            router.push('/auth/login?redirect=' + encodeURIComponent(`/jobs/${id}`))
            return
        }

        if (!user) return

        if (user.role !== 'jobseeker') {
            toast.error('Only job seekers can apply for jobs')
            return
        }

        if (!user.resume) {
            toast.error('Please upload your resume before applying')
            return
        }

        if (!job) return

        if (applicationStatus === 'applied') {
            toast.error('You have already applied for this job')
            return
        }

        if (applicationStatus === 'hired') {
            toast.error('You have already been hired for this position')
            return
        }

        if (applicationStatus === 'rejected') {
            toast.error('Your previous application was not selected')
            return
        }

        try {
            await applyForJob(job.job_id)
            setApplicationStatus('applied')
            await checkApplicationStatus()
        } catch (error) {
            console.error('Error applying for job:', error)
        }
    }

    const handleViewCompany = () => {
        router.push(`/company/${job?.company_id}`)
    }

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

    const getApplicationStatusBadge = (status: string) => {
        switch (status.toLowerCase()) {
            case 'applied':
                return (
                    <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        <Clock className="w-3 h-3 mr-1" />
                        APPLIED
                    </Badge>
                )
            case 'hired':
                return (
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        HIRED
                    </Badge>
                )
            case 'rejected':
                return (
                    <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                        <XCircle className="w-3 h-3 mr-1" />
                        NOT SELECTED
                    </Badge>
                )
            default:
                return null
        }
    }

    const getApplicationStatusAlert = (status: string) => {
        switch (status.toLowerCase()) {
            case 'applied':
                return (
                    <Alert className="mb-6 border-blue-200 bg-blue-50 dark:bg-blue-950">
                        <Clock className="h-4 w-4 text-blue-600" />
                        <AlertDescription className="text-blue-800 dark:text-blue-200">
                            Application submitted successfully! Your application is under review by the recruiter.
                        </AlertDescription>
                    </Alert>
                )
            case 'hired':
                return (
                    <Alert className="mb-6 border-green-200 bg-green-50 dark:bg-green-950">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <AlertDescription className="text-green-800 dark:text-green-200">
                            🎉 Congratulations! You have been selected for this position. The recruiter will contact you soon with next steps.
                        </AlertDescription>
                    </Alert>
                )
            case 'rejected':
                return (
                    <Alert className="mb-6 border-red-200 bg-red-50 dark:bg-red-950">
                        <XCircle className="h-4 w-4 text-red-600" />
                        <AlertDescription className="text-red-800 dark:text-red-200">
                            Your application was not selected for this position. Don't give up - keep exploring other opportunities!
                        </AlertDescription>
                    </Alert>
                )
            default:
                return null
        }
    }

    const getStatusCardStyle = (status: string) => {
        switch (status.toLowerCase()) {
            case 'applied':
                return "border-blue-500 bg-linear-to-br from-blue-500 to-blue-600 text-white"
            case 'hired':
                return "border-green-500 bg-linear-to-br from-green-500 to-green-600 text-white"
            case 'rejected':
                return "border-red-500 bg-linear-to-br from-red-500 to-red-600 text-white"
            default:
                return "border-[#494bd6] bg-linear-to-br from-[#494bd6] to-[#2b2ed6] text-white"
        }
    }

    const getStatusCardText = (status: string) => {
        switch (status.toLowerCase()) {
            case 'applied':
                return "text-blue-100"
            case 'hired':
                return "text-green-100"
            case 'rejected':
                return "text-red-100"
            default:
                return "text-blue-100"
        }
    }

    const getApplicationStatusDisplay = (status: string) => {
        switch (status.toLowerCase()) {
            case 'applied':
                return (
                    <div className="bg-white/10 rounded-lg p-3">
                        <Clock className="mx-auto mb-2 text-blue-200" size={24} />
                        <p className="text-sm font-medium">Application Under Review</p>
                        <p className="text-xs text-blue-100 mt-1">We'll notify you of any updates</p>
                    </div>
                )
            case 'hired':
                return (
                    <div className="bg-white/10 rounded-lg p-3">
                        <div className="flex items-center justify-center mb-2">
                            <CheckCircle className="text-green-200 mr-1" size={24} />
                            <span className="text-lg">🎉</span>
                        </div>
                        <p className="text-sm font-medium">Congratulations! You're Hired</p>
                        <p className="text-xs text-green-100 mt-1">The recruiter will contact you soon</p>
                    </div>
                )
            case 'rejected':
                return (
                    <div className="bg-white/10 rounded-lg p-3">
                        <XCircle className="mx-auto mb-2 text-red-200" size={24} />
                        <p className="text-sm font-medium">Application Not Selected</p>
                        <p className="text-xs text-red-100 mt-1">Keep exploring other opportunities</p>
                    </div>
                )
            default:
                return null
        }
    }

    const formatBulletPoints = (text: string) => {
        return text.split('\n').filter(line => line.trim()).map((line, index) => (
            <li key={index} className="flex items-start gap-2">
                <CheckCircle className="text-[#494bd6] mt-1 shrink-0" size={16} />
                <span>{line.replace(/^[•\-\*]\s*/, '')}</span>
            </li>
        ))
    }

    const isJobOwner = user && job && Number(user.user_id) === job.posted_by_recruiter_id
    const hasApplied = applicationStatus && applicationStatus !== ''
    const canApply = !hasApplied && job?.is_active && isAuth && user?.role === 'jobseeker' && user?.resume

    if (loading) return <Loading />

    if (error) {
        return (
            <div className="min-h-screen py-8 bg-linear-to-br from-[#ededff] via-white to-[#f0f8ff] dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center py-12">
                        <Briefcase className="mx-auto text-gray-400 mb-4" size={64} />
                        <h2 className="text-2xl font-semibold mb-2">{error}</h2>
                        <p className="text-gray-500 mb-6">
                            The job you're looking for might have been removed or doesn't exist.
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

    if (!job) return <Loading />

    return (
        <div className="min-h-screen py-8 bg-linear-to-br from-[#ededff] via-white to-[#f0f8ff] dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
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

                {/* Application Status Alert */}
                {applicationStatus && getApplicationStatusAlert(applicationStatus)}

                {/* Resume Missing Alert */}
                {isAuth && user?.role === 'jobseeker' && !user?.resume && job.is_active && !hasApplied && (
                    <Alert className="mb-6 border-yellow-200 bg-yellow-50 dark:bg-yellow-950">
                        <AlertTriangle className="h-4 w-4 text-yellow-600" />
                        <AlertDescription className="text-yellow-800 dark:text-yellow-200">
                            You need to upload your resume before applying for jobs.{' '}
                            <Button
                                variant="link"
                                className="p-0 h-auto text-yellow-600 hover:text-yellow-800 cursor-pointer"
                                onClick={() => router.push('/account')}
                            >
                                Upload resume
                            </Button>
                        </AlertDescription>
                    </Alert>
                )}

                {/* Job Header */}
                <Card className="shadow-xl border-[#b0b0ff] dark:border-[#0000c5] bg-white/90 dark:bg-gray-900/90 backdrop-blur-md mb-8">
                    <CardContent className="p-8">
                        <div className="flex flex-col lg:flex-row gap-6">
                            {/* Company Logo & Info */}
                            <div className="flex items-start gap-4 flex-1">
                                {job.company_logo && (
                                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-700 shrink-0">
                                        <img
                                            src={job.company_logo}
                                            alt={job.company_name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                )}
                                <div className="flex-1 min-w-0">
                                    <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">
                                        {job.title}
                                    </h1>
                                    {job.company_name && (
                                        <button
                                            onClick={handleViewCompany}
                                            className="text-[#494bd6] hover:text-[#2b2ed6] font-semibold text-lg flex items-center gap-2 hover:underline mb-4 cursor-pointer"
                                        >
                                            <Building2 size={20} />
                                            {job.company_name}
                                            <ExternalLink size={16} />
                                        </button>
                                    )}

                                    {/* Job Meta Info */}
                                    <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
                                        <div className="flex items-center gap-2">
                                            <MapPin size={16} />
                                            <span>{job.location}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Calendar size={16} />
                                            <span>Posted {new Date(job.created_at).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Users size={16} />
                                            <span>{job.openings} opening{job.openings !== 1 ? 's' : ''}</span>
                                        </div>
                                        {job.company_website && (
                                            <div className="flex items-center gap-2">
                                                <Globe size={16} />
                                                <a
                                                    href={job.company_website}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-[#494bd6] hover:text-[#2b2ed6] hover:underline"
                                                >
                                                    Company Website
                                                </a>
                                            </div>
                                        )}
                                    </div>

                                    {/* Badges */}
                                    <div className="flex flex-wrap gap-2 mb-6">
                                        <Badge className={getJobTypeColor(job.job_type)}>
                                            {job.job_type.replace('_', ' ').toUpperCase()}
                                        </Badge>
                                        <Badge className={getWorkLocationColor(job.work_location)}>
                                            {job.work_location.toUpperCase()}
                                        </Badge>
                                        <Badge variant="outline" className="border-[#494bd6] text-[#494bd6]">
                                            {job.role}
                                        </Badge>
                                        {job.is_active && !hasApplied && !isJobOwner && (
                                            <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                                ACTIVELY HIRING
                                            </Badge>
                                        )}
                                        {applicationStatus && getApplicationStatusBadge(applicationStatus)}
                                        {isJobOwner && (
                                            <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                                                YOUR JOB
                                            </Badge>
                                        )}
                                        {checkingApplication && (
                                            <Badge variant="outline" className="border-gray-400 text-gray-600">
                                                <Clock className="w-3 h-3 mr-1 animate-spin" />
                                                CHECKING STATUS
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Salary & Apply Section */}
                            {!isJobOwner && (
                                <div className="lg:w-80 shrink-0">
                                    <Card className={getStatusCardStyle(applicationStatus)}>
                                        <CardContent className="p-6 text-center">
                                            <div className="flex items-center justify-center gap-2 mb-2">
                                                <DollarSign size={24} />
                                                <span className="text-3xl font-bold">
                                                    {job.salary}
                                                </span>
                                            </div>
                                            <p className={`${getStatusCardText(applicationStatus)} mb-4`}>per year</p>

                                            {checkingApplication ? (
                                                <div className="bg-white/10 rounded-lg p-3">
                                                    <Clock className="mx-auto mb-2 text-white animate-spin" size={24} />
                                                    <p className="text-sm font-medium">Checking Application Status...</p>
                                                </div>
                                            ) : applicationStatus ? (
                                                getApplicationStatusDisplay(applicationStatus)
                                            ) : job.is_active ? (
                                                <Button
                                                    onClick={handleApplyNow}
                                                    disabled={btnLoading || !canApply}
                                                    className="w-full bg-white text-[#494bd6] hover:bg-gray-100 font-semibold cursor-pointer"
                                                >
                                                    {btnLoading ? (
                                                        <>
                                                            <Clock className="mr-2 h-4 w-4 animate-spin" />
                                                            Applying...
                                                        </>
                                                    ) : !isAuth ? (
                                                        <>
                                                            <Send className="mr-2 h-4 w-4" />
                                                            Login to Apply
                                                        </>
                                                    ) : user?.role !== 'jobseeker' ? (
                                                        <>
                                                            <Briefcase className="mr-2 h-4 w-4" />
                                                            Job Seekers Only
                                                        </>
                                                    ) : !user?.resume ? (
                                                        <>
                                                            <AlertTriangle className="mr-2 h-4 w-4" />
                                                            Upload Resume First
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Send className="mr-2 h-4 w-4" />
                                                            Apply Now
                                                        </>
                                                    )}
                                                </Button>
                                            ) : (
                                                <div className="bg-white/10 rounded-lg p-3">
                                                    <p className="text-sm">This position is no longer accepting applications</p>
                                                </div>
                                            )}

                                            {isAuth && user?.resume && canApply && (
                                                <div className="mt-4 pt-4 border-t border-white/20">
                                                    <p className={`text-xs ${getStatusCardText(applicationStatus)} mb-2`}>Your resume will be submitted</p>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="text-white hover:bg-white/10 cursor-pointer"
                                                        onClick={() => window.open(user.resume!, '_blank')}
                                                    >
                                                        <Eye className="mr-1 h-3 w-3" />
                                                        Preview Resume
                                                    </Button>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Tab Navigation */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <Card className="shadow-lg border-[#b0b0ff] dark:border-[#0000c5] bg-white/90 dark:bg-gray-900/90 backdrop-blur-md mb-6">
                        <CardContent className="p-6">
                            <TabsList className={`grid w-full ${isJobOwner ? 'grid-cols-2' : 'grid-cols-1'} bg-gray-100 dark:bg-gray-800`}>
                                <TabsTrigger
                                    value="details"
                                    className="data-[state=active]:bg-[#494bd6] data-[state=active]:text-white"
                                >
                                    <Briefcase size={16} className="mr-2" />
                                    Job Details
                                </TabsTrigger>
                                {isJobOwner && (
                                    <TabsTrigger
                                        value="applications"
                                        className="data-[state=active]:bg-[#494bd6] data-[state=active]:text-white"
                                    >
                                        <UserCheck size={16} className="mr-2" />
                                        Applications
                                    </TabsTrigger>
                                )}
                            </TabsList>
                        </CardContent>
                    </Card>

                    {/* Job Details Tab */}
                    <TabsContent value="details" className="space-y-8">
                        <div className="grid gap-8 lg:grid-cols-3">
                            {/* Main Content */}
                            <div className="lg:col-span-2 space-y-8">
                                {/* Job Description */}
                                <Card className="shadow-lg border-[#b0b0ff] dark:border-[#0000c5] bg-white/90 dark:bg-gray-900/90 backdrop-blur-md">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Briefcase className="text-[#494bd6]" size={20} />
                                            Job Description
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                                            {job.description}
                                        </p>
                                    </CardContent>
                                </Card>

                                {/* Responsibilities */}
                                <Card className="shadow-lg border-[#b0b0ff] dark:border-[#0000c5] bg-white/90 dark:bg-gray-900/90 backdrop-blur-md">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <CheckCircle className="text-[#494bd6]" size={20} />
                                            Key Responsibilities
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                                            {formatBulletPoints(job.responsibilities)}
                                        </ul>
                                    </CardContent>
                                </Card>

                                {/* Qualifications */}
                                <Card className="shadow-lg border-[#b0b0ff] dark:border-[#0000c5] bg-white/90 dark:bg-gray-900/90 backdrop-blur-md">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Star className="text-[#494bd6]" size={20} />
                                            Required Qualifications
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                                            {formatBulletPoints(job.qualifications)}
                                        </ul>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Sidebar */}
                            <div className="space-y-6">
                                {/* Job Overview */}
                                <Card className="shadow-lg border-[#b0b0ff] dark:border-[#0000c5] bg-white/90 dark:bg-gray-900/90 backdrop-blur-md">
                                    <CardHeader>
                                        <CardTitle className="text-lg">Job Overview</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-500">Job Type</span>
                                            <Badge className={getJobTypeColor(job.job_type)}>
                                                {job.job_type.replace('_', ' ')}
                                            </Badge>
                                        </div>
                                        <Separator />
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-500">Work Location</span>
                                            <Badge className={getWorkLocationColor(job.work_location)}>
                                                {job.work_location}
                                            </Badge>
                                        </div>
                                        <Separator />
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-500">Role</span>
                                            <span className="font-medium">{job.role}</span>
                                        </div>
                                        <Separator />
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-500">Openings</span>
                                            <span className="font-medium">{job.openings} position{job.openings !== 1 ? 's' : ''}</span>
                                        </div>
                                        <Separator />
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-500">Posted</span>
                                            <span className="font-medium">{new Date(job.created_at).toLocaleDateString()}</span>
                                        </div>
                                        {applicationStatus && (
                                            <>
                                                <Separator />
                                                <div className="flex items-center justify-between">
                                                    <span className="text-gray-500">Application Status</span>
                                                    {getApplicationStatusBadge(applicationStatus)}
                                                </div>
                                            </>
                                        )}
                                    </CardContent>
                                </Card>

                                {/* Company Quick Info */}
                                {job.company_name && (
                                    <Card className="shadow-lg border-[#b0b0ff] dark:border-[#0000c5] bg-white/90 dark:bg-gray-900/90 backdrop-blur-md">
                                        <CardHeader>
                                            <CardTitle className="text-lg">About {job.company_name}</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="flex items-center gap-3">
                                                {job.company_logo && (
                                                    <img
                                                        src={job.company_logo}
                                                        alt={job.company_name}
                                                        className="w-12 h-12 rounded-lg object-cover"
                                                    />
                                                )}
                                                <div>
                                                    <h4 className="font-semibold">{job.company_name}</h4>
                                                    <p className="text-sm text-gray-500">Visit company page for more details</p>
                                                </div>
                                            </div>
                                            <Button
                                                variant="outline"
                                                className="w-full cursor-pointer"
                                                onClick={handleViewCompany}
                                            >
                                                <Building2 className="mr-2 h-4 w-4" />
                                                View Company Profile
                                            </Button>
                                            {job.company_website && (
                                                <Button
                                                    variant="ghost"
                                                    className="w-full cursor-pointer"
                                                    onClick={() => window.open(job.company_website!, '_blank')}
                                                >
                                                    <Globe className="mr-2 h-4 w-4" />
                                                    Company Website
                                                </Button>
                                            )}
                                        </CardContent>
                                    </Card>
                                )}

                                {/* Similar Jobs CTA */}
                                {!isJobOwner && (
                                    <Card className="shadow-lg border-[#b0b0ff] dark:border-[#0000c5] bg-linear-to-br from-[#ededff] to-[#f0f8ff] dark:from-gray-800 dark:to-gray-700">
                                        <CardContent className="p-6 text-center">
                                            <Briefcase className="mx-auto text-[#494bd6] mb-3" size={32} />
                                            <h4 className="font-semibold mb-2">Find Similar Jobs</h4>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                                                Explore more opportunities in {job.role}
                                            </p>
                                            <Button
                                                variant="outline"
                                                className="w-full cursor-pointer"
                                                onClick={() => router.push(`/jobs?role=${encodeURIComponent(job.role)}`)}
                                            >
                                                Browse Similar Jobs
                                            </Button>
                                        </CardContent>
                                    </Card>
                                )}
                            </div>
                        </div>

                        {/* Bottom Action Bar - Only for Job Seekers */}
                        {!isJobOwner && job.is_active && !hasApplied && (
                            <div className="mt-8">
                                <Card className="shadow-lg border-[#b0b0ff] dark:border-[#0000c5] bg-white/90 dark:bg-gray-900/90 backdrop-blur-md">
                                    <CardContent className="p-6">
                                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                            <div>
                                                <h3 className="font-semibold text-lg mb-1">Ready to Apply?</h3>
                                                <p className="text-gray-600 dark:text-gray-400">
                                                    Don't miss out on this opportunity at {job.company_name}
                                                </p>
                                            </div>
                                            <div className="flex gap-3">
                                                <Button
                                                    variant="outline"
                                                    onClick={() => router.push('/jobs')}
                                                    className="cursor-pointer"
                                                >
                                                    Browse More Jobs
                                                </Button>
                                                <Button
                                                    onClick={handleApplyNow}
                                                    disabled={btnLoading || !canApply}
                                                    className="cursor-pointer"
                                                >
                                                    {btnLoading ? (
                                                        <>
                                                            <Clock className="mr-2 h-4 w-4 animate-spin" />
                                                            Applying...
                                                        </>
                                                    ) : !isAuth ? (
                                                        <>
                                                            <Send className="mr-2 h-4 w-4" />
                                                            Login to Apply
                                                        </>
                                                    ) : user?.role !== 'jobseeker' ? (
                                                        <>
                                                            <Briefcase className="mr-2 h-4 w-4" />
                                                            Job Seekers Only
                                                        </>
                                                    ) : !user?.resume ? (
                                                        <>
                                                            <AlertTriangle className="mr-2 h-4 w-4" />
                                                            Upload Resume First
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Send className="mr-2 h-4 w-4" />
                                                            Apply Now
                                                        </>
                                                    )}
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        )}
                    </TabsContent>

                    {/* Applications Tab - Only for Job Owners */}
                    {isJobOwner && (
                        <TabsContent value="applications" className="space-y-6">
                            <ApplicationsTab jobId={job.job_id} />
                        </TabsContent>
                    )}
                </Tabs>
            </div>
        </div>
    )
}

export default JobPage