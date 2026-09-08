import mongoose, { Schema, Document } from 'mongoose';

export interface IAiUser extends Document {
  email: string;
  passwordHash?: string;
  name: string;
  role: 'OWNER' | 'SUPER_ADMIN' | 'ADMIN' | 'DEVELOPER' | 'MARKETING' | 'ANALYST' | 'SUPPORT' | 'MEMBER';
  organizations: mongoose.Types.ObjectId[];
  status: 'ACTIVE' | 'DISABLED';
  createdAt: Date;
  updatedAt: Date;
  lastActivityAt?: Date;
}

const AiUserSchema: Schema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String },
    name: { type: String, required: true },
    role: {
      type: String,
      enum: ['OWNER', 'SUPER_ADMIN', 'ADMIN', 'DEVELOPER', 'MARKETING', 'ANALYST', 'SUPPORT', 'MEMBER'],
      default: 'MEMBER',
    },
    organizations: [{ type: Schema.Types.ObjectId, ref: 'AiOrganization' }],
    status: { type: String, enum: ['ACTIVE', 'DISABLED'], default: 'ACTIVE' },
    lastActivityAt: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.models.AiUser || mongoose.model<IAiUser>('AiUser', AiUserSchema);
