const mongoose = require("mongoose")
const dbUser = process.env.DB_USER
const dbPassword = process.env.DB_PASS
mongoose.set("strictQuery", true);
const conn = async () =>{
    try {
        const dbConn = await mongoose.connect(`mongodb+srv://${dbUser}:${dbPassword}@cluster0.tg19bog.mongodb.net/?retryWrites=true&w=majority`)
        console.log("conectou o banco")
        return dbConn
    } catch (error) {
        console.log(error)
    }
}
conn()

module.exports = conn