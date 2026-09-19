const eventInventoryService = require("../Services/eventInventoryService");

const createEventInventory = async (req, res) => {
    try {
        const { eventId } = req.params;
        const {
            ticketType,
            totalQuantity,
            price
        } = req.body;

        const inventory = await eventInventoryService.createEventInventory({
            eventId,
            ticketType,
            totalQuantity,
            price
        });

        return res.status(201).json({
            success: true,
            message: "Inventory created successfully",
            data: inventory
        });
    } catch (error) {
        console.error(error);

        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

const getEventInventoryById = async (req, res) => {
    try {
        const { inventoryId } = req.params;

        const inventory = await eventInventoryService.getEventInventoryById({
            inventoryId
        });

        return res.status(200).json({
            success: true,
            message: "Inventory fetched successfully",
            data: inventory
        });
    } catch (error) {
        console.error(error);

        return res.status(404).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    createEventInventory,
    getEventInventoryById
};