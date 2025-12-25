"use client"
import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, ArrowRight, Plus, X, Lightbulb, Search } from 'lucide-react'
import { JobFormData } from '../types/jobForm'
import axios from 'axios'
import { user_service } from '@/context/AppContext'

interface Skill {
    skill_id: number
    name: string
}

interface RequirementsStepProps {
    data: JobFormData
    onUpdate: (data: Partial<JobFormData>) => void
    onNext: () => void
    onPrevious: () => void
}

const RequirementsStep: React.FC<RequirementsStepProps> = ({
    data,
    onUpdate,
    onNext,
    onPrevious
}) => {
    const [currentQualification, setCurrentQualification] = useState('')
    const [skillInput, setSkillInput] = useState('')
    const [allSkills, setAllSkills] = useState<Skill[]>([])
    const [filteredSkills, setFilteredSkills] = useState<Skill[]>([])
    const [showSkillDropdown, setShowSkillDropdown] = useState(false)

    const qualifications = data.qualifications
        ? data.qualifications.split('\n').filter(q => q.trim().startsWith('•')).map(q => q.replace('• ', '').trim())
        : []

    const isValid = qualifications.length >= 3

    useEffect(() => {
        fetchAllSkills()
    }, [])

    const fetchAllSkills = async () => {
        try {
            const { data } = await axios.get(`${user_service}/api/user/skill/search`)
            setAllSkills(data.data || [])
            setFilteredSkills(data.data || [])
        } catch (error) {
            console.error('Error fetching skills:', error)
            setAllSkills([])
            setFilteredSkills([])
        }
    }

    const addQualification = () => {
        if (currentQualification.trim() && qualifications.length < 10) {
            const newQualifications = [...qualifications, currentQualification.trim()]
            const formattedQualifications = newQualifications.map(q => `• ${q}`).join('\n')
            onUpdate({ qualifications: formattedQualifications })
            setCurrentQualification('')
        }
    }

    const removeQualification = (index: number) => {
        const newQualifications = qualifications.filter((_, i) => i !== index)
        const formattedQualifications = newQualifications.map(q => `• ${q}`).join('\n')
        onUpdate({ qualifications: formattedQualifications })
    }

    const handleNext = () => {
        if (isValid) {
            onNext()
        }
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            addQualification()
        }
    }

    const handleSkillInputChange = (value: string) => {
        setSkillInput(value)
        if (value.trim()) {
            const filtered = allSkills.filter(skill =>
                skill.name.toLowerCase().includes(value.toLowerCase()) &&
                !data.skills_required.some(selected => selected.toLowerCase() === skill.name.toLowerCase())
            )
            setFilteredSkills(filtered)
        } else {
            setFilteredSkills(allSkills.filter(skill =>
                !data.skills_required.some(selected => selected.toLowerCase() === skill.name.toLowerCase())
            ))
        }
        setShowSkillDropdown(true)
    }

    const handleSkillSelect = (skill: Skill) => {
        if (!data.skills_required.some(selected => selected.toLowerCase() === skill.name.toLowerCase())) {
            onUpdate({ skills_required: [...data.skills_required, skill.name] })
            setSkillInput('')
            setShowSkillDropdown(false)
        }
    }

    const handleAddCustomSkill = () => {
        if (skillInput.trim() && !data.skills_required.some(skill => skill.toLowerCase() === skillInput.trim().toLowerCase())) {
            onUpdate({ skills_required: [...data.skills_required, skillInput.trim()] })
            setSkillInput('')
            setShowSkillDropdown(false)
        }
    }

    const handleRemoveSkill = (skillToRemove: string) => {
        const updatedSkills = data.skills_required.filter(skill => skill !== skillToRemove)
        onUpdate({ skills_required: updatedSkills })
    }

    const suggestedQualifications = [
        "Bachelor's degree in Computer Science or related field",
        "3+ years of professional experience",
        "Strong problem-solving and analytical skills",
        "Excellent communication and teamwork abilities",
        "Experience with Agile development methodologies",
        "Ability to work in a fast-paced environment",
        "Self-motivated and detail-oriented",
        "Experience with version control systems (Git)"
    ]

    const addSuggestion = (suggestion: string) => {
        if (!qualifications.includes(suggestion) && qualifications.length < 10) {
            const newQualifications = [...qualifications, suggestion]
            const formattedQualifications = newQualifications.map(q => `• ${q}`).join('\n')
            onUpdate({ qualifications: formattedQualifications })
        }
    }

    return (
        <div className="space-y-6">
            <div className="space-y-6">
                {/* Instructions */}
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-md p-4">
                    <div className="flex items-start gap-3">
                        <Lightbulb className="text-blue-600 dark:text-blue-400 mt-0.5" size={16} />
                        <div>
                            <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-1">
                                Qualifications & Skills
                            </h4>
                            <p className="text-xs text-blue-700 dark:text-blue-300">
                                Define the essential requirements and preferred skills for this position.
                                This helps attract qualified candidates and sets clear expectations.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Qualifications Section */}
                <div className="space-y-4">
                    <h3 className="text-lg font-medium">Qualifications & Requirements</h3>

                    {/* Add New Qualification */}
                    <div className="space-y-2">
                        <Label htmlFor="qualification" className="text-sm font-medium">
                            Add Qualification ({qualifications.length}/10)
                        </Label>
                        <div className="flex gap-2">
                            <Textarea
                                id="qualification"
                                value={currentQualification}
                                onChange={(e) => setCurrentQualification(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="e.g., Bachelor's degree in Computer Science or equivalent experience"
                                className="border-[#d0d0ff] dark:border-[#0000c5] focus:border-[#494bd6] transition-colors resize-none"
                                rows={2}
                                maxLength={150}
                            />
                            <Button
                                onClick={addQualification}
                                disabled={!currentQualification.trim() || qualifications.length >= 10}
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
                            <span className={`text-xs ${currentQualification.length > 120 ? 'text-red-500' : 'text-gray-400'}`}>
                                {currentQualification.length}/150
                            </span>
                        </div>
                    </div>

                    {/* Current Qualifications */}
                    {qualifications.length > 0 && (
                        <div className="space-y-2">
                            <Label className="text-sm font-medium">
                                Current Qualifications
                            </Label>
                            <div className="space-y-2">
                                {qualifications.map((qualification, index) => (
                                    <div
                                        key={index}
                                        className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-md group"
                                    >
                                        <span className="text-[#494bd6] mt-1">•</span>
                                        <span className="flex-1 text-sm">{qualification}</span>
                                        <Button
                                            onClick={() => removeQualification(index)}
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

                    {/* Suggested Qualifications */}
                    {qualifications.length < 8 && (
                        <div className="space-y-2">
                            <Label className="text-sm font-medium">
                                Suggested Qualifications
                            </Label>
                            <div className="flex flex-wrap gap-2">
                                {suggestedQualifications
                                    .filter(suggestion => !qualifications.includes(suggestion))
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

                {/* Skills Section */}
                <div className="space-y-4">
                    <h3 className="text-lg font-medium">Required Skills (Optional)</h3>

                    {/* Selected Skills */}
                    {data.skills_required.length > 0 && (
                        <div className="space-y-2">
                            <Label className="text-sm font-medium">
                                Selected Skills ({data.skills_required.length})
                            </Label>
                            <div className="flex flex-wrap gap-2">
                                {data.skills_required.map((skill, index) => (
                                    <Badge
                                        key={index}
                                        variant="secondary"
                                        className="bg-[#ededff] dark:bg-[#00005f] text-[#2b2ed6] border border-[#b0b0ff] dark:border-[#0000c5] hover:bg-[#d0d0ff] px-3 py-1 gap-2"
                                    >
                                        {skill}
                                        <button
                                            onClick={() => handleRemoveSkill(skill)}
                                            className="text-[#2b2ed6] hover:text-red-500"
                                        >
                                            <X size={12} />
                                        </button>
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Skills Input */}
                    <div className="space-y-2">
                        <Label htmlFor="skills" className="text-sm font-medium">
                            Add Skills
                        </Label>
                        <div className="relative">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                                <Input
                                    id="skills"
                                    value={skillInput}
                                    onChange={(e) => handleSkillInputChange(e.target.value)}
                                    onFocus={() => setShowSkillDropdown(true)}
                                    onBlur={() => setTimeout(() => setShowSkillDropdown(false), 200)}
                                    placeholder="Search for skills (e.g., React, Python, Leadership)"
                                    className="pl-10 border-[#d0d0ff] dark:border-[#0000c5] focus:border-[#494bd6] transition-colors"
                                />
                                {skillInput && (
                                    <Button
                                        onClick={handleAddCustomSkill}
                                        size="sm"
                                        className="absolute right-1 top-1/2 transform -translate-y-1/2 cursor-pointer"
                                    >
                                        Add
                                    </Button>
                                )}
                            </div>

                            {/* Skills Dropdown */}
                            {showSkillDropdown && filteredSkills.length > 0 && (
                                <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-[#d0d0ff] dark:border-[#0000c5] rounded-md shadow-lg max-h-48 overflow-y-auto">
                                    {filteredSkills.slice(0, 8).map((skill) => (
                                        <button
                                            key={skill.skill_id}
                                            onClick={() => handleSkillSelect(skill)}
                                            className="w-full px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                                        >
                                            <span className="text-sm">{skill.name}</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            Add technical skills, soft skills, or tools relevant to this position
                        </p>
                    </div>
                </div>
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
                        Step 4 of 5
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
                        Please add at least 3 qualifications to continue.
                    </p>
                    <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
                        Currently have: {qualifications.length} qualifications
                    </p>
                </div>
            )}
        </div>
    )
}

export default RequirementsStep
