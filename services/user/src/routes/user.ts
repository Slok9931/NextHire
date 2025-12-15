import express from 'express'
import { isAuth } from '../middleware/auth.js'
import { addSkillsToUser, applyForJob, getAllApplications, getAllSkills, getUserProfile, myProfile, removeSkillFromUser, searchSkills, updateProfilePicture, updateResume, updateUserProfile } from '../controllers/user.js'
import uploadFile from '../middleware/multer.js'

const router = express.Router();

router.get('/me', isAuth, myProfile);
router.get('/:userId', getUserProfile);
router.put('/update-profile', isAuth, updateUserProfile);
router.put('/update-profile-picture', isAuth, uploadFile, updateProfilePicture);
router.put('/update-resume', isAuth, uploadFile, updateResume);
router.post('/skill/add', isAuth, addSkillsToUser);
router.delete('/skill/remove', isAuth, removeSkillFromUser);
router.get('/skill/search', searchSkills);
router.get('/skill', getAllSkills);
router.post('/apply/:jobId', isAuth, applyForJob);
router.get('applications', isAuth, getAllApplications);

export default router