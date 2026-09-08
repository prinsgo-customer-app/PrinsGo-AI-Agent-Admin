import mongoose, { Schema, Document } from 'mongoose';

export interface IAiOrganization extends Document {
  name: string;
  description?: string;
  ownerId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const AiOrganizationSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    ownerId: { type: Schema.Types.ObjectId, ref: 'AiUser', required: true },
  },
  { timestamps: true }
);

export default mongoose.models.AiOrganization || mongoose.model<IAiOrganization>('AiOrganization', AiOrganizationSchema);
