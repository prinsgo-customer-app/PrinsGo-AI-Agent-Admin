import mongoose, { Schema, Document } from 'mongoose';

export interface IAiMemory extends Document {
  content: string;
  category: string;
  workspaceId: mongoose.Types.ObjectId;
  userId?: mongoose.Types.ObjectId;
  metadata?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

const AiMemorySchema: Schema = new Schema(
  {
    content: { type: String, required: true },
    category: { type: String, required: true },
    workspaceId: { type: Schema.Types.ObjectId, ref: 'AiOrganization', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'AiUser' },
    metadata: { type: Schema.Types.Mixed }
  },
  { timestamps: true }
);

export default mongoose.models.AiMemory || mongoose.model<IAiMemory>('AiMemory', AiMemorySchema);
