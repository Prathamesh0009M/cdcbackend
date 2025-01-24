const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
    },

    YearAndBranch: {
        type: String,
        // required: true,
        trim: true,
    },
    collegeId: {
        type: String,
        // required: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,

    },
    accountType: {
        type: String,
        enum: ["CDC Coordinator", "Staff"],
        required: true,
    },
    batch: {
        type: String,
    },
    additionaldetail: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Profile"
    },
    image: {
        type: String,
        required: true,
    },
    lastChange: {
        type: [String],
    },
    token: {
        type: String,
    },
    resetPasswordExpires: {
        type: Date,
    },
})

module.exports = mongoose.model("User", userSchema);