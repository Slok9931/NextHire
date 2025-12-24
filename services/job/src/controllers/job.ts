import axios from "axios";
import { AuthenticatedRequest } from "../middleware/auth.js";
import getBuffer from "../utils/buffer.js";
import { sql } from "../utils/db.js";
import ErrorHandler from "../utils/errorHandler.js";
import { tryCatch } from "../utils/tryCatch.js";
import { jobStatusTemplate } from "../utils/template.js";
import { publishToTopic } from "../producer.js";
import { redisClient } from "../index.js";
import { CacheService, CACHE_TTL } from "../utils/cache.js";

export const createCompany = tryCatch(
  async (req: AuthenticatedRequest, res) => {
    const user = req.user;
    if (!user) {
      throw new ErrorHandler("Authentication required.", 401);
    }

    if (user.role !== "recruiter") {
      throw new ErrorHandler("Only recruiters can create companies.", 403);
    }

    const { name, description, website } = req.body;

    if (!name || !description || !website) {
      throw new ErrorHandler(
        "Name, description, and website are required to create a company.",
        400
      );
    }

    const alreadyExists = await sql`
        SELECT company_id FROM companies WHERE name = ${name}
    `;

    if (alreadyExists.length > 0) {
      throw new ErrorHandler("A company with this name already exists.", 409);
    }

    const file = req.file;
    if (!file) {
      throw new ErrorHandler("Company logo is required.", 400);
    }

    const fileBuffer = getBuffer(file);

    if (!fileBuffer || !fileBuffer.content) {
      throw new ErrorHandler("Failed to create file buffer.", 500);
    }

    const { data } = await axios.post(
      `${process.env.FILE_UPLOAD_SERVICE_URL}/api/utils/upload`,
      { buffer: fileBuffer.content }
    );

    const result = await sql`
        INSERT INTO companies (name, description, website, logo, logo_public_id, recruiter_id)
        VALUES (${name}, ${description}, ${website}, ${data.url}, ${data.public_id}, ${user.user_id})
        RETURNING *
    `;

    // Invalidate companies cache using utility
    await CacheService.invalidateCompanyCaches();

    res.status(200).json({
      status: "success",
      message: "Company created successfully.",
      data: {
        company: result[0],
      },
    });
  }
);

export const deleteCompany = tryCatch(
  async (req: AuthenticatedRequest, res) => {
    const user = req.user;
    if (!user) {
      throw new ErrorHandler("Authentication required.", 401);
    }

    const { companyId } = req.params;

    const company = await sql`
        SELECT * FROM companies WHERE company_id = ${companyId} AND recruiter_id = ${user.user_id}
    `;

    if (company.length === 0) {
      throw new ErrorHandler(
        "Company not found or you are not authorised to delete it.",
        404
      );
    }

    await sql`
        DELETE FROM companies WHERE company_id = ${companyId}
    `;

    // Invalidate caches using utility
    await CacheService.invalidateCompanyCache(
      companyId,
      user.user_id.toString()
    );

    res.status(200).json({
      status: "success",
      message: "Company deleted successfully.",
      data: null,
    });
  }
);

export const createJob = tryCatch(async (req: AuthenticatedRequest, res) => {
  const user = req.user;
  if (!user) {
    throw new ErrorHandler("Authentication required.", 401);
  }

  if (user.role !== "recruiter") {
    throw new ErrorHandler("Only recruiters can create job postings.", 403);
  }

  const {
    title,
    description,
    salary,
    location,
    role,
    responsibilities,
    qualifications,
    job_type,
    work_location,
    company_id,
    openings,
  } = req.body;

  if (
    !title ||
    !description ||
    !salary ||
    !location ||
    !role ||
    !responsibilities ||
    !qualifications ||
    !openings
  ) {
    throw new ErrorHandler(
      "All fields are required to create a job posting.",
      400
    );
  }

  const company = await sql`
        SELECT * FROM companies WHERE company_id = ${company_id} AND recruiter_id = ${user.user_id}
    `;

  if (company.length === 0) {
    throw new ErrorHandler(
      "Company not found or you are not authorised to post jobs for this company.",
      404
    );
  }

  const result = await sql`
        INSERT INTO jobs (title, description, location, salary, role, responsibilities, qualifications, job_type, work_location, company_id, posted_by_recruiter_id, openings)
        VALUES (${title}, ${description}, ${location}, ${salary}, ${role}, ${responsibilities}, ${qualifications}, ${job_type}, ${work_location}, ${company_id}, ${user.user_id}, ${openings})
        RETURNING *
    `;

  // Invalidate caches using utility
  await CacheService.invalidateJobCaches();
  await CacheService.del(`company:details:${company_id}`);

  res.status(200).json({
    status: "success",
    message: "Job created successfully.",
    data: {
      job: result[0],
    },
  });
});

export const updateJob = tryCatch(async (req: AuthenticatedRequest, res) => {
  const user = req.user;
  if (!user) {
    throw new ErrorHandler("Authentication required.", 401);
  }

  const { jobId } = req.params;
  const {
    title,
    description,
    salary,
    location,
    role,
    responsibilities,
    qualifications,
    job_type,
    work_location,
    openings,
    is_active,
  } = req.body;

  const job = await sql`
        SELECT * FROM jobs WHERE job_id = ${jobId} AND posted_by_recruiter_id = ${user.user_id}
    `;

  if (job.length === 0) {
    throw new ErrorHandler(
      "Job not found or you are not authorised to update it.",
      404
    );
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
    `;

  // Invalidate caches using utility
  await CacheService.invalidateJobCaches();
  await CacheService.del(`company:details:${job[0].company_id}`);

  res.status(200).json({
    status: "success",
    message: "Job updated successfully.",
    data: {
      job: updatedJob[0],
    },
  });
});

export const getAllCompanyByRecruiter = tryCatch(
  async (req: AuthenticatedRequest, res) => {
    const recruiterId = req.user?.user_id;
    const cacheKey = `companies:recruiter:${recruiterId}`;

    // Try to get from cache first
    const cachedCompanies = await redisClient.get(cacheKey);

    if (cachedCompanies) {
      return res.status(200).json({
        status: "success",
        message: "Companies fetched successfully from cache.",
        data: {
          companies: JSON.parse(cachedCompanies),
        },
      });
    }

    const companies = await sql`
        SELECT company_id, name, description, website, logo, created_at FROM companies WHERE recruiter_id = ${recruiterId}
    `;

    // Cache the result for 30 minutes
    await redisClient.setEx(cacheKey, 30 * 60, JSON.stringify(companies));

    res.status(200).json({
      status: "success",
      message: "Companies fetched successfully.",
      data: {
        companies,
      },
    });
  }
);

export const getCompanyDetails = tryCatch(
  async (req: AuthenticatedRequest, res) => {
    const { companyId } = req.params;

    if (!companyId) {
      throw new ErrorHandler("Company ID is required.", 400);
    }

    const cacheKey = `company:details:${companyId}`;

    // Try to get from cache first
    const cachedCompany = await redisClient.get(cacheKey);

    if (cachedCompany) {
      return res.status(200).json({
        status: "success",
        message: "Company details fetched successfully from cache.",
        data: {
          company: JSON.parse(cachedCompany),
        },
      });
    }

    const company = await sql`
        SELECT c.*, COALESCE(
            (SELECT json_agg(j.*) FROM jobs j WHERE j.company_id = c.company_id),
            '[]'::json
        ) AS jobs
        FROM companies c
        WHERE c.company_id = ${companyId} GROUP BY c.company_id;`; // SQL query to get company details along with its jobs

    if (company.length === 0) {
      throw new ErrorHandler("Company not found.", 404);
    }

    // Cache the result for 30 minutes
    await redisClient.setEx(cacheKey, 30 * 60, JSON.stringify(company[0]));

    res.status(200).json({
      status: "success",
      message: "Company details fetched successfully.",
      data: {
        company: company[0],
      },
    });
  }
);

export const getAllJobs = tryCatch(async (req, res) => {
  const {
    search,
    role,
    min_salary,
    max_salary,
    job_type,
    work_location,
    min_openings,
    max_openings,
    is_active,
    company_id,
    page = 1,
    limit = 10,
  } = req.query;

  // Convert page and limit to numbers
  const pageNum = Math.max(1, parseInt(page as string) || 1);
  const limitNum = Math.max(1, parseInt(limit as string) || 10);
  const offset = (pageNum - 1) * limitNum;

  // Create cache key based on query parameters
  const queryParams = {
    search,
    role,
    min_salary,
    max_salary,
    job_type,
    work_location,
    min_openings,
    max_openings,
    is_active,
    company_id,
    page: pageNum,
    limit: limitNum,
  };
  const cacheKey = `jobs:filtered:${JSON.stringify(queryParams)}`;

  // Check cache first
  const cachedResult = await redisClient.get(cacheKey);
  if (cachedResult) {
    const parsedResult = JSON.parse(cachedResult);
    return res.status(200).json({
      status: "success",
      message: "Jobs fetched successfully from cache.",
      data: parsedResult.data,
      pagination: parsedResult.pagination,
    });
  }

  // Build conditions using template literal approach
  let conditions = [];

  // Search filter
  if (search && typeof search === "string" && search.trim()) {
    const searchTerm = `%${search.trim()}%`;
    conditions.push(sql`(
      LOWER(j.title) LIKE LOWER(${searchTerm}) OR 
      LOWER(j.description) LIKE LOWER(${searchTerm}) OR 
      LOWER(c.name) LIKE LOWER(${searchTerm})
    )`);
  }

  // Role filter - supports multiple values
  if (role) {
    let roleArray: string[];
    if (typeof role === "string") {
      roleArray = role
        .split(",")
        .map((r) => r.trim())
        .filter((r) => r);
    } else if (Array.isArray(role)) {
      roleArray = role.map((r) => String(r).trim()).filter((r) => r);
    } else {
      roleArray = [];
    }

    if (roleArray.length > 0) {
      if (roleArray.length === 1) {
        conditions.push(sql`LOWER(j.role) LIKE LOWER(${`%${roleArray[0]}%`})`);
      } else {
        // Create OR conditions for multiple roles
        let roleCondition = sql`LOWER(j.role) LIKE LOWER(${`%${roleArray[0]}%`})`;
        for (let i = 1; i < roleArray.length; i++) {
          roleCondition = sql`${roleCondition} OR LOWER(j.role) LIKE LOWER(${`%${roleArray[i]}%`})`;
        }
        conditions.push(sql`(${roleCondition})`);
      }
    }
  }

  // Salary range filters
  if (min_salary) {
    const minSal = parseFloat(min_salary as string);
    if (!isNaN(minSal)) {
      conditions.push(sql`j.salary >= ${minSal}`);
    }
  }

  if (max_salary) {
    const maxSal = parseFloat(max_salary as string);
    if (!isNaN(maxSal)) {
      conditions.push(sql`j.salary <= ${maxSal}`);
    }
  }

  // Job type filter
  if (job_type && typeof job_type === "string") {
    const validJobTypes = ["full_time", "part_time", "contract", "internship"];
    if (validJobTypes.includes(job_type)) {
      conditions.push(sql`j.job_type = ${job_type}`);
    }
  }

  // Work location filter - supports multiple values
  if (work_location) {
    let locationArray: string[];
    if (typeof work_location === "string") {
      locationArray = work_location
        .split(",")
        .map((l) => l.trim())
        .filter((l) => l);
    } else if (Array.isArray(work_location)) {
      locationArray = work_location
        .map((l) => String(l).trim())
        .filter((l) => l);
    } else {
      locationArray = [];
    }

    const validWorkLocations = ["onsite", "remote", "hybrid"];
    const filteredLocations = locationArray.filter((loc) =>
      validWorkLocations.includes(loc)
    );

    if (filteredLocations.length > 0) {
      conditions.push(sql`j.work_location = ANY(${filteredLocations})`);
    }
  }

  // Openings range filters
  if (min_openings) {
    const minOpen = parseFloat(min_openings as string);
    if (!isNaN(minOpen)) {
      conditions.push(sql`j.openings >= ${minOpen}`);
    }
  }

  if (max_openings) {
    const maxOpen = parseFloat(max_openings as string);
    if (!isNaN(maxOpen)) {
      conditions.push(sql`j.openings <= ${maxOpen}`);
    }
  }

  // Active status filter
  if (is_active !== undefined) {
    const isActiveBoolean = is_active === "true";
    conditions.push(sql`j.is_active = ${isActiveBoolean}`);
  }

  // Company ID filter - supports multiple values
  if (company_id) {
    let companyArray: number[];
    if (typeof company_id === "string") {
      companyArray = company_id
        .split(",")
        .map((c) => parseInt(c.trim()))
        .filter((c) => !isNaN(c));
    } else if (Array.isArray(company_id)) {
      companyArray = company_id
        .map((c) => parseInt(String(c)))
        .filter((c) => !isNaN(c));
    } else {
      const compIdNum = parseInt(String(company_id));
      companyArray = !isNaN(compIdNum) ? [compIdNum] : [];
    }

    if (companyArray.length > 0) {
      conditions.push(sql`j.company_id = ANY(${companyArray})`);
    }
  }

  try {
    let countResult, jobs;

    if (conditions.length === 0) {
      // No filters - simple queries
      [countResult, jobs] = await Promise.all([
        sql`
          SELECT COUNT(*) as total 
          FROM jobs j 
          JOIN companies c ON j.company_id = c.company_id
        `,
        sql`
          SELECT 
            j.job_id, j.title, j.description, j.location, j.job_type,
            j.salary, j.openings, j.role, j.responsibilities, j.qualifications,
            j.work_location, j.created_at, j.is_active, j.posted_by_recruiter_id,
            c.company_id, c.name as company_name, c.logo as company_logo, c.website as company_website
          FROM jobs j
          JOIN companies c ON j.company_id = c.company_id
          ORDER BY j.created_at DESC
          LIMIT ${limitNum} OFFSET ${offset}
        `,
      ]);
    } else {
      // With filters - build WHERE clause properly
      let whereClause = conditions[0];
      for (let i = 1; i < conditions.length; i++) {
        whereClause = sql`${whereClause} AND ${conditions[i]}`;
      }

      [countResult, jobs] = await Promise.all([
        sql`
          SELECT COUNT(*) as total
          FROM jobs j
          JOIN companies c ON j.company_id = c.company_id
          WHERE ${whereClause}
        `,
        sql`
          SELECT 
            j.job_id, j.title, j.description, j.location, j.job_type,
            j.salary, j.openings, j.role, j.responsibilities, j.qualifications,
            j.work_location, j.created_at, j.is_active, j.posted_by_recruiter_id,
            c.company_id, c.name as company_name, c.logo as company_logo, c.website as company_website
          FROM jobs j
          JOIN companies c ON j.company_id = c.company_id
          WHERE ${whereClause}
          ORDER BY j.created_at DESC
          LIMIT ${limitNum} OFFSET ${offset}
        `,
      ]);
    }

    const total =
      countResult && countResult.length > 0
        ? parseInt(String(countResult[0].total || 0))
        : 0;

    const totalPages = Math.ceil(total / limitNum);

    const responseData = {
      jobs,
      pagination: {
        current_page: pageNum,
        total_pages: totalPages,
        total_jobs: total,
        jobs_per_page: limitNum,
        has_next_page: pageNum < totalPages,
        has_prev_page: pageNum > 1,
      },
    };

    // Cache the result for 15 minutes
    await redisClient.setEx(
      cacheKey,
      15 * 60,
      JSON.stringify({
        data: responseData,
        pagination: responseData.pagination,
      })
    );

    res.status(200).json({
      status: "success",
      message: "Jobs fetched successfully.",
      data: responseData,
    });
  } catch (error) {
    console.error("Database query error:", error);
    throw new ErrorHandler("Failed to fetch jobs", 500);
  }
});

export const getAllCompany = tryCatch(async (req, res) => {
  const cacheKey = "companies:all";

  // Try to get from cache first
  const cachedCompanies = await redisClient.get(cacheKey);

  if (cachedCompanies) {
    return res.status(200).json({
      status: "success",
      message: "Companies fetched successfully from cache.",
      data: {
        companies: JSON.parse(cachedCompanies),
      },
    });
  }

  const companies = await sql`
        SELECT company_id, name, logo FROM companies
    `;

  // Cache the result for 1 hour
  await redisClient.setEx(cacheKey, 60 * 60, JSON.stringify(companies));

  res.status(200).json({
    status: "success",
    message: "Companies fetched successfully.",
    data: {
      companies,
    },
  });
});

export const getAllRoles = tryCatch(async (req, res) => {
  const cacheKey = "roles:all";

  // Try to get from cache first
  const cachedRoles = await redisClient.get(cacheKey);

  if (cachedRoles) {
    return res.status(200).json({
      status: "success",
      message: "Roles fetched successfully from cache.",
      data: {
        roles: JSON.parse(cachedRoles),
      },
    });
  }

  const roles = await sql`
        SELECT DISTINCT role FROM jobs
    `;

  const rolesList = roles.map((r) => r.role);

  // Cache the result for 2 hours
  await redisClient.setEx(cacheKey, 2 * 60 * 60, JSON.stringify(rolesList));

  res.status(200).json({
    status: "success",
    message: "Roles fetched successfully.",
    data: {
      roles: rolesList,
    },
  });
});

export const getJobDetails = tryCatch(
  async (req: AuthenticatedRequest, res) => {
    const { jobId } = req.params;

    if (!jobId) {
      throw new ErrorHandler("Job ID is required.", 400);
    }

    const cacheKey = `job:details:${jobId}`;

    // Try to get from cache first
    const cachedJob = await redisClient.get(cacheKey);

    if (cachedJob) {
      return res.status(200).json({
        status: "success",
        message: "Job details fetched successfully from cache.",
        data: {
          job: JSON.parse(cachedJob),
        },
      });
    }

    const job = await sql`
        SELECT j.*
        FROM jobs j
        WHERE j.job_id = ${jobId}
    `;

    if (job.length === 0) {
      throw new ErrorHandler("Job not found.", 404);
    }

    const company = await sql`
        SELECT c.*
        FROM companies c
        WHERE c.company_id = ${job[0]?.company_id}
    `;

    if (company.length === 0) {
      throw new ErrorHandler("Associated company not found.", 404);
    }

    job[0].company_id = company[0].company_id;
    job[0].company_name = company[0].name;
    job[0].company_logo = company[0].logo;
    job[0].company_website = company[0].website;

    // Cache the result for 30 minutes
    await redisClient.setEx(cacheKey, 30 * 60, JSON.stringify(job[0]));

    res.status(200).json({
      status: "success",
      message: "Job details fetched successfully.",
      data: {
        job: job[0],
      },
    });
  }
);

export const getAllApplicationsForJob = tryCatch(
  async (req: AuthenticatedRequest, res) => {
    const user = req.user;
    if (!user) {
      throw new ErrorHandler("Authentication required.", 401);
    }

    if (user.role !== "recruiter") {
      throw new ErrorHandler("Only recruiters can view job applications.", 403);
    }

    const { jobId } = req.params;

    const job = await sql`
        SELECT posted_by_recruiter_id FROM jobs WHERE job_id = ${jobId}
    `;

    if (job.length === 0) {
      throw new ErrorHandler("Job not found.", 404);
    }

    if (job[0].posted_by_recruiter_id !== user.user_id) {
      throw new ErrorHandler(
        "You are not authorised to view applications for this job.",
        403
      );
    }

    const applications = await sql`
        SELECT a.*, u.name as applicant_name, u.email as applicant_email
        FROM applications a
        JOIN users u ON a.applicant_id = u.user_id
        WHERE a.job_id = ${jobId}
        ORDER BY a.subscribed DESC, a.applied_at ASC
    `;

    res.status(200).json({
      status: "success",
      message: "Applications fetched successfully.",
      data: {
        applications,
      },
    });
  }
);

export const updateApplicationStatus = tryCatch(
  async (req: AuthenticatedRequest, res) => {
    const user = req.user;
    if (!user) {
      throw new ErrorHandler("Authentication required.", 401);
    }

    if (user.role !== "recruiter") {
      throw new ErrorHandler(
        "Only recruiters can update application status.",
        403
      );
    }

    const { applicationId } = req.params;

    const application = await sql`
        SELECT *
        FROM applications
        WHERE application_id = ${applicationId}
    `;

    if (application.length === 0) {
      throw new ErrorHandler("Application not found.", 404);
    }

    const job = await sql`
        SELECT * FROM jobs WHERE job_id = ${application[0].job_id}
    `;

    const company = await sql`
        SELECT * FROM companies WHERE company_id = ${job[0].company_id}
    `;

    const users = await sql`
        SELECT * FROM users WHERE user_id = ${application[0].applicant_id}
    `;

    if (job.length === 0) {
      throw new ErrorHandler("Associated job not found.", 404);
    }

    if (job[0].posted_by_recruiter_id !== user.user_id) {
      throw new ErrorHandler(
        "You are not authorised to update this application.",
        403
      );
    }

    const updatedApplication = await sql`
        UPDATE applications
        SET status = ${req.body.status}
        WHERE application_id = ${applicationId}
        RETURNING *
    `;
    const message = {
      to: application[0].applicant_email,
      subject: `Update on your application - NextHire`,
      html: jobStatusTemplate(
        users[0].name,
        job[0].title,
        company[0].name,
        job[0].location,
        application[0].applied_at.toDateString(),
        job[0].role,
        process.env.FRONTEND_URL || "http://localhost:3000"
      ),
    };

    publishToTopic("send-mail", message).catch((err) => {
      console.log("Failed to publish email message to topic:", err);
    });

    res.status(200).json({
      status: "success",
      message: "Application status updated successfully.",
      data: {
        application: updatedApplication[0],
        job: job[0],
        company: company[0],
      },
    });
  }
);
