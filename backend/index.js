import express from "express"
import dotEnv from 'dotenv'
import cors from 'cors'
import { connectDb } from "./config/db.js"
import cookieParser from "cookie-parser"
import authRouter from "./routes/auth.routes.js"
import userRouter from "./routes/user.routes.js"
import postRouter from "./routes/post.routes.js"
import flickRouter from "./routes/flick.routes.js"
import storyRouter from "./routes/Story.routes.js"
import messageRouter from "./routes/message.routes.js"
import { app, server } from "./socket.js"
dotEnv.config()


const port = process.env.PORT || 5000
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))
app.use(express.json())
app.use(cookieParser())

app.use("/api/auth",authRouter)
app.use("/api/user",userRouter)
app.use("/api/post",postRouter)
app.use("/api/flick",flickRouter)
app.use("/api/story",storyRouter)
app.use("/api/message",messageRouter)

server.listen(port,()=>{
    connectDb()
   console.log(`server is listening on port ${port}`)
})

