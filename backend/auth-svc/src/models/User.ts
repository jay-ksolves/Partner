import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  role: 'partner' | 'admin';
  isVerified: boolean;
  isKycVerified: boolean;
  companyName?: string;
  phone?: string;
  refreshTokens: string[];
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  role: {
    type: String,
    enum: ['partner', 'admin'],
    default: 'partner',
  },
  isVerified: {
    type: Boolean,
    default: true, // Email verification disabled by default
  },
  isKycVerified: {
    type: Boolean,
    default: false,
  },
  companyName: {
    type: String,
    trim: true,
  },
  phone: {
    type: String,
    trim: true,
  },
  refreshTokens: [{
    type: String,
  }],
  lastLogin: {
    type: Date,
  },
}, {
  timestamps: true,
});

// Password hashing middleware
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Remove sensitive fields from JSON output
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  delete user.refreshTokens;
  return user;
};

export default mongoose.model<IUser>('User', userSchema);