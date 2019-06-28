"use strict"; function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }Object.defineProperty(exports, "__esModule", {value: true});var _Product = require('../models/Product'); var _Product2 = _interopRequireDefault(_Product);


class ProductController {
   async index (req, res) {
    const product = await _Product2.default.find()
    return res.json(product)
  }

   async show (req, res) {
    const product = await _Product2.default.findById(req.params.id)
    return res.json(product)
  }

   async store (req, res) {
    const {
      title,
      price,
      qty

    } = req.body

    const { filename: image } = req.file
    const [name] = image.split('.')
    const filename = `${name}.jpg`

    const product = await _Product2.default.create({
      title,
      price,
      qty,
      image: filename
    })
    return res.json(product)
  }

   async delete (req, res) {
    const product = await _Product2.default.findByIdAndDelete(req.params.id)
    return res.send({ success: `${product.title} deleted with success!` })
  }

   async update (req, res) {
    const product = await _Product2.default.findOneAndUpdate(req.params.id, req.body, {

      new: true
    })
    return res.json(product)
  }
}

exports. default = new ProductController()
