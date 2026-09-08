import mongoose, { Schema, Document } from 'mongoose';

export interface IAiAuditLog extends Document {
  userId: mongoose.Types.ObjectId;
  workspaceId: mongoose.Types.ObjectId;
  agentId?: mongoose.Types.ObjectId;
  taskId?: mongoose.Types.ObjectId;
  tool?: string;
  action: string;
  target?: string;
  ip?: string;
  result: 'SUCCESS' | 'FAILURE' | 'PENDING';
  error?: string;
  correlationId?: string;
  createdAt: Date;
}

const AiAuditLogSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'AiUser', required: true },
    workspaceId: { type: Schema.Types.ObjectId, ref: 'AiOrganization', required: true },
    agentId: { type: Schema.Types.ObjectId, ref: 'AiAgent' },
    taskId: { type: Schema.Types.ObjectId, ref: 'AiTask' },
    tool: { type: String },
    action: { type: String, required: true },
    target: { type: String },
    ip: { type: String },
    result: { type: String, enum: ['SUCCESS', 'FAILURE', 'PENDING'], required: true },
    error: { type: String },
    correlationId: { type: String },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export default mongoose.models.AiAuditLog || mongoose.model<IAiAuditLog>('AiAuditLog', AiAuditLogSchema);
