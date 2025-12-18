"use client"
import Loading from '@/components/loading'
import { useAppData } from '@/context/AppContext'
import React, { useState, useEffect } from 'react'
import { redirect } from 'next/navigation'
import PageHeader from './components/PageHeader'
import ProfileCard from './components/ProfileCard'
import QuickStats from './components/QuickStats'
import ProfileInformation from './components/ProfileInformation'
import SkillsCard from './components/SkillsCard'
import SubscriptionCard from './components/SubscriptionCard'
import FileUploadDialog from './components/FileUploadDialog'
import toast from 'react-hot-toast'
import Company from './components/Company'

const Account = () => {
    const {
        isAuth,
        user,
        loading,
        btnLoading,
        updateUserProfile,
        updateProfilePicture,
        updateResume,
        addSkillToUser,
        removeSkillFromUser,
        searchSkills,
    } = useAppData()

    const [editMode, setEditMode] = useState(false)
    const [profileData, setProfileData] = useState({
        name: '',
        phone_number: '',
        bio: ''
    })
    const [profilePic, setProfilePic] = useState<File | null>(null)
    const [resume, setResumeFile] = useState<File | null>(null)
    const [newSkill, setNewSkill] = useState('')
    const [searchResults, setSearchResults] = useState<any[]>([])
    const [dialogs, setDialogs] = useState({ profile: false, resume: false })
    const [skillsRefreshTrigger, setSkillsRefreshTrigger] = useState(0)

    useEffect(() => {
        if (user) {
            setProfileData({
                name: user.name || '',
                phone_number: user.phone_number || '',
                bio: user.bio || ''
            })
        }
    }, [user])

    useEffect(() => {
        if (!loading && !isAuth) {
            redirect('/login')
        }
    }, [loading, isAuth])

    if (loading) return <Loading />
    if (!isAuth) return null
    if (!user) return <Loading />

    const handleInputChange = (field: string, value: string) => {
        setProfileData(prev => ({ ...prev, [field]: value }))
    }

    const handleUpdateProfile = async () => {
        try {
            await updateUserProfile(profileData)
            setEditMode(false)
        } catch (error) {
            console.error('Error updating profile:', error)
        }
    }

    const handleFileUpload = async (file: File, type: 'profile' | 'resume') => {
        try {
            if (type === 'profile') {
                await updateProfilePicture(file)
                setProfilePic(null)
            } else {
                await updateResume(file)
                setResumeFile(null)
            }
            setDialogs(prev => ({ ...prev, [type]: false }))
        } catch (error) {
            console.error(`Error uploading ${type}:`, error)
        }
    }

    const handleSearchSkills = async (query: string) => {
        setNewSkill(query)
        if (query.length >= 2) {
            const results = await searchSkills(query)
            setSearchResults(results)
        } else {
            setSearchResults([])
        }
    }

    const handleAddSkill = async (skillName: string, skillId?: number): Promise<void> => {
        try {
            await addSkillToUser(skillName, skillId)
            setNewSkill('')
            setSearchResults([])
            setSkillsRefreshTrigger(prev => prev + 1)
        } catch (error) {
            throw error
        }
    }

    const handleRemoveSkill = async (skillName: string): Promise<void> => {
        try {
            await removeSkillFromUser(skillName)
        } catch (error) {
            throw error
        }
    }

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
                        <SubscriptionCard
                            user={user}
                            onUpgrade={() => alert('Premium upgrade coming soon!')}
                        />
                    </div>

                    <div className="lg:col-span-2 space-y-6">
                        <ProfileInformation
                            user={user}
                            editMode={editMode}
                            profileData={profileData}
                            isUpdating={btnLoading}
                            isOwner={true}
                            onEdit={() => setEditMode(true)}
                            onSave={handleUpdateProfile}
                            onInputChange={handleInputChange}
                        />

                        {user.role === 'jobseeker' && (
                            <SkillsCard
                                user={user}
                                newSkill={newSkill}
                                searchResults={searchResults}
                                isOwner={true}
                                onNewSkillChange={handleSearchSkills}
                                onAddSkill={handleAddSkill}
                                onRemoveSkill={handleRemoveSkill}
                                refreshTrigger={skillsRefreshTrigger}
                            />
                        )}
                        
                        {user.role === 'recruiter' && (
                            <Company />
                        )}
                    </div>
                </div>

                <FileUploadDialog
                    open={dialogs.profile}
                    onOpenChange={(open) => setDialogs(prev => ({ ...prev, profile: open }))}
                    type="profile"
                    file={profilePic}
                    uploading={btnLoading}
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
                    uploading={btnLoading}
                    onFileSelect={(file) => {
                        if (file.type !== 'application/pdf') {
                            toast.error('Please upload a PDF file')
                            return
                        }
                        if (file.size > 5 * 1024 * 1024) {
                            toast.error('File size should be less than 5MB')
                            return
                        }
                        setResumeFile(file)
                    }}
                    onUpload={() => resume && handleFileUpload(resume, 'resume')}
                />
            </div>
        </div>
    )
}

export default Account