const jwt = require('jsonwebtoken');
const asyncHandler = require('../util/async');
const ErrorResponse = require('../util/errorResponse');
const User = require('../models/User');

// Protect routes
exports.protect = asyncHandler(async (req, res, next) => {
  let token;
  const authHeaders = req.headers.authorization;
  console.log(req.headers);
  console.log(authHeaders);
  // const tokenCookies = req.cookies.token;

  if (authHeaders && authHeaders.startsWith('Bearer')) {
    // Set token from Bearer token in header
    token = authHeaders.split(' ')[1];
    // Set token from cookies
  }
  // else if (req.cookies.token) {
  //   token = tokenCookies;
  // }

  // Make sure token exists
  if (!token) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log(decoded);

    req.user = await User.findById(decoded.id);

    next();
  } catch (error) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }
});

// Grant access to specific roles
exports.authorize = (...roles) => {
  console.log(...roles);
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(
          `User role ${req.user.role} is not authorized to access`,
          403
        )
      );
    }
    next();
  };
};
