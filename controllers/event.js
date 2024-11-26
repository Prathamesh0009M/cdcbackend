const { json } = require("express");
const Event = require("../module/Event");
const User = require("../module/User");
const mongoose = require("mongoose");

exports.makeEvent = async (req, res) => {
    try {
        const { name, description, date, time, location, eventType, registrationRequired, isFeatured, tags } = req.body;

        // Combined validation for essential fields
        if (
            !name || typeof name !== "string" ||
            !description || typeof description !== "string" ||
            !date || isNaN(Date.parse(date)) ||
            !time || typeof time !== "string" ||
            !location || typeof location !== "string" ||
            typeof registrationRequired !== "boolean"
        ) {
            return res.status(400).json({ message: "Invalid input: please ensure all required fields are provided and correctly formatted." });
        }

        // Create the event
        const newEvent = await Event.create({
            name, description, date, time, location, type: eventType, registrationRequired, isFeatured, tags
        });

        // Update the user's lastChange field with the new event ID
        const userId = req.user.id;
        const userData = await User.findByIdAndUpdate(userId, { $push: { lastChange: newEvent._id } }, { new: true });

        res.status(201).json({
            data: newEvent
        });
    } catch (e) {
        console.error("Error creating event:", e.message);
        res.status(500).json({ message: "Server error. Could not create event." });
    }
};


exports.fetchEvent = async (req, res) => {
    try {
        // Fetch all events, sorted by creation date in descending order
        const eventData = await Event.find({}).sort({ createdAt: -1 });

        // Send the fetched data as a response
        res.status(200).json({ data: eventData });
    } catch (e) {
        console.error("Error fetching events:", e.message);
        res.status(500).json({ message: "Server error. Could not fetch events." });
    }
};



exports.deleteEvents = async (req, res) => {
    try {
        const { EventDelete } = req.body;

        const idsArray = EventDelete.split(',').map((id) => id.trim());
        const objectIds = idsArray.map((id) => {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                throw new Error(`Invalid ObjectId: ${id}`);
            }
            // Use `new` when creating ObjectId
            return new mongoose.Types.ObjectId(id);
        });

        const result = await Event.deleteMany({
            _id: { $in: objectIds }
        });

        res.status(200).json({
            message: `${result.deletedCount} event deleted successfully.`,
            deletedCount: result.deletedCount,
        });


    } catch (e) {
        console.log("Error creating announcement:", e.message);
        res.status(500).json({ message: "Server error. Could not delete event." });
    }
}

exports.updateEvents = async (req, res) => {
    try {
        const { eventId } = req.body;
        const { name, description, date, time, location, eventType, registrationRequired, isFeatured } = req.body;

        const eventData = await Event.findById(eventId);

        eventData.name = name;
        eventData.description = description;
        eventData.date = date;
        eventData.time = time;
        eventData.location = location;
        eventData.type = eventType  ;
        eventData.registrationRequired = registrationRequired;
        eventData.isFeatured = isFeatured;

        await eventData.save();

        return res.status(201).json({
            success: true,
            message: "Data has been updated",
            data: eventData,
        })

    } catch (e) {
        console.log("Error Updating Events:", e.message);
        res.status(500).json({ message: "Server error. Could not update event." });
    }
}






