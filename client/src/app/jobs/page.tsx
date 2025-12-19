"use client"
import React, { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
    Search,
    Briefcase,
    ChevronLeft,
    ChevronRight,
    Loader2,
    Filter,
    X,
    CheckCircle,
    Clock,
    FileText,
    User
} from 'lucide-react'
import { useAppData } from '@/context/AppContext'
import { Job, Application } from '@/type'
import FilterPanel from './components/FilterPanel'
import JobCard from './components/JobCard'
import Loading from '@/components/loading'

const Jobs = () => {
    const { getAllJobs, getMyApplications, isAuth, user } = useAppData()

    const [jobs, setJobs] = useState<Job[]>([])
    const [loading, setLoading] = useState(true)
    const [applicationsLoading, setApplicationsLoading] = useState(false)
    const [pagination, setPagination] = useState<any>({})
    const [filters, setFilters] = useState<any>({ is_active: true, page: 1, limit: 12 })
    const [showMobileFilters, setShowMobileFilters] = useState(false)
    const [quickSearch, setQuickSearch] = useState('')
    const [myApplications, setMyApplications] = useState<Application[]>([])
    const [applicationFilter, setApplicationFilter] = useState<'all' | 'applied' | 'not_applied'>('all')
    const [recruiterFilter, setRecruiterFilter] = useState<'all' | 'my_jobs'>('all')

    useEffect(() => {
        fetchJobs()
        if (isAuth && user?.role === 'jobseeker') {
            fetchMyApplications()
        }
    }, [isAuth, user])

    useEffect(() => {
        // Refetch jobs when application filter changes
        if (applicationFilter !== 'all') {
            applyApplicationFilter()
        } else {
            fetchJobs()
        }
    }, [applicationFilter])

    useEffect(() => {
        // Refetch jobs when recruiter filter changes
        handleRecruiterFilterChange()
    }, [recruiterFilter])

    const fetchMyApplications = async () => {
        try {
            setApplicationsLoading(true)
            const applications = await getMyApplications()
            setMyApplications(applications)
        } catch (error) {
            console.error('Error fetching applications:', error)
        } finally {
            setApplicationsLoading(false)
        }
    }

    const fetchJobs = async (newFilters = filters) => {
        try {
            setLoading(true)
            const { jobs: jobsData, pagination: paginationData } = await getAllJobs(newFilters)
            setJobs(jobsData)
            setPagination(paginationData)
        } catch (error) {
            console.error('Error fetching jobs:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleRecruiterFilterChange = () => {
        if (recruiterFilter === 'my_jobs' && isAuth && user?.role === 'recruiter') {
            const newFilters = { ...filters, recruiter_id: user.user_id, page: 1 }
            setFilters(newFilters)
            fetchJobs(newFilters)
        } else if (recruiterFilter === 'all') {
            const { recruiter_id, ...newFilters } = filters
            setFilters({ ...newFilters, page: 1 })
            fetchJobs({ ...newFilters, page: 1 })
        }
    }

    const applyApplicationFilter = async () => {
        if (!isAuth || user?.role !== 'jobseeker' || applicationFilter === 'all') {
            return
        }

        try {
            setLoading(true)
            // Fetch all jobs first
            const { jobs: allJobs, pagination: paginationData } = await getAllJobs({
                ...filters,
                page: 1,
                limit: 1000 // Get more jobs for filtering
            })

            const appliedJobIds = new Set(myApplications.map(app => app.job_id))

            let filteredJobs: Job[] = []
            if (applicationFilter === 'applied') {
                filteredJobs = allJobs.filter(job => appliedJobIds.has(job.job_id))
            } else if (applicationFilter === 'not_applied') {
                filteredJobs = allJobs.filter(job => !appliedJobIds.has(job.job_id))
            }

            // Apply pagination to filtered results
            const startIndex = (filters.page - 1) * filters.limit
            const endIndex = startIndex + filters.limit
            const paginatedJobs = filteredJobs.slice(startIndex, endIndex)

            const totalPages = Math.ceil(filteredJobs.length / filters.limit)

            setJobs(paginatedJobs)
            setPagination({
                ...paginationData,
                total_jobs: filteredJobs.length,
                total_pages: totalPages,
                current_page: filters.page,
                has_prev_page: filters.page > 1,
                has_next_page: filters.page < totalPages
            })
        } catch (error) {
            console.error('Error applying application filter:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleFiltersChange = (newFilters: any) => {
        const updatedFilters = { ...newFilters, limit: 12 }
        setFilters(updatedFilters)

        // Reset other filters when applying new filters
        setApplicationFilter('all')
        setRecruiterFilter('all')

        fetchJobs(updatedFilters)
    }

    const handlePageChange = (page: number) => {
        const newFilters = { ...filters, page }
        setFilters(newFilters)

        if (applicationFilter === 'all') {
            fetchJobs(newFilters)
        } else {
            applyApplicationFilter()
        }

        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const handleQuickSearch = () => {
        const newFilters = { ...filters, search: quickSearch, page: 1 }
        setFilters(newFilters)
        setApplicationFilter('all') // Reset application filter when searching
        setRecruiterFilter('all') // Reset recruiter filter when searching
        fetchJobs(newFilters)
    }

    const handleQuickSearchKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleQuickSearch()
        }
    }

    const clearQuickSearch = () => {
        setQuickSearch('')
        const newFilters = { ...filters, search: '', page: 1 }
        setFilters(newFilters)
        fetchJobs(newFilters)
    }

    const getApplicationStats = () => {
        if (!isAuth || user?.role !== 'jobseeker') return null

        const totalApplications = myApplications.length
        return {
            total: totalApplications,
            applied: totalApplications,
            pending: myApplications.filter(app => !app.subscribed).length
        }
    }

    const isJobApplied = (jobId: number) => {
        return myApplications.some(app => app.job_id === jobId)
    }

    const applicationStats = getApplicationStats()

    if (loading && jobs.length === 0) return <Loading />

    return (
        <div className="min-h-screen bg-linear-to-br from-[#ededff] via-white to-[#f0f8ff] dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            {/* Header */}
            <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-[#d0d0ff] dark:border-[#0000c5] sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <Briefcase className="text-[#494bd6]" size={32} />
                                Find Your Dream Job
                            </h1>
                            <div className="flex items-center gap-4 mt-1">
                                <p className="text-gray-600 dark:text-gray-300">
                                    Discover {pagination.total_jobs || 0} amazing opportunities waiting for you
                                </p>
                                {applicationStats && (
                                    <div className="flex items-center gap-2 text-sm">
                                        <Badge variant="secondary" className="gap-1">
                                            <CheckCircle size={12} />
                                            {applicationStats.applied} Applied
                                        </Badge>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Quick Search */}
                        <div className="flex gap-2 w-full lg:w-auto lg:min-w-96">
                            <div className="relative flex-1 lg:flex-none lg:w-80">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                                <Input
                                    placeholder="Quick search jobs..."
                                    value={quickSearch}
                                    onChange={(e) => setQuickSearch(e.target.value)}
                                    onKeyPress={handleQuickSearchKeyPress}
                                    className="pl-10 pr-10 border-[#d0d0ff] dark:border-[#0000c5] focus:border-[#494bd6]"
                                />
                                {quickSearch && (
                                    <button
                                        onClick={clearQuickSearch}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer" 
                                    >
                                        <X size={16} />
                                    </button>
                                )}
                            </div>
                            <Button onClick={handleQuickSearch} className="cursor-pointer">
                                Search
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => setShowMobileFilters(!showMobileFilters)}
                                className="lg:hidden cursor-pointer"
                            >
                                <Filter size={16} />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Filters Panel */}
                    <aside className={`w-full lg:w-80 ${showMobileFilters ? 'block' : 'hidden lg:block'}`}>
                        <FilterPanel onFiltersChange={handleFiltersChange} isLoading={loading} />
                    </aside>

                    {/* Jobs Content */}
                    <main className="flex-1">
                        {/* Results Header with Application Filter */}
                        <div className="mb-6 space-y-4">
                            <Card className="border-[#b0b0ff] dark:border-[#0000c5] bg-white/80 dark:bg-gray-900/80 backdrop-blur-md">
                                <CardContent className="p-4">
                                    <div className="flex flex-col gap-4">
                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                            <div>
                                                <h2 className="text-lg font-semibold flex items-center gap-2">
                                                    {loading ? (
                                                        <>
                                                            <Loader2 className="animate-spin" size={16} />
                                                            Searching...
                                                        </>
                                                    ) : (
                                                        `${pagination.total_jobs || 0} Jobs Found`
                                                    )}
                                                </h2>
                                                {pagination.total_jobs > 0 && (
                                                    <p className="text-sm text-gray-500">
                                                        Showing {((pagination.current_page - 1) * pagination.jobs_per_page) + 1} to{' '}
                                                        {Math.min(pagination.current_page * pagination.jobs_per_page, pagination.total_jobs)} of{' '}
                                                        {pagination.total_jobs} jobs
                                                    </p>
                                                )}
                                            </div>

                                            {/* Filters Row */}
                                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                                                {/* Application Filter - Only for Job Seekers */}
                                                {isAuth && user?.role === 'jobseeker' && (
                                                    <div className="flex items-center gap-2">
                                                        {applicationsLoading && (
                                                            <Clock className="animate-spin text-gray-400" size={16} />
                                                        )}
                                                        <Select
                                                            value={applicationFilter}
                                                            onValueChange={(value: 'all' | 'applied' | 'not_applied') => setApplicationFilter(value)}
                                                        >
                                                            <SelectTrigger className="w-48 border-[#d0d0ff] dark:border-[#0000c5] focus:border-[#494bd6]">
                                                                <SelectValue placeholder="Filter by application" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="all">All Jobs</SelectItem>
                                                                <SelectItem value="applied">
                                                                    <div className="flex items-center gap-2">
                                                                        <CheckCircle size={14} className="text-green-600" />
                                                                        Applied Jobs ({applicationStats?.applied || 0})
                                                                    </div>
                                                                </SelectItem>
                                                                <SelectItem value="not_applied">
                                                                    <div className="flex items-center gap-2">
                                                                        <Clock size={14} className="text-orange-600" />
                                                                        Not Applied Yet
                                                                    </div>
                                                                </SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                )}

                                                {/* Recruiter Filter - Only for Recruiters */}
                                                {isAuth && user?.role === 'recruiter' && (
                                                    <div className="flex items-center gap-2">
                                                        <Select
                                                            value={recruiterFilter}
                                                            onValueChange={(value: 'all' | 'my_jobs') => setRecruiterFilter(value)}
                                                        >
                                                            <SelectTrigger className="w-48 border-[#d0d0ff] dark:border-[#0000c5] focus:border-[#494bd6]">
                                                                <SelectValue placeholder="Filter by recruiter" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="all">All Jobs</SelectItem>
                                                                <SelectItem value="my_jobs">
                                                                    <div className="flex items-center gap-2">
                                                                        <User size={14} className="text-[#494bd6]" />
                                                                        My Posted Jobs
                                                                    </div>
                                                                </SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Active Filters Display */}
                                        <div className="flex flex-wrap gap-2">
                                            {filters.search && (
                                                <Badge variant="secondary" className="gap-1">
                                                    <Search size={12} />
                                                    Search: "{filters.search}"
                                                    <button
                                                        onClick={clearQuickSearch}
                                                        className="ml-1 hover:text-red-500 cursor-pointer"
                                                    >
                                                        <X size={12} />
                                                    </button>
                                                </Badge>
                                            )}
                                            {applicationFilter !== 'all' && (
                                                <Badge variant="secondary" className="gap-1">
                                                    {applicationFilter === 'applied' ? (
                                                        <CheckCircle size={12} className="text-green-600" />
                                                    ) : (
                                                        <Clock size={12} className="text-orange-600" />
                                                    )}
                                                    {applicationFilter === 'applied' ? 'Applied Jobs' : 'Not Applied'}
                                                    <button
                                                        onClick={() => setApplicationFilter('all')}
                                                        className="ml-1 hover:text-red-500 cursor-pointer"
                                                    >
                                                        <X size={12} />
                                                    </button>
                                                </Badge>
                                            )}
                                            {recruiterFilter !== 'all' && (
                                                <Badge variant="secondary" className="gap-1">
                                                    <User size={12} className="text-[#494bd6]" />
                                                    My Posted Jobs
                                                    <button
                                                        onClick={() => setRecruiterFilter('all')}
                                                        className="ml-1 hover:text-red-500 cursor-pointer"
                                                    >
                                                        <X size={12} />
                                                    </button>
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Jobs Grid */}
                        {loading ? (
                            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                                {[...Array(8)].map((_, i) => (
                                    <Card key={i} className="border-[#d0d0ff] dark:border-[#0000c5] bg-white/90 dark:bg-gray-900/90">
                                        <CardContent className="p-6">
                                            <div className="space-y-4 animate-pulse">
                                                <div className="flex gap-3">
                                                    <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                                                    <div className="flex-1 space-y-2">
                                                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                                                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                                                    </div>
                                                </div>
                                                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                                                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                                                <div className="flex gap-2">
                                                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                                                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        ) : jobs.length === 0 ? (
                            <Card className="border-[#b0b0ff] dark:border-[#0000c5] bg-white/90 dark:bg-gray-900/90 backdrop-blur-md">
                                <CardContent className="text-center py-12">
                                    <Briefcase className="mx-auto text-gray-400 mb-4" size={64} />
                                    <h3 className="text-xl font-semibold mb-2">
                                        {applicationFilter === 'applied'
                                            ? 'No Applied Jobs Found'
                                            : applicationFilter === 'not_applied'
                                                ? 'All Jobs Applied!'
                                                : recruiterFilter === 'my_jobs'
                                                    ? 'No Jobs Posted Yet'
                                                    : 'No Jobs Found'
                                        }
                                    </h3>
                                    <p className="text-gray-500 mb-6">
                                        {applicationFilter === 'applied'
                                            ? 'You haven\'t applied to any jobs yet. Start exploring and find your dream job!'
                                            : applicationFilter === 'not_applied'
                                                ? 'Congratulations! You\'ve applied to all available jobs matching your criteria.'
                                                : recruiterFilter === 'my_jobs'
                                                    ? 'You haven\'t posted any jobs yet. Start by creating your first job posting.'
                                                    : 'We couldn\'t find any jobs matching your criteria. Try adjusting your filters or search terms.'
                                        }
                                    </p>
                                    <Button
                                        onClick={() => {
                                            setApplicationFilter('all')
                                            setRecruiterFilter('all')
                                            handleFiltersChange({ is_active: true, page: 1, limit: 12 })
                                            }}
                                            className='cursor-pointer'
                                    >
                                        {applicationFilter !== 'all' || recruiterFilter !== 'all' ? 'View All Jobs' : 'Clear All Filters'}
                                    </Button>
                                </CardContent>
                            </Card>
                        ) : (
                            <>
                                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                                    {jobs.map((job) => (
                                        <JobCard
                                            key={job.job_id}
                                            job={job}
                                            hasApplied={isJobApplied(job.job_id)}
                                        />
                                    ))}
                                </div>

                                {/* Pagination */}
                                {pagination?.total_pages > 1 && (
                                    <div className="mt-8">
                                        <Card className="border-[#b0b0ff] dark:border-[#0000c5] bg-white/80 dark:bg-gray-900/80 backdrop-blur-md">
                                            <CardContent className="p-4">
                                                <div className="flex items-center justify-between">
                                                    <div className="text-sm text-gray-500">
                                                        Page {pagination.current_page} of {pagination.total_pages}
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handlePageChange(pagination.current_page - 1)}
                                                            disabled={!pagination.has_prev_page || loading}
                                                            className="gap-1 cursor-pointer"
                                                        >
                                                            <ChevronLeft size={14} />
                                                            Previous
                                                        </Button>

                                                        <div className="flex items-center gap-1">
                                                            {Array.from({
                                                                length: Math.min(5, pagination.total_pages)
                                                            }, (_, i) => {
                                                                const startPage = Math.max(1, pagination.current_page - 2)
                                                                const page = startPage + i
                                                                if (page > pagination.total_pages) return null

                                                                return (
                                                                    <Button
                                                                        key={page}
                                                                        variant={pagination.current_page === page ? "default" : "outline"}
                                                                        size="sm"
                                                                        onClick={() => handlePageChange(page)}
                                                                        disabled={loading}
                                                                        className="w-8 h-8 p-0 cursor-pointer"
                                                                    >
                                                                        {page}
                                                                    </Button>
                                                                )
                                                            })}
                                                        </div>

                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handlePageChange(pagination.current_page + 1)}
                                                            disabled={!pagination.has_next_page || loading}
                                                            className="gap-1 cursor-pointer"
                                                        >
                                                            Next
                                                            <ChevronRight size={14} />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                )}
                            </>
                        )}
                    </main>
                </div>
            </div>
        </div>
    )
}

export default Jobs