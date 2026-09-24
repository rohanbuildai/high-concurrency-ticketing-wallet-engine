const express = require("express") ;
const { createPurchase } = require("../Controllers/purchaseController") ;
const { authMiddleware } = require("../Middlewares/authMiddleware") ;

const router = express.Router();

router.post( "/:eventId/inventory/:inventoryId/reservations/:reservationId/purchase" , authMiddleware , createPurchase ) ;

module.exports = router ;