import { Schema, model, Document } from 'mongoose'

interface ProductInterface extends Document{
    title?: string,
    price?: number,
    qty?: number,
    image?: string

}

const Product = new Schema({
  title: String,
  price: Number,
  qty: Number,
  image: String
}, {
  timestamps: true

})

export default model<ProductInterface>('Product', Product)
