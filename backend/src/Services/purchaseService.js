const pool = require("../config/db") ;
const reservationModel = require("../Models/eventInventoryReservationModel") ;
const walletService = require("./walletService") ;
const purchaseModel = require("../Models/purchaseModel") ;

const createPurchase = async ({
    userId,
    eventId ,
    inventoryId ,
    reservationId
}) => {
    if (!userId) {
        throw new Error("User ID is required");
    }

    if (!reservationId) {
        throw new Error("Reservation ID is required");
    }

    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        const reservation =
            await reservationModel.getReservationForUpdate({
                client,
                reservationId
            });

        if (!reservation) {
            throw new Error("Reservation not found");
        }

        if (reservation.user_id !== userId) {
            throw new Error("You are not authorized to purchase this reservation");
        }

        if (reservation.status !== "HELD") {
            throw new Error("Reservation is not available for purchase");
        }

        const inventory =
            await reservationModel.getEventInventoryForUpdate({
                client,
                inventoryId: reservation.inventory_id
            });

        if (String(inventory.id) !== String(inventoryId)) {
            throw new Error("Reservation does not belong to this inventory");
        }

        if (!inventory) {
            throw new Error("Inventory not found");
        }

        const purchaseAmount = Number(inventory.price) * reservation.quantity;

        console.log("Purchase amount:", purchaseAmount);

        await walletService.debitWallet({
            client,
            userId,
            amount: purchaseAmount
        });

        const purchase = await purchaseModel.createPurchase({
            client,
            userId,
            reservationId,
            amount: purchaseAmount
        });

        const confirmedReservation =
            await reservationModel.confirmReservation({
                client,
                reservationId
            });

        if (!confirmedReservation) {
            throw new Error("Reservation could not be confirmed");
        }

        await client.query("COMMIT");

        return purchase;

    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
};

module.exports = {
    createPurchase
};