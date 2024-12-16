import logger from '../utils/logger';
import mongoose from 'mongoose';
import extractContent from '../utils/scrapper';
import { AppError, ComplianceRequest, ComplianceResponse } from '../utils/types/compliance';
import { createCompliance, findByWebsiteCompliance, updateCompliance } from '../db/repositories/compliance';
import config from '../config';
import { LLMFactory } from './providers';
import { findByIdPolicy } from '../db/repositories/policy';

export class ComplianceService {
  private llmProvider;

  constructor(
  ) {
    this.llmProvider = LLMFactory.createProvider(
      config.get('llm.provider'),
      {  
        apiKey: config.get('llm.api_key'),
        modelName: config.get('llm.model_name'),
        temperature: config.get('llm.temperature'),
        maxTokens: config.get('llm.max_tokens'),
      }
    );
  }

  async checkCompliance(request: ComplianceRequest): Promise<ComplianceResponse> {
    logger.info('Starting compliance check', { request });

    // Create initial compliance check record
    const check = await createCompliance({
      website_url: request.website_url,
      policy_id: new mongoose.Types.ObjectId(request.policy_id),
      status: 'pending'
    });

    try {
      // Get policy content
      const policy = await findByIdPolicy(request.policy_id);
      if (!policy) {
        throw new AppError(404, 'Policy not found');
      }

      // Extract website content
      const websiteContent = await extractContent(request.website_url, '');

      // Prepare prompt
      const prompt = `
        Compare the following website content against the compliance policy rules.
        
        Policy Rules:
        ${policy.content}
        
        Website Content:
        ${websiteContent}
        
        ### 

        Analyze the website content for compliance violations. Return the results in JSON format with the following structure:

        ###
        {
          "violations": [
            {
              "rule": "specific policy rule that was violated",
              "violation": "description of how the content violates the rule",
              "location": "relevant quote from the website content",
              "severity": "high|medium|low"
            }
          ],
          "summary": "brief summary of overall compliance status"
        }
        ###


        Focus on serious violations and marketing claims that could be problematic.
      `;

      // Analyze compliance using configured LLM provider

      const result = await this.llmProvider.analyze(prompt);
      const analysis = JSON.parse(result.content);

      // Update compliance check record
      const updatedCheck = await updateCompliance(check._id, {
        violations: analysis.violations,
        summary: analysis.summary,
        status: 'completed'
      });

      logger.info('Compliance check completed', {
        checkId: check._id,
        violations: analysis.violations.length
      });

      return {
        ...analysis
      };
    } catch (error) {
      // Update check status to failed
      await updateCompliance(check._id, {
        status: 'failed',
        summary: error.message
      });

      throw error;
    }
  }

  async getComplianceHistory(website_url: string) {
    return findByWebsiteCompliance(website_url);
  }
}
