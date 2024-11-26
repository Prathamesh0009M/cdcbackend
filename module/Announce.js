const mongoose = require("mongoose");


const announcementSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true

    },
    datePosted: {
        type: Date,
        default: Date.now
    },
    priority: {
        type: Number,
        default: 1  
        // For ordering announcements; lower number means higher priority
    },
    // can be array for multiple data store 
    attachments: {
        type: String,
    },

    category: String, // e.g., "Job Posting", "Event", "General"

});
module.exports = mongoose.model("Announce", announcementSchema);