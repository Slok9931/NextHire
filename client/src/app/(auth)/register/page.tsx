"use client"
import { auth_service, useAppData } from '@/context/AppContext'
import axios from 'axios'
import { redirect } from 'next/navigation'
import React, { FormEvent, useState, useRef } from 'react'
import toast from "react-hot-toast"
import Cookies from 'js-cookie'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Eye, EyeOff, Lock, Mail, User, Loader2, ArrowRight, Phone, FileText, Upload, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import Loading from '@/components/loading'

const Register = () => {
    const [step, setStep] = useState(1)
    const [name, setName] = useState("")
    const [role, setRole] = useState("")
    const [phone_number, setPhoneNumber] = useState("")
    const [bio, setBio] = useState("")
    const [resume, setResume] = useState<File | null>(null)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [otp, setOtp] = useState(["", "", "", "", "", ""])
    const [btnLoading, setBtnLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    const otpRefs = useRef<(HTMLInputElement | null)[]>([])

    const { isAuth, setUser, loading, setIsAuth } = useAppData()

    if (loading) return <Loading />

    if (isAuth) return redirect('/')

    const handleOtpChange = (index: number, value: string) => {
        if (value.length > 1) return

        const newOtp = [...otp]
        newOtp[index] = value
        setOtp(newOtp)

        // Move to next input if value is entered
        if (value && index < 5) {
            otpRefs.current[index + 1]?.focus()
        }
    }

    const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
        // Move to previous input on backspace if current input is empty
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            otpRefs.current[index - 1]?.focus()
        }
    }

    const handleOtpPaste = (e: React.ClipboardEvent) => {
        e.preventDefault()
        const pastedData = e.clipboardData.getData('text').slice(0, 6)
        const newOtp = [...otp]

        for (let i = 0; i < pastedData.length && i < 6; i++) {
            if (/^\d$/.test(pastedData[i])) {
                newOtp[i] = pastedData[i]
            }
        }

        setOtp(newOtp)

        // Focus on the next empty input or the last input
        const nextIndex = Math.min(pastedData.length, 5)
        otpRefs.current[nextIndex]?.focus()
    }

    const requestOTP = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setBtnLoading(true)
        try {
            const { data } = await axios.post(`${auth_service}/api/auth/request-otp`, {
                email
            })

            toast.success(data.message)
            setStep(2)

        } catch (error: any) {
            toast.error(error.response?.data?.message || "An error occurred")
        } finally {
            setBtnLoading(false)
        }
    }

    const verifyOTP = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setBtnLoading(true)
        try {
            const otpString = otp.join('')
            const { data } = await axios.post(`${auth_service}/api/auth/verify-otp`, {
                email,
                otp: otpString
            })

            toast.success(data.message)
            setStep(3)

        } catch (error: any) {
            toast.error(error.response?.data?.message || "An error occurred")
        } finally {
            setBtnLoading(false)
        }
    }

    const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setBtnLoading(true)
        try {
            const formData = new FormData()
            formData.append('name', name)
            formData.append('email', email)
            formData.append('password', password)
            formData.append('phone_number', phone_number)
            formData.append('role', role)

            if (role === 'jobseeker') {
                formData.append('bio', bio)
                if (resume) {
                    formData.append('file', resume)
                }
            }

            const { data } = await axios.post(`${auth_service}/api/auth/register`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
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

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            if (file.type !== 'application/pdf') {
                toast.error('Please upload a PDF file')
                return
            }
            if (file.size > 5 * 1024 * 1024) {
                toast.error('File size should be less than 5MB')
                return
            }
            setResume(file)
        }
    }

    const otpComplete = otp.every(digit => digit !== "")

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border bg-[#ededff] dark:bg-[#00005f] mb-4">
                        <User size={16} className='text-[#2b2ed6]' />
                        <span className="text-sm font-medium">Join NextHire</span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold mb-2">
                        Create Your <span className="text-[#494bd6]">Next</span><span className="text-[#e7234a]">Hire</span> Account
                    </h1>
                    <p className="text-lg opacity-70">
                        {step === 1 && "Start your journey with us today"}
                        {step === 2 && "Verify your email address"}
                        {step === 3 && "Complete your profile setup"}
                    </p>
                </div>

                <Card className="shadow-lg border-[#b0b0ff] dark:border-[#0000c5] bg-white/80 dark:bg-gray-900/80 backdrop-blur-md">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl text-center">
                            {step === 1 && "Sign Up"}
                            {step === 2 && "Email Verification"}
                            {step === 3 && "Complete Registration"}
                        </CardTitle>
                        <CardDescription className="text-center">
                            {step === 1 && "Enter your email to get started"}
                            {step === 2 && "Enter the OTP sent to your email"}
                            {step === 3 && "Fill in your details to complete registration"}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {step === 1 && (
                            <form onSubmit={requestOTP} className="space-y-4">
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
                                    className="w-full h-11 font-medium transition-all duration-200"
                                >
                                    {btnLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Sending OTP...
                                        </>
                                    ) : (
                                        <>
                                            Send OTP
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </>
                                    )}
                                </Button>
                            </form>
                        )}

                        {step === 2 && (
                            <form onSubmit={verifyOTP} className="space-y-4">
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium">
                                        Verification Code
                                    </Label>
                                    <div className="flex gap-2 justify-center">
                                        {otp.map((digit, index) => (
                                            <Input
                                                key={index}
                                                ref={(el) => { otpRefs.current[index] = el }}
                                                type="text"
                                                inputMode="numeric"
                                                pattern="[0-9]*"
                                                maxLength={1}
                                                value={digit}
                                                onChange={(e) => handleOtpChange(index, e.target.value.replace(/\D/g, ''))}
                                                onKeyDown={(e) => handleOtpKeyDown(index, e)}
                                                onPaste={index === 0 ? handleOtpPaste : undefined}
                                                className="w-12 h-12 text-center text-lg font-semibold border-[#d0d0ff] dark:border-[#0000c5] focus:border-[#494bd6] focus:ring-[#494bd6]"
                                                required
                                            />
                                        ))}
                                    </div>
                                    <p className="text-sm text-gray-500 text-center">
                                        OTP sent to {email}
                                    </p>
                                </div>

                                <div className="flex gap-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setStep(1)}
                                        className="flex-1 h-11"
                                    >
                                        Back
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={btnLoading || !otpComplete}
                                        className="flex-1 h-11 font-medium"
                                    >
                                        {btnLoading ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Verifying...
                                            </>
                                        ) : (
                                            <>
                                                Verify OTP
                                                <ArrowRight className="ml-2 h-4 w-4" />
                                            </>
                                        )}
                                    </Button>
                                </div>

                                <div className="text-center">
                                    <button
                                        type="button"
                                        onClick={() => requestOTP({ preventDefault: () => { } } as any)}
                                        className="text-sm text-[#494bd6] hover:text-[#2b2ed6] hover:underline font-medium transition-colors"
                                    >
                                        Resend OTP
                                    </button>
                                </div>
                            </form>
                        )}

                        {step === 3 && (
                            <form onSubmit={submitHandler} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="text-sm font-medium">
                                        Full Name
                                    </Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                        <Input
                                            id="name"
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="Your full name"
                                            className="pl-10 h-11 border-[#d0d0ff] dark:border-[#0000c5] focus:border-[#494bd6] focus:ring-[#494bd6]"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="phone" className="text-sm font-medium">
                                            Phone Number
                                        </Label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                            <Input
                                                id="phone"
                                                type="tel"
                                                value={phone_number}
                                                onChange={(e) => setPhoneNumber(e.target.value)}
                                                placeholder="Your phone number"
                                                className="pl-10 h-11 border-[#d0d0ff] dark:border-[#0000c5] focus:border-[#494bd6] focus:ring-[#494bd6]"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="role" className="text-sm font-medium">
                                            I want to
                                        </Label>
                                        <Select value={role} onValueChange={setRole} required>
                                            <SelectTrigger className="h-11 border-[#d0d0ff] dark:border-[#0000c5] focus:border-[#494bd6] focus:ring-[#494bd6]" style={{ height: '2.75rem', width: '100%' }}>
                                                <SelectValue placeholder="Select your role" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="jobseeker">Find a Job</SelectItem>
                                                <SelectItem value="recruiter">Hire a Talent</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                {role === 'jobseeker' && (
                                    <>
                                        <div className="space-y-2">
                                            <Label htmlFor="bio" className="text-sm font-medium">
                                                Bio
                                            </Label>
                                            <Textarea
                                                id="bio"
                                                value={bio}
                                                onChange={(e: any) => setBio(e.target.value)}
                                                placeholder="Tell us about yourself..."
                                                className="min-h-20 border-[#d0d0ff] dark:border-[#0000c5] focus:border-[#494bd6] focus:ring-[#494bd6]"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="resume" className="text-sm font-medium">
                                                Resume <span className="text-red-500">*</span>
                                            </Label>
                                            <div className="relative">
                                                <div className="flex items-center justify-center w-full">
                                                    <label htmlFor="resume" className="flex flex-col items-center justify-center w-full h-20 border-2 border-[#d0d0ff] dark:border-[#0000c5] border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100">
                                                        <div className="flex flex-col items-center justify-center pt-2 pb-2">
                                                            {resume ? (
                                                                <>
                                                                    <FileText className="w-6 h-6 mb-1 text-green-500" />
                                                                    <p className="text-sm text-green-600 dark:text-green-400 font-medium">{resume.name}</p>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <Upload className="w-6 h-6 mb-1 text-gray-500" />
                                                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                                                        <span className="font-semibold">Click to upload</span> or drag and drop
                                                                    </p>
                                                                    <p className="text-xs text-gray-500 dark:text-gray-400">PDF (MAX. 5MB)</p>
                                                                </>
                                                            )}
                                                        </div>
                                                        <input
                                                            id="resume"
                                                            type="file"
                                                            className="hidden"
                                                            accept=".pdf"
                                                            onChange={handleFileChange}
                                                            required
                                                        />
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}

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
                                            placeholder="Create a password"
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

                                <div className="flex gap-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setStep(2)}
                                        className="flex-1 h-11"
                                    >
                                        Back
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={btnLoading || !name || !phone_number || !role || !password || (role === 'jobseeker' && !resume)}
                                        className="flex-1 h-11 font-medium"
                                    >
                                        {btnLoading ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Creating Account...
                                            </>
                                        ) : (
                                            <>
                                                Create Account
                                                <ArrowRight className="ml-2 h-4 w-4" />
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </form>
                        )}

                        {step === 1 && (
                            <>
                                <div className="relative my-6">
                                    <div className="absolute inset-0 flex items-center">
                                        <span className="w-full border-t border-[#d0d0ff] dark:border-[#0000c5]" />
                                    </div>
                                    <div className="relative flex justify-center text-xs">
                                        <span className="bg-white dark:bg-gray-900 px-2 text-gray-500">
                                            Already have an account?
                                        </span>
                                    </div>
                                </div>

                                <div className="text-center">
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Already registered?{' '}
                                        <Link
                                            href="/login"
                                            className="text-[#494bd6] hover:text-[#2b2ed6] hover:underline font-medium transition-colors"
                                        >
                                            Sign in here
                                        </Link>
                                    </p>
                                </div>
                            </>
                        )}
                    </CardContent>
                </Card>

                <div className="mt-8 text-center">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        By creating an account, you agree to our{' '}
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

export default Register