const path = require('path');
const Bootcamp = require('../models/Bootcamp');
const asyncHandler = require('../util/async');
const geocoder = require('../util/geocoder');
const ErrorResponse = require('../util/errorResponse');
const logger = require('../util/logger');
const upload = require('../util/ImageUpload');

// const singleUpload = upload.single('image');
// console.group('singleUpload:');
// console.log(singleUpload);
// console.groupEnd();

exports.getBootcamps = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
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

// File upload for bootcamp
// PUT /api/v1/bootcamps/:id/photo
exports.fileUpload = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }

  if (!req.files) {
    return next(new ErrorResponse('Please upload a file', 400));
  }

  const { file } = req.files;

  // Make sure the image is a photo file
  if (!file.mimetype.startsWith('image')) {
    return next(new ErrorResponse(`Please upload an image file`, 400));
  }

  // Check file size
  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new ErrorResponse(
        `Please upload a smaller file(max:${process.env.MAX_FILE_UPLOAD})`,
        400
      )
    );
  }

  // Create custom filename
  file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (error) => {
    if (error) {
      console.error(error);
      return next(new ErrorResponse(`Problem with file upload`, 500));
    }

    await Bootcamp.findByIdAndUpdate(req.params.id, { photo: file.name });

    res.status(200).json({ success: true, data: file.name });
  });
});

// File upload for bootcamp
// PUT /api/v1/bootcamps/:id/upload
exports.profilePictureUpload = asyncHandler(async (req, res, next) => {
  const bid = req.params.id;
  const singleUpload = upload.fields([
    { name: 'avatar', maxCount: 1 },
    { name: 'gallery', maxCount: 8 },
  ]);
  // console.log('Storage', upload.storage.s3);
  // console.log(singleUpload);
  // console.log(req.files.fileUpload.name);
  // const filename = req.files.fileUpload.name;
  // console.log('request', req.file);
  console.log('req.files', req.files);

  singleUpload(req, res, function (err) {
    if (err) {
      return res.json({ success: false });
    }
  });

  // let update = { profilePicture: filename };

  // await Bootcamp.findByIdAndUpdate(bid, update, { new: true });

  // console.log('response', res);

  res.send(`Successfully uploaded `);
  // res.status(200).json({ success: true });
});

// exports.profileUpload = asyncHandler(async (req, res, next) => {

//   // Upload to s3
//   singleUpload(req, res, function (err) {
//     if (err) {
//       return res.json({
//         success: false,
//         errors: {
//           title: 'Image Upload Error',
//           detail: err.message,
//           error: err,
//         },
//       });
//     }

//     let update = { profilePicture: req.file.location };
//     await Bootcamp.findByIdAndUpdate(req.params.id, update);

//     res.status(200).json({ success: true, data: req.file.location });
//   });
// });
