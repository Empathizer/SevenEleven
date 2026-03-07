const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  storeName: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6,
    select: false
  },
  role: {
    type: String,
    enum: ['admin', 'seller', 'customer'],
    default: 'customer'
  },
  status: {
    type: String,
    enum: ['active', 'pending', 'blocked'],
    default: 'active'
  },
  avatar: String,
  walletBalance: {
    type: Number,
    default: 0
  },
  pendingBalance: {
    type: Number,
    default: 0
  },
  totalEarnings: {
    type: Number,
    default: 0
  },
  totalWithdrawn: {
    type: Number,
    default: 0
  },
  isVirtual: {
    type: Boolean,
    default: false
  },
  package: {
    type: String,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  address: {
    type: String,
    trim: true
  },
  storeDescription: {
    type: String,
    trim: true
  },
  idType: {
    type: String,
    enum: ['CNIC', 'Passport', 'Driving License'],
    trim: true
  },
  idNumber: {
    type: String,
    trim: true
  },
  idImage: {
    type: String
  },
  invitationCode: {
    type: String,
    trim: true
  },
  guaranteeMoney: {
    type: Number,
    default: 0
  },
  viewsBase: {
    type: Number,
    default: 0
  },
  viewsInc: {
    type: Number,
    default: 0
  },
  salesman: {
    type: String,
    trim: true
  },
  creditScore: {
    type: Number,
    default: 100
  },
  commentPermission: {
    type: String,
    enum: ['enabled', 'disabled'],
    default: 'enabled'
  },
  homeDisplay: {
    type: String,
    enum: ['show', 'hide'],
    default: 'show'
  },
  totalRecharge: {
    type: Number,
    default: 0
  },
  recharge: {
    type: Number,
    default: 0
  },
  withdrawal: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Performance indexes
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ role: 1 });
userSchema.index({ status: 1 });
userSchema.index({ isVirtual: 1 });
userSchema.index({ role: 1, status: 1 });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.models.User || mongoose.model('User', userSchema);
