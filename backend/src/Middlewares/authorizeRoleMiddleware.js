const authService = require("../Services/authService");

const authorizeRoleMiddleware = (...allowedRoles) => {
  return async (req, res, next) => {
    try {
      const { id } = req.user;

      const userRole = await authService.getUserRole({
        userId: id,
      });

      if ( !allowedRoles.includes(userRole.role) ) {
        return res.status(403).json({
          success: false,
          message: "You are not authorized to perform this action",
        });
      }

      next();

    } catch (error) {
      console.error(error);

      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
      
    }
  };
};

module.exports = {
  authorizeRoleMiddleware,
};
