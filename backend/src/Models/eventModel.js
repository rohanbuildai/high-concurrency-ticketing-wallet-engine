const pool = require("../config/db") ;

const createEvent = async ( { name , description , venue , eventDate , status , createdBy } ) => {

    const query = `
    INSERT INTO events( name , description , venue , event_date , status , created_by )
    VALUES ($1 , $2 , $3 , $4 , $5 , $6)
    RETURNING id , name , description , venue , event_date , status , created_by , created_at , updated_at ;` ;

    const values = [ name , description , venue , eventDate , status , createdBy ] ;

    const result = await pool.query( query , values ) ;

    return result.rows[0] ;
}

const getEventById = async ( { eventId } ) => {

    const query = `
    SELECT id , name , description , venue , event_date , status , created_by , created_at , updated_at
    FROM events WHERE 
    id = $1 ;` ;

    const value = [ eventId ]  ;

    const result = await pool.query( query , value ) ;

    return result.rows[0] ;
}

const getEvents = async ( { limit , offset } ) => {

    const query = `
    SELECT id , name , description , venue , event_date , status , created_by , created_at , updated_at
    FROM events
    ORDER BY event_date ASC
    LIMIT $1
    OFFSET $2 ;` ;

    const values = [ limit , offset ] ;

    const result = await pool.query( query, values ) ;

    return result.rows ;
}

module.exports = {
    createEvent ,
    getEventById ,
    getEvents
}