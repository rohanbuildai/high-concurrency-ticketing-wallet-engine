const pool = require("../config/db");

const getEventInventoryForUpdate = async ( { client, inventoryId } ) => {
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
        WHERE id = $1
        FOR UPDATE;
    `;

    const values = [ inventoryId ] ;

    const result = await client.query( query , values ) ;

    return result.rows[0] ;
};

const decreaseInventoryAvailableQuantity = async ({
    client,
    inventoryId,
    quantity
}) => {
    const query = `
        UPDATE event_inventory
        SET
            available_quantity = available_quantity - $1,
            updated_at = NOW()
        WHERE id = $2
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

    const values = [ quantity , inventoryId ] ;

    const result = await client.query( query , values ) ;

    return result.rows[0] ;
};

const createEventReservation = async ({
    client,
    userId,
    inventoryId,
    quantity,
    expiresAt
}) => {
    const query = `
        INSERT INTO reservations (
            user_id,
            inventory_id,
            quantity,
            status,
            expires_at
        )
        VALUES ($1, $2, $3, 'HELD', $4)
        RETURNING
            id,
            user_id,
            inventory_id,
            quantity,
            status,
            expires_at,
            created_at,
            updated_at;
    `;

    const values = [
        userId,
        inventoryId,
        quantity,
        expiresAt
    ];

    const result = await client.query( query , values ) ;

    return result.rows[0] ;
};

const getEventInventoryReservationById = async ( { reservationId } ) => {
    const query = `
        SELECT
            id,
            user_id,
            inventory_id,
            quantity,
            status,
            expires_at,
            created_at,
            updated_at
        FROM reservations
        WHERE id = $1;
    `;

    const values = [ reservationId ] ;

    const result = await pool.query( query , values ) ;
 
    return result.rows[0] ;
};

const getExpiredReservations = async ( { client, limit } ) => {
    const query = `
        SELECT
            id,
            user_id,
            inventory_id,
            quantity,
            status,
            expires_at,
            created_at,
            updated_at
        FROM reservations
        WHERE status = 'HELD'
          AND expires_at <= NOW()
        ORDER BY expires_at ASC
        LIMIT $1
        FOR UPDATE SKIP LOCKED;
    `;

    const value = [ limit ] ;

    const result = await client.query( query, value ) ;

    return result.rows ;
};

const increaseInventoryAvailableQuantity = async ({
    client,
    inventoryId,
    quantity
}) => {
    const query = `
        UPDATE event_inventory
        SET
            available_quantity = available_quantity + $1,
            updated_at = NOW()
        WHERE id = $2
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

    const values = [ quantity , inventoryId ] ;

    const result = await client.query( query , values ) ;

    return result.rows[0];
};

const markReservationAsExpired = async ({
    client,
    reservationId
}) => {
    const query = `
        UPDATE reservations
        SET
            status = 'EXPIRED',
            updated_at = NOW()
        WHERE id = $1
          AND status = 'HELD'
        RETURNING
            id,
            user_id,
            inventory_id,
            quantity,
            status,
            expires_at,
            created_at,
            updated_at;
    `;

    const values = [ reservationId ] ;

    const result = await client.query( query , values ) ;

    return result.rows[0];
};

const getReservationForUpdate = async ({
    client,
    reservationId
}) => {
    const query = `
        SELECT
            id,
            user_id,
            inventory_id,
            quantity,
            status,
            expires_at,
            created_at,
            updated_at
        FROM reservations
        WHERE id = $1
        FOR UPDATE;
    `;

    const value = [ reservationId ] ;

    const result = await client.query( query, value ) ;

    return result.rows[0];
};

const confirmReservation = async ({
    client,
    reservationId
}) => {
    const query = `
        UPDATE reservations
        SET
            status = 'CONFIRMED',
            updated_at = NOW()
        WHERE id = $1
          AND status = 'HELD'
        RETURNING
            id,
            user_id,
            inventory_id,
            quantity,
            status,
            expires_at,
            created_at,
            updated_at;
    `;

    const value = [ reservationId ] ;

    const result = await client.query(query, value) ;

    return result.rows[0];
};

module.exports = {
    getEventInventoryForUpdate ,
    decreaseInventoryAvailableQuantity ,
    createEventReservation ,
    getEventInventoryReservationById ,
    getExpiredReservations ,
    increaseInventoryAvailableQuantity ,
    markReservationAsExpired ,
    getReservationForUpdate ,
    confirmReservation
}