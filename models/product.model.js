const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  brand:       { type: String, default: 'No brand'},
  description: { type: String },
  price:       { type: Number, required: true },
  image:       { type: String },
  sizes:       { type: [Number] }
});

module.exports = mongoose.model('Product', productSchema);
