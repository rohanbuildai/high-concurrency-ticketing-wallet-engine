require("dotenv").config();

const app = require("./app");
const pool = require("./config/db") ;
const { startReservationExpirationWorker } = require("../src/workers/reservationExpirationWorker") ;

const PORT = process.env.PORT || 5000;

async function startServer()
{
    try{
        await pool.query("SELECT NOW()");

        console.log("✅ Database Connected");

        app.listen(PORT , ()=>{
            console.log(`server running on http://localhost:${PORT}`)
            startReservationExpirationWorker() ;
        });
    }
    catch(err){
        console.error("❌ database connection failed")
        console.error(err.message);
    }
}

startServer();