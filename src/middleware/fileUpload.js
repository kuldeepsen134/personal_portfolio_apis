const multer = require("multer");
const path = require("path");

exports.fileUploader = (req, res, next) => {
  const BASE_PATH = path.join(__dirname, "../upload");
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, BASE_PATH);
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + file.originalname);
    },
  });
  const upload = multer({
    storage: storage,
  });


  upload.single("pic")(req, res, next);
};



exports.multipleFileUploading = async (req, res, next) => {

  const BASE_PATH = __dirname
  const storage = multer.diskStorage({

    destination: function (req, file, cb) {
      cb(null, path.join(BASE_PATH, '../upload'))
    },

    filename: function (req, file, cb) {
      const string = file.originalname.replace(/[&\/\\#,+()$~%'":*?<>{}]/g, '')
      const myFile = string.split(" ").join("_")

      cb(null, Date.now() + myFile)
    },
  })

  const upload = multer({
    storage: storage,
  })

  upload.fields([{ name: 'image', maxCount: 5 }, { name: 'video', maxCount: 2 },])(req, res, next)

}