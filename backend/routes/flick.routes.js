import express from 'express'
import isAuth from '../middlewares/isAuth.js'
import { upload } from '../middlewares/multer.js'
import { comment, getAllFlicks, like, uploadFlick } from '../controllers/flick.controllers.js'


const flickRouter = express.Router()

flickRouter.post("/upload", isAuth, upload.single("media"), uploadFlick)
flickRouter.get("/getAll",isAuth,getAllFlicks)
flickRouter.get("/like/:flickId",isAuth,like)
flickRouter.post("/comments/:flickId",isAuth,comment)

export default flickRouter