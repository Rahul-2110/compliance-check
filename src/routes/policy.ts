import { Router } from 'express';
import { validatePolicyRequest } from '../utils/validator/payload';
import * as policyController from '../controller/policy';

const router = Router();

router.post(
  '/',
  validatePolicyRequest,
  policyController.createPolicy
);

router.get(
  '/:id',
  policyController.getPolicy
);


export default router; 