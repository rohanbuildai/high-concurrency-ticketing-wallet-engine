const purchaseService = require("../Services/purchaseService");

const createPurchase = async (req, res) => {
    try {
        const {
            eventId,
            inventoryId,
            reservationId
        } = req.params;

        const { id } = req.user;
        const idempotencyKey = req.get("Idempotency-Key");

        const purchase = await purchaseService.createPurchase({
            userId : id,
            eventId,
            inventoryId,
            reservationId ,
            idempotencyKey
        });

        return res.status(purchase.status).json(purchase.body);

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