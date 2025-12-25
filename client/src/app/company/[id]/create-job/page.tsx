"use client"
import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { ArrowLeft, ArrowRight, Check, Building2 } from 'lucide-react'
import { useAppData } from '@/context/AppContext'
import { Company } from '@/type'
import Loading from '@/components/loading'

// Step components
import BasicInfoStep from '../../components/BasicInfoStep'
import JobDetailsStep from '../../components/JobDetailsStep'
import ResponsibilitiesStep from '../../components/ResponsibilitiesStep'
import RequirementsStep from '../../components/RequirementsStep'
import ReviewStep from '../../components/ReviewStep'
import { JobFormData } from '../../types/jobForm'

const CreateJobPage = () => {
    const { id } = useParams()
    const router = useRouter()
    const { user, getCompanyDetails, createJob, btnLoading } = useAppData()
    
    const [company, setCompany] = useState<Company | null>(null)
    const [loading, setLoading] = useState(true)
    const [currentStep, setCurrentStep] = useState(1)
    const [formData, setFormData] = useState<JobFormData>({
        title: '',
        description: '',
        salary: '',
        location: '',
        role: '',
        responsibilities: '',
        qualifications: '',
        job_type: 'full_time',
        work_location: 'onsite',
        openings: '1',
        is_active: true,
        skills_required: []
    })

    const totalSteps = 5
    const stepTitles = [
        'Basic Information',
        'Job Details',
        'Responsibilities',
        'Requirements',
        'Review & Publish'
    ]

    useEffect(() => {
        if (id) {
            fetchCompanyData()
        }
    }, [id])

    const fetchCompanyData = async () => {
        try {
            setLoading(true)
            const companyData = await getCompanyDetails(Number(id))
            
            if (!companyData) {
                router.push('/jobs')
                return
            }
            
            // Check if user is the owner
            if (!user || Number(user.user_id) !== companyData.recruiter_id) {
                router.push(`/company/${id}`)
                return
            }
            
            setCompany(companyData)
        } catch (error) {
            console.error('Error fetching company data:', error)
            router.push('/jobs')
        } finally {
            setLoading(false)
        }
    }

    const handleNext = () => {
        if (currentStep < totalSteps) {
            setCurrentStep(currentStep + 1)
        }
    }

    const handlePrevious = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1)
        }
    }

    const handleStepClick = (step: number) => {
        if (step <= currentStep || step === currentStep + 1) {
            setCurrentStep(step)
        }
    }

    const updateFormData = (data: Partial<JobFormData>) => {
        setFormData(prev => ({ ...prev, ...data }))
    }

    const isStepValid = (step: number): boolean => {
        switch (step) {
            case 1:
                return !!(formData.title && formData.role && formData.description)
            case 2:
                return !!(formData.salary && formData.location && formData.openings)
            case 3:
                return !!formData.responsibilities
            case 4:
                return !!formData.qualifications
            case 5:
                return true
            default:
                return false
        }
    }

    const handleSubmit = async () => {
        const salary = parseFloat(formData.salary)
        const openings = parseInt(formData.openings)

        const jobData = {
            title: formData.title.trim(),
            description: formData.description.trim(),
            salary,
            location: formData.location.trim(),
            role: formData.role.trim(),
            responsibilities: formData.responsibilities.trim(),
            qualifications: formData.qualifications.trim(),
            job_type: formData.job_type,
            work_location: formData.work_location,
            openings,
            company_id: Number(id),
            is_active: formData.is_active,
            skills_required: formData.skills_required.filter(skill => skill && skill.trim())
        }

        try {
            await createJob(jobData)
            router.push(`/company/${id}`)
        } catch (error) {
            console.error('Error creating job:', error)
        }
    }

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return (
                    <BasicInfoStep
                        data={formData}
                        onUpdate={updateFormData}
                        onNext={handleNext}
                    />
                )
            case 2:
                return (
                    <JobDetailsStep
                        data={formData}
                        onUpdate={updateFormData}
                        onNext={handleNext}
                        onPrevious={handlePrevious}
                    />
                )
            case 3:
                return (
                    <ResponsibilitiesStep
                        data={formData}
                        onUpdate={updateFormData}
                        onNext={handleNext}
                        onPrevious={handlePrevious}
                    />
                )
            case 4:
                return (
                    <RequirementsStep
                        data={formData}
                        onUpdate={updateFormData}
                        onNext={handleNext}
                        onPrevious={handlePrevious}
                    />
                )
            case 5:
                return (
                    <ReviewStep
                        data={formData}
                        company={company}
                        onSubmit={handleSubmit}
                        onPrevious={handlePrevious}
                        loading={btnLoading}
                    />
                )
            default:
                return null
        }
    }

    if (loading) return <Loading />

    if (!company) {
        return (
            <div className="min-h-screen py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center py-12">
                        <Building2 className="mx-auto text-gray-400 mb-4" size={64} />
                        <h2 className="text-2xl font-semibold mb-2">Company not found</h2>
                        <p className="text-gray-500 mb-6">
                            The company you're looking for might have been removed or doesn't exist.
                        </p>
                        <Button onClick={() => router.push('/jobs')} className="gap-2 cursor-pointer">
                            <ArrowLeft size={16} />
                            Back to Jobs
                        </Button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen py-8 bg-linear-to-br from-[#ededff] via-white to-[#f0f8ff] dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-4 mb-6">
                        <Button 
                            variant="ghost" 
                            onClick={() => router.push(`/company/${id}`)}
                            className="gap-2 text-[#494bd6] hover:text-[#2b2ed6] cursor-pointer"
                        >
                            <ArrowLeft size={16} />
                            Back to Company
                        </Button>
                    </div>

                    <div className="text-center mb-8">
                        <div className="flex items-center justify-center gap-3 mb-4">
                            <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-700 shrink-0">
                                <img 
                                    src={company.logo} 
                                    alt={`${company.name} logo`}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                    Create New Job
                                </h1>
                                <p className="text-gray-600 dark:text-gray-400">
                                    at {company.name}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Progress Steps */}
                    <Card className="shadow-lg border-[#b0b0ff] dark:border-[#0000c5] bg-white/90 dark:bg-gray-900/90 backdrop-blur-md">
                        <CardContent className="p-6">
                            <div className="mb-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-[#494bd6]">
                                        Step {currentStep} of {totalSteps}
                                    </span>
                                    <span className="text-sm text-gray-500">
                                        {Math.round((currentStep / totalSteps) * 100)}% Complete
                                    </span>
                                </div>
                                <Progress 
                                    value={(currentStep / totalSteps) * 100} 
                                    className="h-2 bg-gray-200 dark:bg-gray-700"
                                />
                            </div>

                            {/* Step indicators */}
                            <div className="flex items-center justify-between">
                                {stepTitles.map((title, index) => {
                                    const stepNumber = index + 1
                                    const isCompleted = stepNumber < currentStep
                                    const isCurrent = stepNumber === currentStep
                                    const isAccessible = stepNumber <= currentStep || stepNumber === currentStep + 1
                                    
                                    return (
                                        <div 
                                            key={stepNumber}
                                            className={`flex flex-col items-center cursor-pointer transition-all duration-200 ${
                                                isAccessible ? 'opacity-100' : 'opacity-50 cursor-not-allowed'
                                            }`}
                                            onClick={() => isAccessible && handleStepClick(stepNumber)}
                                        >
                                            <div className={`
                                                w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium mb-2 transition-all duration-200
                                                ${isCompleted 
                                                    ? 'bg-green-500 text-white' 
                                                    : isCurrent 
                                                        ? 'bg-[#494bd6] text-white' 
                                                        : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                                                }
                                                ${isAccessible ? 'hover:scale-110' : ''}
                                            `}>
                                                {isCompleted ? <Check size={16} /> : stepNumber}
                                            </div>
                                            <span className={`
                                                text-xs text-center max-w-16 leading-tight
                                                ${isCurrent 
                                                    ? 'text-[#494bd6] font-medium' 
                                                    : 'text-gray-500 dark:text-gray-400'
                                                }
                                            `}>
                                                {title}
                                            </span>
                                        </div>
                                    )
                                })}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Step Content */}
                <Card className="shadow-xl border-[#b0b0ff] dark:border-[#0000c5] bg-white/90 dark:bg-gray-900/90 backdrop-blur-md">
                    <CardHeader>
                        <CardTitle className="text-xl text-gray-900 dark:text-white">
                            {stepTitles[currentStep - 1]}
                        </CardTitle>
                        <CardDescription>
                            {currentStep === 1 && "Let's start with the basic information about this job position"}
                            {currentStep === 2 && "Now, let's add the specific details about compensation and work arrangements"}
                            {currentStep === 3 && "What will be the key responsibilities for this role?"}
                            {currentStep === 4 && "What qualifications and skills are required?"}
                            {currentStep === 5 && "Review all details before publishing your job"}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {renderStep()}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default CreateJobPage
