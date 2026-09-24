const walletModel = require("../Models/walletModel");
const pool = require("../config/db") ;

const createWallet = async ( { client, userId } ) => {
    if (!userId) {
        throw new Error("User ID is required");
    }

    const existingWallet = await walletModel.getWalletByUserId({
        client ,
        userId
    });

    if (existingWallet) {
        throw new Error("Wallet already exists");
    }

    const wallet = await walletModel.createWallet({
        client,
        userId
    });

    return wallet;
};

const creditWallet = async ({ userId, amount }) => {
    if (!userId) {
        throw new Error("User ID is required");
    }

    if (!Number.isInteger(amount) || amount <= 0) {
        throw new Error("Amount must be a positive integer");
    }

    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        const wallet = await walletModel.getWalletForUpdate({
            client,
            userId
        });

        if (!wallet) {
            throw new Error("Wallet not found");
        }

        const updatedWallet =
            await walletModel.increaseWalletBalance({
                client,
                walletId: wallet.id,
                amount
            });

        await walletModel.createLedgerEntry({
            client,
            walletId: wallet.id,
            transactionType: "SIMULATED_CREDIT",
            amount,
            balanceAfter: updatedWallet.balance
        });

        await client.query("COMMIT");

        return updatedWallet;
    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
};

const debitWallet = async ( { userId, amount } ) => {
    if (!userId) {
        throw new Error("User ID is required");
    }

    if (!Number.isInteger(amount) || amount <= 0) {
        throw new Error("Amount must be a positive integer");
    }

    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        const wallet = await walletModel.getWalletForUpdate({
            client,
            userId
        });

        if (!wallet) {
            throw new Error("Wallet not found");
        }

        if (wallet.balance < amount) {
            throw new Error("Insufficient wallet balance");
        }

        const updatedWallet =
            await walletModel.decreaseWalletBalance({
                client,
                walletId: wallet.id,
                amount
            });

        await walletModel.createLedgerEntry({
            client,
            walletId: wallet.id,
            transactionType: "TICKET_PURCHASE",
            amount,
            balanceAfter: updatedWallet.balance
        });

        await client.query("COMMIT");

        return updatedWallet;
    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
};

module.exports = {
    createWallet ,
    creditWallet ,
    debitWallet
};