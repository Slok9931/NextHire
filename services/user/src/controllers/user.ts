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
    data: user,
  });
});

export const updateUserProfile = tryCatch(
  async (req: AuthenticatedRequest, res, next) => {
    const user = req.user;

    if (!user) {
      throw new ErrorHandler("Unauthorized", 401);
    }

    const { name, phone_number, bio, skills } = req.body;

    const updatedUser =
      await sql`UPDATE users SET name = COALESCE(${name}, name), phone_number = COALESCE(${phone_number}, phone_number), bio = COALESCE(${bio}, bio) WHERE user_id = ${user.user_id} RETURNING user_id, name, email, phone_number, role, bio, resume, profile_pic, subscription`;

    if (skills && Array.isArray(skills)) {
      // Delete existing skills
      await sql`DELETE FROM user_skills WHERE user_id = ${user.user_id}`;

      // Insert new skills
      for (const skillName of skills) {
        let skillRecord =
          await sql`SELECT skill_id FROM skills WHERE name = ${skillName}`;
        let skillId;
        if (skillRecord.length === 0) {
          const insertedSkill =
            await sql`INSERT INTO skills (name) VALUES (${skillName}) RETURNING skill_id`;
          skillId = insertedSkill[0].skill_id;
        } else {
          skillId = skillRecord[0].skill_id;
        }
        await sql`INSERT INTO user_skills (user_id, skill_id) VALUES (${user.user_id}, ${skillId})`;
      }
    }

    res.status(200).json({
      success: true,
      data: updatedUser[0],
      skills: skills || [],
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
      data: updatedUser,
    });
  }
);
