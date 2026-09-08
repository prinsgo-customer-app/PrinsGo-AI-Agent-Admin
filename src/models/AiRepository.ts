import mongoose, { Schema, Document } from 'mongoose';

export interface IAiRepository extends Document {
  name: string;
  url: string;
  workspaceId: mongoose.Types.ObjectId;
  provider: 'GITHUB' | 'GITLAB' | 'BITBUCKET' | 'OTHER';
  status: 'CONNECTED' | 'DISCONNECTED' | 'ERROR';
  permissions: {
    read: boolean;
    analyze: boolean;
    edit: boolean;
    createBranch: boolean;
    commit: boolean;
    createPr: boolean;
    runTests: boolean;
    deploy: boolean;
  };
  healthStatus?: 'HEALTHY' | 'DEGRADED' | 'DOWN';
  lastActivityAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const AiRepositorySchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    url: { type: String, required: true },
    workspaceId: { type: Schema.Types.ObjectId, ref: 'AiOrganization', required: true },
    provider: { type: String, enum: ['GITHUB', 'GITLAB', 'BITBUCKET', 'OTHER'], default: 'GITHUB' },
    status: { type: String, enum: ['CONNECTED', 'DISCONNECTED', 'ERROR'], default: 'DISCONNECTED' },
    permissions: {
      read: { type: Boolean, default: false },
      analyze: { type: Boolean, default: false },
      edit: { type: Boolean, default: false },
      createBranch: { type: Boolean, default: false },
      commit: { type: Boolean, default: false },
      createPr: { type: Boolean, default: false },
      runTests: { type: Boolean, default: false },
      deploy: { type: Boolean, default: false },
    },
    healthStatus: { type: String, enum: ['HEALTHY', 'DEGRADED', 'DOWN'] },
    lastActivityAt: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.models.AiRepository || mongoose.model<IAiRepository>('AiRepository', AiRepositorySchema);
