const express = require("express") ;
const { creditWallet , debitWallet } = require("../Controllers/walletController") ;
const { authMiddleware } = require("../Middlewares/authMiddleware") ;
const { authorizeRoleMiddleware } = require("../Middlewares/authorizeRoleMiddleware") ;

const router = express.Router();

router.post( "/credit" , authMiddleware , creditWallet ) ;
router.post( "/debit" , authMiddleware , debitWallet ) ;

module.exports = router ;