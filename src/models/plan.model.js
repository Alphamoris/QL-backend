const mongoose = require('mongoose');

const planSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Plan name is required'],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Plan description is required'],
    },
    price: {
      type: Number,
      required: [true, 'Plan price is required'],
      min: [0, 'Price cannot be negative'],
    },
    currency: {
      type: String,
      default: 'INR',
      enum: ['USD', 'EUR', 'GBP', 'INR'],
    },
    duration: {
      type: Number,
      required: [true, 'Plan duration is required'],
      min: [1, 'Duration must be at least 1 day'],
      default: 30,
    },
    durationUnit: {
      type: String,
      enum: ['day', 'month', 'year'],
      default: 'day',
    },
    features: {
      type: [String],
      default: [],
    },
    isActive: {
      type: Boolean,
      default: true,
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

planSchema.virtual('formattedPrice').get(function () {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: this.currency,
  });
  return formatter.format(this.price);
});

planSchema.virtual('formattedDuration').get(function () {
  return `${this.duration} ${this.durationUnit}${this.duration > 1 ? 's' : ''}`;
});

planSchema.set('toJSON', { virtuals: true });
planSchema.set('toObject', { virtuals: true });

const Plan = mongoose.model('Plan', planSchema);

module.exports = Plan; 