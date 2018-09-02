const mongoose = require("mongoose");
const PostModel = mongoose.model("Post", mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    data: {
        type: String,
        required: true
    }
}));