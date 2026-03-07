import multer from "multer";
import path from "path";
import fs from "fs";

/*
---------------------------------------
STORAGE CONFIG
---------------------------------------
*/
const storage = multer.diskStorage({

  destination: function (req, file, cb) {

    const { course_id } = req.body;

    const uploadPath = `uploads/courses/course-${course_id}`;

    // create folder if not exists
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },

  filename: function (req, file, cb) {

    const uniqueName = Date.now() + "-" + file.originalname;

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


const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 200 * 1024 * 1024 } // 200MB
});

export default upload;