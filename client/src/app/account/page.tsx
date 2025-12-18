"use client"
import Loading from '@/components/loading'
import { useAppData, user_service } from '@/context/AppContext'
import React, { useState } from 'react'
import axios from 'axios'
import Cookies from 'js-cookie'
import toast from 'react-hot-toast'
import { redirect } from 'next/navigation'
import PageHeader from './(components)/PageHeader'
import ProfileCard from './(components)/ProfileCard'
import QuickStats from './(components)/QuickStats'
import ProfileInformation from './(components)/ProfileInformation'
import SkillsCard from './(components)/SkillsCard'
import SubscriptionCard from './(components)/SubscriptionCard'
import FileUploadDialog from './(components)/FileUploadDialog'

const Account = () => {
    const { isAuth, user, loading, setUser } = useAppData()
    const [editMode, setEditMode] = useState(false)
    const [profileData, setProfileData] = useState({
        name: user?.name || '',
        phone_number: user?.phone_number || '',
        bio: user?.bio || ''
    })
    const [profilePic, setProfilePic] = useState<File | null>(null)
    const [resume, setResume] = useState<File | null>(null)
    const [newSkill, setNewSkill] = useState('')
    const [searchResults, setSearchResults] = useState<any[]>([])
    const [isUpdating, setIsUpdating] = useState(false)
    const [uploading, setUploading] = useState({ profile: false, resume: false })
    const [dialogs, setDialogs] = useState({ profile: false, resume: false })

    if (loading) return <Loading />
    if (!isAuth) return redirect('/login')

    const handleInputChange = (field: string, value: string) => {
        setProfileData(prev => ({ ...prev, [field]: value }))
    }

    const updateProfile = async () => {
        setIsUpdating(true)
        try {
            const { data } = await axios.put(`${user_service}/api/user/update-profile`, profileData, {
                headers: { 'Authorization': `Bearer ${Cookies.get('token')}` }
            })
            setUser(data.data)
            toast.success('Profile updated successfully')
            setEditMode(false)
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to update profile')
        } finally {
            setIsUpdating(false)
        }
    }

    const handleFileUpload = async (file: File, type: 'profile' | 'resume') => {
        const formData = new FormData()
        formData.append('file', file)
        setUploading(prev => ({ ...prev, [type]: true }))

        try {
            const endpoint = type === 'profile' ? 'update-profile-picture' : 'update-resume'
            const { data } = await axios.put(`${user_service}/api/user/${endpoint}`, formData, {
                headers: {
                    'Authorization': `Bearer ${Cookies.get('token')}`,
                    'Content-Type': 'multipart/form-data'
                }
            })
            setUser(data.data)
            toast.success(`${type === 'profile' ? 'Profile picture' : 'Resume'} updated successfully`)
            if (type === 'profile') setProfilePic(null)
            if (type === 'resume') setResume(null)
            setDialogs(prev => ({ ...prev, [type]: false }))
        } catch (error: any) {
            toast.error(error.response?.data?.message || `Failed to update ${type}`)
        } finally {
            setUploading(prev => ({ ...prev, [type]: false }))
        }
    }

    const searchSkills = async (query: string) => {
        if (query.length < 2) {
            setSearchResults([])
            return
        }
        try {
            const { data } = await axios.get(`${user_service}/api/user/skill/search?query=${query}`)
            setSearchResults(data.data)
        } catch (error) {
            console.error('Error searching skills:', error)
        }
    }

    const handleNewSkillChange = (value: string) => {
        setNewSkill(value)
        searchSkills(value)
    }

    const addSkill = async (skillName: string, skillId?: number) => {
        try {
            await axios.post(`${user_service}/api/user/skill/add`, {
                skillName: skillId ? undefined : skillName,
                skillId
            }, {
                headers: { 'Authorization': `Bearer ${Cookies.get('token')}` }
            })
            
            const { data } = await axios.get(`${user_service}/api/user/me`, {
                headers: { 'Authorization': `Bearer ${Cookies.get('token')}` }
            })
            setUser(data.data)
            setNewSkill('')
            setSearchResults([])
            toast.success('Skill added successfully')
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to add skill')
        }
    }

    const removeSkill = async (skillName: string) => {
        try {
            await axios.delete(`${user_service}/api/user/skill/remove`, {
                data: { skillName },
                headers: { 'Authorization': `Bearer ${Cookies.get('token')}` }
            })
            
            const { data } = await axios.get(`${user_service}/api/user/me`, {
                headers: { 'Authorization': `Bearer ${Cookies.get('token')}` }
            })
            setUser(data.data)
            toast.success('Skill removed successfully')
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to remove skill')
        }
    }

    if (!user) return <Loading />

    return (
        <div className="min-h-screen py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <PageHeader 
                    title="Account Settings"
                    subtitle="Manage your profile information and preferences"
                    badgeText="My Account"
                />

                <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1 space-y-6">
                        <ProfileCard 
                            user={user}
                            isOwner={true}
                            onUpdateProfilePic={() => setDialogs(prev => ({ ...prev, profile: true }))}
                            onUpdateResume={() => setDialogs(prev => ({ ...prev, resume: true }))}
                        />
                        <QuickStats user={user} />
                    </div>

                    <div className="lg:col-span-2 space-y-6">
                        <ProfileInformation 
                            user={user}
                            editMode={editMode}
                            profileData={profileData}
                            isUpdating={isUpdating}
                            isOwner={true}
                            onEdit={() => setEditMode(true)}
                            onSave={updateProfile}
                            onInputChange={handleInputChange}
                        />

                        {user.role === 'jobseeker' && (
                            <SkillsCard 
                                user={user}
                                newSkill={newSkill}
                                searchResults={searchResults}
                                isOwner={true}
                                onNewSkillChange={handleNewSkillChange}
                                onAddSkill={addSkill}
                                onRemoveSkill={removeSkill}
                            />
                        )}

                        <SubscriptionCard 
                            user={user}
                            onUpgrade={() => toast.success('Premium upgrade coming soon!')}
                        />
                    </div>
                </div>

                <FileUploadDialog 
                    open={dialogs.profile}
                    onOpenChange={(open) => setDialogs(prev => ({ ...prev, profile: open }))}
                    type="profile"
                    file={profilePic}
                    uploading={uploading.profile}
                    onFileSelect={(file) => {
                        if (file.size > 5 * 1024 * 1024) {
                            toast.error('File size should be less than 5MB')
                            return
                        }
                        setProfilePic(file)
                    }}
                    onUpload={() => profilePic && handleFileUpload(profilePic, 'profile')}
                />

                <FileUploadDialog 
                    open={dialogs.resume}
                    onOpenChange={(open) => setDialogs(prev => ({ ...prev, resume: open }))}
                    type="resume"
                    file={resume}
                    uploading={uploading.resume}
                    onFileSelect={(file) => {
                        if (file.type !== 'application/pdf') {
                            toast.error('Please upload a PDF file')
                            return
                        }
                        if (file.size > 5 * 1024 * 1024) {
                            toast.error('File size should be less than 5MB')
                            return
                        }
                        setResume(file)
                    }}
                    onUpload={() => resume && handleFileUpload(resume, 'resume')}
                />
            </div>
        </div>
    )
}

export default Account
