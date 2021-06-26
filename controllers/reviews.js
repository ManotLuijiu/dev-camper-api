const ErrorResponse = require('../util/errorResponse');
const asyncHandler = require('../util/async');
const Review = require('../models/Review');
const Bootcamp = require('../models/Bootcamp');

// Get reviews
// GET /api/v1/reviews
// GET /api/v1/bootcamps/:bootcampId/reviews
exports.getReviews = asyncHandler(async (req, res, next) => {
  if (req.params.bootcampId) {
    const reviews = await Review.find({ bootcamp: req.params.bootcampId });

    return res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } else {
    res.status(200).json(res.advancedResults);
  }
});
