const express = require("express") ;
const { creditWallet , debitWalletTransaction } = require("../Controllers/walletController") ;
const { authMiddleware } = require("../Middlewares/authMiddleware") ;

const router = express.Router();

router.post( "/credit" , authMiddleware , creditWallet ) ;
router.post( "/debit" , authMiddleware , debitWalletTransaction ) ;

module.exports = router ;