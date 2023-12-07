import express from "express"
import jwt from "jsonwebtoken"

const jwtTestRouter = express.Router()

jwtTestRouter.get("/jwt-test", async (req, res) => {
    // Creiamo un token con informazioni arbitrarie

    // Il payload è la parte che ci interessa, contiene le informazioni
    // del nostro utente come ad esempio il suo id

    const payload = {
        name: "Tizio Caio Sempronio",
        email: "tizio@ca.io",
    }

    const token = jwt.sign(payload, "IL MIO SEGRETO", { expiresIn: "1h" })

    res.status(200).json({ token })
})

// verify
jwtTestRouter.get("/jwt-test-verify", async (req, res) => {
    const token = req.headers.authorization.split(" ")[1]

    try {
        const payload = jwt.verify(token, "IL MIO SEGRETO")
        res.status(200).json({ payload })
    } catch (error) {
        res.status(401).json({ message: "Invalid token" })
    }
})

export default jwtTestRouter
