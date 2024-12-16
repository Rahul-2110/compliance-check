import { Request, Response, NextFunction } from 'express';
import { ComplianceRequest } from '../utils/types/compliance';
import { ComplianceService } from '../services/compliance';

const complianceService = new ComplianceService();

export const checkCompliance = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const request = req.body as ComplianceRequest;
      
      const result = await complianceService.checkCompliance(request);
      
      res.json(result);
    } catch (error) {
      next(error);
    }
  };