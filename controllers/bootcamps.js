const Bootcamp = require('../models/Bootcamp');
const asyncHandler = require('../util/async');
const geocoder = require('../util/geocoder');
const ErrorResponse = require('../util/errorResponse');
const logger = require('../util/logger');

exports.getBootcamps = asyncHandler(async (req, res, next) => {
  let query;

  const reqQuery = { ...req.query };

  const removeFields = ['select', 'sort', 'page', 'limit'];

  removeFields.forEach((param) => {
    delete reqQuery[param];
  });

  let queryStr = JSON.stringify(reqQuery);

  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );

  query = Bootcamp.find(JSON.parse(queryStr)).populate('courses');

  // Select fields
  if (req.query.select) {
    const qrSelect = req.query.select;
    const fields = qrSelect.split(',').join(' ');
    query = query.select(fields);
  }

  // Sort fields
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt');
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 25;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Bootcamp.countDocuments();

  query = query.skip(startIndex).limit(limit);

  const bootcamps = await query;

  // Pagination results
  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  res.status(200).json({
    success: true,
    count: bootcamps.length,
    pagination,
    data: bootcamps,
  });
});

exports.getBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);
  res.status(200).json({ success: true, data: bootcamp });
});

exports.createBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.create(req.body);
  res.status(201).json({ success: true, data: bootcamp });
});

exports.updateBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with if of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({ success: true, data: bootcamp });
});

exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with if of ${req.params.id}`, 404)
    );
  }

  bootcamp.remove();

  res.status(200).json({ success: true, data: {} });
});

// GET /api/v1/bootcamps/radius/:zipcode/:distance
exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params;

  // Get lat/lng from geocoder
  const loc = await geocoder.geocode(zipcode);
  const lat = loc[0].latitude;
  const lng = loc[0].longitude;

  // Calc radius using radians
  // Divide dist by radius of Earth
  // Earth Radius = 3,963 mi / 6,378 km
  const radiusMi = distance / 3963;
  const radiusKm = distance / 6378;

  const bootcamps = await Bootcamp.find({
    location: { $geoWithin: { $centerSphere: [[lng, lat], radiusMi] } },
  });

  console.log('Mi', distance);
  console.log('Mi', radiusMi);
  console.log('KM', radiusKm);

  res
    .status(200)
    .json({ success: true, count: bootcamps.length, data: bootcamps });
});

// GET /api/v1/bootcamps/radius/:zipcode/:distance/:unit
exports.getBootcampsInRadiusKm = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params;

  // Get lat/lng from geocoder
  const loc = await geocoder.geocode(zipcode);
  const lat = loc[0].latitude;
  const lng = loc[0].longitude;

  // Calc radius using radians
  // Divide dist by radius of Earth
  // Earth Radius = 3,963 mi / 6,378 km
  const radiusMi = distance / 3963;
  const radiusKm = distance / 6378;

  const bootcamps = await Bootcamp.find({
    location: { $geoWithin: { $centerSphere: [[lng, lat], radiusKm] } },
  });

  console.log('KM: ', distance);
  console.log('KM: ', radiusKm);
  console.log('Mi: ', radiusMi);

  res
    .status(200)
    .json({ success: true, count: bootcamps.length, data: bootcamps });
});
