const User = require("../module/User");
const Job = require("../module/Job");

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
            tags

        } = req.body;

        // Validate required fields
        if (!title || !company || !description || !applicationDeadline) {
            return res.status(400).json({ message: "Missing required fields." });
        }

        // Create new job
        const newJob = new Job({
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
            tags
        },{new:true});

        // Save job to the database
        await newJob.save();

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

exports.updateJob = async (req, res) => {
    try {
        const { id } = req.body; // Job ID to be updated
        const updates = req.body; // Fields to update

        if (!id) {
            return res.status(400).json({ message: "Job ID is required." });
        }

        const updatedJob = await Job.findByIdAndUpdate(id, updates, {
            new: true, // Return the updated document
            runValidators: true, // Enforce schema validation during update
        });

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
        const AllJobPost = await Job.find({}).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            message:"all job returned successfully",
            data: eventData
        });

    } catch (e) {
        console.error("Error fetching AllJobs:", e.message);
        res.status(500).json({ message: "Server error. Could not fetch AllJobs." });
    }
}

exports.deleteJobs = async (req, res) => {
    try {
        const { tobedeleteJob } = req.body; // Array of job IDs to delete

        if (!tobedeleteJob || !Array.isArray(tobedeleteJob) || tobedeleteJob.length === 0) {
            return res.status(400).json({
                message: "Please provide an array of job IDs to delete.",
            });
        }

        const deletedJobs = await Job.deleteMany({
            _id: { $in: tobedeleteJob },
        });

        res.status(200).json({
            success: true,
            message: `${deletedJobs.deletedCount} job(s) deleted successfully.`,
            deletedCount: deletedJobs.deletedCount,
        });
    } catch (error) {
        console.error("Error deleting jobs:", error.message);
        res.status(500).json({
            success: false,
            message: "Server error. Could not delete jobs.",
        });
    }
};
















