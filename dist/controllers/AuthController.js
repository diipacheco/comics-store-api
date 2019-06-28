"use strict"; function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }Object.defineProperty(exports, "__esModule", {value: true});/* eslint-disable @typescript-eslint/explicit-function-return-type */
var _User = require('../models/User'); var _User2 = _interopRequireDefault(_User);

var _bcryptjs = require('bcryptjs'); var _bcryptjs2 = _interopRequireDefault(_bcryptjs);
var _jsonwebtoken = require('jsonwebtoken'); var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);
var _auth = require('../config/authentication/auth'); var _auth2 = _interopRequireDefault(_auth);
var _crypto = require('crypto'); var _crypto2 = _interopRequireDefault(_crypto);
var _Mailer = require('../models/Mailer'); var _Mailer2 = _interopRequireDefault(_Mailer);

function generateToken (params = {}) {
  return _jsonwebtoken2.default.sign(params, _auth2.default.secret, {
    expiresIn: 86400
  })
}

class Authentication {
   async register (req, res) {
    const { email } = req.body
    try {
      if (await _User2.default.findOne({ email })) { return res.status(400).send({ error: 'User alredy exists' }) }
      const user = await _User2.default.create(req.body)
      user.password = undefined
      return res.send({ user, token: generateToken({ id: user._id }) })
    } catch (error) {
      if (error) { return res.status(400).send({ error: 'Registration failed' }) }
    }
  }

   async signin (req, res) {
    const { email, password } = req.body

    try {
      const user = await _User2.default.findOne({ email }).select('+password')

      if (!user) return res.status(400).send({ error: 'User not found' })

      if (!await _bcryptjs2.default.compare(password, user.password)) return res.status(400).send({ error: 'Invalid password' })

      user.password = undefined

      res.send({ user, token: generateToken({ id: user._id }) })
    } catch (error) {
      if (error) res.status(400).send({ error: 'Something is going wrong, please try out again latter!' })
    }
  }

   async forgotPassword (req, res) {
    const { email } = req.body

    try {
      const user = await _User2.default.findOne({ email })
      if (!user) return res.status(400).send({ error: 'User not found' })

      const token = _crypto2.default.randomBytes(20).toString('hex')

      const now = new Date()
      now.setHours(now.getHours() + 1)

      await _User2.default.findByIdAndUpdate(user._id, {
        '$set': {
          passwordResetToken: token,
          passwordResetExpires: now
        }
      })

      _Mailer2.default.sendMail({
        to: email,
        from: 'edilsonpacheco6@gmail.com',
        html: `<p> Você esqueceu sua senha? Não tem problema, utilize esse token: ${token} </p>`

      }, (err) => {
        console.log(err)
        if (err) return res.status(400).send({ error: 'Cannot send forgot password email' })
        return res.send()
      })
    } catch (error) {
      console.log(error)
      res.status(400).send({ error: 'Error on forgot password, try again' })
    }
  }

   async resetPassword (req, res) {
    const { email, token, password } = req.body

    try {
      const user = await _User2.default.findOne({ email }).select('+passwordResetToken passwordResetExpires')
      if (!user) return res.status(400).send({ error: 'User not found' })
      if (token !== user.passwordResetToken) return res.status(400).send({ error: 'Token invalid' })

      const now = new Date()

      if (now > user.passwordResetExpires) return res.status(400).send({ error: 'Token expired, generate a new one' })

      user.password = password

      await user.save()

      res.send()
    } catch (error) {
      console.log(error)
      if (error) return res.status(400).send({ error: 'Cannot reeset password, try again' })
    }
  }
}

exports. default = new Authentication()
