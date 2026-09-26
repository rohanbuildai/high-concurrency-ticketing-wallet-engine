const pool = require("../config/db") ;
const reservationModel = require("../Models/eventInventoryReservationModel") ;
const walletService = require("./walletService") ;
const purchaseModel = require("../Models/purchaseModel") ;
const idempotencyModel = require("../Models/idempotencyModel") ;

const createPurchase = async ({
    userId,
    eventId ,
    inventoryId ,
    reservationId ,
    idempotencyKey
}) => {

    const isIdempotencyConflict = (error) => {
        return (
            error.code === "23505" &&
            error.constraint === "unique_user_idempotency_key"
        );
    };

    if (!userId) {
        throw new Error("User ID is required");
    }

    if (!reservationId) {
        throw new Error("Reservation ID is required");
    }

    if (!idempotencyKey || typeof idempotencyKey !== "string") {
            throw new Error("Idempotency-Key header is required");
        }

    const normalizedIdempotencyKey = idempotencyKey.trim();

    if (!normalizedIdempotencyKey) {
        throw new Error("Idempotency-Key header is required");
    }

    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        const existingIdempotencyKey =
        await idempotencyModel.getIdempotencyKey({
            client,
            userId,
            idempotencyKey: normalizedIdempotencyKey
        });

        if (existingIdempotencyKey) {
            await client.query("COMMIT");

            return {
                status: existingIdempotencyKey.response_status,
                body: existingIdempotencyKey.response_body
            };
        }

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

        if (!inventory) {
            throw new Error("Inventory not found");
        }

        if (String(inventory.id) !== String(inventoryId)) {
            throw new Error("Reservation does not belong to this inventory");
        }

        const purchaseAmount = Number(inventory.price) * reservation.quantity;

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

        const responseBody = {
            success: true,
            message: "Purchase created successfully",
            data: purchase
        };

        await idempotencyModel.createIdempotencyKey({
            client,
            userId,
            idempotencyKey: normalizedIdempotencyKey,
            purchaseId: purchase.id,
            responseStatus: 201,
            responseBody
        });

        await client.query("COMMIT");

        return {
            status: 201,
            body: responseBody
        };

    } catch (error) {
        await client.query("ROLLBACK");

        if (isIdempotencyConflict(error)) {
            const existingClient = await pool.connect();

            try {
                const existingIdempotencyKey =
                    await idempotencyModel.getIdempotencyKey({
                        client: existingClient,
                        userId,
                        idempotencyKey: normalizedIdempotencyKey
                    });

                if (!existingIdempotencyKey) {
                    throw error;
                }

                return {
                    status: existingIdempotencyKey.response_status,
                    body: existingIdempotencyKey.response_body
                };
            } finally {
                existingClient.release();
            }
        }

        throw error;
    }finally {
        client.release();
    }
};

module.exports = {
    createPurchase
};