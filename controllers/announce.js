const Announce = require("../module/Announce");
const User = require("../module/User");
const Slider = require("../module/Slider")
const { uploadImageToCloudinary } = require("../utils/uploadImageToCloudinary")
const mongoose = require("mongoose");


exports.makeAnnouncement = async (req, res) => {
    try {
        const { title, content, priority, category, Highlight } = req.body;
        const attachments = req.files?.attachments;  // Check if files are provided

        console.log("before", title, content, priority, category, attachments);


        console.log("attachments:", attachments);

        const userId  = req.user.id;
        

        let imageResponse = null;

        // If attachments is an array, take the first file; if it's a single file, use it directly
        if (attachments) {
            const fileToUpload = Array.isArray(attachments) ? attachments[0] : attachments;
            imageResponse = await uploadImageToCloudinary(fileToUpload, "CDC_DATA");
            console.log("Image uploaded successfully:", imageResponse);
        } else {
            console.log("No image uploaded.");
        }

       

        // Create a new announcement document
        const announcement = new Announce({
            title,
            content,
            priority,
            attachments: imageResponse ? imageResponse.secure_url : null, // Only save image URL if uploaded
            lastChange: userId,
            category,
            Highlight: JSON.stringify(Highlight),
        });


        // Save to database
        const savedAnnouncement = await announcement.save();



        // Send the saved document as a response
        res.status(201).json({
            success: true,
            message: "Announcement made successfully",
            data: savedAnnouncement
        });

    } catch (error) {
        console.error("Error creating announcement:", error.message);
        res.status(500).json({ message: "Server error. Could not create announcement." });
    }
};



exports.updateAnnouncement = async (req, res) => {
    try {
        const { id } = req.body; // Announcement ID from the request parameters
        const { title, content, priority, category } = req.body;
        const attachments = req.files?.attachments;

        // Find the existing announcement by ID
        const announcement = await Announce.findById(id);
        if (!announcement) {
            return res.status(404).json({ message: "Announcement not found" });
        }

        // Update fields if they are provided in the request
        if (title) announcement.title = title;
        if (content) announcement.content = content;
        if (priority) announcement.priority = priority;
        if (category) announcement.category = category;

        const userId = req.user.id;
        announcement.lastChange = userId;

        // Handle attachment updates
        if (attachments) {
            const imageResponse = await uploadImageToCloudinary(attachments, "CDC_DATA");
            announcement.attachments = imageResponse.secure_url;
        }

        // Save the updated announcement
        const updatedAnnouncement = await announcement.save();

        res.status(200).json({
            success: true,
            message: "Announcement updated successfully",
            data: updatedAnnouncement,
        });

    } catch (error) {
        console.error("Error updating announcement:", error.message);
        res.status(500).json({ message: "Server error. Could not update announcement." });
    }
};
exports.fetchAnnounceMent = async (req, res) => {
    try {
        const announcements = await Announce.find()
            .sort({ priority: -1 })
            .populate('lastChange', 'firstName lastName'); // Correct populate syntax

        return res.status(200).json({
            data: announcements
        });

    } catch (e) {
        console.log("Error fetching announcements:", e.message);
        res.status(500).json({ message: "Server error. Could not fetch announcements." });
    }
};

exports.fetchAnnounceById = async (req, res) => {
    try {
        const { announceId } = req.body;
        if (!announceId) {
            res.status(500).json({
                success: false,
                message: "Id is undefined"
            });
        }

        const response = await Announce.findById(announceId);
        res.status(200).json({
            success: true,
            data: response,
        })

    } catch (e) {
        console.log("Error fetching announcement:", e.message);
        res.status(500).json({ message: "Server error. Could not fetch single announcement." });
    }

}


//  to be check 
exports.deleteAnnouncement = async (req, res) => {
    try {
        const { id } = req.body;

        // Ensure `AnnouncementDelete` is provided
        if (!id) {
            return res.status(400).json({ message: "No announcements to delete provided." });
        }

        // Split the string into an array of IDs and validate each ID
        // const idsArray = AnnouncementDelete.split(',').map((id) => id.trim());
        // const objectIds = idsArray.map((id) => {
        //     if (!mongoose.Types.ObjectId.isValid(id)) {
        //         throw new Error(`Invalid ObjectId: ${id}`);
        //     }
        //     // Use `new` when creating ObjectId
        //     return new mongoose.Types.ObjectId(id);
        // });

        // // Delete the announcements with matching IDs
        // const result = await Announce.deleteMany({
        //     _id: { $in: objectIds }
        // });

        const announceData = await Announce.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "Announcement Deleted Successfully",
        });

    } catch (e) {
        console.error("Error deleting announcement:", e.message);
        res.status(500).json({ message: `Server error: ${e.message}` });
    }
};
