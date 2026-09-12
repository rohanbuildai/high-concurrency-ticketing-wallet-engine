const pool = require("../config/db") ;

const createRefreshToken = async ( { userId , tokenHash , expiresAt } ) => {

    const query = `
    INSERT INTO refresh_tokens(user_id , token_hash , expires_at)
    VALUES($1 , $2 , $3)
    RETURNING *;` ;

    const values = [ userId , tokenHash , expiresAt ] ;

    const result = await pool.query( query , values ) ;

    return result.rows[0] ;
}

module.exports = {
    createRefreshToken
}