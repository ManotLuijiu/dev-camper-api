const ErrorResponse = require('../util/errorResponse');
const asyncHandler = require('../util/async');
const Course = require('../models/Course');

exports.getCourses = asyncHandler(async (req, res, next) => {
  let query;

  if (req.params.bootcampId) {
    query = Course.find({ bootcamp: req.params.bootcampId });
  } else {
    query = Course.find().populate({
      path: 'bootcamp',
      select: 'name description',
    });
  }

  const courses = await query;

  res.status(200).json({ success: true, count: courses.length, data: courses });
});

exports.getCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id).populate({
    path: 'bootcamp',
    select: 'name description',
  });

  if (!course) {
    return next(
      new ErrorResponse(`No course with the id ${req.params.id}`),
      404
    );
  }

  res.status(200).json({ success: true, data: course });
});
