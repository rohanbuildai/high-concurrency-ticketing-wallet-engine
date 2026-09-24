const pool = require("../config/db");

const createWallet = async ( { client = pool , userId } ) => {
    const query = `
        INSERT INTO wallets (
            user_id
        )
        VALUES ($1)
        RETURNING
            id,
            user_id,
            balance,
            created_at,
            updated_at;
    `;

    const value = [ userId ] ;

    const result = await client.query(query, value);

    return result.rows[0];
};

const getWalletByUserId = async ( { userId } ) => {
    const query = `
        SELECT
            id,
            user_id,
            balance,
            created_at,
            updated_at
        FROM wallets
        WHERE user_id = $1;
    `;

    const value = [ userId ] ;

    const result = await pool.query(query, value);

    return result.rows[0];
};

const getWalletForUpdate = async ({ client, userId }) => {
    const query = `
        SELECT
            id,
            user_id,
            balance,
            created_at,
            updated_at
        FROM wallets
        WHERE user_id = $1
        FOR UPDATE;
    `;

    const result = await client.query(query, [userId]);

    return result.rows[0];
};

const increaseWalletBalance = async ({
    client,
    walletId,
    amount
}) => {
    const query = `
        UPDATE wallets
        SET
            balance = balance + $1,
            updated_at = NOW()
        WHERE id = $2
        RETURNING
            id,
            user_id,
            balance,
            created_at,
            updated_at;
    `;

    const result = await client.query(query, [
        amount,
        walletId
    ]);

    return result.rows[0];
};

const createLedgerEntry = async ({
    client,
    walletId,
    transactionType,
    amount,
    balanceAfter,
    referenceType = null,
    referenceId = null
}) => {
    const query = `
        INSERT INTO wallet_ledger (
            wallet_id,
            transaction_type,
            amount,
            balance_after,
            reference_type,
            reference_id
        )
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING
            id,
            wallet_id,
            transaction_type,
            amount,
            balance_after,
            reference_type,
            reference_id,
            created_at;
    `;

    const result = await client.query(query, [
        walletId,
        transactionType,
        amount,
        balanceAfter,
        referenceType,
        referenceId
    ]);

    return result.rows[0];
};

module.exports = {
    createWallet,
    getWalletByUserId ,
    getWalletForUpdate ,
    increaseWalletBalance ,
    createLedgerEntry
};