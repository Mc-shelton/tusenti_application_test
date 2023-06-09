import express from 'express'
import http from 'http'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import compression from 'compression'
import cors from 'cors'
import router from './router'
import dotenv from 'dotenv'
import {dbConnection} from './dbconnection'
dotenv.config()

const app = express()
app.use(cors({
  credentials:true
}))

app.use(compression())
app.use(cookieParser())
app.use(bodyParser.json())
app.use('/',router())

const server = http.createServer(app)
const PORT = process.env.PORT

server.listen(PORT,()=>{
  console.log('app running on port ', PORT)
})
try{
dbConnection.connect()
console.log('db connected')
}catch{
  console.log('db connection failed')
}

export default server