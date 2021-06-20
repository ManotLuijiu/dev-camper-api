const express = require('express');
const controllers = require('../controllers/courses');
const { getCourses, getCourse } = controllers;

const router = express.Router({ mergeParams: true });

router.route('/').get(getCourses);
router.route('/:id').get(getCourse);

module.exports = router;
