"use strict";Object.defineProperty(exports, "__esModule", {value: true});var _mongoose = require('mongoose');









const Product = new (0, _mongoose.Schema)({
  title: String,
  price: Number,
  qty: Number,
  image: String
}, {
  timestamps: true

})

exports. default = _mongoose.model('Product', Product)
