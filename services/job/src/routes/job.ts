import express from 'express'
import { isAuth } from '../middleware/auth.js'
import uploadFile from '../middleware/multer.js'
import { createCompany, createJob, deleteCompany, getAllCompany, getAllCompanyByRecruiter, getAllJobs, getAllRoles, getCompanyDetails, getJobDetails, updateJob } from '../controllers/job.js'

const router = express.Router()

router.post('/company/new', isAuth, uploadFile, createCompany)
router.delete('/company/:companyId', isAuth, deleteCompany)
router.post('/new', isAuth, createJob)
router.put('/:jobId', isAuth, updateJob)
router.get('/company/by-recruiter', isAuth, getAllCompanyByRecruiter)
router.get('/company/:companyId', isAuth, getCompanyDetails)
router.get('/', getAllJobs)
router.get('/company', getAllCompany)
router.get('/role', getAllRoles)
router.get('/:jobId', isAuth, getJobDetails)

export default router