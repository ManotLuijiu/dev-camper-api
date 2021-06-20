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
} = controllers;

// Include other resource routers
const courseRouter = require('./courses');

const router = express.Router();

// Re-route into other resource routers
router.use('/:bootcampId/courses', courseRouter);

router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius);
router.route('/radius/:zipcode/:distance/:unit').get(getBootcampsInRadiusKm);

router.route('/').get(getBootcamps).post(createBootcamp);
router
  .route('/:id')
  .get(getBootcamp)
  .put(updateBootcamp)
  .delete(deleteBootcamp);

module.exports = router;
