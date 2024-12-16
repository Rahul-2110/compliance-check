import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/types/compliance';
import extractContent from '../utils/scrapper';
import * as policyRepository from '../db/repositories/policy';

export const createPolicy = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let websiteContent = await extractContent(req.body.url, req.body.content);
    if(req.body.url && !req.body.content && !websiteContent) {
      throw new AppError(400, 'Failed to extract content from website, Please add content');
    }
    const policy = await policyRepository.createNewPolicy({...req.body, content: req.body.content || websiteContent});
    res.status(201).json(policy);
  } catch (error) {
    next(error);
  }
};

export const getPolicy = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const policy = await policyRepository.findByIdPolicy(req.params.id); // Updated to use policyRepository
    if (!policy) {
      throw new AppError(404, 'Policy not found');
    }
    res.json(policy);
  } catch (error) {
    next(error);
  }
};

export const getActivePolicies = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const policies = await policyRepository.findActivePolicy(); // Updated to use policyRepository
    res.json(policies);
  } catch (error) {
    next(error);
  }
};

export const updatePolicy = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const policy = await policyRepository.updatePolicy(req.params.id, req.body); // Updated to use policyRepository
    if (!policy) {
      throw new AppError(404, 'Policy not found');
    }
    res.json(policy);
  } catch (error) {
    next(error);
  }
};
