import { Router } from 'express'
import ProductController from './controllers/ProductControllers'
import AuthController from './controllers/AuthController'
import multer from 'multer'
import uploadConfig from './config/multerconfig/upload'
const upload = multer(uploadConfig)

const routes = Router()

// User
routes.post('/signup', AuthController.register)
routes.post('/signin', AuthController.signin)

// Products
routes.get('/products', ProductController.index)
routes.get('/products/:id', ProductController.show)
routes.post('/products/new', upload.single('image'), ProductController.store)
routes.put('/products/edit/:id', ProductController.update)
routes.delete('/products/delete/:id', ProductController.delete)

export default routes
