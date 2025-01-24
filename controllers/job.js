const User = require("../module/User");
const Job = require("../module/Job");
const Slider = require("../module/Slider")


// search engine 
exports.createJob = async (req, res) => {
    try {
        const {
            title,
            company,
            description,
            qualifications,
            jobType,
            location,
            salaryRange,
            applicationDeadline,
            contactEmail,
            isUrgent,
            lastDateToApply,
            eligibleBranch,
            eligibleYear,
            tags,
            applyLink,
        } = req.body;
        
        console.log("req.body is ", applyLink);

        // Validate required fields
        if (!title || !company || !description || !applicationDeadline) {
            return res.status(400).json({ message: "Missing required fields." });
        }
        const userId = req.user.id;

        // Create new job
        const newJob = new Job({
            title,
            company,
            description,
            qualifications,
            jobType,
            location,
            salaryRange,
            lastChange: userId,
            applicationDeadline,
            contactEmail,
            isUrgent,
            lastDateToApply,
            eligibleBranch,
            eligibleYear,
            tags,
            applyLink
        });

        // Save job to the database
        await newJob.save();


        // let slider = await Slider.findOne();

        // if (!slider) {
        //     // If no document exists, create a new one with the first ID
        //     slider = new Slider({ currentInSlide: [newJob._id], description: 'Job' });
        // } else {
        //     // If a document exists, push the new ID into the array
        //     slider.currentInSlide.push(newJob._id);
        //     slider.description.push('Job');


        //     // Ensure a maximum of 6 entries
        //     if (slider.currentInSlide.length > 6) {
        //         slider.currentInSlide.shift(); // Remove the oldest entry
        //     }
        // }

        // // Save the updated or new document
        // await slider.save();
        // console.log('Slider updated:', slider);


        res.status(201).json({
            success: true,
            message: "Job created successfully.",
            job: newJob,
        });
    } catch (error) {
        console.error("Error creating job:", error);
        res.status(500).json({
            success: false,
            message: "An error occurred while creating the job.",
        });
    }
};

exports.jobFetchByID = async (req, res) => {
    try {
        const { formId } = req.body;
        if (!formId) {
            return res.status(400).json({ message: "Missing required fields." });
        }

        const JobData = await Job.findById(formId);

        return res.status(200).json({
            success: true,
            data: JobData
        })

    } catch (e) {
        console.log("Error creating job:", e);
        res.status(500).json({
            success: false,
            message: "An error occurred while creating the job.",
        });
    }
}


exports.updateJob = async (req, res) => {
    try {
        // const { _id } = req.body; // Job ID to be updated
        const updates = req.body; // Fields to update
        console.log(updates);

        if (!updates.id) {
            return res.status(400).json({ message: "Job ID is required." });
        }
        const userId = req.user.id;

        const updatedJob = await Job.findByIdAndUpdate(updates.id, updates, {
            new: true, // Return the updated document
            runValidators: true, // Enforce schema validation during update
        });
        updatedJob.lastChange = userId;
        await updatedJob.save();

        if (!updatedJob) {
            return res.status(404).json({ message: "Job not found." });
        }

        res.status(200).json({
            success: true,
            message: "Job updated successfully.",
            job: updatedJob,
        });
    } catch (error) {
        console.error("Error updating job:", error.message);
        res.status(500).json({
            success: false,
            message: "An error occurred while updating the job.",
        });
    }
};



exports.fetchAllJob = async (req, res) => {
    try {
        const AllJobPost = await Job.find({}).sort({ createdAt: -1 }).populate('lastChange', 'firstName lastName');

        console.log(AllJobPost);

        res.status(200).json({
            success: true,
            message: "all job returned successfully",
            data: AllJobPost
        });

    } catch (e) {
        console.error("Error fetching AllJobs:", e.message);
        res.status(500).json({ message: "Server error. Could not fetch AllJobs." });
    }
}


exports.deleteJobs = async (req, res) => {
    try {
        const { id } = req.body; // Array of job IDs to delete

        console.log("id to delete is ", id);
        const tobeDelete = await Job.findByIdAndDelete(id);

        // if (!deletedJobs || !Array.isArray(deletedJobs) || deletedJobs.length === 0) {
        //     return res.status(400).json({
        //         message: "Please provide an array of job IDs to delete.",
        //     });
        // }

        // const deletedJobs = await Job.deleteMany({
        //     _id: { $in: deletedJobs },
        // });

        if (!tobeDelete) {
            return res.status(401).json({
                success: false,
                message: "something error while deleting"
            })

        }


        res.status(200).json({
            success: true,
            // message: `${deletedJobs.deletedCount} job(s) deleted successfully.`,
            // deletedCount: deletedJobs.deletedCount,
            message: "deleted Successfully"
        });
    } catch (error) {
        console.error("Error deleting jobs:", error.message);
        res.status(500).json({
            success: false,
            message: "Server error. Could not delete jobs.",
        });
    }
};
















