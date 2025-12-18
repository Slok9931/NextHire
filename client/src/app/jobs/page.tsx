"use client"
import React, { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
    Search, 
    Briefcase, 
    ChevronLeft, 
    ChevronRight, 
    Loader2,
    Filter,
    X
} from 'lucide-react'
import { useAppData } from '@/context/AppContext'
import { Job } from '@/type'
import FilterPanel from './components/FilterPanel'
import JobCard from './components/JobCard'
import Loading from '@/components/loading'

const Jobs = () => {
    const { getAllJobs } = useAppData()
    
    const [jobs, setJobs] = useState<Job[]>([])
    const [loading, setLoading] = useState(true)
    const [pagination, setPagination] = useState<any>({})
    const [filters, setFilters] = useState<any>({ is_active: true, page: 1, limit: 12 })
    const [showMobileFilters, setShowMobileFilters] = useState(false)
    const [quickSearch, setQuickSearch] = useState('')

    useEffect(() => {
        fetchJobs()
    }, [])

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

    const handleFiltersChange = (newFilters: any) => {
        const updatedFilters = { ...newFilters, limit: 12 }
        setFilters(updatedFilters)
        fetchJobs(updatedFilters)
    }

    const handlePageChange = (page: number) => {
        const newFilters = { ...filters, page }
        setFilters(newFilters)
        fetchJobs(newFilters)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const handleQuickSearch = () => {
        const newFilters = { ...filters, search: quickSearch, page: 1 }
        setFilters(newFilters)
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
                            <p className="text-gray-600 dark:text-gray-300 mt-1">
                                Discover {pagination.total_jobs || 0} amazing opportunities waiting for you
                            </p>
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
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
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
                                className="lg:hidden"
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
                        {/* Results Header */}
                        <div className="mb-6">
                            <Card className="border-[#b0b0ff] dark:border-[#0000c5] bg-white/80 dark:bg-gray-900/80 backdrop-blur-md">
                                <CardContent className="p-4">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                        <div>
                                            <h2 className="text-lg font-semibold">
                                                {loading ? 'Searching...' : `${pagination.total_jobs || 0} Jobs Found`}
                                            </h2>
                                            {pagination.total_jobs > 0 && (
                                                <p className="text-sm text-gray-500">
                                                    Showing {((pagination.current_page - 1) * pagination.jobs_per_page) + 1} to{' '}
                                                    {Math.min(pagination.current_page * pagination.jobs_per_page, pagination.total_jobs)} of{' '}
                                                    {pagination.total_jobs} jobs
                                                </p>
                                            )}
                                        </div>
                                        {filters.search && (
                                            <Badge variant="secondary" className="self-start sm:self-center">
                                                Searching: "{filters.search}"
                                            </Badge>
                                        )}
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
                                    <h3 className="text-xl font-semibold mb-2">No Jobs Found</h3>
                                    <p className="text-gray-500 mb-6">
                                        We couldn't find any jobs matching your criteria. Try adjusting your filters or search terms.
                                    </p>
                                    <Button onClick={() => handleFiltersChange({ is_active: true, page: 1, limit: 12 })}>
                                        Clear All Filters
                                    </Button>
                                </CardContent>
                            </Card>
                        ) : (
                            <>
                                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                                    {jobs.map((job) => (
                                        <JobCard key={job.job_id} job={job} />
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
                                                            className="gap-1"
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
                                                                        className="w-8 h-8 p-0"
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
                                                            className="gap-1"
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
