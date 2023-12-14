import express from "express"
import usersRouter from "./routes/users.js"
import mongoose from "mongoose"
import jwtTestRouter from "./jwtTest.js"
import cors from "cors"
import passport from "passport"
import googleStrategy from "./middleware/oauth/google.js"
import list from "express-list-endpoints"

const app = express()

// app.use(cors())

app.use(express.json())

app.get("/health", (req, res) => {
    res.status(200).json({ message: "OK" })
})

// 1 - Creiamo su Google una nuova applicazione e recuperiamo le credenziali
//     clientID e clientSecret

// 2 - Creiamo una nuova strategia di autenticazione con Google
passport.use(googleStrategy)

app.use("/users", usersRouter)

app.use(jwtTestRouter)

const port = process.env.PORT || 3030

mongoose.connect(process.env.MONGO_URL).then(() => {
    app.listen(port, () => {
        console.log("Server is running on port " + port)

        console.table(list(app))
    })
})
