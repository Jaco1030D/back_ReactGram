require("dotenv").config()

const express = require("express")
const path = require("path")
const cors = require('cors');
const router = require("./routes/Router");
require("./config/db.js")
const port = process.env.PORT
const app = express()

app.use(cors({credentials: true, origin: "http://front-react-gram.vercel.app"}))

app.use("/uploads", express.static(path.join(__dirname, "/uploads")))

app.use(express.json())

app.use(express.urlencoded({extended:false}))
app.use(router) 
app.listen(port, () =>{
    console.log("ta rodando ai")
})