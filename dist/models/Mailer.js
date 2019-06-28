"use strict"; function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }Object.defineProperty(exports, "__esModule", {value: true});
var _nodemailer = require('nodemailer'); var _nodemailer2 = _interopRequireDefault(_nodemailer);

var _mailjson = require('../config/authentication/mail.json');

const transport = _nodemailer2.default.createTransport({
  host: _mailjson.host,
  port: _mailjson.port,
  auth: {
    user: _mailjson.user,
    pass: _mailjson.pass
  }
})

exports. default = transport
