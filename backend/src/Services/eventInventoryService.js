const eventModel = require("../Models/eventModel");
const eventInventoryModel = require("../Models/eventInventoryModel");

const createEventInventory = async ({
    eventId,
    ticketType,
    totalQuantity,
    price
}) => {
    if (!eventId) {
        throw new Error("Event ID is required");
    }

    if (!ticketType) {
        throw new Error("Ticket type is required");
    }

    if (!totalQuantity || totalQuantity <= 0) {
        throw new Error("Total quantity must be greater than 0");
    }

    if (price === undefined || price < 0) {
        throw new Error("Price cannot be negative");
    }

    const event = await eventModel.getEventById({
        eventId
    });

    if (!event) {
        throw new Error("Event not found");
    }

    if (event.status !== "DRAFT") {
        throw new Error(
            "Inventory can only be created for draft events"
        );
    }

    const inventory = await eventInventoryModel.createEventInventory({
        eventId,
        ticketType,
        totalQuantity,
        availableQuantity: totalQuantity,
        price
    });

    return inventory ;
};

const getEventInventoryById = async ( { inventoryId } ) => {
    if (!inventoryId) {
        throw new Error("Inventory ID is required");
    }

    const inventory = await eventInventoryModel.getEventInventoryById({
        inventoryId
    });

    if (!inventory) {
        throw new Error("Inventory not found");
    }

    return inventory ;
};

module.exports = {
    createEventInventory ,
    getEventInventoryById
}