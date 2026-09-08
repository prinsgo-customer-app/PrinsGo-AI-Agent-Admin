import mongoose, { Schema, Document } from 'mongoose';

export interface IAiAutomation extends Document {
  name: string;
  trigger: string;
  action: string;
  schedule?: string;
  workspaceId: mongoose.Types.ObjectId;
  agentId: mongoose.Types.ObjectId;
  tools: string[];
  status: 'ACTIVE' | 'PAUSED' | 'ERROR';
  lastExecutionAt?: Date;
  nextExecutionAt?: Date;
  executionHistory: {
    executedAt: Date;
    status: 'SUCCESS' | 'FAILED';
    error?: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const AiAutomationSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    trigger: { type: String, required: true },
    action: { type: String, required: true },
    schedule: { type: String },
    workspaceId: { type: Schema.Types.ObjectId, ref: 'AiOrganization', required: true },
    agentId: { type: Schema.Types.ObjectId, ref: 'AiAgent', required: true },
    tools: [{ type: String }],
    status: { type: String, enum: ['ACTIVE', 'PAUSED', 'ERROR'], default: 'ACTIVE' },
    lastExecutionAt: { type: Date },
    nextExecutionAt: { type: Date },
    executionHistory: [
      {
        executedAt: { type: Date, required: true },
        status: { type: String, enum: ['SUCCESS', 'FAILED'], required: true },
        error: { type: String },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.AiAutomation || mongoose.model<IAiAutomation>('AiAutomation', AiAutomationSchema);
