const walletService = require("../Services/walletService");

const creditWallet = async (req, res) => {
    try {
        const { id } = req.user;
        const { amount } = req.body;

        const wallet = await walletService.creditWallet({
            userId : id,
            amount
        });

        return res.status(200).json({
            success: true,
            message: "Wallet credited successfully",
            data: wallet
        });
    } catch (error) {
        console.error(error);

        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

const debitWalletTransaction = async (req, res) => {
    try {
        const { id } = req.user;
        const { amount } = req.body;

        const wallet = await walletService.debitWalletTransaction({
            userId : id,
            amount
        });

        return res.status(200).json({
            success: true,
            message: "Wallet debited successfully",
            data: wallet
        });
    } catch (error) {
        console.error(error);

        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    creditWallet ,
    debitWalletTransaction
};