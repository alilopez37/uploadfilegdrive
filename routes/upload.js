import express from 'express'
import { google } from 'googleapis'
import {uploadController} from '../controllers/upload.mjs'

export const upload = express.Router()

upload.get("/", uploadController.get)

upload.post("/image",uploadController.post)
