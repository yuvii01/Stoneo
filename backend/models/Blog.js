const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  excerpt: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  author: {
    type: String,
    default: 'KM Stonex Team'
  },
  date: {
    type: String,
    default: () => new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: '2-digit' })
  }
}, { timestamps: true });

// Convert _id to id when sending to frontend
blogSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {   
      delete ret._id;
  }
});

module.exports = mongoose.model('Blog', blogSchema);
