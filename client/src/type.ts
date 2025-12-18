import { Dispatch, SetStateAction } from "react"

export interface JobOptions {
    title: string
    responsibilities: string
    why: string
}

export interface SkillsToLearn {
    title: string
    why: string
    how: string
}

export interface SkillCategory {
    category: string
    skills: SkillsToLearn[]
} 

export interface LearningApproach {
    title: string
    points: string[]
}

export interface CareerGuide {
    summary: string
    jobOptions: JobOptions[]
    skillsToLearn: SkillCategory[]
    learningApproach: LearningApproach
}

export interface ScoreBreakdown {
    formatting: { score: number; feedback: string }
    keywords: { score: number; feedback: string }
    structure: { score: number; feedback: string }
    readability: { score: number; feedback: string }
}

export interface Suggestion {
    category: string
    issue: string
    recommendation: string
    priority: "low" | "medium" | "high"
}

export interface ResumeAnalysisResponse {
    atsScore: number
    scoreBreakdown: ScoreBreakdown
    suggestions: Suggestion[]
    strengths: string[]
    summary: string
}

export interface User {
    user_id: string;
    name: string;
    email: string;
    phone_number: string;
    bio: string | null;
    resume: string | null;
    resume_public_id: string | null;
    profile_pic: string | null;
    profile_pic_public_id: string | null;
    skills: string[];
    subscription: string | null;
    role: "jobseeker" | "recruiter";
}

export interface Company {
    company_id: number;
    name: string;
    description: string;
    website: string;
    logo: string;
    logo_public_id?: string;
    recruiter_id: number;
    created_at: string;
    jobs?: Job[];
}

export interface Job {
    job_id: number;
    title: string;
    description: string;
    location: string;
    salary: number;
    role: string;
    responsibilities: string;
    qualifications: string;
    job_type: 'full_time' | 'part_time' | 'contract' | 'internship';
    work_location: 'onsite' | 'remote' | 'hybrid';
    company_id: number;
    posted_by_recruiter_id: number;
    openings: number;
    is_active: boolean;
    created_at: string;
    company_name?: string;
    company_logo?: string;
    company_website?: string;
}

export interface AppContextType {
    user: User | null;
    loading: boolean;
    btnLoading: boolean;
    isAuth: boolean;
    setUser: (user: User | null) => void;
    setLoading: (loading: boolean) => void;
    setIsAuth: (isAuth: boolean) => void;
    setBtnLoading: (loading: boolean) => void;
    logoutUser: () => Promise<void>;
    updateUserProfile: (profileData: { name?: string; phone_number?: string; bio?: string }) => Promise<{ success: boolean; data: User }>;
    updateProfilePicture: (file: File) => Promise<{ success: boolean; data: User }>;
    updateResume: (file: File) => Promise<{ success: boolean; data: User }>;
    addSkillToUser: (skillName: string, skillId?: number) => Promise<{ success: boolean; data: User }>;
    removeSkillFromUser: (skillName: string) => Promise<{ success: boolean; data: User }>;
    searchSkills: (query: string) => Promise<any[]>;
    createCompany: (companyData: { name: string; description: string; website: string }, logo: File) => Promise<{ success: boolean; data: any }>;
    getRecruiterCompanies: () => Promise<Company[]>;
    deleteCompany: (companyId: number) => Promise<{ success: boolean }>;
    getCompanyDetails: (companyId: number) => Promise<Company | null>;
    refreshUser: () => Promise<void>;
}

export interface AppProviderProps {
    children: React.ReactNode;
}