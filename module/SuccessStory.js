const mongoose = require('mongoose');

const successStorySchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    }, // Name of the student/alumnus
    course: {
        type: String,
        required: true
    }, // Course or degree pursued
    batch: {
        type: String
    }, // Batch year (e.g., "2020-2024")
    company: {
        type: String
    }, // Name of the company/organization
    position: {
        type: String
    }, // Job title or internship role
    achievement: {
        type: String, required: true
    }, // Key achievement description
    story: {
        type: String, required: true
    }, // Detailed success story narrative
    photo:
    {
        type: String
    }, // URL or path to the person's photo 
    tags: [String], // Tags for filtering (e.g., "Internship", "Placement", "Tech")
    
    datePosted: {
        type: Date,
        default: Date.now
    }, // When the story was posted
    isFeatured: { type: Boolean, default: false }, // Highlight on the homepage
});

module.exports = mongoose.model('SuccessStory', successStorySchema);
