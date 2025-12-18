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

export interface AppContextType {
  user: User | null;
  loading: boolean;
  btnLoading: boolean;
  isAuth: boolean;
  setUser: Dispatch<SetStateAction<User | null>>;
  setLoading: Dispatch<SetStateAction<boolean>>;
  setIsAuth: Dispatch<SetStateAction<boolean>>;
  logoutUser: () => Promise<void>;
}

export interface AppProviderProps {
    children: React.ReactNode;
}