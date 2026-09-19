const pool = require("../config/db") ;

const eventInventoryReservationModel = require("../Models/eventInventoryReservationModel") ;

const createEventReservation = async ( { userId , inventoryId , quantity } ) => {

    const client = await pool.connect();

    try {

        if ( !userId ) {
            throw new Error("User not found") ;
        }

        if ( !inventoryId ) {
            throw new Error("Inventory not found") ;
        }

        if (!Number.isInteger(quantity) || quantity <= 0) {
            throw new Error("Quantity must be a positive integer");
        }

        await client.query("BEGIN");

        const eventInventory = await eventInventoryReservationModel.getEventInventoryForUpdate({
            client ,
            inventoryId
        })

        if ( !eventInventory ) {
            throw new Error("Event inventory not found") ;
        }

        if ( eventInventory.available_quantity < quantity ) {
            throw new Error("Tickets have been sold out")
        }

        await eventInventoryReservationModel.decreaseInventoryAvailableQuantity({
            client ,
            inventoryId ,
            quantity
        })

        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

        const reservation = await eventInventoryReservationModel.createEventReservation({
            client ,
            userId ,
            inventoryId ,
            quantity ,
            expiresAt
        })

        await client.query("COMMIT");

        return reservation ;
    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
}

module.exports = {
    createEventReservation
}