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
    MoreHorizontal
} from 'lucide-react'
import { useAppData } from '@/context/AppContext'
import { JobApplication } from '@/type'
import { Input } from '@/components/ui/input'
import { redirect } from 'next/navigation'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface ApplicationsTabProps {
    jobId: number
}

const ApplicationsTab: React.FC<ApplicationsTabProps> = ({ jobId }) => {
    const { getAllApplicationsForJob, updateApplicationStatus, btnLoading } = useAppData()
    
    const [applications, setApplications] = useState<JobApplication[]>([])
    const [loading, setLoading] = useState(true)
    const [filteredApplications, setFilteredApplications] = useState<JobApplication[]>([])
    const [statusFilter, setStatusFilter] = useState<'all' | 'applied' | 'rejected' | 'hired'>('all')
    const [searchQuery, setSearchQuery] = useState('')

    useEffect(() => {
        fetchApplications()
    }, [jobId])

    useEffect(() => {
        applyFilters()
    }, [applications, statusFilter, searchQuery])

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

    const handleStatusUpdate = async (applicationId: number, newStatus: string) => {
        try {
            await updateApplicationStatus(applicationId, newStatus)
            // Refresh applications after successful update
            await fetchApplications()
        } catch (error) {
            console.error('Error updating application status:', error)
        }
    }

    const applyFilters = () => {
        let filtered = [...applications]

        // Apply status filter
        if (statusFilter !== 'all') {
            filtered = filtered.filter(app => app.status === statusFilter)
        }

        // Apply search filter
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase()
            filtered = filtered.filter(app => 
                app.applicant_name.toLowerCase().includes(query) ||
                app.applicant_email.toLowerCase().includes(query)
            )
        }

        setFilteredApplications(filtered)
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

    const getStats = () => {
        const total = applications.length
        const applied = applications.filter(app => app.status === 'applied').length
        const hired = applications.filter(app => app.status === 'hired').length
        const rejected = applications.filter(app => app.status === 'rejected').length
        
        return { total, applied, hired, rejected }
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="border-[#b0b0ff] dark:border-[#0000c5] bg-linear-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Applications</p>
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
            </div>

            {/* Filters */}
            <Card className="border-[#b0b0ff] dark:border-[#0000c5] bg-white/80 dark:bg-gray-900/80 backdrop-blur-md">
                <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
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
                        
                        <div className="flex items-center gap-2">
                            <Filter size={16} className="text-gray-500" />
                            <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
                                <SelectTrigger className="w-48 border-[#d0d0ff] dark:border-[#0000c5] focus:border-[#494bd6]">
                                    <SelectValue placeholder="Filter by status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Applications ({stats.total})</SelectItem>
                                    <SelectItem value="applied">Applied ({stats.applied})</SelectItem>
                                    <SelectItem value="hired">Hired ({stats.hired})</SelectItem>
                                    <SelectItem value="rejected">Rejected ({stats.rejected})</SelectItem>
                                </SelectContent>
                            </Select>
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
                            </CardTitle>
                            <CardDescription>
                                Manage and review job applications for this position
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
                            {filteredApplications.map((application) => (
                                <Card 
                                    key={application.application_id}
                                    className="border-[#d0d0ff] dark:border-[#0000c5] hover:shadow-md transition-all duration-200"
                                >
                                    <CardContent className="p-6">
                                        <div className="flex items-start gap-4">
                                            <Avatar className="w-12 h-12 shrink-0">
                                                <AvatarFallback className="bg-[#494bd6] text-white font-semibold">
                                                    {getInitials(application.applicant_name)}
                                                </AvatarFallback>
                                            </Avatar>
                                            
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-4">
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex gap-2 items-center">
                                                            <h3 className="font-semibold text-lg mb-1 text-gray-900 dark:text-white">
                                                                {application.applicant_name}
                                                            </h3>
                                                            <ExternalLink size={14} className='hover:text-[#494bd6] cursor-pointer' onClick={() => redirect(`/account/${application.applicant_id}`)} />
                                                        </div>
                                                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
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
                                                    
                                                    <div className="flex items-center gap-2">
                                                        {getStatusBadge(application.status)}
                                                        {application.status === 'applied' && (
                                                            <DropdownMenu>
                                                                <DropdownMenuTrigger asChild>
                                                                    <Button 
                                                                        variant="ghost" 
                                                                        size="sm"
                                                                        disabled={btnLoading}
                                                                        className="h-8 w-8 p-0"
                                                                    >
                                                                        <MoreHorizontal size={16} />
                                                                    </Button>
                                                                </DropdownMenuTrigger>
                                                                <DropdownMenuContent align="end">
                                                                    <DropdownMenuItem 
                                                                        onClick={() => handleStatusUpdate(application.application_id, 'hired')}
                                                                        className="flex items-center gap-2 text-green-600"
                                                                    >
                                                                        <CheckCircle size={14} />
                                                                        Hire Candidate
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem 
                                                                        onClick={() => handleStatusUpdate(application.application_id, 'rejected')}
                                                                        className="flex items-center gap-2 text-red-600"
                                                                    >
                                                                        <XCircle size={14} />
                                                                        Reject Application
                                                                    </DropdownMenuItem>
                                                                </DropdownMenuContent>
                                                            </DropdownMenu>
                                                        )}
                                                    </div>
                                                </div>
                                                
                                                <div className="flex items-center gap-2 mt-4">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="gap-2"
                                                        onClick={() => window.open(application.resume, '_blank')}
                                                    >
                                                        <Eye size={14} />
                                                        View Resume
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="gap-2"
                                                        onClick={() => {
                                                            const link = document.createElement('a')
                                                            link.href = application.resume
                                                            link.download = `${application.applicant_name}_resume.pdf`
                                                            link.click()
                                                        }}
                                                    >
                                                        <Download size={14} />
                                                        Download
                                                    </Button>
                                                </div>
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
    )
}

export default ApplicationsTab