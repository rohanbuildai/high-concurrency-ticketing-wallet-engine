const express = require("express") ;
const { createEventReservation } = require("../Controllers/eventInventoryReservationController") ;
const { authMiddleware } = require("../Middlewares/authMiddleware") ;

const router = express.Router();

router.post( "/:eventId/inventory/:inventoryId/reservations" , authMiddleware , createEventReservation ) ;

module.exports = router ;