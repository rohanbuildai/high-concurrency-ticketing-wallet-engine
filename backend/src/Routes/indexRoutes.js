const express = require("express") ;
const healthRoutes = require("./healthRoutes") ;
const authRoutes = require("./authRoutes") ;
const eventRoutes = require("./eventRoutes") ;

const router = express.Router() ;

router.use( "/" , healthRoutes ) ;
router.use( "/auth" , authRoutes ) ;
router.use( "/events" , eventRoutes ) ;

module.exports = router ;