const express = require("express") ;
const { registerUser , loginUser , refreshAccessToken , getCurrentUser } = require("../Controllers/authController") ;
const { authMiddleware } = require("../Middlewares/authMiddleware") ;

const router = express.Router() ;

router.post( "/register" , registerUser ) ;
router.post( "/login" , loginUser ) ;
router.post( "/refresh" , refreshAccessToken ) ;
router.get( "/me" , authMiddleware ,  getCurrentUser ) ;

module.exports = router ;