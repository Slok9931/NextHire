"use client"
import { user_service } from '@/context/AppContext'
import { User } from '@/type'
import axios from 'axios'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import Loading from '@/components/loading'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'
import PageHeader from '../(components)/PageHeader'
import ProfileCard from '../(components)/ProfileCard'
import QuickStats from '../(components)/QuickStats'
import ProfileInformation from '../(components)/ProfileInformation'
import SkillsCard from '../(components)/SkillsCard'
import ContactCard from '../(components)/ContactCard'

const UseAccount = () => {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string>('')
    const { id } = useParams()

    async function fetchUser() { 
        try {
            const { data } = await axios.get(`${user_service}/api/user/${id}`, {
                headers: { 'Authorization': `Bearer ${Cookies.get('token')}` }
            })
            setUser(data.data)
        } catch (error: any) {
            setError(error.response?.data?.message || "Failed to load user profile")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchUser()
    }, [id])

    if (loading) return <Loading />

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <Card className="max-w-md w-full text-center">
                    <CardContent className="pt-6">
                        <AlertTriangle className="mx-auto mb-4 text-red-500" size={48} />
                        <h2 className="text-xl font-semibold mb-2">Profile Not Found</h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
                        <Button className='cursor-pointer' onClick={() => window.history.back()}>
                            Go Back
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    if (!user) return <Loading />

    return (
        <div className="min-h-screen py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <PageHeader 
                    title={`${user.name}'s Profile`}
                    subtitle={`${user.role} Profile`}
                    badgeText="User Profile"
                />

                <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1 space-y-6">
                        <ProfileCard user={user} isOwner={false} />
                        <QuickStats user={user} />
                    </div>

                    <div className="lg:col-span-2 space-y-6">
                        <ProfileInformation user={user} isOwner={false} />

                        {user.role === 'jobseeker' && (
                            <SkillsCard user={user} isOwner={false} />
                        )}

                        <ContactCard user={user} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UseAccount
