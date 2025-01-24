const Announce = require("../module/Announce");
const Event = require("../module/Event");
const Job = require("../module/Job");
const SuccessStory = require("../module/SuccessStory");

exports.fetchAllSlidingData = async (req, res) => {
    try {
        // Fetch the slider document
        const slider = await Slider.findOne();

        if (!slider || slider.currentInSlide.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No sliding data found.",
            });
        }

        // Create an empty array to hold all data
        const slidingData = [];

        // Loop through currentInSlide and description arrays
        for (let i = 0; i < slider.currentInSlide.length; i++) {
            const id = slider.currentInSlide[i];
            const modelType = slider.description[i];

            let data = null;

            // Fetch data based on the model type
            switch (modelType) {
                case "SuccessStory":
                    data = await SuccessStory.findById(id);
                    break;
                case "Event":
                    data = await Event.findById(id);
                    break;
                case "Announce":
                    data = await Announce.findById(id);
                    break;
                case "Job":
                    data = await Job.findById(id);
                    break;
                default:
                    console.warn(`Unknown model type: ${modelType}`);
            }

            // If data is found, push it to the slidingData array
            if (data) {
                slidingData.push(data);
            }
        }

        // Respond with the collected data
        res.status(200).json({
            success: true,
            data: slidingData,
        });
    } catch (e) {
        console.error(e.message);
        res.status(500).json({
            success: false,
            message: "An error occurred while fetching the slider data.",
            error: e.message,
        });
    }
};
