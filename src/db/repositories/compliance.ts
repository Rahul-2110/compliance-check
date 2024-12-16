import { ObjectId } from "mongoose";
import logger from "../../utils/logger";
import { AppError } from "../../utils/types/compliance";
import { ComplianceCheck, IComplianceCheck } from "../models/compliance";


export const createCompliance = async (data: Partial<IComplianceCheck>): Promise<IComplianceCheck> => {
  try {
    const check = new ComplianceCheck(data);
    await check.save();
    return check;
  } catch (error) {
    logger.error('Error creating compliance check:', error);
    throw new AppError(500, 'Failed to create compliance check');
  }
}

export const findByIdCompliance = async (id: string): Promise<IComplianceCheck | null> => {
  try {
    return await ComplianceCheck.findById(id).populate('policy_id');
  } catch (error) {
    logger.error('Error finding compliance check:', error);
    throw new AppError(500, 'Failed to find compliance check');
  }
}

export const findByWebsiteCompliance = async (website_url: string): Promise<IComplianceCheck[]> => {
  try {
    return await ComplianceCheck.find({ website_url })
      .populate('policy_id')
      .sort({ created_at: -1 });
  } catch (error) {
    logger.error('Error finding compliance checks:', error);
    throw new AppError(500, 'Failed to find compliance checks');
  }
}

export const updateCompliance = async (id, data: Partial<IComplianceCheck>): Promise<IComplianceCheck | null> => {
  try {
    return await ComplianceCheck.findByIdAndUpdate(id, data, { new: true });
  } catch (error) {
    logger.error('Error updating compliance check:', error);
    throw new AppError(500, 'Failed to update compliance check');
  }
}