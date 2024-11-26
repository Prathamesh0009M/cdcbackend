const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
    dateOfBirth: {
        type: String,
    },
    Designation: {
        type: String,
        // required: true,
    },
    about: {
        type: String,
        trim: true,
    },
    contactNumber: {
        type: Number,
        trim: true,
    },
    linkedinProfile: {
        type: String,
    }


}, { timestamps: true })

module.exports = mongoose.model("Profile", profileSchema);