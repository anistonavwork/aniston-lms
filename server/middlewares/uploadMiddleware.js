import multer from "multer";
import path from "path";
import fs from "fs";

/*
---------------------------------------
BASE UPLOAD DIRECTORY
---------------------------------------
*/

const BASE_UPLOAD_PATH = path.join(process.cwd(), "uploads");

/*
---------------------------------------
STORAGE CONFIG
---------------------------------------
*/

const storage = multer.diskStorage({

  destination: function (req, file, cb) {

    const { course_id } = req.body;

    if (!course_id) {
      return cb(new Error("course_id is required for upload"));
    }

    const uploadPath = path.join(BASE_UPLOAD_PATH, "courses", `course-${course_id}`);

    /* CREATE DIRECTORY IF NOT EXISTS */

    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },

  filename: function (req, file, cb) {

    const ext = path.extname(file.originalname);

    const uniqueName = Date.now() + ext;

    cb(null, uniqueName);

  }

});


/*
---------------------------------------
FILE FILTER
---------------------------------------
*/

const fileFilter = (req, file, cb) => {

  const allowedTypes = [
    "application/pdf",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "video/mp4",
    "video/mpeg"
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("File type not allowed"), false);
  }

};


/*
---------------------------------------
MULTER INSTANCE
---------------------------------------
*/

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 200 * 1024 * 1024
  }
});

export default upload;