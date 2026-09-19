const express = require("express") ;
const { createEventReservation } = require("../Controllers/eventInventoryReservationController") ;
const { authMiddleware } = require("../Middlewares/authMiddleware") ;
const { authorizeRoleMiddleware } = require("../Middlewares/authorizeRoleMiddleware") ;

const router = express.Router();

router.post( "/:eventId/inventory/:inventoryId/reservations" , authMiddleware , createEventReservation ) ;

module.exports = router ;