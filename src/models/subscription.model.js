const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
    },
    plan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Plan',
      required: [true, 'Plan is required'],
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'INACTIVE', 'CANCELLED', 'EXPIRED', 'PENDING'],
      default: 'PENDING',
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required'],
    },
    autoRenew: {
      type: Boolean,
      default: false,
    },
    paymentStatus: {
      type: String,
      enum: ['PAID', 'UNPAID', 'FAILED', 'REFUNDED', 'PENDING'],
      default: 'PENDING',
    },
    paymentMethod: {
      type: String,
      enum: ['CREDIT_CARD', 'PAYPAL', 'BANK_TRANSFER', 'OTHER'],
      default: 'CREDIT_CARD',
    },
    transactionId: {
      type: String,
      default: null,
    },
    cancellationReason: {
      type: String,
      default: null,
    },
    metaData: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
      default: {},
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

subscriptionSchema.index({ user: 1, status: 1 });
subscriptionSchema.index({ plan: 1, status: 1 });
subscriptionSchema.index({ endDate: 1, status: 1 });

subscriptionSchema.virtual('isActive').get(function () {
  return this.status === 'ACTIVE' && this.endDate > new Date();
});

subscriptionSchema.virtual('daysRemaining').get(function () {
  if (this.status !== 'ACTIVE') return 0;
  
  const now = new Date();
  const end = new Date(this.endDate);
  const diffTime = end - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
});

subscriptionSchema.set('toJSON', { virtuals: true });
subscriptionSchema.set('toObject', { virtuals: true });

subscriptionSchema.statics.checkExpiredSubscriptions = async function () {
  const now = new Date();
  return this.updateMany(
    {
      status: 'ACTIVE',
      endDate: { $lt: now },
    },
    {
      $set: { status: 'EXPIRED' },
    }
  );
};

const Subscription = mongoose.model('Subscription', subscriptionSchema);

module.exports = Subscription; 