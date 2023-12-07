import mongoose, { Schema } from "mongoose"

const UsersSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: [true, "User email required"],
    },
    password: {
        type: String,
        required: [true, "User password required"],
    },
    // role: {
    //     type: String,
    //     default: "user",
    //     required: true,
    // },
})

export const User = mongoose.model("User", UsersSchema)
