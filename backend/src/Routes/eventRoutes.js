const express = require("express") ;
const { createEvent , getEventById , getEvents , updateEvent , deleteEvent , updateEventStatus } = require("../Controllers/eventController") ;
const { authMiddleware } = require("../Middlewares/authMiddleware") ;
const { authorizeRoleMiddleware } = require("../Middlewares/authorizeRoleMiddleware") ;

const router = express.Router();

router.post("/" , authMiddleware , authorizeRoleMiddleware("ADMIN") , createEvent) ;
router.get("/" , authMiddleware ,  getEvents) ;
router.get("/:eventId" , authMiddleware , getEventById) ;
router.patch("/:eventId" , authMiddleware , authorizeRoleMiddleware("ADMIN") , updateEvent) ;
router.delete("/:eventId" , authMiddleware , authorizeRoleMiddleware("ADMIN") , deleteEvent) ;
router.patch("/:eventId/status" , authMiddleware , authorizeRoleMiddleware("ADMIN") , updateEventStatus) ;

module.exports = router ;