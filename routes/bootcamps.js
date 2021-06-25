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

// const upload = require('../util/ImageUpload');
// console.group('upload:');
// console.log(upload);
// console.groupEnd();
// const singleUpload = upload.single('fileUpload');

// Include other resource routers
const courseRouter = require('./courses');

const router = express.Router();

const advancedResults = require('../middleware/advancedResults');
const { protect, authorize } = require('../middleware/auth');

// Re-route into other resource routers
router.use('/:bootcampId/courses', courseRouter);

router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius);
router.route('/radius/:zipcode/:distance/:unit').get(getBootcampsInRadiusKm);

router
  .route('/:id/photo')
  .put(protect, authorize('publisher', 'admin'), fileUpload);
router.route('/:id/upload').post(protect, profilePictureUpload);
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
  .post(protect, authorize('publisher', 'admin'), createBootcamp);
router
  .route('/:id')
  .get(getBootcamp)
  .put(protect, authorize('publisher', 'admin'), updateBootcamp)
  .delete(protect, authorize('publisher', 'admin'), deleteBootcamp);

module.exports = router;
