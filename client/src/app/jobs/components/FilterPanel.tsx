"use client"
import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { X, Filter, Search, DollarSign, Building2, MapPin, Users, Briefcase } from 'lucide-react'
import { useAppData } from '@/context/AppContext'
import { Company } from '@/type'

interface FilterPanelProps {
    onFiltersChange: (filters: any) => void
    isLoading: boolean
}

const FilterPanel: React.FC<FilterPanelProps> = ({ onFiltersChange, isLoading }) => {
    const { getAllCompanies, getAllRoles } = useAppData()

    const [companies, setCompanies] = useState<Company[]>([])
    const [roles, setRoles] = useState<string[]>([])
    const [filters, setFilters] = useState({
        search: '',
        role: 'all',
        min_salary: '',
        max_salary: '',
        job_type: 'all',
        work_location: [] as string[],
        company_id: 'all',
        min_openings: '',
        max_openings: ''
    })

    useEffect(() => {
        fetchFilterData()
    }, [])

    const fetchFilterData = async () => {
        const [companiesData, rolesData] = await Promise.all([
            getAllCompanies(),
            getAllRoles()
        ])
        setCompanies(companiesData)
        setRoles(rolesData)
    }

    const handleFilterChange = (key: string, value: any) => {
        const newFilters = { ...filters, [key]: value }
        setFilters(newFilters)

        // Convert filters to API format
        const apiFilters: any = {}

        if (newFilters.search) apiFilters.search = newFilters.search
        if (newFilters.role && newFilters.role !== 'all') apiFilters.role = newFilters.role
        if (newFilters.min_salary) apiFilters.min_salary = parseFloat(newFilters.min_salary)
        if (newFilters.max_salary) apiFilters.max_salary = parseFloat(newFilters.max_salary)
        if (newFilters.job_type && newFilters.job_type !== 'all') apiFilters.job_type = newFilters.job_type
        if (newFilters.work_location.length > 0) apiFilters.work_location = newFilters.work_location.join(',')
        if (newFilters.company_id && newFilters.company_id !== 'all') apiFilters.company_id = parseInt(newFilters.company_id)
        if (newFilters.min_openings) apiFilters.min_openings = parseInt(newFilters.min_openings)
        if (newFilters.max_openings) apiFilters.max_openings = parseInt(newFilters.max_openings)

        apiFilters.is_active = true // Only show active jobs
        apiFilters.page = 1 // Reset to first page when filters change

        onFiltersChange(apiFilters)
    }

    const handleWorkLocationChange = (location: string, checked: boolean) => {
        const newLocations = checked
            ? [...filters.work_location, location]
            : filters.work_location.filter(loc => loc !== location)

        handleFilterChange('work_location', newLocations)
    }

    const clearAllFilters = () => {
        const clearedFilters = {
            search: '',
            role: 'all',
            min_salary: '',
            max_salary: '',
            job_type: 'all',
            work_location: [] as string[],
            company_id: 'all',
            min_openings: '',
            max_openings: ''
        }
        setFilters(clearedFilters)
        onFiltersChange({ is_active: true, page: 1 })
    }

    const getActiveFiltersCount = () => {
        let count = 0
        if (filters.search) count++
        if (filters.role && filters.role !== 'all') count++
        if (filters.min_salary || filters.max_salary) count++
        if (filters.job_type && filters.job_type !== 'all') count++
        if (filters.work_location.length > 0) count++
        if (filters.company_id && filters.company_id !== 'all') count++
        if (filters.min_openings || filters.max_openings) count++
        return count
    }

    const activeFiltersCount = getActiveFiltersCount()

    return (
        <Card className="h-fit sticky top-4 shadow-lg border-[#b0b0ff] dark:border-[#0000c5] bg-white/90 dark:bg-gray-900/90 backdrop-blur-md">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                        <Filter className="text-[#494bd6]" size={20} />
                        Filters
                        {activeFiltersCount > 0 && (
                            <Badge variant="secondary" className="ml-2">
                                {activeFiltersCount}
                            </Badge>
                        )}
                    </CardTitle>
                    {activeFiltersCount > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={clearAllFilters}
                            className="text-gray-500 hover:text-gray-700 cursor-pointer"
                        >
                            Clear All
                        </Button>
                    )}
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Search */}
                <div className="space-y-2">
                    <Label htmlFor="search" className="flex items-center gap-2">
                        <Search size={16} />
                        Search Jobs
                    </Label>
                    <Input
                        id="search"
                        placeholder="Job title, description, company..."
                        value={filters.search}
                        onChange={(e) => handleFilterChange('search', e.target.value)}
                        className="border-[#d0d0ff] dark:border-[#0000c5] focus:border-[#494bd6]"
                    />
                </div>

                <Separator />

                {/* Role */}
                <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                        <Briefcase size={16} />
                        Role
                    </Label>
                    <Select value={filters.role} onValueChange={(value) => handleFilterChange('role', value)}>
                        <SelectTrigger className="border-[#d0d0ff] dark:border-[#0000c5] focus:border-[#494bd6] w-full">
                            <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Roles</SelectItem>
                            {roles.map((role) => (
                                <SelectItem key={role} value={role}>
                                    {role}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <Separator />

                {/* Salary Range */}
                <div className="space-y-3">
                    <Label className="flex items-center gap-2">
                        <DollarSign size={16} />
                        Salary Range (USD)
                    </Label>
                    <div className="grid grid-cols-2 gap-2">
                        <Input
                            placeholder="Min"
                            type="number"
                            value={filters.min_salary}
                            onChange={(e) => handleFilterChange('min_salary', e.target.value)}
                            className="border-[#d0d0ff] dark:border-[#0000c5] focus:border-[#494bd6]"
                        />
                        <Input
                            placeholder="Max"
                            type="number"
                            value={filters.max_salary}
                            onChange={(e) => handleFilterChange('max_salary', e.target.value)}
                            className="border-[#d0d0ff] dark:border-[#0000c5] focus:border-[#494bd6]"
                        />
                    </div>
                </div>

                <Separator />

                {/* Job Type */}
                <div className="space-y-2">
                    <Label>Job Type</Label>
                    <Select value={filters.job_type} onValueChange={(value) => handleFilterChange('job_type', value)}>
                        <SelectTrigger className="border-[#d0d0ff] dark:border-[#0000c5] focus:border-[#494bd6] w-full">
                            <SelectValue placeholder="Select job type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Types</SelectItem>
                            <SelectItem value="full_time">Full Time</SelectItem>
                            <SelectItem value="part_time">Part Time</SelectItem>
                            <SelectItem value="contract">Contract</SelectItem>
                            <SelectItem value="internship">Internship</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <Separator />

                {/* Work Location */}
                <div className="space-y-3">
                    <Label className="flex items-center gap-2">
                        <MapPin size={16} />
                        Work Location
                    </Label>
                    <div className="space-y-2">
                        {[
                            { value: 'onsite', label: 'Onsite' },
                            { value: 'remote', label: 'Remote' },
                            { value: 'hybrid', label: 'Hybrid' }
                        ].map((location) => (
                            <div key={location.value} className="flex items-center space-x-2">
                                <Checkbox
                                    id={location.value}
                                    checked={filters.work_location.includes(location.value)}
                                    onCheckedChange={(checked) =>
                                        handleWorkLocationChange(location.value, checked as boolean)
                                    }
                                />
                                <Label htmlFor={location.value} className="text-sm">
                                    {location.label}
                                </Label>
                            </div>
                        ))}
                    </div>
                    {filters.work_location.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                            {filters.work_location.map((location) => (
                                <Badge
                                    key={location}
                                    variant="secondary"
                                    className="text-xs"
                                >
                                    {location.charAt(0).toUpperCase() + location.slice(1)}
                                    <X
                                        size={12}
                                        className="ml-1 cursor-pointer"
                                        onClick={() => handleWorkLocationChange(location, false)}
                                    />
                                </Badge>
                            ))}
                        </div>
                    )}
                </div>

                <Separator />

                {/* Company */}
                <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                        <Building2 size={16} />
                        Company
                    </Label>
                    <Select value={filters.company_id} onValueChange={(value) => handleFilterChange('company_id', value)}>
                        <SelectTrigger className="border-[#d0d0ff] dark:border-[#0000c5] focus:border-[#494bd6] w-full">
                            <SelectValue placeholder="Select company" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Companies</SelectItem>
                            {companies.map((company) => (
                                <SelectItem key={company.company_id} value={company.company_id.toString()}>
                                    <div className="flex items-center gap-2">
                                        <img
                                            src={company.logo}
                                            alt={company.name}
                                            className="w-4 h-4 rounded-full object-cover"
                                        />
                                        {company.name}
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <Separator />

                {/* Openings Range */}
                <div className="space-y-3">
                    <Label className="flex items-center gap-2">
                        <Users size={16} />
                        Number of Openings
                    </Label>
                    <div className="grid grid-cols-2 gap-2">
                        <Input
                            placeholder="Min"
                            type="number"
                            min="1"
                            value={filters.min_openings}
                            onChange={(e) => handleFilterChange('min_openings', e.target.value)}
                            className="border-[#d0d0ff] dark:border-[#0000c5] focus:border-[#494bd6]"
                        />
                        <Input
                            placeholder="Max"
                            type="number"
                            min="1"
                            value={filters.max_openings}
                            onChange={(e) => handleFilterChange('max_openings', e.target.value)}
                            className="border-[#d0d0ff] dark:border-[#0000c5] focus:border-[#494bd6]"
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default FilterPanel