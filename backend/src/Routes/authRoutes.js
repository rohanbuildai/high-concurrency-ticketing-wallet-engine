const express = require("express") ;
const { registerUser , loginUser , refreshAccessToken , getCurrentUser } = require("../Controllers/authController") ;
const { authMiddleware } = require("../Middlewares/authMiddleware") ;
const { authorizeRoleMiddleware } = require("../Middlewares/authorizeRoleMiddleware") ;

const router = express.Router() ;

router.post( "/register" , registerUser ) ;
router.post( "/login" , loginUser ) ;
router.post( "/refresh" , refreshAccessToken ) ;
router.get( "/me" , authMiddleware ,  getCurrentUser ) ;


router.get(
    "/admin-test",
    authMiddleware,
    authorizeRoleMiddleware("ADMIN"),
    (req, res) => {
        return res.status(200).json({
            success: true,
            message: "Admin access granted",
        });
    }
);

module.exports = router ;