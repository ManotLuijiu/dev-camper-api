const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');

// console.log(process.env.S3_BUCKET);
// console.log(process.env.S3_ACCESS_KEY);
// console.log(process.env.S3_ACCESS_SECRET);

const s3 = new aws.S3();
// console.log('s3', s3);

aws.config.update({
  // secretAccessKey: process.env.S3_ACCESS_SECRET,
  secretAccessKey: process.env.ROOT_ACCESS_SECRET,
  // accessKeyId: process.env.S3_ACCESS_KEY,
  accessKeyId: process.env.ROOT_ACCESS_KEY,
  region: process.env.S3_REGION,
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type, only JPEG and PNG is allowed'), false);
  }
};

const upload = multer({
  fileFilter,
  storage: multerS3({
    acl: 'public-read-write',
    s3: s3,
    bucket: 'campers-api',
    // contentType: multerS3.AUTO_CONTENT_TYPE,
    // metadata: function (req, file, cb) {
    //   cb(null, { fieldName: file.fieldname });
    // },
    key: function (req, file, cb) {
      console.log('file', file);
      cb(null, file.originalname);
      // cb(null, Date.now().toString());
    },
  }),
});

module.exports = upload;
