import express from "express";
import cors from "cors";
// import env from 'dotenv';
import db from "./db.js";
import router from "./routes/jwtAuth.js";
import dashboard from "./routes/dashboard.js"

const app = express();
const PORT = process.env.PORT || 4123



// middleware
app.use(cors())
app.use(express.json())

db.connect()

// ROUTE

// register and login routes
app.use("/auth", router)

// dashboard route
app.use("/dashboard", dashboard)

app.get("/", (req, res)=>{
    res.status(200).json({
        username: "Emdes",
        email: "naiajbayz@gmail.com"
    })
})

// run server

app.listen(PORT, ()=>{
    console.log(`Server now running on ${PORT}`)
})