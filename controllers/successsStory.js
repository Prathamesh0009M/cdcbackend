const SuccessStory = require("../module/SuccessStory");
const User = require("../module/User");

// Controller for posting a success story
exports.postSuccessStory = async (req, res) => {
    try {
        // photo will come from req.fils
        const {
            name,
            course,
            batch,
            company,
            position,
            achievement,
            story,
            photo,
            tags,
            isFeatured
        } = req.body;

        // Validate required fields
        if (!name || !course || !achievement || !story) {
            return res.status(400).json({
                success: false,
                message: "Name, course, achievement, and story are required fields.",
            });
        }

        // Create a new success story
        const newStory = new SuccessStory({
            name,
            course,
            batch,
            company,
            position,
            achievement,
            story,
            photo,
            tags,
            isFeatured
        }, { new: true });

        // Save to the database
        await newStory.save();

        res.status(201).json({
            success: true,
            message: "Success story posted successfully.",
            data: newStory,
        });
    } catch (e) {
        console.error(e.message);
        res.status(500).json({
            success: false,
            message: "An error occurred while posting the success story.",
            error: e.message,
        });
    }
};


exports.fetchAllSuccessStory = async (req, res) => {
    try {
        const successStory = await successStory.find({}).sort({ createdAt: -1 });
        if (!successStory) {

            res.status(404).json({
                success: false,
                message: "No more success story found till now .",

            });
        }

    } catch (e) {
        console.error(e.message);
        res.status(500).json({
            success: false,
            message: "An error occurred while fetchimg the success story.",
            error: e.message,
        });
    }
}


exports.updateSuccessStory = async (req, res) => {
    try {
        const { id } = req.body; // ID of the success story to be updated
        const updatedData = req.body; // Fields to be updated

        // Find the story by ID and update it
        const updatedStory = await SuccessStory.findByIdAndUpdate(id, updatedData, {
            new: true, // Return the updated document
            runValidators: true, // Ensure validation rules are applied
        });

        // If the story is not found
        if (!updatedStory) {
            return res.status(404).json({
                success: false,
                message: "Success story not found.",
            });
        }

        res.status(200).json({
            success: true,
            message: "Success story updated successfully.",
            data: updatedStory,
        });
    } catch (e) {
        console.error(e.message);
        res.status(500).json({
            success: false,
            message: "An error occurred while updating the success story.",
            error: e.message,
        });
    }
};


exports.deleteSuccessStory = async (req, res) => {
    try {
        const { id } = req.body; // ID of the success story to be deleted

        // Find the story by ID and delete it
        const deletedStory = await SuccessStory.findByIdAndDelete(id);

        // If the story is not found
        if (!deletedStory) {
            return res.status(404).json({
                success: false,
                message: "Success story not found.",
            });
        }

        res.status(200).json({
            success: true,
            message: "Success story deleted successfully.",
            data: deletedStory,
        });
    } catch (e) {
        console.error(e.message);
        res.status(500).json({
            success: false,
            message: "An error occurred while deleting the success story.",
            error: e.message,
        });
    }
};




















