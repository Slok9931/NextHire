import { AuthenticatedRequest } from "../middleware/auth.js"
import { tryCatch } from "../utils/tryCatch.js"

export const myProfile = tryCatch(async (req: AuthenticatedRequest, res, next) => {
    const user = req.user;
    res.status(200).json({
        success: true,
        data: user
    });
 });