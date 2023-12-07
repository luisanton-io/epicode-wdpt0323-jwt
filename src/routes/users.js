import express from "express"
import { User } from "../models/users.js"
import bcrypt from "bcrypt"
import checkJwt from "../middleware/jwt.js"
import jwt from "jsonwebtoken"
const usersRouter = express.Router()

// CRUD - Create, Read, Update, Delete
// CRUD endpoints for users

// Create
// POST /users
usersRouter.post("/", async (req, res) => {
    const password = await bcrypt.hash(req.body.password, 10)

    const newUser = await User.create({
        ...req.body,
        password,
    })
    res.status(201).json(newUser)
})
// Authentication - Autenticazione
// il processo di verifica dell'identità di un utente
usersRouter.post("/session", async (req, res) => {
    const { email, password } = req.body

    const user = await User.findOne({ email })

    if (!user) {
        return res.status(404).json({ message: "User not found" })
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password)

    if (!isPasswordCorrect) {
        return res.status(401).json({ message: "Invalid credentials" })
    }

    // Abbiamo bisogno di restituire un Bearer token al nostro utente
    // in modo che possa poi usarlo per fare richieste autenticate

    const payload = { id: user._id }

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" })

    res.status(200).json({ token })
})

// Logout
// usersRouter.delete("/session", async (req, res) => {})

// Read
// GET /users
usersRouter.get("/", async (req, res) => {
    const users = await User.find({})
    res.status(200).json(users)
})

// GET /users/:id
usersRouter.get("/:id", checkJwt, async (req, res) => {
    // const user = await User.findById(req.params.id)

    // if (!user) {
    //     res.status(404).json({ message: "User not found" })
    //     return
    // }

    // il nostro utente, dopo l'autenticazione, è disponibile dentro req.user
    // (siccome glielo abbiamo messo noi nel middleware checkJwt)

    res.status(200).json(req.user)
})

// Update
// PUT /users/:id
usersRouter.put("/:id", async (req, res) => {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
    })
    res.status(200).json(user)
})

// Delete
// DELETE /users/:id
usersRouter.delete("/:id", async (req, res) => {
    const deletedUser = await User.findByIdAndDelete(req.params.id)
    if (!deletedUser) {
        return res.status(404).json({ message: "User not found" })
    }
    res.status(204)
})

export default usersRouter
