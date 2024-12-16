import mongoose from 'mongoose';

export interface IPolicy extends mongoose.Document {
    name: string;
    content: string;
    url: string;
    version: string;
    active: boolean;
    created_at: Date;
    updated_at: Date;
}

const policySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    content: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true,
        trim: true
    },
    version: {
        type: String,
        required: true,
        default: '1.0.0'
    },
    active: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: { createdAt: "created_at", updatedAt: "modified_at" }
});

export const Policy = mongoose.model<IPolicy>('Policy', policySchema);