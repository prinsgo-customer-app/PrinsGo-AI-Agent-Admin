import mongoose, { Schema, Document } from 'mongoose';

export interface IAiTask extends Document {
  description: string;
  state: 'QUEUED' | 'PLANNING' | 'RUNNING' | 'WAITING_FOR_APPROVAL' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  userId: mongoose.Types.ObjectId;
  workspaceId: mongoose.Types.ObjectId;
  agentId: mongoose.Types.ObjectId;
  repositoryId?: mongoose.Types.ObjectId;
  toolsUsed: string[];
  modelUsed?: mongoose.Types.ObjectId;
  startedAt?: Date;
  completedAt?: Date;
  result?: string;
  error?: string;
  approvalStatus?: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: Date;
  updatedAt: Date;
}

const AiTaskSchema: Schema = new Schema(
  {
    description: { type: String, required: true },
    state: {
      type: String,
      enum: ['QUEUED', 'PLANNING', 'RUNNING', 'WAITING_FOR_APPROVAL', 'COMPLETED', 'FAILED', 'CANCELLED'],
      default: 'QUEUED',
    },
    userId: { type: Schema.Types.ObjectId, ref: 'AiUser', required: true },
    workspaceId: { type: Schema.Types.ObjectId, ref: 'AiOrganization', required: true },
    agentId: { type: Schema.Types.ObjectId, ref: 'AiAgent', required: true },
    repositoryId: { type: Schema.Types.ObjectId, ref: 'AiRepository' },
    toolsUsed: [{ type: String }],
    modelUsed: { type: Schema.Types.ObjectId, ref: 'AiProviderConfig' },
    startedAt: { type: Date },
    completedAt: { type: Date },
    result: { type: String },
    error: { type: String },
    approvalStatus: { type: String, enum: ['PENDING', 'APPROVED', 'REJECTED'] },
  },
  { timestamps: true }
);

export default mongoose.models.AiTask || mongoose.model<IAiTask>('AiTask', AiTaskSchema);
