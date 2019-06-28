"use strict"; function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }Object.defineProperty(exports, "__esModule", {value: true});var _express = require('express');
var _ProductControllers = require('./controllers/ProductControllers'); var _ProductControllers2 = _interopRequireDefault(_ProductControllers);
var _AuthController = require('./controllers/AuthController'); var _AuthController2 = _interopRequireDefault(_AuthController);
var _multer = require('multer'); var _multer2 = _interopRequireDefault(_multer);
var _upload = require('./config/multerconfig/upload'); var _upload2 = _interopRequireDefault(_upload);
var _auth = require('./middlewares/auth'); var _auth2 = _interopRequireDefault(_auth);
const upload = _multer2.default.call(void 0, _upload2.default)

const routes = _express.Router.call(void 0, )

// User
routes.post('/signup', _AuthController2.default.register)
routes.post('/signin', _AuthController2.default.signin)
routes.post('/auth/forgot_password', _AuthController2.default.forgotPassword)
routes.post('/auth/reset_password', _AuthController2.default.resetPassword)

// Products
routes.get('/dashboard/products', _auth2.default, _ProductControllers2.default.index)
routes.get('/dashboard/products/:id', _auth2.default, _ProductControllers2.default.show)
routes.post(
  '/dashboard/products/new',
  _auth2.default,
  upload.single('image'),

  _ProductControllers2.default.store
)

routes.put(
  '/dashboard/products/edit/:id',
  _auth2.default,

  _ProductControllers2.default.update
)

routes.delete(
  '/dashboard/products/delete/:id',
  _auth2.default,

  _ProductControllers2.default.delete
)

exports. default = routes
