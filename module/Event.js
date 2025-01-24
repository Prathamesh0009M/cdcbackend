const mongoose = require("mongoose");
// google form link for registration 

const eventSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    img: {
        type: String,
    },
    time: {
        type: String
    }, // Optional, e.g., "10:00 AM - 12:00 PM"

    location: {
        type: String,
        required: true
    },
    type: {
        type: String,
        // enum: ['Workshop', 'Webinar', 'Interview', 'Networking', 'Other']
    }, // Event type
    registrationRequired: {
        type: Boolean,
        default: false
    },
    // registrationLink: { type: String }, // Link to register, if required
    // maxParticipants: { type: Number }, // Optional limit on participants
    // contactPerson: { name: String, email: String }, // Contact for questions
    isFeatured: {
        type: Boolean,
        default: false
    }, // Highlight this event
    lastChange: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    tags: [String], // Tags for easy searching or filtering

    createdAt: {
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model('Event', eventSchema);
