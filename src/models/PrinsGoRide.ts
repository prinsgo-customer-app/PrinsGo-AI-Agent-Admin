import mongoose, { Schema, Document } from 'mongoose';

export interface IPrinsGoRide extends Document {
  customerId: mongoose.Types.ObjectId;
  driverId?: mongoose.Types.ObjectId;
  status: string;
  fare?: number;
  distance?: number;
  createdAt: Date;
  updatedAt: Date;
}

const PrinsGoRideSchema: Schema = new Schema(
  {
    customerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    driverId: { type: Schema.Types.ObjectId, ref: 'Driver' },
    status: { type: String, required: true },
    fare: { type: Number },
    distance: { type: Number },
  },
  { timestamps: true }
);

export default mongoose.models.Ride || mongoose.model<IPrinsGoRide>('Ride', PrinsGoRideSchema, 'rides');
