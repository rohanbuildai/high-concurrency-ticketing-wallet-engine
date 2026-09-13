const express = require("express") ;
const { registerUser , loginUser , refreshAccessToken } = require("../Controllers/authController") ;

const router = express.Router() ;

router.post( "/register" , registerUser ) ;
router.post( "/login" , loginUser ) ;
router.post( "/refresh" , refreshAccessToken ) ;

module.exports = router ;