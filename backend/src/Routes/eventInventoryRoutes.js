const express = require("express") ;
const { createEventInventory , getEventInventoryById } = require("../Controllers/eventInventoryController") ;
const { authMiddleware } = require("../Middlewares/authMiddleware") ;
const { authorizeRoleMiddleware } = require("../Middlewares/authorizeRoleMiddleware") ;

const router = express.Router();

router.post( "/:eventId/inventory" , authMiddleware , authorizeRoleMiddleware("ADMIN") , createEventInventory) ;
router.get( "/:eventId/inventory/:inventoryId" , authMiddleware , getEventInventoryById ) ;

module.exports = router ;