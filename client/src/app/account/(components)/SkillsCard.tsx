"use client"
import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Briefcase, Plus, X, Search, ChevronDown, Loader2 } from 'lucide-react'
import { User as UserType } from '@/type'
import axios from 'axios'
import { user_service } from '@/context/AppContext'

interface Skill {
    skill_id: number
    name: string
}

interface SkillsCardProps {
    user: UserType
    newSkill?: string
    searchResults?: Skill[]
    isOwner?: boolean
    onNewSkillChange?: (value: string) => void
    onAddSkill?: (skillName: string, skillId?: number) => void
    onRemoveSkill?: (skillName: string) => void
}

const SkillsCard = ({
    user,
    isOwner = false,
    onNewSkillChange,
    onAddSkill,
    onRemoveSkill
}: SkillsCardProps) => {
    const [allSkills, setAllSkills] = useState<Skill[]>([])
    const [filteredSkills, setFilteredSkills] = useState<Skill[]>([])
    const [showDropdown, setShowDropdown] = useState(false)
    const [skillInput, setSkillInput] = useState('')
    const [loading, setLoading] = useState(false)
    const [skillOperationLoading, setSkillOperationLoading] = useState(false)

    useEffect(() => {
        const fetchAllSkills = async () => {
            try {
                setLoading(true)
                const { data } = await axios.get(`${user_service}/api/user/skill/search`)
                setAllSkills(data.data || [])
                setFilteredSkills(data.data || [])
            } catch (error) {
                console.error('Error fetching skills:', error)
                setAllSkills([])
                setFilteredSkills([])
            } finally {
                setLoading(false)
            }
        }

        if (isOwner) {
            fetchAllSkills()
        }
    }, [isOwner])

    useEffect(() => {
        if (!skillInput.trim()) {
            setFilteredSkills(allSkills)
        } else {
            const filtered = allSkills.filter(skill =>
                skill.name.toLowerCase().includes(skillInput.toLowerCase())
            )
            setFilteredSkills(filtered)
        }
    }, [skillInput, allSkills])

    const handleSkillInputChange = (value: string) => {
        setSkillInput(value)
        setShowDropdown(true)

        if (onNewSkillChange) {
            onNewSkillChange(value)
        }
    }

    const handleSkillSelect = async (skill: Skill) => {
        if (onAddSkill) {
            setSkillOperationLoading(true)
            try {
                await onAddSkill(skill.name, skill.skill_id)
            } finally {
                setSkillOperationLoading(false)
            }
        }
        setSkillInput('')
        setShowDropdown(false)
    }

    const handleAddNewSkill = async () => {
        if (skillInput.trim() && onAddSkill) {
            setSkillOperationLoading(true)
            try {
                const existingSkill = allSkills.find(skill =>
                    skill.name.toLowerCase() === skillInput.toLowerCase()
                )

                if (existingSkill) {
                    await onAddSkill(existingSkill.name, existingSkill.skill_id)
                } else {
                    await onAddSkill(skillInput.trim())
                }
            } finally {
                setSkillOperationLoading(false)
            }
        }
        setSkillInput('')
        setShowDropdown(false)
    }

    const handleRemoveSkill = async (skillName: string) => {
        if (onRemoveSkill) {
            setSkillOperationLoading(true)
            try {
                await onRemoveSkill(skillName)
            } finally {
                setSkillOperationLoading(false)
            }
        }
    }

    const handleInputFocus = () => {
        setShowDropdown(true)
    }

    const handleInputBlur = () => {
        setTimeout(() => setShowDropdown(false), 200)
    }

    const isExistingSkill = allSkills.some(skill =>
        skill.name.toLowerCase() === skillInput.toLowerCase()
    )

    const isSkillAlreadyAdded = user?.skills?.includes(skillInput.trim())

    return (
        <Card className="shadow-lg border-[#b0b0ff] dark:border-[#0000c5] bg-white/80 dark:bg-gray-900/80 backdrop-blur-md relative">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Briefcase className="text-[#494bd6]" size={20} />
                    {isOwner ? 'Skills' : 'Skills & Expertise'}
                </CardTitle>
                <CardDescription>
                    {isOwner ? 'Manage your technical skills' : 'Technical skills and competencies'}
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Skills Display with Loading Overlay */}
                <div className="relative">
                    {skillOperationLoading && (
                        <div className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm flex items-center justify-center z-10 rounded-md">
                            <div className="flex items-center gap-2 text-[#494bd6]">
                                <Loader2 className="animate-spin" size={16} />
                                <span className="text-sm font-medium">Updating skills...</span>
                            </div>
                        </div>
                    )}
                    <div className="flex flex-wrap gap-2">
                        {user?.skills && user.skills.length > 0 ? (
                            user.skills.map((skill: string, index: number) => (
                                <Badge
                                    key={index}
                                    variant="secondary"
                                    className="bg-[#ededff] dark:bg-[#00005f] text-[#2b2ed6] border border-[#b0b0ff] dark:border-[#0000c5] hover:bg-[#d0d0ff] px-3 py-1 gap-2"
                                >
                                    {skill}
                                    {isOwner && onRemoveSkill && (
                                        <button
                                            onClick={() => handleRemoveSkill(skill)}
                                            disabled={skillOperationLoading}
                                            className="text-red-500 hover:text-red-700 ml-1 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <X size={12} />
                                        </button>
                                    )}
                                </Badge>
                            ))
                        ) : (
                            <p className="text-gray-500 text-sm">
                                {isOwner ? 'No skills added yet' : 'No skills listed'}
                            </p>
                        )}
                    </div>
                </div>

                {isOwner && onAddSkill && (
                    <div className="space-y-2">
                        <Label htmlFor="skillSearch">Add New Skill</Label>
                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                                    <Input
                                        id="skillSearch"
                                        value={skillInput}
                                        onChange={(e) => handleSkillInputChange(e.target.value)}
                                        onFocus={handleInputFocus}
                                        onBlur={handleInputBlur}
                                        placeholder="Search or add new skill..."
                                        className="pl-10 pr-10 border-[#d0d0ff] dark:border-[#0000c5] focus:border-[#494bd6]"
                                        disabled={skillOperationLoading}
                                    />
                                    <ChevronDown
                                        className={`absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 transition-transform ${showDropdown ? 'rotate-180' : ''}`}
                                        size={16}
                                    />
                                </div>

                                {showDropdown && (
                                    <div className="absolute top-full left-0 right-0 z-9999 bg-white dark:bg-gray-800 border border-[#d0d0ff] dark:border-[#0000c5] rounded-md shadow-xl max-h-60 overflow-y-auto">
                                        {loading ? (
                                            <div className="px-3 py-2 text-sm text-gray-500 flex items-center gap-2">
                                                <Loader2 className="animate-spin" size={14} />
                                                Loading skills...
                                            </div>
                                        ) : (
                                            <>
                                                {filteredSkills.length > 0 ? (
                                                    <>
                                                        <div className="px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wide border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
                                                            Existing Skills
                                                        </div>
                                                        {filteredSkills.slice(0, 8).map((skill) => {
                                                            const isAlreadyAdded = user?.skills?.includes(skill.name)
                                                            return (
                                                                <button
                                                                    key={skill.skill_id}
                                                                    onClick={() => !isAlreadyAdded && !skillOperationLoading && handleSkillSelect(skill)}
                                                                    disabled={isAlreadyAdded || skillOperationLoading}
                                                                    className={`w-full text-left px-3 py-2 text-sm transition-colors ${isAlreadyAdded || skillOperationLoading
                                                                        ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                                                                        : 'hover:bg-[#ededff] dark:hover:bg-gray-700 cursor-pointer'
                                                                        }`}
                                                                >
                                                                    <div className="flex items-center justify-between">
                                                                        <span>{skill.name}</span>
                                                                        {isAlreadyAdded && (
                                                                            <Badge variant="secondary" className="text-xs">
                                                                                Added
                                                                            </Badge>
                                                                        )}
                                                                    </div>
                                                                </button>
                                                            )
                                                        })}
                                                        {filteredSkills.length > 8 && (
                                                            <div className="px-3 py-2 text-xs text-gray-500 bg-gray-50 dark:bg-gray-700/30">
                                                                +{filteredSkills.length - 8} more skills...
                                                            </div>
                                                        )}
                                                    </>
                                                ) : skillInput.trim() ? (
                                                    <div className="px-3 py-2 text-sm text-gray-500">
                                                        No existing skills found
                                                    </div>
                                                ) : (
                                                    <div className="px-3 py-2 text-sm text-gray-500">
                                                        Start typing to search skills...
                                                    </div>
                                                )}

                                                {skillInput.trim() && !isExistingSkill && !isSkillAlreadyAdded && (
                                                    <>
                                                        <div className="px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wide border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
                                                            Add New Skill
                                                        </div>
                                                        <button
                                                            onClick={() => !skillOperationLoading && handleAddNewSkill()}
                                                            disabled={skillOperationLoading}
                                                            className="w-full text-left px-3 py-2 text-sm hover:bg-[#ededff] dark:hover:bg-gray-700 cursor-pointer border-l-2 border-[#494bd6] disabled:opacity-50 disabled:cursor-not-allowed"
                                                        >
                                                            <div className="flex items-center gap-2">
                                                                {skillOperationLoading ? (
                                                                    <Loader2 size={14} className="text-[#494bd6] animate-spin" />
                                                                ) : (
                                                                    <Plus size={14} className="text-[#494bd6]" />
                                                                )}
                                                                <span>Add "<strong>{skillInput.trim()}</strong>" as new skill</span>
                                                            </div>
                                                        </button>
                                                    </>
                                                )}
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>
                            <Button
                                onClick={handleAddNewSkill}
                                disabled={!skillInput.trim() || isSkillAlreadyAdded || skillOperationLoading}
                                className="gap-2 cursor-pointer"
                            >
                                {skillOperationLoading ? (
                                    <Loader2 size={16} className="animate-spin" />
                                ) : (
                                    <Plus size={16} />
                                )}
                                Add
                            </Button>
                        </div>

                        {skillInput.trim() && (
                            <div className="text-xs text-gray-500 mt-2">
                                {isSkillAlreadyAdded ? (
                                    <span className="text-amber-600">⚠️ This skill is already added</span>
                                ) : isExistingSkill ? (
                                    <span className="text-green-600">✓ This skill exists in our database</span>
                                ) : skillInput.trim() ? (
                                    <span className="text-blue-600">➕ This will be added as a new skill</span>
                                ) : null}
                            </div>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

export default SkillsCard