import logger from "../../utils/logger";
import { AppError } from "../../utils/types/compliance";
import { IPolicy, Policy } from "../models/policy";


export const createNewPolicy = async (data: Partial<IPolicy>): Promise<IPolicy> => {
  try {
    const policy = new Policy(data);
    await policy.save();
    return policy;
  } catch (error) {
    logger.error('Error creating policy:', error);
    throw new AppError(500, 'Failed to create policy');
  }
}

export const findByIdPolicy = async (id: string): Promise<IPolicy | null> => {
  try {
    return await Policy.findById(id);
  } catch (error) {
    logger.error('Error finding policy:', error);
    throw new AppError(500, 'Failed to find policy');
  }
}

export const findActivePolicy = async (): Promise<IPolicy[]> => {
  try {
    return await Policy.find({ active: true });
  } catch (error) {
    logger.error('Error finding active policies:', error);
    throw new AppError(500, 'Failed to find active policies');
  }
}

export const updatePolicy = async (id: string, data: Partial<IPolicy>): Promise<IPolicy | null> => {
  try {
    return await Policy.findByIdAndUpdate(id, data, { new: true });
  } catch (error) {
    logger.error('Error updating policy:', error);
    throw new AppError(500, 'Failed to update policy');
  }
}