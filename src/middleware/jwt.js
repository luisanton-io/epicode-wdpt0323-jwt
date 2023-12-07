import jwt from "jsonwebtoken"
import { User } from "../models/users.js"

// Encoded !== encrypted
// Un pezzo del nostro JWT token è CODIFICATO in base64
// ma non è criptato, quindi è leggibile da chiunque

const checkJwt = async (req, res, next) => {
    // 1. Leggiamo il token dalla richiesta

    // 2. Verifichiamo che il token sia valido
    try {
        const token = req.headers.authorization.split(" ")[1] // il token viene normalmente inviato come "Bearer <token>"
        const payload = jwt.verify(token, process.env.JWT_SECRET)
        // se siamo gli autori, allora ci aspettiamo di trovare nel payload
        // proprio ciò che gli avevamo scritto dentro noi stessi

        // qui andiamo a recuperare le info dell'utente dal database
        req.user = await User.findById(payload.id).select("-password")

        if (!req.user) {
            return res.status(404).json({ message: "User not found" })
        }

        // 3. Se il token è valido, allora possiamo procedere
        next()
    } catch (error) {
        return res.status(401).json({ message: "Invalid token" })
    }
}

export default checkJwt
