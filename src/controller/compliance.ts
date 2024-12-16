import { Request, Response, NextFunction } from 'express';
import { AppError, ComplianceRequest } from '../utils/types/compliance';
import { ComplianceService } from '../services/compliance';
import extractContent from '../utils/scrapper';
import { createNewPolicy } from '../db/repositories/policy';

const complianceService = new ComplianceService();


const generateRandomPolicyName = () => {
  const randomBytes = Buffer.from(Math.random().toString()).toString('base64');
  return randomBytes.substring(0, 5);
}

export const checkCompliance = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {

    if (!req.body.policy_id && !req.body.policy_url && !req.body.content) {
      throw new AppError(400, 'Please provide either policy_id, policy_url or content');
    }
    if (req.body.policy_id) {
      const request = req.body as ComplianceRequest;
      const result = await complianceService.checkCompliance(request);
      res.json(result);

    } else if (req.body.policy_url || req.body.content) {

      let websiteContent = await extractContent(req.body.policy_url, req.body.content);
      if (!websiteContent) {
        throw new AppError(400, 'Failed to extract content from website, Please add content');
      }
      const policy = await createNewPolicy({ ...req.body, content: req.body.content || websiteContent, name: generateRandomPolicyName() });
      req.body.policy_id = policy._id;

      const request = req.body as ComplianceRequest;
      const result = await complianceService.checkCompliance(request);

      res.json(result);
    } else {
      res.status(400).json({
        status: 'error',
        message: 'Invalid request'
      });
    }

  } catch (error) {
    next(error);
  }
};