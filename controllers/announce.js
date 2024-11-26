const Announce = require("../module/Announce");
const User = require("../module/User");
const { uploadImageToCloudinary } = require("../utils/uploadImageToCloudinary")
const mongoose = require("mongoose");


exports.makeAnnouncement = async (req, res) => {
    try {
        const { title, content, priority, category } = req.body;
        const attachments = req.files?.attachments;

        console.log("before",title, content, priority, category ,attachments)

        const imageResponse = await uploadImageToCloudinary(attachments, "CDC_DATA")
        console.log("After",imageResponse)



        // Create a new announcement document
        const announcement = new Announce({
            title,
            content,
            priority,
            attachments: imageResponse.secure_url,
            category,
        });

        // Save to database
        const savedAnnouncement = await announcement.save();
        const userId = req.user.id;

        const userData = await User.findByIdAndUpdate(userId, { $push: { lastChange: savedAnnouncement._id } }, { new: true });

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
}


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

        const announcements = await Announce.find().sort({ priority: -1 });

        res.status(200).json({
            data: announcements
        });

    } catch (e) {
        console.log("Error creating announcement:", e.message);
        res.status(500).json({ message: "Server error. Could not fetch announcement." });
    }
}
//  to be check 
exports.deleteAnnouncement = async (req, res) => {
    try {
        const { AnnouncementDelete } = req.body;

        // Ensure `AnnouncementDelete` is provided
        if (!AnnouncementDelete) {
            return res.status(400).json({ message: "No announcements to delete provided." });
        }

        // Split the string into an array of IDs and validate each ID
        const idsArray = AnnouncementDelete.split(',').map((id) => id.trim());
        const objectIds = idsArray.map((id) => {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                throw new Error(`Invalid ObjectId: ${id}`);
            }
            // Use `new` when creating ObjectId
            return new mongoose.Types.ObjectId(id);
        });

        // Delete the announcements with matching IDs
        const result = await Announce.deleteMany({
            _id: { $in: objectIds }
        });

        res.status(200).json({
            message: `${result.deletedCount} announcements deleted successfully.`,
            deletedCount: result.deletedCount,
        });

    } catch (e) {
        console.error("Error deleting announcement:", e.message);
        res.status(500).json({ message: `Server error: ${e.message}` });
    }
};
