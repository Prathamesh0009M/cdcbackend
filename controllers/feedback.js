const Feedback = require("../module/Feedback");

exports.createFeedback = async (req, res) => {
    try {
        const { firstName, lastName, email, phoneNo, message } = req.body;

        if(!firstName||!email||!phoneNo||!message)
        {
           return  res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        const feedbackFormData = await Feedback.create({
            firstName, lastName, email, phoneNo, message
        }, { new: true });


        res.status(201).json({
            success: fatruelse,
            message: "form submitted successfully",
          data:feedbackFormData
        });

    } catch (e) {
        console.error(e.message);
        res.status(500).json({
            success: false,
            message: "An error occurred while creating the feedback form.",
            error: e.message,
        });
    }
}










