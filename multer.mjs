import multer from "multer";
import { CustomError } from "./routers/error.mjs";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },

})

const upload = multer({
  storage,
  limits: { fileSize: 1002400 /* bytes */ },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.includes("image")) {
      cb(null, true);
    } else {
      return cb(new CustomError(null, 418, "only image file type is valid"));
    }
  }
})

export { upload }