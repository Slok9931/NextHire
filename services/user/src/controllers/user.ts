import axios from "axios";
import { AuthenticatedRequest } from "../middleware/auth.js";
import getBuffer from "../utils/buffer.js";
import { sql } from "../utils/db.js";
import ErrorHandler from "../utils/errorHandler.js";
import { tryCatch } from "../utils/tryCatch.js";

export const myProfile = tryCatch(
  async (req: AuthenticatedRequest, res, next) => {
    const user = req.user;
    res.status(200).json({
      success: true,
      message: "User profile fetched successfully",
      data: user,
    });
  }
);

export const getUserProfile = tryCatch(async (req, res, next) => {
  const { userId } = req.params;

  const users =
    await sql`SELECT u.user_id, u.name, u.email, u.phone_number, u.role, u.bio, u.resume, u.profile_pic, u.subscription, ARRAY_AGG(s.name) FILTER(WHERE s.name IS NOT NULL) as skills FROM users u LEFT JOIN user_skills us ON u.user_id = us.user_id LEFT JOIN skills s ON us.skill_id = s.skill_id WHERE u.user_id = ${userId} GROUP BY u.user_id`;

  if (users.length === 0) {
    throw new ErrorHandler("User not found", 404);
  }

  const user = users[0];
  user.skills = user.skills || [];

  res.status(200).json({
    success: true,
    message: "User profile fetched successfully",
    data: user,
  });
});

export const updateUserProfile = tryCatch(
  async (req: AuthenticatedRequest, res, next) => {
    const user = req.user;

    if (!user) {
      throw new ErrorHandler("Unauthorized", 401);
    }

    const { name, phone_number, bio } = req.body;

    const updatedUser =
      await sql`UPDATE users SET name = COALESCE(${name}, name), phone_number = COALESCE(${phone_number}, phone_number), bio = COALESCE(${bio}, bio) WHERE user_id = ${user.user_id} RETURNING user_id, name, email, phone_number, role, bio, resume, profile_pic, subscription`;

    res.status(200).json({
      success: true,
      message: "User profile updated successfully",
      data: updatedUser[0],
    });
  }
);

export const updateProfilePicture = tryCatch(
  async (req: AuthenticatedRequest, res, next) => {
    const user = req.user;

    if (!user) {
      throw new ErrorHandler("Unauthorized", 401);
    }

    const file = req.file;

    if (!file) {
      throw new ErrorHandler("No file uploaded", 400);
    }

    const oldPublicId = user.profile_pic_public_id;

    const fileBuffer = getBuffer(file);

    if (!fileBuffer || !fileBuffer.content) {
      throw new ErrorHandler("Error processing the uploaded file", 500);
    }

    const { data: uploadResult } = await axios.post(
      `${process.env.FILE_UPLOAD_SERVICE_URL}/api/utils/upload`,
      { buffer: fileBuffer.content, public_id: oldPublicId }
    );

    const [updatedUser] =
      await sql`UPDATE users SET profile_pic = ${uploadResult.url}, profile_pic_public_id = ${uploadResult.public_id} WHERE user_id = ${user.user_id} RETURNING user_id, name, email, phone_number, role, bio, resume, profile_pic, subscription`;

    res.status(200).json({
      success: true,
      message: "Profile picture updated successfully",
      data: updatedUser,
    });
  }
);

export const updateResume = tryCatch(
  async (req: AuthenticatedRequest, res, next) => {
    const user = req.user;

    if (!user) {
      throw new ErrorHandler("Unauthorized", 401);
    }

    const file = req.file;

    if (!file) {
      throw new ErrorHandler("No file uploaded", 400);
    }

    const oldPublicId = user.resume_public_id;

    const fileBuffer = getBuffer(file);

    if (!fileBuffer || !fileBuffer.content) {
      throw new ErrorHandler("Error processing the uploaded file", 500);
    }

    const { data: uploadResult } = await axios.post(
      `${process.env.FILE_UPLOAD_SERVICE_URL}/api/utils/upload`,
      { buffer: fileBuffer.content, public_id: oldPublicId }
    );

    const [updatedUser] =
      await sql`UPDATE users SET resume = ${uploadResult.url}, resume_public_id = ${uploadResult.public_id} WHERE user_id = ${user.user_id} RETURNING user_id, name, email, phone_number, role, bio, resume, profile_pic, subscription`;

    res.status(200).json({
      success: true,
      message: "Resume updated successfully",
      data: updatedUser,
    });
  }
);

export const searchSkills = tryCatch(async (req, res, next) => {
  const { query } = req.query;

  if (!query || typeof query !== "string" || query.trim() === "") {
    return res.status(200).json({
      success: true,
      message: "No search query provided",
      data: [],
    });
  }

  const searchTerm = query.trim();

  const skills = await sql`
      SELECT skill_id, name 
      FROM skills 
      WHERE LOWER(name) LIKE LOWER(${"%" + searchTerm + "%"}) 
      ORDER BY 
        CASE 
          WHEN LOWER(name) = LOWER(${searchTerm}) THEN 1
          WHEN LOWER(name) LIKE LOWER(${searchTerm + "%"}) THEN 2
          ELSE 3
        END,
        name
      LIMIT 10
    `;

  res.status(200).json({
    success: true,
    message: "Skills fetched successfully",
    data: skills,
  });
});

export const getAllSkills = tryCatch(async (req, res, next) => {
  const skills = await sql`
      SELECT skill_id, name 
      FROM skills 
      ORDER BY name
    `;

  res.status(200).json({
    success: true,
    message: "All skills fetched successfully",
    data: skills,
  });
});

export const addSkillsToUser = tryCatch(
  async (req: AuthenticatedRequest, res, next) => {
    const userId = req.user?.user_id;

    const { skillName, skillId } = req.body;

    // User can either provide skillId (selecting existing) or skillName (creating new)
    if (!skillId && (!skillName || skillName.trim() === "")) {
      throw new ErrorHandler("Either skill ID or skill name is required", 400);
    }

    let finalSkillId = skillId;
    let alreadyExists = false;
    let isNewSkill = false;

    try {
      await sql`BEGIN`;

      const users =
        await sql`SELECT user_id FROM users WHERE user_id = ${userId}`;
      if (users.length === 0) {
        throw new ErrorHandler("User not found", 404);
      }

      if (skillId) {
        const existingSkill =
          await sql`SELECT skill_id FROM skills WHERE skill_id = ${skillId}`;
        if (existingSkill.length === 0) {
          throw new ErrorHandler("Skill not found", 404);
        }
      } else {
        const trimmedSkillName = skillName.trim();
        const existingSkill = await sql`
          SELECT skill_id 
          FROM skills 
          WHERE LOWER(name) = LOWER(${trimmedSkillName})
        `;

        if (existingSkill.length > 0) {
          finalSkillId = existingSkill[0].skill_id;
        } else {
          const [newSkill] = await sql`
            INSERT INTO skills (name) 
            VALUES (${trimmedSkillName}) 
            RETURNING skill_id
          `;
          finalSkillId = newSkill.skill_id;
          isNewSkill = true;
        }
      }

      const insertResult = await sql`
        INSERT INTO user_skills (user_id, skill_id) 
        VALUES (${userId}, ${finalSkillId}) 
        ON CONFLICT (user_id, skill_id) DO NOTHING 
        RETURNING user_id
      `;

      if (insertResult.length === 0) {
        alreadyExists = true;
      }

      await sql`COMMIT`;
    } catch (error) {
      await sql`ROLLBACK`;
      throw error;
    }

    if (alreadyExists) {
      return res.status(200).json({
        success: true,
        message: "Skill already exists for the user",
        data: null,
      });
    }

    res.status(200).json({
      success: true,
      message: isNewSkill
        ? "New skill created and added successfully"
        : "Skill added successfully",
      data: { skillId: finalSkillId },
    });
  }
);

export const removeSkillFromUser = tryCatch(
  async (req: AuthenticatedRequest, res, next) => {
    const user = req.user;

    if (!user) {
      throw new ErrorHandler("Unauthorized", 401);
    }

    const { skillName } = req.body;

    if (!skillName || skillName.trim() === "") {
      throw new ErrorHandler("Skill name is required", 400);
    }

    const deleteResult = await sql`DELETE FROM user_skills WHERE user_id = ${
      user.user_id
    } AND skill_id = (SELECT skill_id FROM skills WHERE name = ${skillName.trim()}) RETURNING user_id`;

    if (deleteResult.length === 0) {
      throw new ErrorHandler("Skill not associated with the user", 404);
    }

    res.status(200).json({
      success: true,
      message: "Skill removed successfully",
      data: null,
    });
  }
);

export const applyForJob = tryCatch(
  async (req: AuthenticatedRequest, res, next) => {
    const user = req.user;

    if (!user) {
      throw new ErrorHandler("Unauthorized", 401);
    }

    if (user.role !== 'jobseeker') {
      throw new ErrorHandler("You are not allowed for this action", 403);
    }

    const resume = user.resume;
    
    if (!resume) {
      throw new ErrorHandler("Please upload your resume before applying", 400);
    }

    const { jobId } = req.params;

    if (!jobId) {
      throw new ErrorHandler("Job ID is required", 400);
    }

    const job = await sql`SELECT is_active FROM jobs WHERE job_id = ${jobId}`;

    if (job.length === 0) {
      throw new ErrorHandler("Job not found", 404);
    }

    if (!job[0].is_active) {
      throw new ErrorHandler("Cannot apply to an inactive job", 400);
    }

    const now = Date.now();

    const subTime = user.subscription ? new Date(user.subscription) : 0;

    const isSubscribed = subTime && subTime.getTime() > now;

    let newApplication;

    try {
      newApplication =
        await sql`INSERT INTO applications (job_id, applicant_id, applicant_email, resume, subscribed) VALUES (${jobId}, ${user.user_id}, ${user.email}, ${resume}, ${isSubscribed}) RETURNING application_id`;
    } catch (error:any) {
      if (error.code === "23505") { // unique_violation
        throw new ErrorHandler("You have already applied for this job", 409);
      }
      throw error;
    }

    res.status(200).json({
      success: true,
      message: "Job application submitted successfully",
      data: newApplication[0],
    });
  }
)

export const getMyApplications = tryCatch(
  async (req: AuthenticatedRequest, res, next) => {
    const applications = await sql`
      SELECT 
        a.*,
        j.title AS job_title,
        j.salary AS job_salary,
        j.location AS job_location
      FROM applications a 
      JOIN jobs j ON a.job_id = j.job_id
      WHERE a.applicant_id = ${req.user?.user_id}
    `;

    res.status(200).json({
      success: true,
      message: "Applications fetched successfully",
      data: applications,
    });
  }
);