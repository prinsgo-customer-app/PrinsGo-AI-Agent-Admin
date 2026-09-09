import mongoose, { Schema, Document } from 'mongoose';

export interface IAiIntegration extends Document {
  name: string;
  type: string;
  status: 'CONNECTED' | 'DISABLED' | 'ERROR' | 'NOT CONFIGURED' | 'BLOCKED';
  workspaceId: mongoose.Types.ObjectId;
  config?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

const AiIntegrationSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    type: { type: String, required: true },
    status: {
      type: String,
      enum: ['CONNECTED', 'DISABLED', 'ERROR', 'NOT CONFIGURED', 'BLOCKED'],
      default: 'NOT CONFIGURED'
    },
    workspaceId: { type: Schema.Types.ObjectId, ref: 'AiOrganization', required: true },
    config: { type: Schema.Types.Mixed }
  },
  { timestamps: true }
);

export default mongoose.models.AiIntegration || mongoose.model<IAiIntegration>('AiIntegration', AiIntegrationSchema);
