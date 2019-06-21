import { Schema, model, Document } from 'mongoose'
import { Response } from 'express'
import bcrypt from 'bcryptjs'

interface UserInterface extends Document{
    name?: string,
    email?: string,
    password?: string
    passwordResetToken?: string,
    passwordResetExpires?: string

}

const User = new Schema({
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
User.pre('save', async function (next, res: Response):Promise<Response> {
  const hash = await bcrypt.hash(this.password, 10)
  this.password = hash
  next()
  return res.send(console.log('Register with success'))
})
export default model<UserInterface>('User', User)
