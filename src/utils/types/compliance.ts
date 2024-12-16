export interface ComplianceViolation {
    rule: string;
    violation: string;
    location: string;
    severity: 'high' | 'medium' | 'low';
}

export interface ComplianceResponse {
    violations: ComplianceViolation[];
    summary: string;
    timestamp: string;
}

export interface ComplianceRequest {
    website_url: string;
    policy_id: string;
}

export class AppError extends Error {
    constructor(
        public statusCode: number,
        public message: string,
        public isOperational = true
    ) {
        super(message);
        Object.setPrototypeOf(this, AppError.prototype);
    }
}