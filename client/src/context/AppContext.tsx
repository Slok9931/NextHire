"use client"

import { AppContextType, AppProviderProps, User, Company, Job } from "@/type"
import React, { createContext, useContext, useEffect, useState } from "react"
import toast, { Toaster } from "react-hot-toast"
import Cookies from "js-cookie"
import axios from "axios"

export const auth_service = "http://localhost:5000"
export const utils_service = "http://localhost:5001"
export const user_service = "http://localhost:5002"
export const job_service = "http://localhost:5003"

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [btnLoading, setBtnLoading] = useState<boolean>(false);
    const [isAuth, setIsAuth] = useState<boolean>(false);

    const token = Cookies.get("token");

    async function fetchUser(token: string) {
        if (!token) {
            setLoading(false);
            setIsAuth(false);
            return;
        }
        
        setLoading(true);
        try {
            const { data } = await axios.get(`${user_service}/api/user/me`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setUser(data.data);
            setIsAuth(true);
        } catch (error) {
            console.error('Error fetching user:', error);
            setUser(null);
            setIsAuth(false);
        } finally {
            setLoading(false);
        }
    }

    async function logoutUser() {
        Cookies.remove("token", { path: "/" });
        setUser(null);
        setIsAuth(false);
        toast.success("Logged out successfully");
    }

    async function updateUserProfile(profileData: { name?: string; phone_number?: string; bio?: string }) {
        try {
            setBtnLoading(true);
            const { data } = await axios.put(`${user_service}/api/user/update-profile`, profileData, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setUser(data.data);
            toast.success('Profile updated successfully');
            return { success: true, data: data.data };
        } catch (error: any) {
            const message = error.response?.data?.message || 'Failed to update profile';
            toast.error(message);
            throw new Error(message);
        } finally {
            setBtnLoading(false);
        }
    }

    async function updateProfilePicture(file: File) {
        try {
            setBtnLoading(true);
            const formData = new FormData();
            formData.append('file', file);
            
            const { data } = await axios.put(`${user_service}/api/user/update-profile-picture`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            setUser(data.data);
            toast.success('Profile picture updated successfully');
            return { success: true, data: data.data };
        } catch (error: any) {
            const message = error.response?.data?.message || 'Failed to update profile picture';
            toast.error(message);
            throw new Error(message);
        } finally {
            setBtnLoading(false);
        }
    }

    async function updateResume(file: File) {
        try {
            setBtnLoading(true);
            const formData = new FormData();
            formData.append('file', file);
            
            const { data } = await axios.put(`${user_service}/api/user/update-resume`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            setUser(data.data);
            toast.success('Resume updated successfully');
            return { success: true, data: data.data };
        } catch (error: any) {
            const message = error.response?.data?.message || 'Failed to update resume';
            toast.error(message);
            throw new Error(message);
        } finally {
            setBtnLoading(false);
        }
    }

    async function addSkillToUser(skillName: string, skillId?: number) {
        try {
            setBtnLoading(true);
            await axios.post(`${user_service}/api/user/skill/add`, {
                skillName: skillId ? undefined : skillName,
                skillId
            }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            const { data } = await axios.get(`${user_service}/api/user/me`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setUser(data.data);
            toast.success('Skill added successfully');
            return { success: true, data: data.data };
        } catch (error: any) {
            const message = error.response?.data?.message || 'Failed to add skill';
            toast.error(message);
            throw new Error(message);
        } finally {
            setBtnLoading(false);
        }
    }

    async function removeSkillFromUser(skillName: string) {
        try {
            setBtnLoading(true);
            await axios.delete(`${user_service}/api/user/skill/remove`, {
                data: { skillName },
                headers: { 'Authorization': `Bearer ${token}` }
            });

            const { data } = await axios.get(`${user_service}/api/user/me`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setUser(data.data);
            toast.success('Skill removed successfully');
            return { success: true, data: data.data };
        } catch (error: any) {
            const message = error.response?.data?.message || 'Failed to remove skill';
            toast.error(message);
            throw new Error(message);
        } finally {
            setBtnLoading(false);
        }
    }

    async function searchSkills(query: string) {
        try {
            if (query.length < 2) return [];
            const { data } = await axios.get(`${user_service}/api/user/skill/search?query=${query}`);
            return data.data || [];
        } catch (error) {
            console.error('Error searching skills:', error);
            return [];
        }
    }

    async function createCompany(companyData: { name: string; description: string; website: string }, logo: File) {
        try {
            setBtnLoading(true);
            const formData = new FormData();
            formData.append('name', companyData.name);
            formData.append('description', companyData.description);
            formData.append('website', companyData.website);
            formData.append('file', logo);
            
            const { data } = await axios.post(`${job_service}/api/job/company/new`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            toast.success('Company created successfully');
            return { success: true, data: data.data };
        } catch (error: any) {
            const message = error.response?.data?.message || 'Failed to create company';
            toast.error(message);
            throw new Error(message);
        } finally {
            setBtnLoading(false);
        }
    }

    async function getRecruiterCompanies() {
        try {
            const { data } = await axios.get(`${job_service}/api/job/company/by-recruiter`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            return data.data?.companies || [];
        } catch (error) {
            console.error('Error fetching companies:', error);
            return [];
        }
    }

    async function deleteCompany(companyId: number) {
        try {
            setBtnLoading(true);
            await axios.delete(`${job_service}/api/job/company/${companyId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            toast.success('Company deleted successfully');
            return { success: true };
        } catch (error: any) {
            const message = error.response?.data?.message || 'Failed to delete company';
            toast.error(message);
            throw new Error(message);
        } finally {
            setBtnLoading(false);
        }
    }

    async function getCompanyDetails(companyId: number): Promise<Company | null> {
        try {
            const { data } = await axios.get(`${job_service}/api/job/company/${companyId}`,{
                headers: { 'Authorization': `Bearer ${token}` }
            });
            return data.data?.company || null;
        } catch (error) {
            console.error('Error fetching company details:', error);
            return null;
        }
    }

    async function createJob(jobData: {
        title: string;
        description: string;
        salary: number;
        location: string;
        role: string;
        responsibilities: string;
        qualifications: string;
        job_type: string;
        work_location: string;
        company_id: number;
        openings: number;
    }) {
        try {
            setBtnLoading(true);
            const { data } = await axios.post(`${job_service}/api/job/new`, jobData, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            toast.success('Job created successfully');
            return { success: true, data: data.data };
        } catch (error: any) {
            const message = error.response?.data?.message || 'Failed to create job';
            toast.error(message);
            throw new Error(message);
        } finally {
            setBtnLoading(false);
        }
    }

    async function updateJob(jobId: number, jobData: {
        title: string;
        description: string;
        salary: number;
        location: string;
        role: string;
        responsibilities: string;
        qualifications: string;
        job_type: string;
        work_location: string;
        openings: number;
        is_active: boolean;
    }) {
        try {
            setBtnLoading(true);
            const { data } = await axios.put(`${job_service}/api/job/${jobId}`, jobData, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            toast.success('Job updated successfully');
            return { success: true, data: data.data };
        } catch (error: any) {
            const message = error.response?.data?.message || 'Failed to update job';
            toast.error(message);
            throw new Error(message);
        } finally {
            setBtnLoading(false);
        }
    }

    async function toggleJobStatus(jobId: number, isActive: boolean) {
        try {
            const job = await getJobDetails(jobId);
            if (!job) {
                throw new Error('Job not found');
            }

            await updateJob(jobId, {
                title: job.title,
                description: job.description,
                salary: job.salary,
                location: job.location,
                role: job.role,
                responsibilities: job.responsibilities,
                qualifications: job.qualifications,
                job_type: job.job_type,
                work_location: job.work_location,
                openings: job.openings,
                is_active: isActive
            });

            return { success: true };
        } catch (error: any) {
            const message = error.response?.data?.message || 'Failed to toggle job status';
            toast.error(message);
            throw new Error(message);
        }
    }

    async function getJobDetails(jobId: number): Promise<Job | null> {
        try {
            const { data } = await axios.get(`${job_service}/api/job/${jobId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            return data.data?.job || null;
        } catch (error) {
            console.error('Error fetching job details:', error);
            return null;
        }
    }

    async function getAllJobs(filters: {
        search?: string;
        role?: string;
        min_salary?: number;
        max_salary?: number;
        job_type?: string;
        work_location?: string;
        min_openings?: number;
        max_openings?: number;
        is_active?: boolean;
        company_id?: number;
        page?: number;
        limit?: number;
    } = {}) {
        try {
            const params = new URLSearchParams();
            
            Object.entries(filters).forEach(([key, value]) => {
                if (value !== undefined && value !== null && value !== '') {
                    params.append(key, value.toString());
                }
            });

            const { data } = await axios.get(`${job_service}/api/job?${params.toString()}`);
            return {
                jobs: data.data?.jobs || [],
                pagination: data.data?.pagination || {}
            };
        } catch (error) {
            console.error('Error fetching jobs:', error);
            return { jobs: [], pagination: {} };
        }
    }

    async function getAllCompanies(): Promise<Company[]> {
        try {
            const { data } = await axios.get(`${job_service}/api/job/company`);
            return data.data?.companies || [];
        } catch (error) {
            console.error('Error fetching companies:', error);
            return [];
        }
    }

    async function getAllRoles(): Promise<string[]> {
        try {
            const { data } = await axios.get(`${job_service}/api/job/role`);
            return data.data?.roles || [];
        } catch (error) {
            console.error('Error fetching roles:', error);
            return [];
        }
    }

    async function applyForJob(jobId: number) {
        try {
            setBtnLoading(true);
            const { data } = await axios.post(`${user_service}/api/user/apply/${jobId}`, {}, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            toast.success('Application submitted successfully!');
            return { success: true, data: data.data };
        } catch (error: any) {
            const message = error.response?.data?.message || 'Failed to apply for job';
            toast.error(message);
            throw new Error(message);
        } finally {
            setBtnLoading(false);
        }
    }

    async function getMyApplications() {
        try {
            const { data } = await axios.get(`${user_service}/api/user/applications/me`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            return data.data || [];
        } catch (error) {
            console.error('Error fetching applications:', error);
            return [];
        }
    }

    async function checkJobApplication(jobId: number): Promise<boolean> {
        try {
            if (!isAuth || !token) return false;
            
            const applications = await getMyApplications();
            return applications.some((app: any) => app.job_id === jobId);
        } catch (error) {
            console.error('Error checking job application:', error);
            return false;
        }
    }

    async function getAllApplicationsForJob(jobId: number) {
        try {
            const { data } = await axios.get(`${job_service}/api/job/applications/${jobId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            return data.data?.applications || [];
        } catch (error: any) {
            const message = error.response?.data?.message || 'Failed to fetch applications';
            console.error('Error fetching job applications:', error);
            throw new Error(message);
        }
    }

    useEffect(() => {
        fetchUser(token as string);
    }, []);

    const value = {
        user,
        loading,
        btnLoading,
        isAuth,
        setUser,
        setLoading,
        setIsAuth,
        setBtnLoading,
        logoutUser,
        updateUserProfile,
        updateProfilePicture,
        updateResume,
        addSkillToUser,
        removeSkillFromUser,
        searchSkills,
        createCompany,
        getRecruiterCompanies,
        deleteCompany,
        getCompanyDetails,
        createJob,
        updateJob,
        toggleJobStatus,
        getJobDetails,
        getAllJobs,
        getAllCompanies,
        getAllRoles,
        applyForJob,
        getMyApplications,
        checkJobApplication,
        getAllApplicationsForJob,
        refreshUser: () => fetchUser(token as string)
    };

    return (
        <AppContext.Provider value={value}>
            {children}
            <Toaster position="top-center" reverseOrder={false} />
        </AppContext.Provider>
    )
}

export const useAppData = (): AppContextType => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error("useAppData must be used within an AppProvider");
    }
    return context;
}

export default AppContext;
