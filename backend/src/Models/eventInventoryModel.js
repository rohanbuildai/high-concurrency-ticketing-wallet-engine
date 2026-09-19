const pool = require("../config/db");

const createEventInventory = async ({
    eventId,
    ticketType,
    totalQuantity,
    availableQuantity,
    price
}) => {
    const query = `
        INSERT INTO event_inventory (
            event_id,
            ticket_type,
            total_quantity,
            available_quantity,
            price
        )
        VALUES ($1, $2, $3, $4, $5)
        RETURNING
            id,
            event_id,
            ticket_type,
            total_quantity,
            available_quantity,
            price,
            created_at,
            updated_at;
    `;

    const values = [
        eventId,
        ticketType,
        totalQuantity,
        availableQuantity,
        price
    ];

    const result = await pool.query( query , values) ;

    return result.rows[0] ;
};

const getEventInventoryById = async ( { inventoryId } ) => {
    const query = `
        SELECT
            id,
            event_id,
            ticket_type,
            total_quantity,
            available_quantity,
            price,
            created_at,
            updated_at
        FROM event_inventory
        WHERE id = $1;
    `;

    const values = [ inventoryId ] ;

    const result = await pool.query( query , values);

    return result.rows[0] ;
};

module.exports = {
    createEventInventory,
    getEventInventoryById
};