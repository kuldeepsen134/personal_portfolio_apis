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
  const imageFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  };

  multer({
    storage: storage,
    fileFilter: imageFilter

  }).array('media')(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading.
      return res.status(400).json({ error: "Multer Error: " + err.message });
    } else if (err) {
      // An unknown error occurred.
      return res.status(500).json({ error: "Unknown Error: " + err.message });
    }
    // Everything went fine, proceed to the next middleware.
    next();
  });
};