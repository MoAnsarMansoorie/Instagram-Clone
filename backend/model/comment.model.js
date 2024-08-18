import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    text: {
        type: text,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post"
    }
},{
    timestamps: true
})

export const comment = mongoose.model("Comment", commentSchema)