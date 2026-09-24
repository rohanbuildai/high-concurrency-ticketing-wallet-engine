const express = require("express") ;
const { creditWallet } = require("../Controllers/walletController") ;
const { authMiddleware } = require("../Middlewares/authMiddleware") ;
const { authorizeRoleMiddleware } = require("../Middlewares/authorizeRoleMiddleware") ;

const router = express.Router();

router.post( "/credit" , authMiddleware , creditWallet ) ;

module.exports = router ;