import express from 'express'
import {uploadController} from '../controllers/upload.mjs'

export const upload = express.Router()

upload.get("/", uploadController.get)

upload.post("/image",uploadController.post)
