import Product from '../models/Product'
import { Request, Response } from 'express'

class ProductController {
  public async index (req: Request, res: Response): Promise<Response> {
    const product = await Product.find()
    return res.json(product)
  }

  public async show (req: Request, res: Response): Promise<Response> {
    const product = await Product.findById(req.params.id)
    return res.json(product)
  }

  public async store (req: Request, res: Response): Promise<Response> {
    const {
      title,
      price,
      qty

    } = req.body

    const { filename: image } = req.file
    const [name] = image.split('.')
    const filename = `${name}.jpg`

    const product = await Product.create({
      title,
      price,
      qty,
      image: filename
    })
    return res.json(product)
  }

  public async delete (req: Request, res: Response): Promise<Response> {
    const product = await Product.findByIdAndDelete(req.params.id)
    return res.send({ success: `${product.title} deleted with success!` })
  }

  public async update (req: Request, res: Response): Promise<Response> {
    const product = await Product.findOneAndUpdate(req.params.id, req.body, {

      new: true
    })
    return res.json(product)
  }
}

export default new ProductController()
