const eventModel = require("../Models/eventModel");

const createEvent = async ({
    name,
    description,
    venue,
    eventDate,
    createdBy
}) => {

    if (!name || !venue || !eventDate) {
        throw new Error("Name, venue and event date are required");
    }

    const event = await eventModel.createEvent({
        name,
        description,
        venue,
        eventDate,
        status: "DRAFT",
        createdBy
    });

    return event;
};

const getEventById = async ({ eventId }) => {

    if (!eventId) {
        throw new Error("Event ID is required");
    }

    const event = await eventModel.getEventById({
        eventId
    });

    if (!event) {
        throw new Error("Event not found");
    }

    return event;
};

const getEvents = async ( { page = 1 , limit = 20 } ) => {

    if ( page < 1 ) {
        throw new Error("Page must be greater than 0") ;
    }

    if ( limit < 1 || limit > 100 ) {
        throw new Error("Limit must be between 1 and 100") ;
    }

    const offset = ( page - 1 ) * limit ;

    const events = await eventModel.getEvents({
        limit ,
        offset
    })

    return events ;
}

module.exports = {
    createEvent,
    getEventById ,
    getEvents
};