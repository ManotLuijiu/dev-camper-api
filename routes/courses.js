const express = require('express');
const controllers = require('../controllers/courses');
const { getCourses, getCourse, addCourse, updateCourse, deleteCourse } =
  controllers;

const router = express.Router({ mergeParams: true });

router.route('/').get(getCourses).post(addCourse);
router.route('/:id').get(getCourse).put(updateCourse).delete(deleteCourse);

module.exports = router;
