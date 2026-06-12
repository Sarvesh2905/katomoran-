import express from 'express';
import { redirectLink } from '../controllers/redirectController.js';
import { getPublicStats } from '../controllers/analyticsController.js';

const router = express.Router();

router.get('/api/stats/:shortCode', getPublicStats);
router.get('/:shortCode', redirectLink);

export default router;