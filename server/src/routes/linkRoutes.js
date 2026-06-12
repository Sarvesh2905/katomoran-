import express from 'express';
import { protect } from '../middleware/auth.js';
import { createLink, getLinks, getLink, updateLink, deleteLink, bulkCreate } from '../controllers/linkController.js';
import upload from '../middleware/upload.js';
import { body } from 'express-validator';

const router = express.Router();

// /bulk MUST come before /:id so Express doesn't treat "bulk" as an id
router.post('/bulk', protect, upload.single('file'), bulkCreate);

router.post('/', protect, [
  body('originalUrl').isURL().withMessage('Valid URL is required')
], createLink);

router.get('/', protect, getLinks);
router.get('/:id', protect, getLink);
router.patch('/:id', protect, updateLink);
router.delete('/:id', protect, deleteLink);

export default router;