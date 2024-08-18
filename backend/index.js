import express, { urlencoded } from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

// middlewares
app.use(express.json())
app.use(urlencoded({extended:true}))
app.use(cookieParser())

const corsOptions = {
    origin: "http://localhost:5173",
    credential: true
}

app.use(cors(corsOptions));

const PORT = 8080

app.get("/", (req, res) => {
    return res.status(200).send({
        message: "Server started...",
        success: true
    })
})

app.listen(PORT, () => {
    console.log(`Server is running at port ${PORT}`)
})