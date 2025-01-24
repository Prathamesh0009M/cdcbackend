const mongoose = require("mongoose");


const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    company: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    qualifications: [String], // Required skills or experience

    jobType: {
        type: String,
        enum: ['Full-Time', 'Part-Time', 'Internship', 'Temporary', 'Contract']
    },
    location: {
        type: String
    }, // e.g., "Remote", "On-Site", "Hybrid"
    lastChange: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    salaryRange: {
        min: Number,
        max: Number
    }, // Optional salary range

    applicationDeadline: {
        type: Date,
        required: true
    },
    // applicationLink: { type: String, required: true }, // Link to apply
    contactEmail: { type: String }, // Email for queries

    isUrgent: {
        type: Boolean,
        default: false
    }, // Highlights urgent openings
    isUrgentAfterUpdates: {
        type: Boolean,
        default: false
    },
    lastDateToApply: {
        type: String,
    },
    eligibleBranch: {
        type: [String]
    },
    eligibleYear: {
        type: [String]

    },
    applyLink: {
        type: String,
    },
    
    tags: [String], // Tags for filtering/searching
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model('Job', jobSchema);
