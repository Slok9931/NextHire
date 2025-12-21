"use client"
import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
    Users,
    Calendar,
    Mail,
    FileText,
    Clock,
    CheckCircle,
    XCircle,
    Download,
    Eye,
    Filter,
    Search,
    Loader2,
    ExternalLink,
    Crown,
    Star
} from 'lucide-react'
import { useAppData } from '@/context/AppContext'
import { JobApplication } from '@/type'
import { Input } from '@/components/ui/input'
import { redirect } from 'next/navigation'
import Link from 'next/link'

interface ApplicationsTabProps {
    jobId: number
}

const ApplicationsTab: React.FC<ApplicationsTabProps> = ({ jobId }) => {
    const { getAllApplicationsForJob, updateApplicationStatus } = useAppData()

    const [applications, setApplications] = useState<JobApplication[]>([])
    const [loading, setLoading] = useState(true)
    const [filteredApplications, setFilteredApplications] = useState<JobApplication[]>([])
    const [statusFilter, setStatusFilter] = useState<'all' | 'applied' | 'rejected' | 'hired'>('all')
    const [subscriptionFilter, setSubscriptionFilter] = useState<'all' | 'subscribed' | 'free'>('all')
    const [searchQuery, setSearchQuery] = useState('')
    const [updatingStatus, setUpdatingStatus] = useState<{ [key: number]: 'hired' | 'rejected' | null }>({})

    useEffect(() => {
        fetchApplications()
    }, [jobId])

    useEffect(() => {
        applyFilters()
    }, [applications, statusFilter, subscriptionFilter, searchQuery])

    const fetchApplications = async () => {
        try {
            setLoading(true)
            const applicationsData = await getAllApplicationsForJob(jobId)
            setApplications(applicationsData)
        } catch (error) {
            console.error('Error fetching applications:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleStatusUpdate = async (applicationId: number, newStatus: 'hired' | 'rejected') => {
        try {
            setUpdatingStatus(prev => ({ ...prev, [applicationId]: newStatus }))
            await updateApplicationStatus(applicationId, newStatus)
            // Refresh applications after successful update
            await fetchApplications()
        } catch (error) {
            console.error('Error updating application status:', error)
        } finally {
            setUpdatingStatus(prev => ({ ...prev, [applicationId]: null }))
        }
    }

    const sortApplications = (apps: JobApplication[]) => {
        return apps.sort((a, b) => {
            // First, prioritize subscribed users
            if (a.subscribed && !b.subscribed) return -1
            if (!a.subscribed && b.subscribed) return 1

            // Then sort by status priority (applied > hired > rejected)
            const statusPriority = { 'applied': 3, 'hired': 2, 'rejected': 1 }
            const aStatusPriority = statusPriority[a.status as keyof typeof statusPriority] || 0
            const bStatusPriority = statusPriority[b.status as keyof typeof statusPriority] || 0

            if (aStatusPriority !== bStatusPriority) {
                return bStatusPriority - aStatusPriority
            }

            // Finally, sort by application date (newest first)
            return new Date(b.applied_at).getTime() - new Date(a.applied_at).getTime()
        })
    }

    const applyFilters = () => {
        let filtered = [...applications]

        // Apply status filter
        if (statusFilter !== 'all') {
            filtered = filtered.filter(app => app.status === statusFilter)
        }

        // Apply subscription filter
        if (subscriptionFilter === 'subscribed') {
            filtered = filtered.filter(app => app.subscribed)
        } else if (subscriptionFilter === 'free') {
            filtered = filtered.filter(app => !app.subscribed)
        }

        // Apply search filter
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase()
            filtered = filtered.filter(app =>
                app.applicant_name.toLowerCase().includes(query) ||
                app.applicant_email.toLowerCase().includes(query)
            )
        }

        // Sort the filtered applications
        const sortedFiltered = sortApplications(filtered)
        setFilteredApplications(sortedFiltered)
    }

    const getInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    }

    const getStatusBadge = (status: string) => {
        switch (status.toLowerCase()) {
            case 'hired':
                return (
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        <CheckCircle size={12} className="mr-1" />
                        Hired
                    </Badge>
                )
            case 'rejected':
                return (
                    <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                        <XCircle size={12} className="mr-1" />
                        Rejected
                    </Badge>
                )
            default: // 'applied'
                return (
                    <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                        <Clock size={12} className="mr-1" />
                        Applied
                    </Badge>
                )
        }
    }

    const getSubscriptionBadge = (subscribed: boolean) => {
        if (subscribed) {
            return (
                <Badge className="bg-linear-to-r from-yellow-400 to-orange-500 text-white border-0 shadow-md">
                    <Crown size={12} className="mr-1" />
                    Premium
                </Badge>
            )
        }
        return (
            <Badge variant="secondary" className="bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                Free
            </Badge>
        )
    }

    const getStats = () => {
        const total = applications.length
        const applied = applications.filter(app => app.status === 'applied').length
        const hired = applications.filter(app => app.status === 'hired').length
        const rejected = applications.filter(app => app.status === 'rejected').length
        const subscribed = applications.filter(app => app.subscribed).length
        const free = total - subscribed

        return { total, applied, hired, rejected, subscribed, free }
    }

    const stats = getStats()

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="animate-spin text-[#494bd6]" size={32} />
                <span className="ml-2 text-gray-600">Loading applications...</span>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                <Card className="border-[#b0b0ff] dark:border-[#0000c5] bg-linear-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total</p>
                                <p className="text-2xl font-bold text-[#494bd6]">{stats.total}</p>
                            </div>
                            <Users className="text-[#494bd6]" size={24} />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-[#b0b0ff] dark:border-[#0000c5] bg-linear-to-br from-yellow-50 to-orange-50 dark:from-yellow-950 dark:to-orange-950">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Applied</p>
                                <p className="text-2xl font-bold text-yellow-600">{stats.applied}</p>
                            </div>
                            <Clock className="text-yellow-600" size={24} />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-[#b0b0ff] dark:border-[#0000c5] bg-linear-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Hired</p>
                                <p className="text-2xl font-bold text-green-600">{stats.hired}</p>
                            </div>
                            <CheckCircle className="text-green-600" size={24} />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-[#b0b0ff] dark:border-[#0000c5] bg-linear-to-br from-red-50 to-pink-50 dark:from-red-950 dark:to-pink-950">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Rejected</p>
                                <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
                            </div>
                            <XCircle className="text-red-600" size={24} />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-[#b0b0ff] dark:border-[#0000c5] bg-linear-to-br from-amber-50 to-yellow-50 dark:from-amber-950 dark:to-yellow-950">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Premium</p>
                                <p className="text-2xl font-bold text-amber-600">{stats.subscribed}</p>
                            </div>
                            <Crown className="text-amber-600" size={24} />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-[#b0b0ff] dark:border-[#0000c5] bg-linear-to-br from-gray-50 to-slate-50 dark:from-gray-950 dark:to-slate-950">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Free</p>
                                <p className="text-2xl font-bold text-gray-600">{stats.free}</p>
                            </div>
                            <Star className="text-gray-600" size={24} />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card className="border-[#b0b0ff] dark:border-[#0000c5] bg-white/80 dark:bg-gray-900/80 backdrop-blur-md">
                <CardContent className="p-4">
                    <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                        <div className="flex items-center gap-4 flex-1">
                            <div className="relative flex-1 max-w-sm">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                                <Input
                                    placeholder="Search applicants..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 border-[#d0d0ff] dark:border-[#0000c5] focus:border-[#494bd6]"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center gap-2">
                            <div className="flex items-center gap-2">
                                <Filter size={16} className="text-gray-500" />
                                <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
                                    <SelectTrigger className="w-48 border-[#d0d0ff] dark:border-[#0000c5] focus:border-[#494bd6]">
                                        <SelectValue placeholder="Filter by status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Status ({stats.total})</SelectItem>
                                        <SelectItem value="applied">Applied ({stats.applied})</SelectItem>
                                        <SelectItem value="hired">Hired ({stats.hired})</SelectItem>
                                        <SelectItem value="rejected">Rejected ({stats.rejected})</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex items-center gap-2">
                                <Crown size={16} className="text-amber-500" />
                                <Select value={subscriptionFilter} onValueChange={(value: any) => setSubscriptionFilter(value)}>
                                    <SelectTrigger className="w-48 border-[#d0d0ff] dark:border-[#0000c5] focus:border-[#494bd6]">
                                        <SelectValue placeholder="Filter by subscription" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Users ({stats.total})</SelectItem>
                                        <SelectItem value="subscribed">
                                            <div className="flex items-center gap-2">
                                                <Crown size={14} className="text-amber-500" />
                                                Premium ({stats.subscribed})
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="free">
                                            <div className="flex items-center gap-2">
                                                <Star size={14} className="text-gray-500" />
                                                Free ({stats.free})
                                            </div>
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Applications List */}
            <Card className="border-[#b0b0ff] dark:border-[#0000c5] bg-white/90 dark:bg-gray-900/90 backdrop-blur-md">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                <Users className="text-[#494bd6]" size={20} />
                                Applications ({filteredApplications.length})
                                {stats.subscribed > 0 && (
                                    <Badge className="bg-linear-to-r from-yellow-400 to-orange-500 text-white border-0 shadow-md ml-2">
                                        <Crown size={12} className="mr-1" />
                                        {stats.subscribed} Premium
                                    </Badge>
                                )}
                            </CardTitle>
                            <CardDescription>
                                Manage and review job applications for this position. Premium users are shown first.
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {filteredApplications.length === 0 ? (
                        <div className="text-center py-12">
                            <Users className="mx-auto text-gray-400 mb-4" size={48} />
                            <h3 className="text-lg font-semibold mb-2">
                                {applications.length === 0 ? 'No Applications Yet' : 'No Matching Applications'}
                            </h3>
                            <p className="text-gray-500">
                                {applications.length === 0
                                    ? 'Applications will appear here once candidates start applying to this job.'
                                    : 'Try adjusting your search or filter criteria.'
                                }
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filteredApplications.map((application, index) => {
                                const isPremium = application.subscribed
                                const isFirstPremium = isPremium && (index === 0 || !filteredApplications[index - 1].subscribed)
                                const isFirstFree = !isPremium && filteredApplications.slice(0, index).every(app => app.subscribed)

                                return (
                                    <div key={application.application_id}>
                                        {/* Section divider */}
                                        {isFirstPremium && stats.subscribed > 0 && stats.free > 0 && (
                                            <div className="flex items-center gap-3 py-3 mb-4">
                                                <div className="h-px bg-linear-to-r from-yellow-400 to-orange-500 flex-1"></div>
                                                <div className="flex items-center gap-2 px-3 py-1 bg-linear-to-r from-yellow-400 to-orange-500 text-white rounded-full text-sm font-medium">
                                                    <Crown size={14} />
                                                    Premium Members
                                                </div>
                                                <div className="h-px bg-linear-to-r from-yellow-400 to-orange-500 flex-1"></div>
                                            </div>
                                        )}
                                        {isFirstFree && stats.subscribed > 0 && (
                                            <div className="flex items-center gap-3 py-3 mb-4">
                                                <div className="h-px bg-gray-300 dark:bg-gray-600 flex-1"></div>
                                                <div className="flex items-center gap-2 px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm font-medium">
                                                    <Star size={14} />
                                                    Free Members
                                                </div>
                                                <div className="h-px bg-gray-300 dark:bg-gray-600 flex-1"></div>
                                            </div>
                                        )}

                                        <Card
                                            className={`border-[#d0d0ff] dark:border-[#0000c5] hover:shadow-md transition-all duration-200 ${isPremium
                                                    ? 'ring-2 ring-yellow-200 dark:ring-yellow-800 bg-linear-to-br from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20'
                                                    : ''
                                                }`}
                                        >
                                            <CardContent className="p-6">
                                                <div className="flex items-start gap-4">
                                                    <div className="relative">
                                                        <Avatar className="w-12 h-12 shrink-0">
                                                            <AvatarFallback className={`text-white font-semibold ${isPremium
                                                                    ? 'bg-linear-to-r from-yellow-400 to-orange-500'
                                                                    : 'bg-[#494bd6]'
                                                                }`}>
                                                                {getInitials(application.applicant_name)}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        {isPremium && (
                                                            <div className="absolute -top-1 -right-1 bg-linear-to-r from-yellow-400 to-orange-500 rounded-full p-1">
                                                                <Crown size={10} className="text-white" />
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-start justify-between gap-4">
                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex gap-2 items-center">
                                                                    <h3 className="font-semibold text-lg mb-1 text-gray-900 dark:text-white">
                                                                        {application.applicant_name}
                                                                    </h3>
                                                                    <Link href={`/account/${application.applicant_id}`} target="_blank">
                                                                        <ExternalLink size={14} className='hover:text-[#494bd6] cursor-pointer' />
                                                                    </Link>
                                                                </div>
                                                                <div className="flex flex-col justify-center md:flex-row md:items-center md:justify-start gap-4 text-sm text-gray-500 mb-2">
                                                                    <div className="flex items-center gap-1">
                                                                        <Mail size={14} />
                                                                        <span className="truncate">{application.applicant_email}</span>
                                                                    </div>
                                                                    <div className="flex items-center gap-1">
                                                                        <Calendar size={14} />
                                                                        <span>Applied {new Date(application.applied_at).toLocaleDateString()}</span>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="flex items-center gap-2 flex-wrap">
                                                                {getSubscriptionBadge(application.subscribed)}
                                                                {getStatusBadge(application.status)}
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center gap-2 mt-4">
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                className="gap-2 cursor-pointer"
                                                                onClick={() => window.open(application.resume, '_blank')}
                                                            >
                                                                <Eye size={14} />
                                                                View Resume
                                                            </Button>

                                                            {application.status === 'applied' && (
                                                                <div className="flex gap-2 ml-auto">
                                                                    <Button
                                                                        size="sm"
                                                                        className="gap-2 bg-green-600 hover:bg-green-700 text-white cursor-pointer"
                                                                        onClick={() => handleStatusUpdate(application.application_id, 'hired')}
                                                                    >
                                                                        {updatingStatus[application.application_id] === 'hired' ? (
                                                                            <Loader2 size={14} className="animate-spin" />
                                                                        ) : (
                                                                            <CheckCircle size={14} />
                                                                        )}
                                                                        {updatingStatus[application.application_id] === 'hired' ? 'Hiring...' : 'Accept'}
                                                                    </Button>
                                                                    <Button
                                                                        size="sm"
                                                                        variant="destructive"
                                                                        className="gap-2 cursor-pointer"
                                                                        onClick={() => handleStatusUpdate(application.application_id, 'rejected')}
                                                                    >
                                                                        {updatingStatus[application.application_id] === 'rejected' ? (
                                                                            <Loader2 size={14} className="animate-spin" />
                                                                        ) : (
                                                                            <XCircle size={14} />
                                                                        )}
                                                                        {updatingStatus[application.application_id] === 'rejected' ? 'Rejecting...' : 'Reject'}
                                                                    </Button>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

export default ApplicationsTab