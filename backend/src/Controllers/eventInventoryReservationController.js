const eventInventoryReservationService = require("../Services/eventInventoryReservationService");

const createEventReservation = async (req, res) => {
    try {
        const { inventoryId } = req.params;
        const { quantity } = req.body;
        const { id } = req.user;

        const reservation = await eventInventoryReservationService.createEventReservation({
            userId : id,
            inventoryId,
            quantity
        });

        return res.status(201).json({
            success: true,
            message: "Reservation created successfully",
            data: reservation
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
    createEventReservation
};