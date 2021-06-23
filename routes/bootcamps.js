const express = require('express');
const controllers = require('../controllers/bootcamps');
const {
  getBootcamps,
  getBootcamp,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
  getBootcampsInRadius,
  getBootcampsInRadiusKm,
  fileUpload,
  profilePictureUpload,
} = controllers;

const Bootcamp = require('../models/Bootcamp');
const advancedResults = require('../middleware/advancedResults');

// const upload = require('../util/ImageUpload');
// console.group('upload:');
// console.log(upload);
// console.groupEnd();
// const singleUpload = upload.single('fileUpload');

// Include other resource routers
const courseRouter = require('./courses');

const router = express.Router();

// Re-route into other resource routers
router.use('/:bootcampId/courses', courseRouter);

router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius);
router.route('/radius/:zipcode/:distance/:unit').get(getBootcampsInRadiusKm);

router.route('/:id/photo').put(fileUpload);
router.route('/:id/upload').post(profilePictureUpload);
// router.post(
//   '/:id/upload',
//   upload.single('fileUpload'),
//   function (req, res, next) {
//     console.log(req.files.fileUpload.name);
//     const filename = req.files.fileUpload.name;
//     res.send(`Successfully uploaded ${filename}`);
//   }
// );

router
  .route('/')
  .get(advancedResults(Bootcamp, 'courses'), getBootcamps)
  .post(createBootcamp);
router
  .route('/:id')
  .get(getBootcamp)
  .put(updateBootcamp)
  .delete(deleteBootcamp);

module.exports = router;
