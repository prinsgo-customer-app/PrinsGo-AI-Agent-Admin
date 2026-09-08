import mongoose, { Schema, Document } from 'mongoose';

export interface IPrinsGoUser extends Document {
  name: string;
  phone: string;
  email?: string;
  role: string;
  isActive: boolean;
  isBlocked: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PrinsGoUserSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String },
    role: { type: String, default: 'customer' },
    isActive: { type: Boolean, default: true },
    isBlocked: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// We define the collection explicitly in case it doesn't match default pluralization
export default mongoose.models.User || mongoose.model<IPrinsGoUser>('User', PrinsGoUserSchema, 'users');
