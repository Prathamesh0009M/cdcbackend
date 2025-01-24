const SuccessStory = require("../module/SuccessStory");
const User = require("../module/User");
const Slider = require("../module/Slider")
const { uploadImageToCloudinary } = require("../utils/uploadImageToCloudinary");

exports.postSuccessStory = async (req, res) => {
    try {
        const {
            name,
            course,
            batch,
            company,
            package,
            position,
            achievement,
            story,
            tags,
            isFeatured,
        } = req.body;

        // Validate required fields
        if (!name || !course || !batch || !company) {
            return res.status(400).json({
                success: false,
                message: "Name, course, batch, and story are required fields.",
            });
        }

        let photoUrl = null;

        // Process file upload if exists
        if (req.files?.attachments) {
            const imageResponse = await uploadImageToCloudinary(
                req.files.attachments,
                "CDC_DATA"
            );
            photoUrl = imageResponse.secure_url;
        }
        const userId = req.user.id;
        // Create a new success story
        const newStory = new SuccessStory({
            name,
            course,
            batch,
            company,
            position,
            achievement,
            lastChange: userId,
            package,
            story,
            photo: photoUrl,
            tags,
            isFeatured,
        });

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
        const successStory = await SuccessStory.find({}).sort({ created: -1 })
        .populate('lastChange', 'firstName lastName')  // Populate only firstName and lastName from User
            .sort({ createdAt: -1 });

        if (!successStory || successStory.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No success stories found.",
            });
        }

        return res.status(200).json({
            success: true,
            data: successStory,
        });
    } catch (e) {
        console.error(e.message);
        res.status(500).json({
            success: false,
            message: "An error occurred while fetching the success story.",
            error: e.message,
        });
    }
};
exports.updateSuccessStory = async (req, res) => {
    try {
      const { id } = req.body; // ID of the success story to be updated
      const updatedData = { ...req.body, lastChange: req.user.id }; // Include the user ID for tracking changes
  
      // Find the story by ID and update it
      const updatedStory = await SuccessStory.findByIdAndUpdate(id, updatedData, {
        new: true, // Return the updated document
        runValidators: true, // Ensure validation rules are applied
      });
  
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
  

exports.fetchSuccessById = async (req, res) => {
    try {
        const { storyId } = req.body;
        if (!storyId) {
            res.status(500).json({
                success: false,
                message: "Id is undefined"
            });
        }

        const response = await SuccessStory.findById(storyId);
        res.status(200).json({
            success: true,
            data: response,
        })

    } catch (e) {
        console.log("Error fetching announcement:", e.message);
        res.status(500).json({ message: "Server error. Could not fetch single announcement." });
    }

}


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




















