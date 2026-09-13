const pool = require("../config/db") ;

const createRefreshToken = async ( { client = pool , userId , tokenHash , expiresAt } ) => {

    const query = `
    INSERT INTO refresh_tokens(user_id , token_hash , expires_at)
    VALUES($1 , $2 , $3)
    RETURNING *;` ;

    const values = [ userId , tokenHash , expiresAt ] ;

    const result = await pool.query( query , values ) ;

    return result.rows[0] ;
}

const getRefreshTokenByHash = async ( { client , refreshTokenHash } ) => {

    const query = `
    SELECT * FROM refresh_tokens
    WHERE token_hash = $1;` ;

    const values = [ refreshTokenHash ] ;

    const result = await client.query( query , values ) ;

    return result.rows[0] ;
}

const revokeRefreshToken = async ( { client , tokenId } ) => {

    const query = `
    UPDATE refresh_tokens
    SET
        revoked_at = NOW(),
        last_used_at = NOW()
    WHERE id = $1
    AND revoked_at IS NULL
    RETURNING *;` ;

    const value = [ tokenId ] ;

    const result = await client.query( query , value ) ;

    return result.rows[0] ;
}

const setReplacedByToken = async ( { client , tokenId , replacedByTokenId } ) => {

    const query = `
    UPDATE refresh_tokens
    SET replaced_by_token_id = $1
    WHERE id = $2
    RETURNING *;` ;

    const values = [ replacedByTokenId , tokenId ] ;

    const result = await client.query( query , values ) ;

    return result.rows[0] ;
}

module.exports = {
    createRefreshToken ,
    getRefreshTokenByHash ,
    revokeRefreshToken ,
    setReplacedByToken
}