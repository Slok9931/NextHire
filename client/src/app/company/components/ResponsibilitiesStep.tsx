"use client"
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft, ArrowRight, Plus, X, Lightbulb } from 'lucide-react'
import { JobFormData } from '../types/jobForm'

interface ResponsibilitiesStepProps {
    data: JobFormData
    onUpdate: (data: Partial<JobFormData>) => void
    onNext: () => void
    onPrevious: () => void
}

const ResponsibilitiesStep: React.FC<ResponsibilitiesStepProps> = ({
    data,
    onUpdate,
    onNext,
    onPrevious
}) => {
    const [currentResponsibility, setCurrentResponsibility] = useState('')

    const responsibilities = data.responsibilities
        ? data.responsibilities.split('\n').filter(r => r.trim().startsWith('•')).map(r => r.replace('• ', '').trim())
        : []

    const isValid = responsibilities.length >= 3

    const addResponsibility = () => {
        if (currentResponsibility.trim() && responsibilities.length < 10) {
            const newResponsibilities = [...responsibilities, currentResponsibility.trim()]
            const formattedResponsibilities = newResponsibilities.map(r => `• ${r}`).join('\n')
            onUpdate({ responsibilities: formattedResponsibilities })
            setCurrentResponsibility('')
        }
    }

    const removeResponsibility = (index: number) => {
        const newResponsibilities = responsibilities.filter((_, i) => i !== index)
        const formattedResponsibilities = newResponsibilities.map(r => `• ${r}`).join('\n')
        onUpdate({ responsibilities: formattedResponsibilities })
    }

    const handleNext = () => {
        if (isValid) {
            onNext()
        }
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            addResponsibility()
        }
    }

    const suggestedResponsibilities = [
        "Develop and maintain software applications",
        "Collaborate with cross-functional teams",
        "Write clean, efficient, and maintainable code",
        "Participate in code reviews and technical discussions",
        "Troubleshoot and debug technical issues",
        "Contribute to system architecture and design decisions",
        "Mentor junior team members",
        "Stay updated with latest industry trends and technologies"
    ]

    const addSuggestion = (suggestion: string) => {
        if (!responsibilities.includes(suggestion) && responsibilities.length < 10) {
            const newResponsibilities = [...responsibilities, suggestion]
            const formattedResponsibilities = newResponsibilities.map(r => `• ${r}`).join('\n')
            onUpdate({ responsibilities: formattedResponsibilities })
        }
    }

    return (
        <div className="space-y-6">
            <div className="space-y-4">
                {/* Instructions */}
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-md p-4">
                    <div className="flex items-start gap-3">
                        <Lightbulb className="text-blue-600 dark:text-blue-400 mt-0.5" size={16} />
                        <div>
                            <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-1">
                                Key Responsibilities
                            </h4>
                            <p className="text-xs text-blue-700 dark:text-blue-300">
                                List the main tasks and duties this role will involve. Be specific and action-oriented.
                                Include at least 3-5 key responsibilities.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Add New Responsibility */}
                <div className="space-y-2">
                    <Label htmlFor="responsibility" className="text-sm font-medium">
                        Add Responsibility ({responsibilities.length}/10)
                    </Label>
                    <div className="flex gap-2">
                        <Textarea
                            id="responsibility"
                            value={currentResponsibility}
                            onChange={(e) => setCurrentResponsibility(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="e.g., Design and develop user-facing features using React and TypeScript"
                            className="border-[#d0d0ff] dark:border-[#0000c5] focus:border-[#494bd6] transition-colors resize-none"
                            rows={2}
                            maxLength={150}
                        />
                        <Button
                            onClick={addResponsibility}
                            disabled={!currentResponsibility.trim() || responsibilities.length >= 10}
                            size="sm"
                            className="shrink-0 cursor-pointer"
                        >
                            <Plus size={16} />
                        </Button>
                    </div>
                    <div className="flex justify-between items-center">
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            Press Enter to add, or click the plus button
                        </p>
                        <span className={`text-xs ${currentResponsibility.length > 120 ? 'text-red-500' : 'text-gray-400'}`}>
                            {currentResponsibility.length}/150
                        </span>
                    </div>
                </div>

                {/* Current Responsibilities */}
                {responsibilities.length > 0 && (
                    <div className="space-y-2">
                        <Label className="text-sm font-medium">
                            Current Responsibilities
                        </Label>
                        <div className="space-y-2">
                            {responsibilities.map((responsibility, index) => (
                                <div
                                    key={index}
                                    className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-md group"
                                >
                                    <span className="text-[#494bd6] mt-1">•</span>
                                    <span className="flex-1 text-sm">{responsibility}</span>
                                    <Button
                                        onClick={() => removeResponsibility(index)}
                                        variant="ghost"
                                        size="sm"
                                        className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 cursor-pointer"
                                    >
                                        <X size={14} />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Suggested Responsibilities */}
                {responsibilities.length < 8 && (
                    <div className="space-y-2">
                        <Label className="text-sm font-medium">
                            Suggested Responsibilities
                        </Label>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                            Click on any suggestion to add it to your list
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {suggestedResponsibilities
                                .filter(suggestion => !responsibilities.includes(suggestion))
                                .slice(0, 6)
                                .map((suggestion, index) => (
                                    <Button
                                        key={index}
                                        variant="outline"
                                        size="sm"
                                        onClick={() => addSuggestion(suggestion)}
                                        className="text-xs h-auto py-2 px-3 cursor-pointer border-[#d0d0ff] dark:border-[#0000c5] hover:bg-[#ededff] dark:hover:bg-[#000040] hover:border-[#494bd6]"
                                    >
                                        + {suggestion}
                                    </Button>
                                ))}
                        </div>
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
                        Step 3 of 5
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
                        Please add at least 3 key responsibilities to continue.
                    </p>
                    <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
                        Currently have: {responsibilities.length} responsibilities
                    </p>
                </div>
            )}
        </div>
    )
}

export default ResponsibilitiesStep
