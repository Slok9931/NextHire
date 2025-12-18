"use client"
import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { User, Edit3, Save, Loader2 } from 'lucide-react'
import { User as UserType } from '@/type'

interface ProfileInformationProps {
    user: UserType
    editMode?: boolean
    profileData?: {
        name: string
        phone_number: string
        bio: string
    }
    isUpdating?: boolean
    isOwner?: boolean
    onEdit?: () => void
    onSave?: () => void
    onInputChange?: (field: string, value: string) => void
}

const ProfileInformation = ({ 
    user, 
    editMode = false, 
    profileData, 
    isUpdating = false, 
    isOwner = false,
    onEdit, 
    onSave, 
    onInputChange 
}: ProfileInformationProps) => {
    return (
        <Card className="shadow-lg border-[#b0b0ff] dark:border-[#0000c5] bg-white/80 dark:bg-gray-900/80 backdrop-blur-md">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <User className="text-[#494bd6]" size={20} />
                            {isOwner ? 'Profile Information' : `About ${user?.name}`}
                        </CardTitle>
                        <CardDescription>
                            {isOwner ? 'Update your personal information' : 'Personal information'}
                        </CardDescription>
                    </div>
                    {isOwner && (
                        <Button 
                            onClick={editMode ? onSave : onEdit}
                            disabled={isUpdating}
                            className="gap-2 cursor-pointer"
                        >
                            {isUpdating ? (
                                <Loader2 size={16} className="animate-spin" />
                            ) : editMode ? (
                                <Save size={16} />
                            ) : (
                                <Edit3 size={16} />
                            )}
                            {isUpdating ? 'Saving...' : editMode ? 'Save' : 'Edit'}
                        </Button>
                    )}
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {isOwner ? (
                    <>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name</Label>
                                <Input
                                    id="name"
                                    value={editMode ? profileData?.name : user?.name}
                                    onChange={(e) => onInputChange && onInputChange('name', e.target.value)}
                                    disabled={!editMode}
                                    className="border-[#d0d0ff] dark:border-[#0000c5] focus:border-[#494bd6]"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone Number</Label>
                                <Input
                                    id="phone"
                                    value={editMode ? profileData?.phone_number : user?.phone_number}
                                    onChange={(e) => onInputChange && onInputChange('phone_number', e.target.value)}
                                    disabled={!editMode}
                                    className="border-[#d0d0ff] dark:border-[#0000c5] focus:border-[#494bd6]"
                                />
                            </div>
                        </div>
                        {user.role === 'jobseeker' && <div className="space-y-2">
                            <Label htmlFor="bio">Bio</Label>
                            <Textarea
                                id="bio"
                                value={editMode ? profileData?.bio : user?.bio || ''}
                                onChange={(e) => onInputChange && onInputChange('bio', e.target.value)}
                                disabled={!editMode}
                                className="min-h-20 border-[#d0d0ff] dark:border-[#0000c5] focus:border-[#494bd6]"
                                placeholder="Tell us about yourself..."
                            />
                        </div>}
                    </>
                ) : (
                    <div>
                        {user?.role === 'jobseeker' && user?.bio ? (
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                {user.bio}
                            </p>
                        ) : (
                            <p className="text-gray-500 italic">
                                No bio provided yet.
                            </p>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

export default ProfileInformation