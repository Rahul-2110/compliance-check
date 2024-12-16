import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { AppError } from '../types/compliance';

export const PolicySchema = z.object({
  name: z.string().min(1),
  url: z.string().url(),
  version: z.string().optional(),
  active: z.boolean().optional()
});

export const validatePolicyRequest = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    PolicySchema.parse(req.body);
    next();
  } catch (error) {
    next(error);
  }
};



const ComplianceRequestSchema = z.object({
  website_url: z.string().url(),
  policy_id: z.string().optional(),
  content: z.string().optional(),
  policy_url: z.string().url().optional(),
});

export const validateComplianceRequest = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    ComplianceRequestSchema.parse(req.body);
    next();
  } catch (error) {
    next(error);
  }
};