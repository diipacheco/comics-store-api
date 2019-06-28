"use strict"; function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }Object.defineProperty(exports, "__esModule", {value: true});var _mongoose = require('mongoose');

var _bcryptjs = require('bcryptjs'); var _bcryptjs2 = _interopRequireDefault(_bcryptjs);










const User = new (0, _mongoose.Schema)({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    required: true
  },
  password: {
    type: String,
    required: true,
    select: false
  },
  passwordResetToken: {
    type: String,
    select: false
  },
  passwordResetExpires: {
    type: String,
    select: false
  }

}, {
  timestamps: true
})
// Gambiarra mal resolvida
User.pre('save', async function (next, res) {
  const hash = await _bcryptjs2.default.hash(this.password, 10)
  this.password = hash
  next()
  return res.send(console.log('Register with success'))
})
exports. default = _mongoose.model('User', User)
