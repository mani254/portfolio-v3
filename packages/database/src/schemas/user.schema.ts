import { Schema, model, models, type Document, type Model } from "mongoose";

// ---------------------------------------------------------------------------
// User Collection
// ---------------------------------------------------------------------------
// Represents authenticated users only.
// Anonymous visitors live purely in the Session collection.
// ---------------------------------------------------------------------------

export type UserRole = "user" | "admin";
export type AuthProvider = "google" | "github" | "credentials";

export interface IUser extends Document {
  name: string;
  email: string;
  avatarUrl?: string;

  /** Auth provider used to sign in */
  provider: AuthProvider;

  /** External OAuth identifier (null for credentials-based auth) */
  providerId?: string;

  /** Hashed password — only used when provider === "credentials" */
  passwordHash?: string;

  role: UserRole;

  /** When false the user is soft-deleted / banned */
  isActive: boolean;

  /** Preferences stored per-user */
  preferences: {
    theme?: "light" | "dark" | "system";
    notifications?: boolean;
  };

  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    avatarUrl: { type: String, default: null },
    provider: {
      type: String,
      enum: ["google", "github", "credentials"],
      required: true,
    },
    providerId: { type: String, default: null },
    passwordHash: { type: String, select: false, default: null },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    isActive: { type: Boolean, default: true },
    preferences: {
      theme: {
        type: String,
        enum: ["light", "dark", "system"],
        default: "system",
      },
      notifications: { type: Boolean, default: true },
    },
    lastLoginAt: { type: Date, default: null },
  },
  {
    timestamps: true,
    collection: "users",
  }
);

// Sparse index: only indexed when the field is present
UserSchema.index({ provider: 1, providerId: 1 }, { sparse: true });
UserSchema.index({ role: 1, isActive: 1 });

export const User: Model<IUser> =
  models.User ?? model<IUser>("User", UserSchema);
