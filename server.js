
import app from './app.js'
import dbConnection from './config/dbConnect.js'

// const app = require('./app.js')

const PORT = process.env.PORT || 5002
app.listen(PORT, async ()=>{
    await dbConnection()
    console.log(`App is listing at port http://localhost:${PORT}`)
})