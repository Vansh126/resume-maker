import express from 'express'
import { protect } from '../middleware/authMiddleware.js';
import { createResume, deleteResume, getResumebyId, getUserResumes, updateResume, saveResumeImages, uploadResumeImages } from '../controllers/resumeController.js'

const resumeRouter = express.Router();

// Public routes (no authentication required for now)
resumeRouter.post('/', createResume);
resumeRouter.get('/', getUserResumes);
resumeRouter.get('/:id', getResumebyId);
resumeRouter.put('/:id', updateResume);
resumeRouter.put('/:id/upload-images', uploadResumeImages, saveResumeImages);
resumeRouter.delete('/:id', deleteResume);

export default resumeRouter;
