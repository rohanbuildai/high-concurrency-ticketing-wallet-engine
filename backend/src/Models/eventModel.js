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

const updateEvent = async ( { eventId , name , description , venue , eventDate } ) => {

    const query = `
    UPDATE events
    SET name = $1,
        description = $2,
        venue = $3,
        event_date = $4,
        updated_at = NOW()
    WHERE id = $5
    RETURNING
        id,
        name,
        description,
        venue,
        event_date,
        status,
        created_by,
        created_at,
        updated_at;` ;

    const values = [
        name,
        description,
        venue,
        eventDate,
        eventId
    ];

    const result = await pool.query( query , values) ;

    return result.rows[0] ;
}

const deleteEvent = async ( { eventId } ) => {
    const query = `
        DELETE FROM events
        WHERE id = $1
        RETURNING
            id,
            name,
            description,
            venue,
            event_date,
            status,
            created_by,
            created_at,
            updated_at;
    `;

    const values = [ eventId ] ;

    const result = await pool.query( query , values ) ;

    return result.rows[0] ;
};

const updateEventStatus = async ({ eventId, status }) => {
    const query = `
        UPDATE events
        SET
            status = $1,
            updated_at = NOW()
        WHERE id = $2
        RETURNING
            id,
            name,
            description,
            venue,
            event_date,
            status,
            created_by,
            created_at,
            updated_at;
    `;

    const values = [status, eventId];

    const result = await pool.query(query, values);

    return result.rows[0];
};

module.exports = {
    createEvent ,
    getEventById ,
    getEvents ,
    updateEvent ,
    deleteEvent ,
    updateEventStatus
}