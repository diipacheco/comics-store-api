import User from '../models/User'
import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import authConfig from '../config/authentication/auth'
import crypto from 'crypto'
import mailer from '../models/Mailer'

function generateToken (params = {}):string {
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

    const user = await User.findOne({ email }).select('+password')

    if (!user) return res.status(400).send({ error: 'User not found' })

    if (!await bcrypt.compare(password, user.password)) return res.status(400).send({ error: 'Invalid password' })

    user.password = undefined

    res.send({ user, token: generateToken({ id: user._id }) })
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

      console.log(token, now)
    } catch (error) {
      res.status(400).send({ error: 'Error on forgot password, try again' })
    }
  }
}

export default new Authentication()
