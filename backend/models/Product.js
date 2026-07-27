const mongoose = require('mongoose');

const FINISH_ENUM = [
  'Polished', 'Honed', 'Leather', 'Flamed',
  'Lapotra', 'Bush Hammered', 'Antique', 'Sandblasted'
];

const CATEGORY_ENUM = ['Granite', 'Imported Marble', 'Indian Marble', 'Sandstone'];

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    default: 'Granite'
  },
  categories: [{
    type: String
  }],
  variety: {
    type: mongoose.Schema.Types.Mixed,
    default: ''
  },
  colorCategory: {
    type: String,
    default: ''
  },
  origin: {
    type: String,
    default: ''
  },
  startingPrice: {
    type: String,
    default: ''
  },
  maximumPrice: {
    type: String,
    default: ''
  },
  estimatedPrice: {
    type: String,
    default: ''
  },
  price: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: 'Premium quality stone, sourced from verified quarries.'
  },
  features: [{
    type: String
  }],
  finish: [{
    type: String
  }],
  color: {
    type: String,
    default: ''
  },
  thickness: {
    type: String,
    default: ''
  },
  slipResistance: {
    type: String,
    default: ''
  },
  priceRange: {
    type: String,
    default: ''
  },
  images: [{
    type: String
  }],
  interior: [{
    type: String
  }],
  exterior: [{
    type: String
  }],
  // Royal Gem Stone specific fields
  isRoyalGemStone: {
    type: Boolean,
    default: false
  },
  gemstoneVariety: {
    type: String,
    default: ''
  },
  gemstoneApplications: [{
    type: String
  }],
  isBacklit: {
    type: Boolean,
    default: false
  },
  sortOrder: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

// Convert _id to id when sending to frontend
productSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  }
});

// Export enum constants for use in routes
module.exports = mongoose.model('Product', productSchema);
module.exports.FINISH_ENUM = FINISH_ENUM;
module.exports.CATEGORY_ENUM = CATEGORY_ENUM;
