"use client"
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Star, CheckCircle, AlertTriangle } from 'lucide-react'
import { User as UserType } from '@/type'

interface SubscriptionCardProps {
    user: UserType
    onUpgrade?: () => void
}

const SubscriptionCard = ({ user, onUpgrade }: SubscriptionCardProps) => {
    const isPremium = user?.subscription && new Date(user.subscription) > new Date()

    return (
        <Card className="shadow-lg border-[#b0b0ff] dark:border-[#0000c5] bg-white/80 dark:bg-gray-900/80 backdrop-blur-md">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Star className="text-[#e7234a]" size={20} />
                    Subscription Status
                </CardTitle>
            </CardHeader>
            <CardContent>
                {isPremium ? (
                    <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle size={16} />
                        <span className="font-medium">Premium Member</span>
                        <span className="text-sm opacity-70">
                            (Valid until {new Date(user.subscription!).toLocaleDateString()})
                        </span>
                    </div>
                ) : (
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-amber-600">
                            <AlertTriangle size={16} />
                            <span className="font-medium">Free Plan</span>
                        </div>
                        {onUpgrade && (
                            <Button 
                                variant="outline" 
                                onClick={onUpgrade}
                                className="border-[#e7234a] text-[#e7234a] hover:bg-[#e7234a] hover:text-white cursor-pointer"
                            >
                                Upgrade to Premium
                            </Button>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

export default SubscriptionCard