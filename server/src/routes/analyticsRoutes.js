import express from 'express';
import { protect } from '../middleware/auth.js';
import { getLinkAnalytics, getGlobalAnalytics, exportAnalyticsCSV } from '../controllers/analyticsController.js';

const router = express.Router();

router.get('/global', protect, getGlobalAnalytics);
router.get('/link/:id', protect, getLinkAnalytics);
router.get('/export/:id/csv', protect, exportAnalyticsCSV);

export default router;