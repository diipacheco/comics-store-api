/* eslint-disable @typescript-eslint/explicit-function-return-type */
import User from '../models/User'
import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import authConfig from '../config/authentication/auth'
import crypto from 'crypto'
import mailer from '../models/Mailer'

function generateToken (params = {}) {
  return jwt.sign(params, authConfig.secret, {
    expiresIn: 86400
  })
}

class Authentication {
  public async register (req: Request, res: Response): Promise<Response> {
    const { email } = req.body
    try {
      if (await User.findOne({ email })) { return res.status(400).send({ error: 'User alredy exists' }) }
      const user = await User.create(req.body)
      user.password = undefined
      return res.send({ user, token: generateToken({ id: user._id }) })
    } catch (error) {
      if (error) { return res.status(400).send({ error: 'Registration failed' }) }
    }
  }

  public async signin (req: Request, res: Response):Promise<Response> {
    const { email, password } = req.body

    try {
      const user = await User.findOne({ email }).select('+password')

      if (!user) return res.status(400).send({ error: 'User not found' })

      if (!await bcrypt.compare(password, user.password)) return res.status(400).send({ error: 'Invalid password' })

      user.password = undefined

      res.send({ user, token: generateToken({ id: user._id }) })
    } catch (error) {
      if (error) res.status(400).send({ error: 'Something is going wrong, please try out again latter!' })
    }
  }

  public async forgotPassword (req: Request, res: Response):Promise<Response> {
    const { email } = req.body

    try {
      const user = await User.findOne({ email })
      if (!user) return res.status(400).send({ error: 'User not found' })

      const token = crypto.randomBytes(20).toString('hex')

      const now = new Date()
      now.setHours(now.getHours() + 1)

      await User.findByIdAndUpdate(user._id, {
        '$set': {
          passwordResetToken: token,
          passwordResetExpires: now
        }
      })

      mailer.sendMail({
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

  public async resetPassword (req: Request, res: Response):Promise<Response> {
    const { email, token, password } = req.body

    try {
      const user = await User.findOne({ email }).select('+passwordResetToken passwordResetExpires')
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

export default new Authentication()
