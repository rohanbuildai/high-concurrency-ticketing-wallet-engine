const express = require("express") ;
const healthRoutes = require("./healthRoutes") ;
const authRoutes = require("./authRoutes") ;
const eventRoutes = require("./eventRoutes") ;
const eventInventoryRoutes = require("./eventInventoryRoutes") ;
const eventInventoryReservationRoutes = require("./eventInventoryReservationRoutes") ;
const walletRoutes = require("./walletRoutes") ;

const router = express.Router() ;

router.use( "/" , healthRoutes ) ;
router.use( "/auth" , authRoutes ) ;
router.use( "/events" , eventRoutes ) ;
router.use( "/events" , eventInventoryRoutes ) ;
router.use( "/events" , eventInventoryReservationRoutes ) ;
router.use( "/wallet" , walletRoutes ) ;

module.exports = router ;