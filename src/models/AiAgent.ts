import mongoose, { Schema, Document } from 'mongoose';

export interface IAiAgent extends Document {
  name: string;
  description: string;
  systemInstructions: string;
  preferredModel: mongoose.Types.ObjectId;
  fallbackModel?: mongoose.Types.ObjectId;
  allowedTools: string[];
  workspaceId: mongoose.Types.ObjectId;
  status: 'ENABLED' | 'DISABLED';
  createdAt: Date;
  updatedAt: Date;
}

const AiAgentSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    systemInstructions: { type: String, required: true },
    preferredModel: { type: Schema.Types.ObjectId, ref: 'AiProviderConfig', required: true },
    fallbackModel: { type: Schema.Types.ObjectId, ref: 'AiProviderConfig' },
    allowedTools: [{ type: String }],
    workspaceId: { type: Schema.Types.ObjectId, ref: 'AiOrganization', required: true },
    status: { type: String, enum: ['ENABLED', 'DISABLED'], default: 'ENABLED' },
  },
  { timestamps: true }
);

export default mongoose.models.AiAgent || mongoose.model<IAiAgent>('AiAgent', AiAgentSchema);
