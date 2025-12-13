import multer from 'multer'

const storage = multer.memoryStorage() // Store files in memory as Buffer objects on cloud not locally

const uploadFile = multer({ storage }).single("file")

export default uploadFile