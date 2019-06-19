import jwt from 'jsonwebtoken'
import authconfig from '../config/authentication/auth'

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader) return res.status(401).send({ error: 'No token provided' })

  const parts = authHeader.split(' ')

  if (!parts.length === 2) return res.status(401).send({ error: 'Token error' })

  const [scheme, token] = parts

  if (!/^Bearer$/i.test(scheme)) {
    return res.status(401).send({ error: 'Token malformatted' })
  }

  jwt.verify(token, authconfig.secret, (err, decoded) => {
    if (err) return res.status(401).send({ err: 'Token invalid' })
    req.userId = decoded.id
    return next()
  })
}

export default authMiddleware
