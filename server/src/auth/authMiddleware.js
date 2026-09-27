const {
  verifyToken
} = require("./authManager");


function requireAuth(req, res, next) {

  const authHeader =
    req.headers.authorization;

  if (!authHeader) {

    return res.status(401).json({
      error: "Authentication required"
    });

  }

  const parts =
    authHeader.split(" ");

  if (
    parts.length !== 2 ||
    parts[0] !== "Bearer"
  ) {

    return res.status(401).json({
      error: "Invalid authorization header"
    });

  }

  const token = parts[1];

  const decoded =
    verifyToken(token);

  if (!decoded) {

    return res.status(401).json({
      error: "Invalid or expired token"
    });

  }

  req.user = decoded;

  next();

}


function requireRole(...roles) {

  return (req, res, next) => {

    if (!req.user) {

      return res.status(401).json({
        error: "Authentication required"
      });

    }

    if (!roles.includes(req.user.role)) {

      return res.status(403).json({
        error: "Insufficient permissions"
      });

    }

    next();

  };

}


module.exports = {
  requireAuth,
  requireRole
};