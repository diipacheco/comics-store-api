"use strict"; function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }Object.defineProperty(exports, "__esModule", {value: true});/* eslint-disable @typescript-eslint/explicit-function-return-type */
var _jsonwebtoken = require('jsonwebtoken'); var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);
var _auth = require('../config/authentication/auth'); var _auth2 = _interopRequireDefault(_auth);

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader) return res.status(401).send({ error: 'No token provided' })

  const parts = authHeader.split(' ')

  if (!parts.length === 2) return res.status(401).send({ error: 'Token error' })

  const [scheme, token] = parts

  if (!/^Bearer$/i.test(scheme)) {
    return res.status(401).send({ error: 'Token malformatted' })
  }

  _jsonwebtoken2.default.verify(token, _auth2.default.secret, (err, decoded) => {
    if (err) return res.status(401).send({ err: 'Token invalid' })
    req.userId = decoded.id
    return next()
  })
}

exports. default = authMiddleware
