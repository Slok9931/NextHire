"use client"
import React from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ArrowRight } from 'lucide-react'
import { JobFormData } from '../types/jobForm'

interface BasicInfoStepProps {
    data: JobFormData
    onUpdate: (data: Partial<JobFormData>) => void
    onNext: () => void
}

const BasicInfoStep: React.FC<BasicInfoStepProps> = ({ data, onUpdate, onNext }) => {
    const handleInputChange = (field: keyof JobFormData, value: string) => {
        onUpdate({ [field]: value })
    }

    const isValid = !!(data.title && data.role && data.description)

    const handleNext = () => {
        if (isValid) {
            onNext()
        }
    }

    return (
        <div className="space-y-6">
            <div className="space-y-4">
                {/* Job Title */}
                <div className="space-y-2">
                    <Label htmlFor="title" className="text-sm font-medium">
                        Job Title *
                    </Label>
                    <Input
                        id="title"
                        value={data.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        placeholder="e.g., Senior Software Engineer"
                        className="border-[#d0d0ff] dark:border-[#0000c5] focus:border-[#494bd6] transition-colors"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        Choose a clear, specific job title that candidates will search for
                    </p>
                </div>

                {/* Role */}
                <div className="space-y-2">
                    <Label htmlFor="role" className="text-sm font-medium">
                        Role Category *
                    </Label>
                    <Input
                        id="role"
                        value={data.role}
                        onChange={(e) => handleInputChange('role', e.target.value)}
                        placeholder="e.g., Software Engineer, Marketing Manager"
                        className="border-[#d0d0ff] dark:border-[#0000c5] focus:border-[#494bd6] transition-colors"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        The general category or department this role belongs to
                    </p>
                </div>

                {/* Job Description */}
                <div className="space-y-2">
                    <Label htmlFor="description" className="text-sm font-medium">
                        Job Description *
                    </Label>
                    <Textarea
                        id="description"
                        value={data.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        placeholder="Provide a compelling overview of the role, what the successful candidate will do, and why they should be excited about this opportunity..."
                        className="min-h-32 border-[#d0d0ff] dark:border-[#0000c5] focus:border-[#494bd6] transition-colors resize-none"
                        rows={6}
                    />
                    <div className="flex justify-between items-center">
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            Write a brief but engaging description that will attract the right candidates
                        </p>
                        <span className={`text-xs ${data.description.length > 500 ? 'text-red-500' : 'text-gray-400'}`}>
                            {data.description.length}/500
                        </span>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="text-sm text-gray-500">
                    Step 1 of 5
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

            {/* Validation Messages */}
            {!isValid && (
                <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-md">
                    <p className="text-sm text-yellow-800 dark:text-yellow-200">
                        Please fill in all required fields to continue:
                    </p>
                    <ul className="mt-1 text-sm text-yellow-700 dark:text-yellow-300 list-disc list-inside">
                        {!data.title && <li>Job Title is required</li>}
                        {!data.role && <li>Role Category is required</li>}
                        {!data.description && <li>Job Description is required</li>}
                    </ul>
                </div>
            )}
        </div>
    )
}

export default BasicInfoStep
