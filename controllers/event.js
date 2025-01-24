const { json } = require("express");
const Slider = require("../module/Slider");
const { uploadImageToCloudinary } = require("../utils/uploadImageToCloudinary");
const Event = require("../module/Event");
const User = require("../module/User");
exports.makeEvent = async (req, res) => {
    try {
        const { name, description, date, time, location, eventType, registrationRequired, isFeatured, tags } = req.body;

        // Validate essential fields
        if (!name || !description || !date || !time || !location) {
            return res.status(400).json({
                message: "Invalid input: name, description, date, time, and location are required.",
            });
        }

        // Handle file upload (attachments)
        console.log("file data is ", req.files)
        let imageData = "";
        if (req.files && req.files.attachments) {
            const file = req.files.attachments;

            // Upload image to Cloudinary
            const imageResponse = await uploadImageToCloudinary(file, "CDC_DATA");
            imageData = imageResponse.secure_url;
        }

        const userId = req.user.id;
        // Create the event
        const newEvent = await Event.create({
            name,
            description,
            date,
            time,
            location,
            lastChange: userId,
            type: eventType,
            registrationRequired: registrationRequired || false,
            isFeatured: isFeatured || false,
            tags: tags ? tags.split(",") : [], // Convert tags to array
            img: imageData,
        });

        // Update user with new event


        res.status(201).json({
            success: true,
            data: newEvent,
        });
    } catch (e) {
        console.error("Error creating event:", e.message);
        res.status(500).json({
            success: false,
            message: "Server error. Could not create event.",
            error: e.message,
        });
    }
};

exports.deleteEventById = async (req, res) => {
    try {
        const { id } = req.body;
        if (!id) {
            return res.status(404).json({
                success: false,
                message: "Id of deleting event not found",
            })
        }

        // console.log("id to be delete is ", id);
        const itemTodelete = await Event.findByIdAndDelete(id);
        // console.log(itemTodelete);
        if (!itemTodelete) {
            return res.status(404).json({
                success: false,
                message: "False could not delete events",
            })
        }
        return res.status(200).json({
            success: true,
            message: "Event Deleted Successfully",
        })
    } catch (e) {
        console.error("Error fetching events:", e.message);
        res.status(500).json({ message: "Server error. Could not fetch events." });
    }
}

exports.getEventById = async (req, res) => {
    try {
        const { eventId } = req.body;
        console.log(eventId);

        if (!eventId) {
            return res.status(404).json({
                success: false,
                message: "Id of  event not found",
            })
        }

        // console.log("id to be delete is ", id);
        const eventData = await Event.findById(eventId);
        // console.log(itemTodelete);
        if (!eventData) {
            return res.status(404).json({
                success: false,
                message: "False could not get events",
            })
        }
        return res.status(200).json({
            success: true,
            data: eventData,
        })
    } catch (e) {
        console.error("Error fetching events:", e.message);
        res.status(500).json({ message: "Server error. Could not fetch events." });
    }
}

exports.fetchEvent = async (req, res) => {
    try {
        // Fetch all events, sorted by creation date in descending order
        const eventData = await Event.find({}).sort({ createdAt: -1 }).populate('lastChange','firstName lastName');

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
        const { eventId, name, description, date, time, location, eventType, registrationRequired, isFeatured } = req.body;

        // Validate required fields
        if (!eventId || !name || !description || !date || !location) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields: eventId, name, description, date, or location.",
            });
        }

        // Find the event by ID
        const eventData = await Event.findById(eventId);

        if (!eventData) {
            return res.status(404).json({
                success: false,
                message: "Event not found.",
            });
        }
        const userId = req.user.id;

        // Update the fields
        eventData.name = name;
        eventData.description = description;
        eventData.date = date;
        eventData.time = time || eventData.time; // Keep existing value if not provided
        eventData.location = location;
        eventData.type = eventType || eventData.type;
        eventData.registrationRequired = registrationRequired !== undefined ? registrationRequired : eventData.registrationRequired;
        eventData.isFeatured = isFeatured !== undefined ? isFeatured : eventData.isFeatured;
        eventData.lastChange = userId;

        // Save the updated event
        await eventData.save();

        return res.status(200).json({
            success: true,
            message: "Event updated successfully.",
            data: eventData,
        });

    } catch (e) {
        console.error("Error Updating Events:", e.message);
        res.status(500).json({
            success: false,
            message: "Server error. Could not update event.",
        });
    }
};






