import axios from "axios"
import { AuthenticatedRequest } from "../middleware/auth.js"
import getBuffer from "../utils/buffer.js"
import { sql } from "../utils/db.js"
import ErrorHandler from "../utils/errorHandler.js"
import { tryCatch } from "../utils/tryCatch.js"

export const createCompany = tryCatch(async (req:AuthenticatedRequest, res) => { 
    const user = req.user
    if (!user) {
        throw new ErrorHandler("Authentication required.", 401)
    }

    if(user.role !== 'recruiter') {
        throw new ErrorHandler("Only recruiters can create companies.", 403)
    }

    const { name, description, website } = req.body

    if(!name || !description || !website) {
        throw new ErrorHandler("Name, description, and website are required to create a company.", 400)
    }

    const alreadyExists = await sql`
        SELECT company_id FROM companies WHERE name = ${name}
    `

    if(alreadyExists.length > 0) {
        throw new ErrorHandler("A company with this name already exists.", 409)
    }

    const file = req.file
    if (!file) {
        throw new ErrorHandler("Company logo is required.", 400)
    }

    const fileBuffer = getBuffer(file)

    if (!fileBuffer || !fileBuffer.content) { 
        throw new ErrorHandler("Failed to create file buffer.", 500)
    }

    const { data } = await axios.post(
      `${process.env.FILE_UPLOAD_SERVICE_URL}/api/utils/upload`,
      {buffer: fileBuffer.content}
    );

    const result = await sql`
        INSERT INTO companies (name, description, website, logo, logo_public_id, recruiter_id)
        VALUES (${name}, ${description}, ${website}, ${data.url}, ${data.public_id}, ${user.user_id})
        RETURNING *
    `

    res.status(200).json({
        status: "success",
        data: {
            company: result[0]
        }
    })
})

export const deleteCompany = tryCatch(async (req: AuthenticatedRequest, res) => {
    const user = req.user
    if (!user) {
        throw new ErrorHandler("Authentication required.", 401)
    }

    const { companyId } = req.params

    const company = await sql`
        SELECT * FROM companies WHERE company_id = ${companyId} AND recruiter_id = ${user.user_id}
    `

    if (company.length === 0) {
        throw new ErrorHandler("Company not found or you are not authorised to delete it.", 404)
    }

    await sql`
        DELETE FROM companies WHERE company_id = ${companyId}
    `

    res.status(200).json({
        status: "success",
        message: "Company deleted successfully."
    })
})

export const createJob = tryCatch(async (req: AuthenticatedRequest, res) => { 
    const user = req.user
    if (!user) {
        throw new ErrorHandler("Authentication required.", 401)
    }

    if(user.role !== 'recruiter') {
        throw new ErrorHandler("Only recruiters can create job postings.", 403)
    }

    const { title, description, salary, location, role, responsibilities, qualifications, job_type, work_location, company_id, openings } = req.body

    if(!title || !description || !salary || !location || !role || !responsibilities || !qualifications || !openings) {
        throw new ErrorHandler("All fields are required to create a job posting.", 400)
    }

    const company = await sql`
        SELECT * FROM companies WHERE company_id = ${company_id} AND recruiter_id = ${user.user_id}
    `

    if(company.length === 0) {
        throw new ErrorHandler("Company not found or you are not authorised to post jobs for this company.", 404)
    }

    const result = await sql`
        INSERT INTO jobs (title, description, location, salary, role, responsibilities, qualifications, job_type, work_location, company_id, posted_by_recruiter_id, openings)
        VALUES (${title}, ${description}, ${location}, ${salary}, ${role}, ${responsibilities}, ${qualifications}, ${job_type}, ${work_location}, ${company_id}, ${user.user_id}, ${openings})
        RETURNING *
    `

    res.status(200).json({
        status: "success",
        data: {
            job: result[0]
        }
    })
})

export const updateJob = tryCatch(async (req: AuthenticatedRequest, res) => { 
    const user = req.user
    if (!user) {
        throw new ErrorHandler("Authentication required.", 401)
    }

    const { jobId } = req.params
    const { title, description, salary, location, role, responsibilities, qualifications, job_type, work_location, openings, is_active } = req.body

    const job = await sql`
        SELECT * FROM jobs WHERE job_id = ${jobId} AND posted_by_recruiter_id = ${user.user_id}
    `

    if(job.length === 0) {
        throw new ErrorHandler("Job not found or you are not authorised to update it.", 404)
    }

    const updatedJob = await sql`
        UPDATE jobs
        SET title = ${title},
            description = ${description},
            salary = ${salary},
            location = ${location},
            role = ${role},
            responsibilities = ${responsibilities},
            qualifications = ${qualifications},
            job_type = ${job_type},
            work_location = ${work_location},
            openings = ${openings},
            is_active = ${is_active}
        WHERE job_id = ${jobId}
        RETURNING *
    `

    res.status(200).json({
        status: "success",
        data: {
            job: updatedJob[0]
        }
    })
})