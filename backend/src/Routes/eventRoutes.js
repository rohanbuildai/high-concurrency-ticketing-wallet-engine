const express = require("express") ;
const { createEvent , getEventById , getEvents , updateEvent } = require("../Controllers/eventController") ;
const { authMiddleware } = require("../Middlewares/authMiddleware") ;
const { authorizeRoleMiddleware } = require("../Middlewares/authorizeRoleMiddleware") ;

const router = express.Router();

router.post( "/" , authMiddleware , authorizeRoleMiddleware("ADMIN") , createEvent ) ;
router.get("/" , authMiddleware ,  getEvents) ;
router.get("/:eventId" , authMiddleware , getEventById ) ;
router.patch("/:eventId" , authMiddleware , authorizeRoleMiddleware("ADMIN") , updateEvent) ;

module.exports = router ;