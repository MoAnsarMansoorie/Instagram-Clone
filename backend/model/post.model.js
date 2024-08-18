import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    image: {
        type: String,
        required: true
    },
    caption: {
        type: String,
        default: ""
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    }]
},
{
    timestamps: true
})

export const Post = mongoose.model("Post", postSchema)