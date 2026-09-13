const express = require("express");
const cookieParser = require("cookie-parser");
const indexRoutes = require("./Routes/indexRoutes") ;

const app = express();

app.use( express.json() );
app.use( cookieParser() );

app.get("/", (req, res) => {
    res.send("Backend is running");
});

app.use("/api/v1" , indexRoutes) ;

module.exports = app;