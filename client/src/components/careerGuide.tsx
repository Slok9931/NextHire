"use client"

import { type CareerGuide } from '@/type'
import axios from 'axios'
import { ArrowRight, BookOpen, Briefcase, Lightbulb, Loader2, Sparkles, Target, TrendingUp, X } from 'lucide-react'
import React, { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { Button } from './ui/button'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { utils_service } from '@/context/AppContext'
import toast from 'react-hot-toast'

const CareerGuide = () => {

    const [open, setOpen] = useState(false)
    const [skills, setSkills] = useState<string[]>([])
    const [currentSkill, setCurrentSkill] = useState("")
    const [loading, setLoading] = useState(false)
    const [response, setResponse] = useState<CareerGuide | null>(null)

    const addSkill = () => {
        if (currentSkill.trim() && !skills.includes(currentSkill.trim())) {
            setSkills([...skills, currentSkill.trim()])
            setCurrentSkill("")
        }
    }

    const removeSkill = (skill: string) => {
        setSkills(skills.filter(s => s !== skill))
    }

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            addSkill()
        }
    }

    const careerGuidance = async () => {
        if (skills.length === 0) {
            toast.error("Please add at least one skill.")
            return
        }
        setLoading(true)

        try {
            const { data } = await axios.post(`${utils_service}/api/utils/career`, { skills: skills })
            setResponse(data)
            toast.success("Career guidance generated successfully!")
        } catch (error: any) {
            toast.error(error.response?.data?.message || "An error occurred while fetching career guidance.")
        } finally {
            setLoading(false)
        }
    }

    const resetDialog = () => {
        setSkills([])
        setResponse(null)
        setCurrentSkill("")
        setOpen(false)
    }

    const processMarkdownBold = (text: string): string => {
        return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    };

    return (
        <div className='max-w-7xl mx-auto px-4 py-16'>
            <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border bg-[#ededff] dark:bg-[#00005f] mb-4">
                    <Sparkles size={16} className='text-[#2b2ed6]' />
                    <span className="text-sm font-medium">AI-Powered Career Guidance</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Discover Your Career Path</h2>
                <p className="text-lg opacity-70 max-w-2xl mx-auto mb-8">
                    Get personalised job recommendations and learning roadmaps based on your skills.
                </p>
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button size={'lg'} className='px-8 h-12 gap-2 cursor-pointer'>
                            <Sparkles size={18} /> Get Career Guidance <ArrowRight size={18} />
                        </Button>
                    </DialogTrigger>
                    <DialogContent className='max-w-4xl max-h-[90vh] overflow-y-auto'>
                        {
                            !response ? (<>
                                <DialogHeader>
                                    <DialogTitle className='text-2xl flex items-center gap-2'>
                                        <Sparkles size={18} className='text-[#2b2ed6]' /> Tell us about your skills
                                    </DialogTitle>
                                    <DialogDescription>Add your technical skills to recieve personalised career recommendations</DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                    <div className="space-y-2">
                                        <Label htmlFor='skill'>Add Skills</Label>
                                        <div className="flex gap-2">
                                            <Input id='skill' value={currentSkill} onKeyPress={handleKeyPress} onChange={(e) => setCurrentSkill(e.target.value)} placeholder='e.g. JavaScript, Python...' className='h-11' />
                                            <Button onClick={() => addSkill()} className='gap-2 h-11 cursor-pointer'>Add</Button>
                                        </div>
                                    </div>
                                    {
                                        skills.length > 0 && (<div className="space-y-2">
                                            <Label>Your Skills:</Label>
                                            <div className="flex flex-wrap gap-2">
                                                {skills.map((skill, index) => (
                                                    <div key={index} className="inline-flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-full bg-[#dcdcf3] dark:bg-[#010092]/30 border border-[#b0b0ff] dark:border-[#0000c5]">
                                                        <span className='text-sm font-medium'>{skill}</span>
                                                        <button onClick={() => removeSkill(skill)} className='items-center h-5 w-5 rounded-full bg-destructive text-white flex justify-center cursor-pointer'><X size={12} /></button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        )
                                    }
                                    <Button disabled={!skills.length || loading} className='w-full h-11 gap-2 cursor-pointer' onClick={careerGuidance}>{loading ? <><Loader2 className='animate-spin' size={18} /> Analysing your skills...</> : <><Sparkles size={18} /> Generate Career Guidance</>}</Button>
                                </div>
                            </>) : (<>
                                    <DialogHeader>
                                        <DialogTitle className='text-2xl flex items-center gap-2'>
                                            <Target className='text-[#2b2ed6]' /> Your Personalised Career Guide
                                        </DialogTitle>
                                    </DialogHeader>
                                    <div className="space-y-6 py-4">
                                        <div className="p-4 rounded-lg bg-[#f0f0f0] dark:bg-[#010092]/30 border border-[#d0d0ff] dark:border-[#0000c5]">
                                            <div className="flex items-start gap-3">
                                                <Lightbulb className='text-[#2b2ed6] mt-1 shrink-0' size={20} />
                                                <div className="">
                                                    <h3 className="font-semibold mb-2">Career Summary</h3>
                                                    <p className='text-sm leading-relaxed opacity-90' dangerouslySetInnerHTML={{ __html: processMarkdownBold(response.summary) }} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="">
                                            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                                                <Briefcase size={20} className='text-[#2b2ed6]' /> Recommended Career Path
                                            </h3>
                                            <div className="space-y-3">
                                                {response.jobOptions.map((job, index) => (
                                                    <div key={index} className="p-4 rounded-lg border hover:border-[#494bd6] transition-colors">
                                                        <h4 className="font-semibold text-base mb-2">{job.title}</h4>
                                                        <div className="space-y-2 text-sm">
                                                            <div className="">
                                                                <span className="font-medium">Responsibilities: </span>
                                                                <span className="opacity-80" dangerouslySetInnerHTML={{ __html: processMarkdownBold(job.responsibilities) }} />
                                                            </div>
                                                            <div className="">
                                                                <span className="font-medium">Why this role: </span>
                                                                <span className="opacity-80" dangerouslySetInnerHTML={{ __html: processMarkdownBold(job.why) }} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="">
                                            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                                                <TrendingUp size={20} className='text-[#2b2ed6]' /> Skills to Enhance Your Career
                                            </h3>
                                            <div className="space-y-4">
                                                {response.skillsToLearn.map((category, index) => (
                                                    <div key={index} className="">
                                                        <h4 className="font-semibold text-sm text-[#2b2ed6]">{category.category}</h4>
                                                        <div className="space-y-2">
                                                            {category.skills.map((skill, idx) => (
                                                                <div key={idx} className="p-3 rounded-lg bg-secondary border text-sm">
                                                                    <h5 className="font-medium mb-1" dangerouslySetInnerHTML={{ __html: processMarkdownBold(skill.title) }} />
                                                                    <p className="text-xs opacity-70 mb-1">
                                                                        <span className="font-medium">Why:</span> 
                                                                        <span className="opacity-80" dangerouslySetInnerHTML={{ __html: processMarkdownBold(skill.why) }} />
                                                                    </p>
                                                                    <p className="text-xs opacity-70">
                                                                        <span className="font-medium">How to learn:</span> 
                                                                        <span className="opacity-80" dangerouslySetInnerHTML={{ __html: processMarkdownBold(skill.how) }} />
                                                                    </p>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="p-4 rounded-lg bg-[#010092]/30 dark:bg-[#86001b]/30 border">
                                                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                                                    <BookOpen size={20} className='text-[#2b2ed6]' /> {response.learningApproach.title}
                                            </h3>
                                            <ul className="space-y-2">
                                                {response.learningApproach.points.map((point, index) => (
                                                    <li key={index} className='text-sm flex items-start gap-2 opacity-90'><span className='text-[#2b2ed6] mt-0.5'>・</span><span dangerouslySetInnerHTML={{ __html: processMarkdownBold(point) }} /></li>
                                                ))}
                                            </ul>
                                        </div>
                                            <Button variant={'outline'} className='w-full cursor-pointer' onClick={resetDialog}>Start New Analysis</Button>
                                    </div>
                                </>)
                        }
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    )
}

export default CareerGuide
