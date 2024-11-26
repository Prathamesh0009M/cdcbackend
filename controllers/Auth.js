const User = require("../module/User");
const OTP = require("../module/OTP");
const otpgenrater = require("otp-generator");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const Profile = require("../module/Profile");
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
        var otp = otpgenrater.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
        })
        console.log("otp-generated", otp);

        // check unique otp or not 

        var result = await OTP.findOne({ otp: otp });

        while (result) {
            otp = otpgenrater(6, {
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
            !YearAndBranch ||
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
            contactNumber: null,
            about: null,
            linkedinProfile:null,
        });

        // Create the user
        const user = await User.create({
            firstName,
            lastName,
            email,
            contactNumber,
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
            data :user,
        });
    } catch (error) {
        console.error("Error during sign-up:", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred during sign-up. Please try again later.",error,
        });
    }
};



// login
exports.login = async (req, res) => {
    try {
        // get data from req body 
        const { email, password } = req.body;



        // validation data
        if (!email || !password) {
            res.status(403).json({
                success: false,
                message: "All field are required",
            })
        }

        // check existing of user 
        // const user = await User.findOne({ email });
        // const user = await User.findOne({ email }).populate('additionaldetail').exec();
        // const extrainfo= await User.findOne({email}).populate('additionaldetail').exec();

        const user = await User.findOne({ email }).populate('additionaldetail');

        if (!user) {
            res.status(401).json({
                success: false,
                message: "User not registered plz sign-up first",
            })
        };

        // generate JWT token ,after password matching
        if (await bcrypt.compare(password, user.password)) {

            const payload = {
                email: user.email,
                id: user._id,
                accountType: user.accountType,
            }

            const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "2h", });

            user.token = token;
            user.password = undefined;

            const option =
            {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly: true,
            }
            // create cookie and send response 
            res.cookie("token", token, option).status(200).json({
                success: true,
                token,
                user,
                message: "Logged in Successfully",
            });

        } else {
            res.status(401).json({
                success: false,
                message: "Password is incorrect"
            })
        }

    } catch (e) {
        console.log("Login problem ", e);
        res.status(501).json({
            success: false,
            message: e.message,
        })
    }
}
