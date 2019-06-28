'use strict'
function _interopRequireWildcard (obj) {
  if (obj && obj.__esModule) {
    return obj
  } else {
    var newObj = {}
    if (obj != null) {
      for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          newObj[key] = obj[key]
        }
      }
    }
    newObj.default = obj
    return newObj
  }
}
function _interopRequireDefault (obj) {
  return obj && obj.__esModule ? obj : { default: obj }
}
Object.defineProperty(exports, '__esModule', { value: true })

var _multer = require('multer')
var multer = _interopRequireWildcard(_multer)
var _path = require('path')
var _path2 = _interopRequireDefault(_path)

const storage = multer.diskStorage({
  destination: _path2.default.resolve(__dirname, '..', '..', '..', 'uploads'),
  filename (req, file, cb) {
    cb(null, file.originalname)
  }
})

const upload = { storage: storage }

exports.default = upload
