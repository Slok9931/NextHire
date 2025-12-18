"use client"
import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Briefcase, Plus, X } from 'lucide-react'
import { User as UserType } from '@/type'

interface SkillsCardProps {
    user: UserType
    newSkill?: string
    searchResults?: any[]
    isOwner?: boolean
    onNewSkillChange?: (value: string) => void
    onAddSkill?: (skillName: string, skillId?: number) => void
    onRemoveSkill?: (skillName: string) => void
}

const SkillsCard = ({ 
    user, 
    newSkill = '', 
    searchResults = [], 
    isOwner = false,
    onNewSkillChange, 
    onAddSkill, 
    onRemoveSkill 
}: SkillsCardProps) => {
    return (
        <Card className="shadow-lg border-[#b0b0ff] dark:border-[#0000c5] bg-white/80 dark:bg-gray-900/80 backdrop-blur-md">
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
                                        onClick={() => onRemoveSkill(skill)}
                                        className="text-red-500 hover:text-red-700 ml-1 cursor-pointer"
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

                {isOwner && onNewSkillChange && onAddSkill && (
                    <div className="space-y-2">
                        <Label htmlFor="newSkill">Add New Skill</Label>
                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <Input
                                    id="newSkill"
                                    value={newSkill}
                                    onChange={(e) => onNewSkillChange(e.target.value)}
                                    placeholder="e.g. JavaScript, React, Python..."
                                    className="border-[#d0d0ff] dark:border-[#0000c5] focus:border-[#494bd6]"
                                />
                                {searchResults.length > 0 && (
                                    <div className="absolute top-full left-0 right-0 z-10 bg-white dark:bg-gray-800 border border-[#d0d0ff] dark:border-[#0000c5] rounded-md shadow-lg max-h-40 overflow-y-auto">
                                        {searchResults.map((skill) => (
                                            <button
                                                key={skill.skill_id}
                                                onClick={() => onAddSkill(skill.name, skill.skill_id)}
                                                className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm cursor-pointer"
                                            >
                                                {skill.name}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <Button 
                                onClick={() => onAddSkill(newSkill)}
                                disabled={!newSkill.trim()}
                                className="gap-2 cursor-pointer"
                            >
                                <Plus size={16} />
                                Add
                            </Button>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

export default SkillsCard