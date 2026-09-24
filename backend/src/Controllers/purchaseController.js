const purchaseService = require("../Services/purchaseService");

const createPurchase = async (req, res) => {
    try {
        const {
            eventId,
            inventoryId,
            reservationId
        } = req.params;

        const { id: userId } = req.user;

        const purchase = await purchaseService.createPurchase({
            userId,
            eventId,
            inventoryId,
            reservationId
        });

        return res.status(201).json({
            success: true,
            message: "Purchase created successfully",
            data: purchase
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
    createPurchase
};