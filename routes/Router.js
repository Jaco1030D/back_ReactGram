const express = require("express")
const router = express()
router.use("/api/users", require("./UserRouter"))
router.use("/api/photos", require("./PhotoRouter"))
router.get("/", (req, res) =>{
    res.send("Api Working")
})

module.exports = router