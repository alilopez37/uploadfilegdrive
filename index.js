import express from 'express'
import dotenv from 'dotenv'
import morgan from 'morgan'
import fileUpload from 'express-fileupload'
import signale from 'signale'
import {upload} from './routes/upload.js'

dotenv.config()
const app = express()

const port = process.env.PORT || 3000

//Espacio de middleware's
app.use(morgan('dev'))
app.use(fileUpload())

app.use("/upload",upload)

app.listen(port, ()=>{
    signale.success(`Server online in ${port}`)
})