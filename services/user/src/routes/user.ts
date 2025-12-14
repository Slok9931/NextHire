import express from 'express'
import { isAuth } from '../middleware/auth.js'
import { getUserProfile, myProfile, updateProfilePicture, updateUserProfile } from '../controllers/user.js'
import uploadFile from '../middleware/multer.js'

const router = express.Router();

router.get('/me', isAuth, myProfile);
router.get('/:userId', getUserProfile);
router.put('/update-profile', isAuth, updateUserProfile);
router.put('/update-profile-picture', isAuth, uploadFile, updateProfilePicture);

export default router