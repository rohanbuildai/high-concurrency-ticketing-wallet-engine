const getIdempotencyKey = async ({
    client,
    userId,
    idempotencyKey
}) => {
    const query = `
        SELECT
            id,
            user_id,
            idempotency_key,
            purchase_id,
            response_status,
            response_body,
            created_at
        FROM idempotency_keys
        WHERE user_id = $1
          AND idempotency_key = $2;
    `;

    const values = [userId, idempotencyKey];

    const result = await client.query(query, values);

    return result.rows[0];
};

const createIdempotencyKey = async ({
    client,
    userId,
    idempotencyKey,
    purchaseId,
    responseStatus,
    responseBody
}) => {
    const query = `
        INSERT INTO idempotency_keys (
            user_id,
            idempotency_key,
            purchase_id,
            response_status,
            response_body
        )
        VALUES ($1, $2, $3, $4, $5)
        RETURNING
            id,
            user_id,
            idempotency_key,
            purchase_id,
            response_status,
            response_body,
            created_at;
    `;

    const values = [
        userId,
        idempotencyKey,
        purchaseId,
        responseStatus,
        responseBody
    ];

    const result = await client.query(query, values);

    return result.rows[0];
};

module.exports = {
    getIdempotencyKey,
    createIdempotencyKey
};