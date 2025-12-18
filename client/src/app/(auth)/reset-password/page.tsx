"use client"
import { auth_service, useAppData } from '@/context/AppContext'
import axios from 'axios'
import { redirect, useSearchParams } from 'next/navigation'
import React, { FormEvent, useState, useEffect, Suspense } from 'react'
import toast from "react-hot-toast"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Eye, EyeOff, Lock, User, Loader2, ArrowRight, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import Loading from '@/components/loading'

const ResetPasswordContent = () => {
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [btnLoading, setBtnLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [isValidToken, setIsValidToken] = useState<boolean | null>(null)

    const searchParams = useSearchParams()
    const token = searchParams.get('token')

    const { isAuth, loading } = useAppData()

    useEffect(() => {
        if (!token) {
            setIsValidToken(false)
        } else {
            setIsValidToken(true)
        }
    }, [token])

    if(loading) return <Loading />

    if (isAuth) return redirect('/')

    if (isValidToken === false) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="w-full max-w-md">
                    <Card className="shadow-lg border-red-200 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md">
                        <CardHeader className="text-center space-y-1">
                            <CardTitle className="text-2xl text-red-600">Invalid Reset Link</CardTitle>
                            <CardDescription>
                                This password reset link is invalid or has expired.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="text-center">
                                <Link href="/forgot-password">
                                    <Button className="w-full cursor-pointer">
                                        Request New Reset Link
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        )
    }

    const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        
        if (password !== confirmPassword) {
            toast.error("Passwords do not match")
            return
        }

        if (password.length < 6) {
            toast.error("Password must be at least 6 characters long")
            return
        }

        setBtnLoading(true)
        try {
            const { data } = await axios.post(`${auth_service}/api/auth/reset-password/${token}`, {
                password
            })

            toast.success(data.message)
            setIsSuccess(true)

        } catch (error: any) {
            toast.error(error.response?.data?.message || "An error occurred")
        } finally {
            setBtnLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border bg-[#ededff] dark:bg-[#00005f] mb-4">
                        <User size={16} className='text-[#2b2ed6]' />
                        <span className="text-sm font-medium">
                            {isSuccess ? "Password Reset Complete" : "Reset Password"}
                        </span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold mb-2">
                        {isSuccess ? "Success!" : "Create New Password"}
                    </h1>
                    <p className="text-lg opacity-70">
                        {isSuccess 
                            ? "Your password has been successfully reset"
                            : "Enter your new password below"
                        }
                    </p>
                </div>

                <Card className="shadow-lg border-[#b0b0ff] dark:border-[#0000c5] bg-white/80 dark:bg-gray-900/80 backdrop-blur-md">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl text-center">
                            {isSuccess ? "Password Reset" : "New Password"}
                        </CardTitle>
                        <CardDescription className="text-center">
                            {isSuccess 
                                ? "You can now sign in with your new password"
                                : "Your new password must be at least 6 characters long"
                            }
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {!isSuccess ? (
                            <form onSubmit={submitHandler} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="password" className="text-sm font-medium">
                                        New Password
                                    </Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                        <Input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="Enter new password"
                                            className="pl-10 pr-12 h-11 border-[#d0d0ff] dark:border-[#0000c5] focus:border-[#494bd6] focus:ring-[#494bd6]"
                                            required
                                            minLength={6}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="confirmPassword" className="text-sm font-medium">
                                        Confirm Password
                                    </Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                        <Input
                                            id="confirmPassword"
                                            type={showConfirmPassword ? "text" : "password"}
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            placeholder="Confirm new password"
                                            className="pl-10 pr-12 h-11 border-[#d0d0ff] dark:border-[#0000c5] focus:border-[#494bd6] focus:ring-[#494bd6]"
                                            required
                                            minLength={6}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                                        >
                                            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    disabled={btnLoading || !password || !confirmPassword || password !== confirmPassword}
                                    className="w-full h-11 font-medium transition-all duration-200 cursor-pointer"
                                >
                                    {btnLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Resetting Password...
                                        </>
                                    ) : (
                                        <>
                                            Reset Password
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </>
                                    )}
                                </Button>

                                {password !== confirmPassword && confirmPassword && (
                                    <p className="text-sm text-red-500 text-center">
                                        Passwords do not match
                                    </p>
                                )}
                            </form>
                        ) : (
                            <div className="space-y-4">
                                <div className="flex items-center justify-center">
                                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                                        <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                                    </div>
                                </div>

                                <div className="text-center space-y-2">
                                    <h3 className="text-lg font-semibold">Password Reset Successfully!</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Your password has been changed. You can now sign in with your new password.
                                    </p>
                                </div>

                                <Link href="/login">
                                    <Button className="w-full h-11 font-medium cursor-pointer">
                                        Continue to Sign In
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {!isSuccess && (
                    <div className="mt-8 text-center">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Remember your password?{' '}
                            <Link
                                href="/login"
                                className="text-[#494bd6] hover:text-[#2b2ed6] hover:underline font-medium transition-colors"
                            >
                                Sign in here
                            </Link>
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}

const ResetPassword = () => {
    return (
        <Suspense fallback={<Loading />}>
            <ResetPasswordContent />
        </Suspense>
    )
}

export default ResetPassword