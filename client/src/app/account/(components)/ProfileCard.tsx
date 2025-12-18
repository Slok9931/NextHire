"use client"
import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Label } from '@/components/ui/label'
import { User, Mail, Phone, FileText, Camera, Upload, Star, ExternalLink } from 'lucide-react'
import { User as UserType } from '@/type'

interface ProfileCardProps {
    user: UserType
    isOwner?: boolean
    onUpdateProfilePic?: () => void
    onUpdateResume?: () => void
}

const ProfileCard = ({ user, isOwner = false, onUpdateProfilePic, onUpdateResume }: ProfileCardProps) => {
    return (
        <Card className="shadow-lg border-[#b0b0ff] dark:border-[#0000c5] bg-white/80 dark:bg-gray-900/80 backdrop-blur-md">
            <CardHeader className="text-center pb-2">
                <div className="relative mx-auto">
                    <Avatar className="w-24 h-24 border-4 border-[#e7234a]">
                        <AvatarImage src={user?.profile_pic || undefined} alt={user?.name} />
                        <AvatarFallback className="bg-[#ededff] dark:bg-[#00005f] text-[#2b2ed6] text-2xl font-bold">
                            {user?.name?.charAt(0)}
                        </AvatarFallback>
                    </Avatar>
                    {user?.subscription && new Date(user.subscription) > new Date() && (
                        <div className="absolute -top-1 -right-1 bg-[#e7234a] text-white rounded-full p-1">
                            <Star size={12} fill="currentColor" />
                        </div>
                    )}
                    {isOwner && onUpdateProfilePic && (
                        <Button 
                            size="sm" 
                            onClick={onUpdateProfilePic}
                            className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0 shadow-lg bg-[#e7234a] hover:bg-[#ba0328] cursor-pointer"
                        >
                            <Camera size={14} />
                        </Button>
                    )}
                </div>
                <CardTitle className="text-xl">{user?.name}</CardTitle>
                <CardDescription className="capitalize text-[#494bd6] font-medium">
                    {user?.role}
                    {user?.subscription && new Date(user.subscription) > new Date() && (
                        <Badge className="ml-2 bg-[#e7234a] hover:bg-[#d11d42] text-white">
                            Premium
                        </Badge>
                    )}
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                        <Mail className="text-[#494bd6]" size={16} />
                        <span className="break-all">{user?.email}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                        <Phone className="text-[#494bd6]" size={16} />
                        <span>{user?.phone_number || 'Not provided'}</span>
                    </div>
                </div>

                {user?.role === 'jobseeker' && (
                    <div className="pt-4 border-t border-[#d0d0ff] dark:border-[#0000c5]">
                        <div className="flex items-center justify-between mb-3">
                            <Label className="text-sm font-medium flex items-center gap-2">
                                <FileText className="text-[#494bd6]" size={16} />
                                Resume
                            </Label>
                            {isOwner && onUpdateResume ? (
                                <Button 
                                    variant="outline" 
                                    size="sm" 
                                    onClick={onUpdateResume}
                                    className='cursor-pointer'
                                >
                                    <Upload size={14} className="mr-1" />
                                    Update
                                </Button>
                            ) : user?.resume ? (
                                <a 
                                    href={user.resume} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                >
                                    <Button size="sm" variant="outline" className="gap-2 cursor-pointer">
                                        <ExternalLink size={14} />
                                        View
                                    </Button>
                                </a>
                            ) : null}
                        </div>
                        {user?.resume && isOwner && (
                            <a 
                                href={user.resume} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-sm text-[#494bd6] hover:text-[#2b2ed6] hover:underline"
                            >
                                View Current Resume
                            </a>
                        )}
                        {!user?.resume && (
                            <p className="text-sm text-gray-500">No resume uploaded</p>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

export default ProfileCard