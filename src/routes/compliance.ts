
import { Router } from 'express';
import { checkCompliance } from '../controller/compliance';
import { validateComplianceRequest } from '../utils/validator/payload';


const router = Router();

router.post(
  '/check',
  validateComplianceRequest,
  checkCompliance
);

export default router; 