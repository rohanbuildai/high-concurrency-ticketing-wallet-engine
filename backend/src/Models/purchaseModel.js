const pool = require("../config/db");

const createPurchase = async ({
    client,
    userId,
    reservationId,
    amount
}) => {
    const query = `
        INSERT INTO purchases (
            user_id,
            reservation_id,
            amount,
            status
        )
        VALUES ($1, $2, $3, 'COMPLETED')
        RETURNING
            id,
            user_id,
            reservation_id,
            amount,
            status,
            created_at,
            updated_at;
    `;

    const values = [ userId , reservationId , amount ] ;

    const result = await client.query( query, values ) ;

    return result.rows[0];
};

const getPurchaseByReservationId = async ({
    client,
    reservationId
}) => {
    const query = `
        SELECT
            id,
            user_id,
            reservation_id,
            amount,
            status,
            created_at,
            updated_at
        FROM purchases
        WHERE reservation_id = $1;
    `;

    const value = [ reservationId ] ;

    const result = await client.query( query, value ) ;

    return result.rows[0];
};

module.exports = {
    createPurchase,
    getPurchaseByReservationId
};