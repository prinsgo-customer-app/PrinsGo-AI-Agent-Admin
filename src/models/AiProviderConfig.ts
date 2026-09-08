import mongoose, { Schema, Document } from 'mongoose';

export interface IAiProviderConfig extends Document {
  providerName: 'GEMINI' | 'OPENAI' | 'ANTHROPIC' | 'OPENROUTER' | 'CUSTOM';
  modelName: string;
  isDefault: boolean;
  isFallback: boolean;
  status: 'ENABLED' | 'DISABLED';
  workspaceId: mongoose.Types.ObjectId;
  usageLimit?: number;
  costLimit?: number;
  rateLimit?: number;
  createdAt: Date;
  updatedAt: Date;
}

const AiProviderConfigSchema: Schema = new Schema(
  {
    providerName: {
      type: String,
      enum: ['GEMINI', 'OPENAI', 'ANTHROPIC', 'OPENROUTER', 'CUSTOM'],
      required: true,
    },
    modelName: { type: String, required: true },
    isDefault: { type: Boolean, default: false },
    isFallback: { type: Boolean, default: false },
    status: { type: String, enum: ['ENABLED', 'DISABLED'], default: 'ENABLED' },
    workspaceId: { type: Schema.Types.ObjectId, ref: 'AiOrganization', required: true },
    usageLimit: { type: Number },
    costLimit: { type: Number },
    rateLimit: { type: Number },
  },
  { timestamps: true }
);

export default mongoose.models.AiProviderConfig || mongoose.model<IAiProviderConfig>('AiProviderConfig', AiProviderConfigSchema);
