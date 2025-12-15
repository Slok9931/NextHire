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

    res.status(201).json({
        status: "success",
        data: {
            company: result[0]
        }
    })
})