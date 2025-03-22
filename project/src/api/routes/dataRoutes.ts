import { Router } from 'express';
import { getData } from '../controllers/DataController';

const router = Router();

// Endpoint: GET /data
router.get('/', getData);

export default router;
