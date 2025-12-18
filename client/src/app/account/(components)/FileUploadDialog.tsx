"use client"
import React from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Upload, CheckCircle, Loader2, FileText, Camera } from 'lucide-react'

interface FileUploadDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    type: 'profile' | 'resume'
    file: File | null
    uploading: boolean
    onFileSelect: (file: File) => void
    onUpload: () => void
}

const FileUploadDialog = ({ 
    open, 
    onOpenChange, 
    type, 
    file, 
    uploading, 
    onFileSelect, 
    onUpload 
}: FileUploadDialogProps) => {
    const isProfileType = type === 'profile'
    const Icon = isProfileType ? Camera : FileText
    const acceptTypes = isProfileType ? 'image/*' : '.pdf'
    const maxSize = '5MB'
    const fileTypes = isProfileType ? 'PNG, JPG or JPEG' : 'PDF only'

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>
                        Update {isProfileType ? 'Profile Picture' : 'Resume'}
                    </DialogTitle>
                    <DialogDescription>
                        Upload {isProfileType ? 'a new profile picture' : 'your updated resume'}
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="flex items-center justify-center w-full">
                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-[#d0d0ff] dark:border-[#0000c5] border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-gray-100">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <Upload className="w-8 h-8 mb-4 text-gray-500" />
                                <p className="mb-2 text-sm text-gray-500">
                                    <span className="font-semibold">Click to upload</span>
                                </p>
                                <p className="text-xs text-gray-500">{fileTypes} (MAX. {maxSize})</p>
                            </div>
                            <input 
                                type="file" 
                                className="hidden" 
                                accept={acceptTypes}
                                onChange={(e) => {
                                    const selectedFile = e.target.files?.[0]
                                    if (selectedFile) {
                                        if (selectedFile.size > 5 * 1024 * 1024) {
                                            return
                                        }
                                        if (!isProfileType && selectedFile.type !== 'application/pdf') {
                                            return
                                        }
                                        onFileSelect(selectedFile)
                                    }
                                }}
                            />
                        </label>
                    </div>
                    {file && (
                        <div className="text-sm text-green-600 flex items-center gap-2">
                            <CheckCircle size={16} />
                            {file.name}
                        </div>
                    )}
                    <Button 
                        onClick={onUpload}
                        disabled={!file || uploading}
                        className="w-full cursor-pointer"
                    >
                        {uploading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Uploading...
                            </>
                        ) : (
                            `Update ${isProfileType ? 'Picture' : 'Resume'}`
                        )}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default FileUploadDialog