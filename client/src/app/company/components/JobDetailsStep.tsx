"use client"
import React from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { JobFormData } from '../types/jobForm'

interface JobDetailsStepProps {
    data: JobFormData
    onUpdate: (data: Partial<JobFormData>) => void
    onNext: () => void
    onPrevious: () => void
}

const JobDetailsStep: React.FC<JobDetailsStepProps> = ({ data, onUpdate, onNext, onPrevious }) => {
    const handleInputChange = (field: keyof JobFormData, value: string) => {
        onUpdate({ [field]: value })
    }

    const isValid = !!(data.salary && data.location && data.openings && 
                      parseFloat(data.salary) > 0 && parseInt(data.openings) > 0)

    const handleNext = () => {
        if (isValid) {
            onNext()
        }
    }

    const formatSalary = (value: string) => {
        const numericValue = value.replace(/[^0-9]/g, '')
        if (numericValue) {
            return parseInt(numericValue).toLocaleString()
        }
        return ''
    }

    const handleSalaryChange = (value: string) => {
        const numericValue = value.replace(/[^0-9]/g, '')
        handleInputChange('salary', numericValue)
    }

    return (
        <div className="space-y-6">
            <div className="space-y-4">
                {/* Salary */}
                <div className="space-y-2">
                    <Label htmlFor="salary" className="text-sm font-medium">
                        Annual Salary (USD) *
                    </Label>
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                        <Input
                            id="salary"
                            value={formatSalary(data.salary)}
                            onChange={(e) => handleSalaryChange(e.target.value)}
                            placeholder="e.g., 120,000"
                            className="pl-8 border-[#d0d0ff] dark:border-[#0000c5] focus:border-[#494bd6] transition-colors"
                        />
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        Enter the annual salary in USD. This helps attract candidates within your budget range.
                    </p>
                </div>

                {/* Location */}
                <div className="space-y-2">
                    <Label htmlFor="location" className="text-sm font-medium">
                        Job Location *
                    </Label>
                    <Input
                        id="location"
                        value={data.location}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                        placeholder="e.g., San Francisco, CA or Remote"
                        className="border-[#d0d0ff] dark:border-[#0000c5] focus:border-[#494bd6] transition-colors"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        Specify the city/state or write "Remote" if location-flexible
                    </p>
                </div>

                {/* Number of Openings */}
                <div className="space-y-2">
                    <Label htmlFor="openings" className="text-sm font-medium">
                        Number of Openings *
                    </Label>
                    <Input
                        id="openings"
                        type="number"
                        min="1"
                        max="50"
                        value={data.openings}
                        onChange={(e) => handleInputChange('openings', e.target.value)}
                        className="border-[#d0d0ff] dark:border-[#0000c5] focus:border-[#494bd6] transition-colors"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        How many positions are you looking to fill?
                    </p>
                </div>

                {/* Job Type and Work Location */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="job_type" className="text-sm font-medium">
                            Employment Type
                        </Label>
                        <Select 
                            value={data.job_type} 
                            onValueChange={(value) => handleInputChange('job_type', value)}
                        >
                            <SelectTrigger className="border-[#d0d0ff] dark:border-[#0000c5] focus:border-[#494bd6] w-full">
                                <SelectValue placeholder="Select employment type" />
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
                        <Label htmlFor="work_location" className="text-sm font-medium">
                            Work Arrangement
                        </Label>
                        <Select 
                            value={data.work_location} 
                            onValueChange={(value) => handleInputChange('work_location', value)}
                        >
                            <SelectTrigger className="border-[#d0d0ff] dark:border-[#0000c5] focus:border-[#494bd6] w-full">
                                <SelectValue placeholder="Select work arrangement" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="onsite">On-site</SelectItem>
                                <SelectItem value="remote">Remote</SelectItem>
                                <SelectItem value="hybrid">Hybrid</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Salary Preview */}
                {data.salary && parseFloat(data.salary) > 0 && (
                    <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-md">
                        <p className="text-sm text-blue-800 dark:text-blue-200">
                            <strong>Salary Range Preview:</strong> ${formatSalary(data.salary)} per year
                            {parseFloat(data.salary) >= 12 && (
                                <span className="ml-2 text-blue-600 dark:text-blue-300">
                                    (≈ ${Math.round(parseFloat(data.salary) / 12).toLocaleString()}/month)
                                </span>
                            )}
                        </p>
                    </div>
                )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
                <Button 
                    variant="outline" 
                    onClick={onPrevious}
                    className="gap-2 cursor-pointer"
                >
                    <ArrowLeft size={16} />
                    Previous
                </Button>
                <div className="flex items-center gap-4">
                    <div className="text-sm text-gray-500">
                        Step 2 of 5
                    </div>
                    <Button 
                        onClick={handleNext}
                        disabled={!isValid}
                        className="gap-2 cursor-pointer bg-[#494bd6] hover:bg-[#2b2ed6]"
                    >
                        Continue
                        <ArrowRight size={16} />
                    </Button>
                </div>
            </div>

            {/* Validation Messages */}
            {!isValid && (
                <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-md">
                    <p className="text-sm text-yellow-800 dark:text-yellow-200">
                        Please complete all required fields:
                    </p>
                    <ul className="mt-1 text-sm text-yellow-700 dark:text-yellow-300 list-disc list-inside">
                        {!data.salary && <li>Salary is required</li>}
                        {data.salary && parseFloat(data.salary) <= 0 && <li>Salary must be greater than 0</li>}
                        {!data.location && <li>Location is required</li>}
                        {!data.openings && <li>Number of openings is required</li>}
                        {data.openings && parseInt(data.openings) <= 0 && <li>Number of openings must be greater than 0</li>}
                    </ul>
                </div>
            )}
        </div>
    )
}

export default JobDetailsStep
