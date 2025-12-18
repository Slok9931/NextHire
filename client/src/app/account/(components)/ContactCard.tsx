"use client"
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Mail, Phone } from 'lucide-react'
import { User as UserType } from '@/type'

interface ContactCardProps {
    user: UserType
}

const ContactCard = ({ user }: ContactCardProps) => {
    return (
        <Card className="shadow-lg border-[#b0b0ff] dark:border-[#0000c5] bg-white/80 dark:bg-gray-900/80 backdrop-blur-md">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Mail className="text-[#494bd6]" size={20} />
                    Contact Information
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">Email</Label>
                        <div className="flex items-center gap-2">
                            <Mail size={16} className="text-[#494bd6]" />
                            <span className="break-all">{user?.email}</span>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">Phone</Label>
                        <div className="flex items-center gap-2">
                            <Phone size={16} className="text-[#494bd6]" />
                            <span>{user?.phone_number || 'Not provided'}</span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default ContactCard