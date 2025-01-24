const express = require("express");
const router = express.Router();

const { sendOTP, signUp, login, fetchAllUser, changeProfile, updateDP, deleteAccount, contactus } = require("../controllers/Auth")
const { resetPasswordToken, resetPassword } = require("../controllers/resetPassword")

const { auth } = require("../middleware/auth")




router.post("/login", login);
router.post("/signUp", signUp);
router.post("/sendOTP", sendOTP);

router.get("/fetchAllUser", fetchAllUser);
router.post("/changeProfile", auth, changeProfile);
router.post("/updateDP", auth, updateDP);



router.post("/resetPasswordToken", resetPasswordToken);
router.post("/resetPassword", resetPassword);
router.post("/deleteAccount", auth, deleteAccount);


router.post("/contactus", contactus);




module.exports = router;





