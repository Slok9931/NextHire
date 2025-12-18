"use client"
import { auth_service, useAppData } from '@/context/AppContext'
import axios from 'axios'
import { redirect } from 'next/navigation'
import React, { FormEvent, useState } from 'react'
import toast from "react-hot-toast"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Mail, User, Loader2, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import Loading from '@/components/loading'

const ForgotPassword = () => {
    const [email, setEmail] = useState("")
    const [btnLoading, setBtnLoading] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)

    const { isAuth, loading } = useAppData()

    if (loading) return <Loading />

    if (isAuth) return redirect('/')

    const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setBtnLoading(true)
        try {
            const { data } = await axios.post(`${auth_service}/api/auth/forgot-password`, {
                email
            })

            toast.success(data.message)
            setIsSubmitted(true)

        } catch (error: any) {
            toast.error(error.response?.data?.message || "An error occurred")
        } finally {
            setBtnLoading(false)
        }
    }

    const handleResend = async () => {
        setBtnLoading(true)
        try {
            const { data } = await axios.post(`${auth_service}/api/auth/forgot-password`, {
                email
            })

            toast.success("Reset link resent successfully!")

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
                            {isSubmitted ? "Check Your Email" : "Reset Password"}
                        </span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold mb-2">
                        {isSubmitted ? "Email Sent" : "Forgot Password?"}
                    </h1>
                    <p className="text-lg opacity-70">
                        {isSubmitted
                            ? "We've sent a password reset link to your email"
                            : "Enter your email address and we'll send you a reset link"
                        }
                    </p>
                </div>

                <Card className="shadow-lg border-[#b0b0ff] dark:border-[#0000c5] bg-white/80 dark:bg-gray-900/80 backdrop-blur-md">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl text-center">
                            {isSubmitted ? "Check Your Inbox" : "Reset Password"}
                        </CardTitle>
                        <CardDescription className="text-center">
                            {isSubmitted
                                ? `We've sent a password reset link to ${email}`
                                : "Enter your email address to receive a password reset link"
                            }
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {!isSubmitted ? (
                            <form onSubmit={submitHandler} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-sm font-medium">
                                        Email Address
                                    </Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                        <Input
                                            id="email"
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="Enter your email"
                                            className="pl-10 h-11 border-[#d0d0ff] dark:border-[#0000c5] focus:border-[#494bd6] focus:ring-[#494bd6]"
                                            required
                                        />
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    disabled={btnLoading || !email}
                                    className="w-full h-11 font-medium transition-all duration-200 cursor-pointer"
                                >
                                    {btnLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Sending Reset Link...
                                        </>
                                    ) : (
                                        <>
                                            Send Reset Link
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </>
                                    )}
                                </Button>

                                <div className="text-center">
                                    <Link
                                        href="/login"
                                        className="inline-flex items-center text-sm text-[#494bd6] hover:text-[#2b2ed6] hover:underline font-medium transition-colors"
                                    >
                                        <ArrowLeft className="mr-1 h-4 w-4" />
                                        Back to Sign In
                                    </Link>
                                </div>
                            </form>
                        ) : (
                            <div className="space-y-4">
                                <div className="flex items-center justify-center">
                                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                                        <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                                    </div>
                                </div>

                                <div className="text-center space-y-2">
                                    <h3 className="text-lg font-semibold">Reset Link Sent!</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Check your email inbox and click on the reset link to create a new password.
                                        The link will expire in 15 minutes.
                                    </p>
                                </div>

                                <div className="space-y-3">
                                    <Button
                                        onClick={() => window.open('https://mail.google.com', '_blank')}
                                        className="w-full h-11 font-medium cursor-pointer"
                                    >
                                        Open Email App
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>

                                    <div className="text-center">
                                        <button
                                            onClick={handleResend}
                                            disabled={btnLoading}
                                            className="text-sm text-[#494bd6] hover:text-[#2b2ed6] hover:underline font-medium transition-colors disabled:opacity-50 cursor-pointer"
                                        >
                                            {btnLoading ? "Resending..." : "Didn't receive email? Resend"}
                                        </button>
                                    </div>

                                    <div className="text-center">
                                        <Link
                                            href="/login"
                                            className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-[#494bd6] transition-colors"
                                        >
                                            <ArrowLeft className="mr-1 h-4 w-4" />
                                            Back to Sign In
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {!isSubmitted && (
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

export default ForgotPassword