import express from 'express'
import { config } from 'dotenv'
import cors from 'cors'
// import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import userRouter from './routes/user.routes.js'


config()
const app = express()
// dbConnection()
app.use(express.json())


app.use(cors({
    origin: [process.env.FRONTEND_URL],
    credentials: true
}))

app.use(cookieParser())
app.use(morgan('dev'))

app.use('/ping', (req, res)=>{
    res.send('/pong')
})
app.use('/api/v1/user', userRouter)

app.all('*',(req, res)=>{
    res.status(404).send("OOPS! NOT FOUND")
})



// module.exports = app
export default app

