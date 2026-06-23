const mongoose = require('mongoose');

const FINISH_ENUM = [
  'Polished', 'Honed', 'Leather', 'Flamed',
  'Lapato', 'Bush Hammered', 'Antique', 'Sandblasted'
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
    enum: CATEGORY_ENUM,
    default: 'Granite'
  },
  colorCategory: {
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
    type: String,
    enum: FINISH_ENUM
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
    type: String // Base64 encoded images, max 3
  }],
  interior: [{
    type: String // e.g., 'Flooring', 'Wall Cladding'
  }],
  exterior: [{
    type: String // e.g., 'Elevation/Facade Cladding'
  }]
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
