"use client"
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { User as UserType } from '@/type'

interface QuickStatsProps {
    user: UserType
}

const QuickStats = ({ user }: QuickStatsProps) => {
    return (
        <Card className="shadow-lg border-[#b0b0ff] dark:border-[#0000c5] bg-white/80 dark:bg-gray-900/80 backdrop-blur-md">
            <CardHeader>
                <CardTitle className="text-lg">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                {user?.role === 'jobseeker' && (
                    <div className="flex justify-between items-center">
                        <span className="text-sm">Skills</span>
                        <Badge variant="secondary" className="bg-[#ededff] text-[#2b2ed6]">
                            {user?.skills?.length || 0}
                        </Badge>
                    </div>
                )}
                <div className="flex justify-between items-center">
                    <span className="text-sm">Account Type</span>
                    <Badge className={user?.subscription && new Date(user.subscription) > new Date() 
                        ? "bg-[#e7234a] hover:bg-[#d11d42]" 
                        : "bg-gray-500"
                    }>
                        {user?.subscription && new Date(user.subscription) > new Date() ? 'Premium' : 'Free'}
                    </Badge>
                </div>
            </CardContent>
        </Card>
    )
}

export default QuickStats