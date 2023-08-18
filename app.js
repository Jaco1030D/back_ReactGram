require("dotenv").config()

const express = require("express")
const path = require("path")
const cors = require('cors');
const router = require("./routes/Router");
require("./config/db.js")
const port = process.env.PORT
const app = express()

app.use(cors({
    origin: '*',
    credentials: true
  }));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

app.use(express.urlencoded({extended:false}))
app.use(router) 
app.listen(port, () =>{
    console.log("ta rodando ai")
})