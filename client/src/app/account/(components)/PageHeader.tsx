"use client"
import React from 'react'
import { User } from 'lucide-react'

interface PageHeaderProps {
    title: string
    subtitle: string
    badgeText: string
}

const PageHeader = ({ title, subtitle, badgeText }: PageHeaderProps) => {
    return (
        <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border bg-[#ededff] dark:bg-[#00005f] mb-4">
                <User size={16} className='text-[#2b2ed6]' />
                <span className="text-sm font-medium">{badgeText}</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
                {title}
            </h1>
            <p className="text-lg opacity-70">
                {subtitle}
            </p>
        </div>
    )
}

export default PageHeader