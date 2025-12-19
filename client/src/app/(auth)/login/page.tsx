"use client"
import { auth_service, useAppData } from '@/context/AppContext'
import axios from 'axios'
import { redirect } from 'next/navigation'
import React, { FormEvent, useState } from 'react'
import toast from "react-hot-toast"
import Cookies from 'js-cookie'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Eye, EyeOff, Lock, Mail, User, Loader2, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import Loading from '@/components/loading'

const Login = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [btnLoading, setBtnLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    const { isAuth, setUser, setIsAuth, loading } = useAppData()

    if(loading) return <Loading />

    if (isAuth) return redirect('/')

    const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setBtnLoading(true)
        try {
            const { data } = await axios.post(`${auth_service}/api/auth/login`, {
                email,
                password
            })

            toast.success(data.message)

            Cookies.set("token", data.token, {
                expires: 15,
                secure: false,
                path: "/"
            })

            setUser(data.data)
            setIsAuth(true)

        } catch (error: any) {
            toast.error(error.response?.data?.message || "An error occurred")
            setIsAuth(false)
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
                        <span className="text-sm font-medium">Welcome Back</span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold mb-2">
                        Sign In to <span className="text-[#494bd6]">Next</span><span className="text-[#e7234a]">Hire</span>
                    </h1>
                    <p className="text-lg opacity-70">
                        Access your account and discover new opportunities
                    </p>
                </div>

                <Card className="shadow-lg border-[#b0b0ff] dark:border-[#0000c5] bg-white/80 dark:bg-gray-900/80 backdrop-blur-md">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl text-center">Sign In</CardTitle>
                        <CardDescription className="text-center">
                            Enter your credentials to access your account
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
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

                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-sm font-medium">
                                    Password
                                </Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Enter your password"
                                        className="pl-10 pr-12 h-11 border-[#d0d0ff] dark:border-[#0000c5] focus:border-[#494bd6] focus:ring-[#494bd6]"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <Link
                                    href="/forgot-password"
                                    className="text-sm text-[#494bd6] hover:text-[#2b2ed6] hover:underline font-medium transition-colors"
                                >
                                    Forgot your password?
                                </Link>
                            </div>

                            <Button
                                type="submit"
                                disabled={btnLoading || !email || !password}
                                className="w-full h-11 font-medium transition-all duration-200 cursor-pointer"
                            >
                                {btnLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Signing In...
                                    </>
                                ) : (
                                    <>
                                        Sign In
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </>
                                )}
                            </Button>
                        </form>

                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-[#d0d0ff] dark:border-[#0000c5]" />
                            </div>
                            <div className="relative flex justify-center text-xs">
                                <span className="bg-white dark:bg-gray-900 px-2 text-gray-500">
                                    New to NextHire?
                                </span>
                            </div>
                        </div>

                        <div className="text-center">
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Don't have an account?{' '}
                                <Link
                                    href="/register"
                                    className="text-[#494bd6] hover:text-[#2b2ed6] hover:underline font-medium transition-colors"
                                >
                                    Create one here
                                </Link>
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <div className="mt-8 text-center">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        By signing in, you agree to our{' '}
                        <Link href="/terms" className="text-[#494bd6] hover:text-[#2b2ed6] transition-colors">
                            Terms of Service
                        </Link>
                        {' '}and{' '}
                        <Link href="/privacy" className="text-[#494bd6] hover:text-[#2b2ed6] transition-colors">
                            Privacy Policy
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Login