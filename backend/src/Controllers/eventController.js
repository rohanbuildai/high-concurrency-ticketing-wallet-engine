const eventService = require("../Services/eventService");

const createEvent = async ( req , res) => {
    try {
        const { name, description, venue, eventDate } = req.body;
        const { id } = req.user;

        const event = await eventService.createEvent({
            name,
            description,
            venue,
            eventDate,
            createdBy : id
        });

        return res.status(201).json({
            success: true,
            message: "Event created successfully",
            data: event
        });
    } catch (error) {
        console.error(error);

        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

const getEventById = async ( req , res) => {
    try {
        const { eventId } = req.params;

        const event = await eventService.getEventById({
            eventId
        });

        return res.status(200).json({
            success: true,
            message: "Event fetched successfully",
            data: event
        });
    } catch (error) {
        console.error(error);

        return res.status(404).json({
            success: false,
            message: error.message
        });
    }
};

const getEvents = async ( req , res ) => {
    try {
        const { page } = req.query || 1;
        const { limit } = req.query || 20;

        const events = await eventService.getEvents({
            page,
            limit
        });

        return res.status(200).json({
            success: true,
            message: "Events fetched successfully",
            data: events
        });
    } catch (error) {
        console.error(error);

        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

const updateEvent = async (req, res) => {
    try {
        const { eventId } = req.params;
        const {
            name,
            description,
            venue,
            eventDate
        } = req.body;

        const updatedEvent = await eventService.updateEvent({
            eventId,
            name,
            description,
            venue,
            eventDate
        });

        return res.status(200).json({
            success: true,
            message: "Event updated successfully",
            data: updatedEvent
        });
    } catch (error) {
        console.error(error);

        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

const deleteEvent = async (req, res) => {
    try {
        const { eventId } = req.params;

        const deletedEvent = await eventService.deleteEvent({
            eventId
        });

        return res.status(200).json({
            success: true,
            message: "Event deleted successfully",
            data: deletedEvent
        });
    } catch (error) {
        console.error(error);

        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

const updateEventStatus = async (req, res) => {
    try {
        const { eventId } = req.params;
        const { status } = req.body;

        const updatedEventStatus = await eventService.updateEventStatus({
            eventId,
            status
        });

        return res.status(200).json({
            success: true,
            message: "Event status updated successfully",
            data: updatedEventStatus
        });
    } catch (error) {
        console.error(error);

        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    createEvent,
    getEventById ,
    getEvents ,
    updateEvent ,
    deleteEvent ,
    updateEventStatus
};