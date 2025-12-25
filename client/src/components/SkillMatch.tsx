"use client"
import React from 'react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { CheckCircle, XCircle, Award } from 'lucide-react'
import { calculateSkillMatch, getSkillMatchColor, getSkillMatchBgColor, getSkillMatchMessage, SkillMatch } from '@/utils/skillMatching'

interface SkillMatchComponentProps {
    userSkills: string[]
    jobSkills: string[] | null | undefined
    showDetails?: boolean
    variant?: 'card' | 'compact' | 'inline'
    className?: string
}

const SkillMatchComponent: React.FC<SkillMatchComponentProps> = ({
    userSkills = [],
    jobSkills = [],
    showDetails = true,
    variant = 'card',
    className = ''
}) => {
    const skillsRequired = jobSkills || []
    const matchData = calculateSkillMatch(userSkills, skillsRequired)

    if (skillsRequired.length === 0) {
        return null // Don't show anything if no skills are required
    }

    if (variant === 'inline') {
        return (
            <div className={`flex items-center gap-2 ${className}`}>
                <div className={`text-sm font-medium ${getSkillMatchColor(matchData.matchPercentage)}`}>
                    {matchData.matchPercentage}% match
                </div>
                <div className="text-xs text-gray-500">
                    {matchData.totalMatched}/{matchData.totalRequired} skills
                </div>
            </div>
        )
    }

    if (variant === 'compact') {
        return (
            <div className={`p-3 rounded-lg border ${getSkillMatchBgColor(matchData.matchPercentage)} ${className}`}>
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                        <Award className={getSkillMatchColor(matchData.matchPercentage)} size={16} />
                        <span className="font-medium text-sm">Skill Match</span>
                    </div>
                    <div className={`text-sm font-bold ${getSkillMatchColor(matchData.matchPercentage)}`}>
                        {matchData.matchPercentage}%
                    </div>
                </div>
                <Progress
                    value={matchData.matchPercentage}
                    className="h-2 mb-2"
                />
                <p className="text-xs text-gray-600 dark:text-gray-400">
                    {getSkillMatchMessage(matchData)}
                </p>
            </div>
        )
    }

    return (
        <Card className={`border-l-4 ${getSkillMatchBgColor(matchData.matchPercentage)} ${className}`}>
            <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                    <Award className={getSkillMatchColor(matchData.matchPercentage)} size={20} />
                    Skill Match Analysis
                </CardTitle>
                <CardDescription>
                    {getSkillMatchMessage(matchData)}
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Match Percentage */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Match Score</span>
                        <span className={`text-lg font-bold ${getSkillMatchColor(matchData.matchPercentage)}`}>
                            {matchData.matchPercentage}%
                        </span>
                    </div>
                    <Progress value={matchData.matchPercentage} className="h-3" />
                </div>

                {showDetails && (
                    <>
                        {/* Matched Skills */}
                        {matchData.matched.length > 0 && (
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="text-green-600" size={16} />
                                    <span className="text-sm font-medium">Skills You Have ({matchData.matched.length})</span>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {matchData.matched.map((skill, index) => (
                                        <Badge
                                            key={index}
                                            className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border-green-200 dark:border-green-800"
                                        >
                                            <CheckCircle size={12} className="mr-1" />
                                            {skill}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Missing Skills */}
                        {matchData.missing.length > 0 && (
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <XCircle className="text-red-600" size={16} />
                                    <span className="text-sm font-medium">Skills to Learn ({matchData.missing.length})</span>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {matchData.missing.map((skill, index) => (
                                        <Badge
                                            key={index}
                                            variant="outline"
                                            className="bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-200 border-red-200 dark:border-red-800"
                                        >
                                            <XCircle size={12} className="mr-1" />
                                            {skill}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </CardContent>
        </Card>
    )
}

export default SkillMatchComponent
