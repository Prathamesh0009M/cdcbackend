const User = require("../module/User");
const OTP = require("../module/OTP");
const otpgenrater = require("otp-generator");
const Profile = require("../module/Profile")
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const { uploadImageToCloudinary } = require("../utils/uploadImageToCloudinary");
const mailsender = require("../utils/mailsender");
require("dotenv").config();

// SendOTP
exports.sendOTP = async (req, res) => {
    try {
        // fetch email from request ki body 
        const { email } = req.body;

        // check user already exist or not 
        const checkUserPresent = await User.findOne({ email });

        // if user present 
        if (checkUserPresent) {
            return res.status(401).json({
                success: false,
                message: "User already registered ",
            })

        }

        // or generate otp 
        var otp = otpgenrater.generate(4, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
        })
        console.log("otp-generated", otp);

        // check unique otp or not 

        var result = await OTP.findOne({ otp: otp });

        while (result) {
            otp = otpgenrater(4, {
                upperCaseAlphabets: false,
                lowerCaseAlphabets: false,
                specialChars: false,
            })
            result = await OTP.findOne({ otp: otp });
        }
        const otpPayload = { email, otp };

        // create an entry in DB for OTP 
        const otpbody = await OTP.create(otpPayload);
        console.log(otpbody);

        // return response successfully 
        console.log("hi")
        res.status(200).json({
            success: true,
            message: "OTP sent Successfully to Email"
        });


    } catch (e) {
        console.log("while sending otp ", e);
        res.status(500).json({
            success: false,
            message: e.message,
        })

    }
}

// sign up 

exports.signUp = async (req, res) => {
    try {
        // Extracting fields from request body
        const {
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            accountType,
            contactNumber,
            otp,
            collegeId,
            YearAndBranch
        } = req.body;

        // Validation: Required fields
        if (
            !firstName ||
            !lastName ||
            !email ||
            !password ||
            !confirmPassword ||
            !otp ||
            !accountType
        ) {
            return res.status(403).json({
                success: false,
                message: "All fields are required.",
            });
        }

        // Validation: Passwords match
        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Passwords do not match. Please try again.",
            });
        }

        // Validation: Account type
        if (!["CDC Coordinator", "Staff"].includes(accountType)) {
            return res.status(400).json({
                success: false,
                message: "Invalid account type. Must be 'CDC Coordinator' or 'Staff'.",
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User is already registered.",
            });
        }

        // Fetch the most recent OTP for the email
        const recentOTP = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);
        if (recentOTP.length === 0) {
            return res.status(400).json({
                success: false,
                message: "No OTP found for this email.",
            });
        } else if (otp !== recentOTP[0].otp) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP. Please try again.",
            });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a profile for the user
        const profileDetail = await Profile.create({
            Designation: null,
            dateOfBirth: null,
            contactNumber: contactNumber,
            about: null,
            linkedinProfile: null,
        });

        // Create the user
        const user = await User.create({
            firstName,
            lastName,
            email,

            password: hashedPassword,
            accountType,
            collegeId,
            additionaldetail: profileDetail._id,
            YearAndBranch,
            image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
            lastChange: [],
        });

        // Add user to a common conversation


        // const addInCommunity = await ConverSation.findByIdAndUpdate(
        //     "66f840e0880017cf58164dde",
        //     { $push: { participants: user._id } },
        //     { new: true }
        // );

        // Add a welcome message in the community chat
        // await Message.create({
        //     conversationId: "66f840e0880017cf58164dde",
        //     sender: user._id,
        //     content: `${firstName} just joined`,
        // });

        // Respond with success
        return res.status(200).json({
            success: true,
            message: "User registered successfully.",
            data: user,
        });
    } catch (error) {
        console.error("Error during sign-up:", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred during sign-up. Please try again later.", error,
        });
    }
};

exports.login = async (req, res) => {
    try {
        // get data from req body 
        const { email, password } = req.body;

        // validation data
        if (!email || !password) {
            return res.status(403).json({
                success: false,
                message: "All fields are required",
            });
        }

        // check existence of user 
        const user = await User.findOne({ email }).populate('additionaldetail');
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not registered. Please sign-up first.",
            });
        }

        // generate JWT token after password matching
        if (await bcrypt.compare(password, user.password)) {
            const payload = {
                email: user.email,
                id: user._id,
                accountType: user.accountType,
            };

            const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });

            user.token = token;
            user.password = undefined;

            const options = {
                expires: new Date(Date.now() + 1 * 60 * 60 * 1000), // 24 hours
                httpOnly: true,
            };

            console.log(user);
            // create cookie and send response 
            return res.cookie("token", token, options).status(200).json({
                success: true,
                token,
                user,
                message: "Logged in Successfully",
            });

        } else {
            return res.status(401).json({
                success: false,
                message: "Password is incorrect",
            });
        }
    } catch (e) {
        console.log("Login problem ", e);
        return res.status(501).json({
            success: false,
            message: e.message,
        });
    }
};

exports.fetchAllUser = async (req, res) => {
    try {
        // Fetch users sorted by creation date in descending order
        const users = await User.find({}).sort({ createdAt: -1 }).populate("additionaldetail");

        if (!users || users.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No User found right now",
            });
        }

        return res.status(200).json({
            success: true,
            data: users,
        });

    } catch (e) {
        console.error("User fetch problem", e);
        res.status(500).json({
            success: false,
            message: e.message,
        });
    }
};
exports.changeProfile = async (req, res) => {
    try {
        const {
            dateOfBirth,
            Designation,
            about,
            contactNumber,
            linkedinProfile,
            firstName,
            lastName,
            YearAndBranch,
            batch
        } = req.body;

        // Get the user ID from the authenticated request
        const userId = req.user.id;

        // Fetch the user and their associated profile data
        const user = await User.findById(userId).populate('additionaldetail');
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        const profileData = await Profile.findById(user.additionaldetail);
        if (!profileData) {
            return res.status(404).json({
                success: false,
                message: "Profile details not found",
            });
        }

        // Update profile details
        if (dateOfBirth) profileData.dateOfBirth = dateOfBirth;
        if (Designation) profileData.Designation = Designation;
        if (about) profileData.about = about;
        if (contactNumber) profileData.contactNumber = contactNumber;
        if (linkedinProfile) profileData.linkedinProfile = linkedinProfile;

        // Save the updated profile
        await profileData.save();

        // Update user details
        if (firstName) user.firstName = firstName;
        if (lastName) user.lastName = lastName;
        if (YearAndBranch) user.YearAndBranch = YearAndBranch;
        if (batch) user.batch = batch;
        // Save the updated user
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Profile and user data have been updated successfully",
            data: user
        });
    } catch (error) {
        console.error("Error updating profile and user:", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while updating the profile and user data",
        });
    }
};


exports.updateDP = async (req, res) => {
    try {

        const DP = req.files.thumbnailImage;
        const newpicture = await uploadImageToCloudinary(DP, process.env.FOLDER_NAME);
        // console.log("current dp is ", newpicture);
        const imageUrl = newpicture.url;

        const userId = req.user.id;
        const user = await User.findByIdAndUpdate(userId, { image: imageUrl });

        return res.status(200).json({
            success: true,
            message: "Successfully to update user DP ",
            data: imageUrl,
        });

    } catch (e) {
        return res.status(400).json({
            success: false,
            message: "Failed to update user_DP ",
            error: e.message,
        })
    }
}
exports.contactus = async (req, res) => {
    try {
        const { name, email, message, yearBranch } = req.body;
        console.log("data received", name, email, message, yearBranch);

        const emailTemplate = `
        <div style="background-color: #000; color: #fff; padding: 20px; font-family: Arial, sans-serif; line-height: 1.6;">
            <h2 style="color: #ff4081; text-align: center;">Career Development Center</h2>
            <p style="font-size: 16px; margin-top: 20px;">Dear Team,</p>
            <p style="font-size: 14px;">You have received a new message from the Contact Us form:</p>
            <div style="margin: 20px 0; padding: 15px; border: 1px solid #333; border-radius: 8px; background-color: #121212;">
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                ${yearBranch ? `<p><strong>Year & Branch:</strong> ${yearBranch}</p>` : ''}
                <p><strong>Message:</strong> ${message}</p>
            </div>
            <p style="font-size: 14px;">Please respond to the sender promptly.</p>
            <p style="text-align: center; margin-top: 30px;">
                <em>Empowering careers, bridging dreams, and fostering excellence.</em>
            </p>
        </div>
        `;

        const response = await mailsender(
            email,
            "Contact Us Form Submission",
            emailTemplate
        );

        return res.status(200).json({
            success: true,
            message: "Form submitted successfully!",
        });
    } catch (e) {
        return res.status(400).json({
            success: false,
            message: "Failed to submit the form.",
            error: e.message,
        });
    }
};
exports.deleteAccount = async (req, res) => {
    try {
        const userId = req.user.id; // Extract the user ID from the request
        const userData = await User.findById(userId).populate("additionaldetail"); // Populate additionaldetail

        if (!userData) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        const profileId = userData.additionaldetail?._id;

        // Ensure both user and profile exist
        if (!profileId) {
            return res.status(400).json({
                success: false,
                message: "User profile data is missing",
            });
        }

        // Delete the profile and user
        await Profile.findByIdAndDelete(profileId);
        await User.findByIdAndDelete(userId);

        return res.status(200).json({
            success: true,
            message: "User deleted successfully",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to delete user",
            error: error.message,
        });
    }
};





