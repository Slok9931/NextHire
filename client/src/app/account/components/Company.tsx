"use client"
import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog'
import { Building2, Plus, ExternalLink, Trash2, Loader2, Upload, Calendar, Globe, Users, AlertTriangle } from 'lucide-react'
import { useAppData } from '@/context/AppContext'
import { Company as CompanyType } from '@/type'
import toast from 'react-hot-toast'

const Company = () => {
    const { createCompany, getRecruiterCompanies, deleteCompany, btnLoading } = useAppData()

    const [companies, setCompanies] = useState<CompanyType[]>([])
    const [loading, setLoading] = useState(true)
    const [showCreateDialog, setShowCreateDialog] = useState(false)
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)
    const [companyToDelete, setCompanyToDelete] = useState<{ id: number; name: string } | null>(null)
    const [companyForm, setCompanyForm] = useState({
        name: '',
        description: '',
        website: ''
    })
    const [logo, setLogo] = useState<File | null>(null)
    const [logoPreview, setLogoPreview] = useState<string | null>(null)

    useEffect(() => {
        fetchCompanies()
    }, [])

    const fetchCompanies = async () => {
        try {
            setLoading(true)
            const companiesData = await getRecruiterCompanies()
            setCompanies(companiesData)
        } catch (error) {
            console.error('Error fetching companies:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleInputChange = (field: string, value: string) => {
        setCompanyForm(prev => ({ ...prev, [field]: value }))
    }

    const handleLogoSelect = (file: File) => {
        if (file.size > 5 * 1024 * 1024) {
            toast.error('Logo size should be less than 5MB')
            return
        }

        if (!file.type.startsWith('image/')) {
            toast.error('Please select an image file')
            return
        }

        setLogo(file)
        const reader = new FileReader()
        reader.onload = (e) => {
            setLogoPreview(e.target?.result as string)
        }
        reader.readAsDataURL(file)
    }

    const handleCreateCompany = async () => {
        if (!companyForm.name.trim() || !companyForm.description.trim() || !companyForm.website.trim()) {
            toast.error('Please fill in all fields')
            return
        }

        if (!logo) {
            toast.error('Please select a company logo')
            return
        }

        if (!companyForm.website.startsWith('http://') && !companyForm.website.startsWith('https://')) {
            toast.error('Please enter a valid website URL (starting with http:// or https://)')
            return
        }

        try {
            await createCompany(companyForm, logo)
            setShowCreateDialog(false)
            resetForm()
            fetchCompanies()
        } catch (error) {
            console.error('Error creating company:', error)
        }
    }

    const handleDeleteClick = (companyId: number, companyName: string) => {
        setCompanyToDelete({ id: companyId, name: companyName })
        setShowDeleteDialog(true)
    }

    const handleDeleteCompany = async () => {
        if (!companyToDelete) return

        try {
            await deleteCompany(companyToDelete.id)
            setShowDeleteDialog(false)
            setCompanyToDelete(null)
            fetchCompanies()
        } catch (error) {
            console.error('Error deleting company:', error)
        }
    }

    const resetForm = () => {
        setCompanyForm({ name: '', description: '', website: '' })
        setLogo(null)
        setLogoPreview(null)
    }

    const handleCreateDialogOpenChange = (open: boolean) => {
        if (!open) {
            resetForm()
        }
        setShowCreateDialog(open)
    }

    const handleDeleteDialogOpenChange = (open: boolean) => {
        if (!open) {
            setCompanyToDelete(null)
        }
        setShowDeleteDialog(open)
    }

    if (loading) {
        return (
            <Card className="shadow-lg border-[#b0b0ff] dark:border-[#0000c5] bg-white/80 dark:bg-gray-900/80 backdrop-blur-md">
                <CardContent className="flex items-center justify-center py-12">
                    <div className="flex items-center gap-2 text-[#494bd6]">
                        <Loader2 className="animate-spin" size={20} />
                        <span>Loading companies...</span>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <>
            <Card className="shadow-lg border-[#b0b0ff] dark:border-[#0000c5] bg-white/80 dark:bg-gray-900/80 backdrop-blur-md">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                <Building2 className="text-[#494bd6]" size={20} />
                                My Companies
                            </CardTitle>
                            <CardDescription>
                                Manage your companies and job postings
                            </CardDescription>
                        </div>
                        <Dialog open={showCreateDialog} onOpenChange={handleCreateDialogOpenChange}>
                            <DialogTrigger asChild>
                                <Button className="gap-2 cursor-pointer">
                                    <Plus size={16} />
                                    Add Company
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-md">
                                <DialogHeader>
                                    <DialogTitle>Create New Company</DialogTitle>
                                    <DialogDescription>
                                        Add a new company to start posting jobs
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="companyName">Company Name</Label>
                                        <Input
                                            id="companyName"
                                            value={companyForm.name}
                                            onChange={(e) => handleInputChange('name', e.target.value)}
                                            placeholder="Enter company name"
                                            className="border-[#d0d0ff] dark:border-[#0000c5] focus:border-[#494bd6]"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="website">Website</Label>
                                        <Input
                                            id="website"
                                            value={companyForm.website}
                                            onChange={(e) => handleInputChange('website', e.target.value)}
                                            placeholder="https://example.com"
                                            className="border-[#d0d0ff] dark:border-[#0000c5] focus:border-[#494bd6]"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="description">Description</Label>
                                        <Textarea
                                            id="description"
                                            value={companyForm.description}
                                            onChange={(e) => handleInputChange('description', e.target.value)}
                                            placeholder="Brief description of the company"
                                            className="min-h-20 border-[#d0d0ff] dark:border-[#0000c5] focus:border-[#494bd6]"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Company Logo</Label>
                                        <div className="flex items-center justify-center w-full">
                                            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-[#d0d0ff] dark:border-[#0000c5] border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-gray-100">
                                                {logoPreview ? (
                                                    <div className="flex flex-col items-center">
                                                        <img src={logoPreview} alt="Logo preview" className="w-16 h-16 object-cover rounded" />
                                                        <p className="text-xs text-gray-500 mt-1">Click to change</p>
                                                    </div>
                                                ) : (
                                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                        <Upload className="w-8 h-8 mb-4 text-gray-500" />
                                                        <p className="mb-2 text-sm text-gray-500">
                                                            <span className="font-semibold">Click to upload logo</span>
                                                        </p>
                                                        <p className="text-xs text-gray-500">PNG, JPG (MAX. 5MB)</p>
                                                    </div>
                                                )}
                                                <input
                                                    type="file"
                                                    className="hidden"
                                                    accept="image/*"
                                                    onChange={(e) => {
                                                        const file = e.target.files?.[0]
                                                        if (file) {
                                                            handleLogoSelect(file)
                                                        }
                                                    }}
                                                />
                                            </label>
                                        </div>
                                    </div>

                                    <Button
                                        onClick={handleCreateCompany}
                                        disabled={btnLoading}
                                        className="w-full cursor-pointer"
                                    >
                                        {btnLoading ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Creating...
                                            </>
                                        ) : (
                                            'Create Company'
                                        )}
                                    </Button>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                </CardHeader>
                <CardContent>
                    {companies.length === 0 ? (
                        <div className="text-center py-8">
                            <Building2 className="mx-auto text-gray-400 mb-4" size={48} />
                            <h3 className="text-lg font-semibold mb-2">No companies yet</h3>
                            <p className="text-gray-500 mb-4">
                                Create your first company to start posting jobs
                            </p>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {companies.map((company) => (
                                <div
                                    key={company.company_id}
                                    className="border border-[#d0d0ff] dark:border-[#0000c5] rounded-lg p-4 hover:bg-[#ededff]/50 dark:hover:bg-[#00005f]/30 transition-colors"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700 shrink-0">
                                            <img
                                                src={company.logo}
                                                alt={`${company.name} logo`}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between mb-2">
                                                <h3 className="font-semibold text-lg truncate">{company.name}</h3>
                                                <div className="flex items-center gap-2">
                                                    <a
                                                        href={company.website}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-[#494bd6] hover:text-[#2b2ed6] cursor-pointer"
                                                    >
                                                        <ExternalLink size={16} />
                                                    </a>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleDeleteClick(company.company_id, company.name)}
                                                        disabled={btnLoading}
                                                        className="text-red-500 hover:text-red-700 hover:bg-red-50 cursor-pointer"
                                                    >
                                                        <Trash2 size={16} />
                                                    </Button>
                                                </div>
                                            </div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                                                {company.description}
                                            </p>
                                            <div className="flex items-center gap-4 text-xs text-gray-500">
                                                <div className="flex items-center gap-1">
                                                    <Calendar size={12} />
                                                    Created {new Date(company.created_at).toLocaleDateString()}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Globe size={12} />
                                                    <a
                                                        href={company.website}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="hover:text-[#494bd6] cursor-pointer truncate"
                                                    >
                                                        {company.website.replace(/^https?:\/\//, '')}
                                                    </a>
                                                </div>
                                                {company.jobs && (
                                                    <div className="flex items-center gap-1">
                                                        <Users size={12} />
                                                        {company.jobs.length} job{company.jobs.length !== 1 ? 's' : ''}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            <Dialog open={showDeleteDialog} onOpenChange={handleDeleteDialogOpenChange}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <AlertTriangle className="text-red-500" size={20} />
                            Delete Company
                        </DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete "{companyToDelete?.name}"? This action cannot be undone and will remove all associated job postings.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setShowDeleteDialog(false)}
                            disabled={btnLoading}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDeleteCompany}
                            disabled={btnLoading}
                            className="cursor-pointer"
                        >
                            {btnLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Deleting...
                                </>
                            ) : (
                                <>
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete Company
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default Company