import { Schema, model, models, type Document, type Model } from "mongoose";

// ---------------------------------------------------------------------------
// OTP Collection
// ---------------------------------------------------------------------------
// Stores short-lived one-time passwords for email verification.
// Records are auto-expired via a TTL index on `expiresAt`.
// ---------------------------------------------------------------------------

export type OtpType = "email_verification" | "password_reset";

export interface IOtp extends Document {
  email: string;
  otp: string;
  type: OtpType;
  isUsed: boolean;
  attempts: number;
  maxAttempts: number;
  expiresAt: Date;
  createdAt: Date;
}

const OtpSchema = new Schema<IOtp>(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    otp: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["email_verification", "password_reset"],
      required: true,
      default: "email_verification",
    },
    isUsed: { type: Boolean, default: false },
    attempts: { type: Number, default: 0 },
    maxAttempts: { type: Number, default: 5 },
    expiresAt: { type: Date, required: true },
  },
  {
    timestamps: true,
    collection: "otps",
  }
);

// TTL index — MongoDB auto-deletes documents once expiresAt is past
OtpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Fast lookup for validation
OtpSchema.index({ email: 1, type: 1, isUsed: 1 });

export const Otp: Model<IOtp> =
  models.Otp ?? model<IOtp>("Otp", OtpSchema);
