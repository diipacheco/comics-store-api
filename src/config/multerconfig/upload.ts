import * as multer from 'multer'
import path from 'path'

const storage = multer.diskStorage({
  destination: path.resolve(__dirname, '..', '..', 'uploads'),
  filename (req, file, cb):void {
    cb(null, file.originalname)
  }
})

const upload = { storage: storage }

export default upload
