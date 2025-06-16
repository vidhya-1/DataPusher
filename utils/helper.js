const { body, validationResult } = require("express-validator");

const authorizeRole = (...allowedRoles) => {
  return (req, res, next) => {
    // Middleware to check if the user has the required role
    const userRole = req.headers["x-user-role"];
    if (!userRole) {
      return res.status(403).json({ message: "User role not found" });
    }

    if (!allowedRoles.includes(userRole)) {
      return res
        .status(403)
        .json({ message: "Access denied: insufficient permissions" });
    }

    next();
  };
};

const validateAccount = [
  body("email")
    .isEmail()
    .withMessage("Invalid email format")
    .notEmpty()
    .withMessage("Email is required"),
  body("account_name").notEmpty().withMessage("Account name is required"),
  body("account_id").notEmpty().withMessage("Account ID is required"),
];

const validateDestination = [
  body("url")
    .notEmpty()
    .withMessage("URL is required")
    .isURL()
    .withMessage("Invalid URL format"),
  body("http_method")
    .notEmpty()
    .withMessage("HTTP method is required")
    .isIn(["GET", "POST", "PUT", "DELETE"])
    .withMessage("Invalid HTTP method"),
  body("headers")
    .optional()
    .isObject()
    .withMessage("Headers must be an object"),
  body("account_id").notEmpty().withMessage("Account ID is required"),
];

const validateUser = [
  body("email")
    .isEmail()
    .withMessage("Invalid email format")
    .notEmpty()
    .withMessage("Email is required"),
  body("passwordValue")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];

const validateAccountMember = [
  body("role_id")
    .notEmpty()
    .withMessage("Role ID is required")
    .isInt()
    .withMessage("Role ID must be an integer")
    .toInt(),
  body("account_id")
    .notEmpty()
    .withMessage("Account ID is required")
    .isInt()
    .withMessage("Account ID must be an integer")
    .toInt(),
  body("user_id")
    .isInt()
    .withMessage("User ID must be an integer")
    .notEmpty()
    .withMessage("User ID is required")
    .toInt(),
];

const validationResultMiddleware = (req, res) => {
  // Middleware to handle validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
};

module.exports = {
  authorizeRole,
  validateAccount,
  validationResultMiddleware,
  validateDestination,
  validateUser,
  validateAccountMember,
};
