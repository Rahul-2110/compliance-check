import mongoose from 'mongoose';

export interface IComplianceCheck extends mongoose.Document {
    website_url: string;
    policy_id: mongoose.Types.ObjectId;
    violations: Object[];
    summary: string;
    status: 'pending' | 'completed' | 'failed';
    created_at: Date;
    updated_at: Date;
}

const complianceCheckSchema = new mongoose.Schema({
    website_url: {
        type: String,
        required: true,
        trim: true
    },
    policy_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Policy',
        required: true
    },
    violations: [{
        rule: {
            type: String,
            required: true
        },
        violation: {
            type: String,
            required: true
        },
        location: {
            type: String,
            required: true
        },
        severity: {
            type: String,
            enum: ['high', 'medium', 'low'],
            required: true
        }
    }],
    summary: {
        type: String,
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending'
    }
}, {
    timestamps: { createdAt: "created_at", updatedAt: "modified_at" },
});


complianceCheckSchema.index({ website_url: 1, policy_id: 1, created_at: -1 });

export const ComplianceCheck = mongoose.model<IComplianceCheck>('ComplianceCheck', complianceCheckSchema);
