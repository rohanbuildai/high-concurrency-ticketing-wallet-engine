const pool = require("../config/db") ;

const getUserByEmail = async ( { email } ) => {

    const query = `
    SELECT * FROM users
    WHERE email = $1;` ;

    const value = [ email ] ;

    const result = await pool.query( query , value ) ;

    return result.rows[0] ;
}

const registerUser = async ( { name , email , password } ) => {

    const query = `

    INSERT INTO users(name , email , password_hash)
    VALUES($1 , $2 , $3)
    RETURNING id, name, email, created_at;
    ` ;

    const values = [ name , email , password ] ;

    const result = await pool.query( query , values ) ;

    return result.rows[0] ;
}

const getUserById = async ( { userId } ) => {

    const query = `
    SELECT id, name, email, status, created_at, updated_at, role
    FROM users
    WHERE id = $1;` ;

    const value = [ userId ] ;

    const result = await pool.query( query , value ) ;

    return result.rows[0] ;
}

const getUserRole = async ( { userId } ) => {

    const query = `
    SELECT role FROM
    users WHERE id = $1;` ;

    const value = [ userId ] ;

    const result = await pool.query( query , value ) ;

    return result.rows[0] ;
}


module.exports = {
    getUserByEmail ,
    registerUser ,
    getUserById ,
    getUserRole
}