import { Router } from 'express'
import ProductController from './controllers/ProductControllers'
import AuthController from './controllers/AuthController'
import multer from 'multer'
import uploadConfig from './config/multerconfig/upload'
import authMiddleware from './middlewares/auth'
const upload = multer(uploadConfig)

const routes = Router()

// User
routes.post('/signup', AuthController.register)
routes.post('/signin', AuthController.signin)
routes.post('/auth/forgot_password', AuthController.forgotPassword)

// Products
routes.get('/dashboard/products', authMiddleware, ProductController.index)
routes.get('/dashboard/products/:id', authMiddleware, ProductController.show)
routes.post(
  '/dashboard/products/new',
  authMiddleware,
  upload.single('image'),

  ProductController.store
)

routes.put(
  '/dashboard/products/edit/:id',
  authMiddleware,

  ProductController.update
)

routes.delete(
  '/dashboard/products/delete/:id',
  authMiddleware,

  ProductController.delete
)

export default routes
